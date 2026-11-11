#!/usr/bin/env bash
# Offline regression checks: every gcloud, docker, and openssl call is a local stub.
# ==============================================================================
# WHAT THIS TEST DOES (no real GCP calls, no cost)
#   Puts fake `gcloud` / `docker` / `openssl` first on PATH and runs deploy/deploy.sh in
#   these scenarios, asserting on the recorded commands:
#     first_run : nothing exists      -> everything is created
#     rerun     : everything exists   -> nothing replaced (credentials kept)
#     partial/discovery failures      -> stop without credential writes
#     job-fail  : migration fails     -> script exits 1, service NOT deployed
#     demo      : --demo flag         -> demo secret is created and granted
#   Checks: `--edition=enterprise`, no project-wide secretAccessor role,
#   DB password matches secret payload, zero secret leaks to stdout/stderr,
#   APP_ORIGIN & TRUST_PROXY_HOPS propagation, and DRY_RUN=1 makes zero gcloud calls.
# ==============================================================================
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEPLOY_SCRIPT="${SCRIPT_DIR}/../deploy.sh"
export TEST_STATE_DIR
TEST_STATE_DIR="$(mktemp -d)"
trap 'rm -rf "$TEST_STATE_DIR"' EXIT
mkdir -p "$TEST_STATE_DIR/bin"

# Stub source identity so offline tests never require a main checkout.
cat > "$TEST_STATE_DIR/bin/git" <<'STUB'
#!/usr/bin/env bash
case "$*" in
  'symbolic-ref --quiet HEAD') echo "${STUB_REF:-refs/heads/main}" ;;
  'rev-parse HEAD') echo 1111111111111111111111111111111111111111 ;;
  'rev-parse origin/main') echo "${STUB_MAIN_SHA:-1111111111111111111111111111111111111111}" ;;
  'status --porcelain --untracked-files=normal') printf '%s' "${STUB_DIRTY:-}" ;;
  *) exit 1 ;;
esac
STUB
chmod +x "$TEST_STATE_DIR/bin/git"

# --- Fake `docker` (skips local daemon) ---------------------------------------
cat > "$TEST_STATE_DIR/bin/docker" <<'STUB'
#!/usr/bin/env bash
echo "$*" >> "$TEST_STATE_DIR/docker.log"
exit 0
STUB
chmod +x "$TEST_STATE_DIR/bin/docker"

# --- Fake `openssl` -----------------------------------------------------------
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
if [ "${1:-} ${2:-}" = 'projects describe' ]; then
  echo 970128017651
  exit 0
fi
if [ "${1:-} ${2:-} ${3:-}" = 'artifacts docker images' ]; then
  image="${5%:*}"
  printf '%s@sha256:%064d\n' "$image" 1
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
  [ "$STUB_MODE" != users_read_fail ] || exit 1
  if [ "$STUB_MODE" = first_run ] || [ "$STUB_MODE" = secret_only ]; then
    echo postgres
  else
    printf 'postgres\nfasttrack_user\n'
  fi
  exit 0
fi
if [ "${1:-} ${2:-}" = 'secrets list' ]; then
  [ "$STUB_MODE" != secret_read_fail ] || exit 1
  case "$STUB_MODE" in
    first_run|partial) ;;
    *) echo projects/970128017651/secrets/fasttrack-database-url ;;
  esac
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
for MODE in first_run rerun job-fail demo; do
  export STUB_MODE="$MODE"
  export GCLOUD_LOG="$TEST_STATE_DIR/gcloud-${MODE}.log"
  OUT_LOG="$TEST_STATE_DIR/output-${MODE}.log"
  : > "$GCLOUD_LOG"
  : > "$OUT_LOG"
  rm -f "$TEST_STATE_DIR/sql-pass" "$TEST_STATE_DIR"/payload-*
  FLAGS=()
  [ "$MODE" != demo ] || FLAGS+=(--demo)

  if [ "$MODE" = job-fail ]; then
    if bash "$DEPLOY_SCRIPT" "${FLAGS[@]}" >"$OUT_LOG" 2>&1; then
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

  bash "$DEPLOY_SCRIPT" "${FLAGS[@]}" >"$OUT_LOG" 2>&1

  # Security check: never grant project-wide secretAccessor role
  if grep -q '^projects add-iam-policy-binding .*roles/secretmanager.secretAccessor' "$GCLOUD_LOG"; then
    echo "FAIL: runtime granted project-wide secretAccessor role" >&2
    exit 1
  fi

  # Check Cloud SQL PostgreSQL tier
  if [ "$MODE" = first_run ]; then
    grep -q 'sql instances create fasttrack-db.*--edition=enterprise.*--tier=db-f1-micro' "$GCLOUD_LOG" \
      || { echo "FAIL: first_run did not create Cloud SQL instance with enterprise edition" >&2; exit 1; }
    grep -q '^sql users create fasttrack_user ' "$GCLOUD_LOG" \
      || { echo "FAIL: first_run did not create fasttrack_user" >&2; exit 1; }
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

  # Demo flag check
  if [ "$MODE" = demo ]; then
    grep -q '^secrets add-iam-policy-binding fasttrack-demo-password ' "$GCLOUD_LOG" \
      || { echo "FAIL: demo mode did not bind fasttrack-demo-password secret" >&2; exit 1; }
  elif grep -q '^secrets add-iam-policy-binding fasttrack-demo-password ' "$GCLOUD_LOG"; then
    echo "FAIL: granted optional demo secret in non-demo mode" >&2
    exit 1
  fi

  # DB password matches DATABASE_URL secret and never leaks to stdout/stderr
  if [ -f "$TEST_STATE_DIR/sql-pass" ]; then
    db_pass="$(cat "$TEST_STATE_DIR/sql-pass")"
    db_url="$(cat "$TEST_STATE_DIR/payload-fasttrack-database-url")"
    case "$db_url" in
      "postgresql://fasttrack_user:${db_pass}@"*) ;;
      *) echo "FAIL: DB password differs from secret payload" >&2; exit 1 ;;
    esac
    if grep -Fq "$db_pass" "$OUT_LOG"; then
      echo "FAIL: DB password leaked to script output" >&2
      exit 1
    fi
  fi
  for secret_file in "$TEST_STATE_DIR"/payload-*; do
    [ -f "$secret_file" ] || continue
    secret_val="$(cat "$secret_file")"
    if [ -n "$secret_val" ] && grep -Fq "$secret_val" "$OUT_LOG"; then
      echo "FAIL: secret payload leaked to script output" >&2
      exit 1
    fi
  done

  # Both fresh and existing jobs must migrate the current immutable image once.
  if [ "$MODE" = first_run ]; then
    grep -q 'run jobs create .*fasttrack-jobs@sha256:.*--max-retries=0' "$GCLOUD_LOG"
  else
    grep -q 'run jobs update .*fasttrack-jobs@sha256:.*--max-retries=0' "$GCLOUD_LOG"
  fi
  grep -q 'run deploy .*fasttrack-app@sha256:' "$GCLOUD_LOG"
  grep -q 'fasttrack-app:1111111111111111111111111111111111111111' "$TEST_STATE_DIR/docker.log"

  # Migration must run with --wait using fasttrack-jobs image
  grep -q 'run jobs execute fasttrack-migrate --wait' "$GCLOUD_LOG" \
    || { echo "FAIL: migration job was not awaited with --wait" >&2; exit 1; }

  # Cloud Run service deployment includes APP_ORIGIN and TRUST_PROXY_HOPS
  grep -q 'run deploy fasttrack-app .*APP_ORIGIN=https://fasttrack-app-970128017651\.asia-southeast1\.run\.app.*TRUST_PROXY_HOPS=1' "$GCLOUD_LOG" \
    || { echo "FAIL: service fasttrack-app missing APP_ORIGIN or TRUST_PROXY_HOPS=1" >&2; exit 1; }

  echo "PASS: scenario ${MODE}"
done

# Existing credentials and unknown discovery must never enter a recovery path.
for MODE in partial secret_only users_read_fail secret_read_fail; do
  export STUB_MODE="$MODE" GCLOUD_LOG="$TEST_STATE_DIR/gcloud-${MODE}.log"
  : > "$GCLOUD_LOG"
  : > "$TEST_STATE_DIR/docker.log"
  if bash "$DEPLOY_SCRIPT" >"$TEST_STATE_DIR/output-${MODE}.log" 2>&1; then
    echo "FAIL: ${MODE} should stop for deliberate recovery/discovery" >&2; exit 1
  fi
  if grep -Eq '^sql users (create|set-password) |^secrets (create|versions add|add-iam-policy-binding) |^run (jobs execute|deploy) ' "$GCLOUD_LOG"; then
    echo "FAIL: ${MODE} changed credentials or continued rollout" >&2; exit 1
  fi
  test ! -s "$TEST_STATE_DIR/docker.log"
  echo "PASS: ${MODE} stops without credential writes or rollout"
done

# DRY_RUN test: must not make any gcloud calls
DRY_LOG="$TEST_STATE_DIR/gcloud-dryrun.log"
: > "$DRY_LOG"
export GCLOUD_LOG="$DRY_LOG"
export DRY_RUN=1
bash "$DEPLOY_SCRIPT" --demo >/dev/null
if [ -s "$DRY_LOG" ]; then
  echo "FAIL: DRY_RUN=1 executed gcloud commands" >&2
  exit 1
fi
echo "PASS: DRY_RUN=1 made 0 gcloud calls"
# Rejected source must not invoke cloud commands.
export DRY_RUN=0
: > "$GCLOUD_LOG"
if STUB_REF=refs/heads/staging/sprint-2 bash "$DEPLOY_SCRIPT" >/dev/null 2>&1; then
  echo 'FAIL: unmerged staging source was accepted' >&2; exit 1
fi
test ! -s "$GCLOUD_LOG"
if STUB_DIRTY=' M Project_code/server/src/app.ts' bash "$DEPLOY_SCRIPT" >/dev/null 2>&1; then
  echo 'FAIL: dirty source was accepted' >&2; exit 1
fi
test ! -s "$GCLOUD_LOG"
if STUB_MAIN_SHA=2222222222222222222222222222222222222222 bash "$DEPLOY_SCRIPT" >/dev/null 2>&1; then
  echo 'FAIL: checkout differing from origin/main was accepted' >&2; exit 1
fi
test ! -s "$GCLOUD_LOG"
echo 'PASS: non-main, dirty and divergent sources rejected before cloud calls'
