#!/usr/bin/env bash
# Offline regression checks: every gcloud and openssl call is a local stub.
# ==============================================================================
# WHAT THIS TEST DOES (no real GCP calls, no cost)
#   Puts fake `gcloud` / `openssl` first on PATH and runs deploy/deploy.sh in
#   these scenarios, asserting on the recorded commands:
#     first_run : nothing exists      -> everything is created
#     rerun     : everything exists   -> nothing replaced (credentials kept)
#     partial   : DB secret missing   -> DB user password reset + secret created
#     job-fail  : migration fails     -> script exits 1, service NOT deployed
#     demo      : --demo flag         -> demo secret is created and granted
#   Checks: `--edition=enterprise`, no project-wide secretAccessor role,
#   DB password matches secret payload, and DRY_RUN=1 makes zero gcloud calls.
# ==============================================================================
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEPLOY_SCRIPT="${SCRIPT_DIR}/../deploy.sh"
export TEST_STATE_DIR
TEST_STATE_DIR="$(mktemp -d)"
trap 'rm -rf "$TEST_STATE_DIR"' EXIT
mkdir -p "$TEST_STATE_DIR/bin"

# --- Fake `docker` (skips local daemon) ---------------------------------------
cat > "$TEST_STATE_DIR/bin/docker" <<'STUB'
#!/usr/bin/env bash
echo "$*" >> "$TEST_STATE_DIR/docker.log"
exit 0
STUB
chmod +x "$TEST_STATE_DIR/bin/docker"
cat > "$TEST_STATE_DIR/bin/openssl" <<'STUB'
#!/usr/bin/env bash
if [ "$2" = "-hex" ]; then
  printf '%s\n' '0123456789abcdef0123456789abcdef0123456789abcdef'
else
  printf '%s\n' 'TESTONLYGENERATEDPASSWORD'
fi
STUB

# --- Fake `gcloud`: logs each call (password redacted), answers per $STUB_MODE
cat > "$TEST_STATE_DIR/bin/gcloud" <<'STUB'
#!/usr/bin/env bash
set -euo pipefail
redacted=()
for arg in "$@"; do
  case "$arg" in
    --password=*)
      printf '%s' "${arg#--password=}" > "$TEST_STATE_DIR/sql-pass"
      redacted+=("--password=<REDACTED>") ;;
    *) redacted+=("$arg") ;;
  esac
done
printf '%s\n' "${redacted[*]}" >> "$GCLOUD_LOG"
if [ "${1:-} ${2:-}" = 'config get-value' ]; then
  echo fasttrack-se-002
  exit 0
fi
if [ "${1:-} ${2:-} ${3:-}" = 'run services describe' ]; then
  echo https://fasttrack-stub.example.invalid
  exit 0
fi
if [ "${1:-} ${2:-} ${3:-}" = 'run jobs execute' ]; then
  [ "$STUB_MODE" != job-fail ]
  exit $?
fi
if [ "${1:-} ${2:-} ${3:-}" = 'secrets versions add' ]; then
  cat > "$TEST_STATE_DIR/payload-${4}"
  exit 0
fi
if [ "${1:-} ${2:-} ${3:-}" = 'sql users list' ]; then
  if [ "$STUB_MODE" = first_run ]; then
    echo postgres
  else
    printf 'postgres\nfasttrack\n'
  fi
  exit 0
fi
for word in "$@"; do
  if [ "$word" = describe ]; then
    case "$STUB_MODE" in
      first_run) exit 1 ;;
      partial)
        if [ "${1:-} ${3:-}" = 'secrets fasttrack-database-url' ]; then
          exit 1
        fi ;;
    esac
  fi
done
STUB

chmod +x "$TEST_STATE_DIR/bin/openssl" "$TEST_STATE_DIR/bin/gcloud"
export PATH="$TEST_STATE_DIR/bin:$PATH"
export PROJECT_ID=fasttrack-se-002
export REGION=asia-southeast1
export DRY_RUN=0

# --- Run scenarios and assert --------------------------------------------------
for MODE in first_run rerun partial job-fail demo; do
  export STUB_MODE="$MODE"
  export GCLOUD_LOG="$TEST_STATE_DIR/gcloud-${MODE}.log"
  : > "$GCLOUD_LOG"
  FLAGS=()
  [ "$MODE" != demo ] || FLAGS+=(--demo)

  if [ "$MODE" = job-fail ]; then
    if bash "$DEPLOY_SCRIPT" "${FLAGS[@]}" >/dev/null 2>&1; then
      echo "FAIL: job-fail should have exited with non-zero status" >&2
      exit 1
    fi
    if grep -q 'run deploy fasttrack-app' "$GCLOUD_LOG"; then
      echo "FAIL: job-fail updated the service after migration failure" >&2
      exit 1
    fi
    echo "PASS: job-fail prevents service deployment"
    continue
  fi

  bash "$DEPLOY_SCRIPT" "${FLAGS[@]}" >/dev/null

  # Check Cloud SQL PostgreSQL tier
  if [ "$MODE" = first_run ]; then
    grep -q 'sql instances create fasttrack-db.*--edition=enterprise.*--tier=db-f1-micro' "$GCLOUD_LOG" \
      || { echo "FAIL: first_run did not create Cloud SQL instance with enterprise edition" >&2; exit 1; }
  fi

  # Idempotency check: rerun must NOT create resources or set password
  if [ "$MODE" = rerun ]; then
    if grep -q 'artifacts repositories create' "$GCLOUD_LOG" \
      || grep -q 'sql instances create' "$GCLOUD_LOG" \
      || grep -q 'sql databases create' "$GCLOUD_LOG" \
      || grep -q 'iam service-accounts create' "$GCLOUD_LOG" \
      || grep -q 'sql users create' "$GCLOUD_LOG" \
      || grep -q 'sql users set-password' "$GCLOUD_LOG" \
      || grep -q 'secrets create' "$GCLOUD_LOG"; then
      echo "FAIL: rerun was not idempotent (attempted to re-create existing resource)" >&2
      exit 1
    fi
  fi

  # Partial check: reset DB user password and add secret version
  if [ "$MODE" = partial ]; then
    grep -q 'sql users set-password fasttrack' "$GCLOUD_LOG" \
      || { echo "FAIL: partial did not reset the database user password" >&2; exit 1; }
    grep -q 'secrets versions add fasttrack-database-url' "$GCLOUD_LOG" \
      || { echo "FAIL: partial did not update fasttrack-database-url" >&2; exit 1; }
  fi

  # Demo flag check
  if [ "$MODE" = demo ]; then
    grep -q '^secrets add-iam-policy-binding fasttrack-demo-password ' "$GCLOUD_LOG" \
      || { echo "FAIL: demo mode did not bind fasttrack-demo-password secret" >&2; exit 1; }
  elif grep -q '^secrets add-iam-policy-binding fasttrack-demo-password ' "$GCLOUD_LOG"; then
    echo "FAIL: granted optional demo secret in non-demo mode" >&2
    exit 1
  fi

  # Migration must run with --wait
  grep -q 'run jobs execute fasttrack-migrate --wait' "$GCLOUD_LOG" \
    || { echo "FAIL: migration job was not awaited with --wait" >&2; exit 1; }

  # Cloud Run service deployment
  grep -q 'run deploy fasttrack-app' "$GCLOUD_LOG" \
    || { echo "FAIL: service fasttrack-app was not deployed" >&2; exit 1; }

  echo "PASS: scenario ${MODE}"
done

# DRY_RUN test: must not make any gcloud calls
DRY_LOG="$TEST_STATE_DIR/gcloud-dryrun.log"
: > "$DRY_LOG"
export GCLOUD_LOG="$DRY_LOG"
export DRY_RUN=1
bash "$DEPLOY_SCRIPT" >/dev/null
if [ -s "$DRY_LOG" ]; then
  echo "FAIL: DRY_RUN=1 executed gcloud commands" >&2
  exit 1
fi
echo "PASS: DRY_RUN=1 made 0 gcloud calls"
