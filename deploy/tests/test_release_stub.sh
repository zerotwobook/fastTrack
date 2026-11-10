#!/usr/bin/env bash
# ==============================================================================
# Offline test for deploy/release.sh (fake `gcloud`, no GCP access, no cost)
# ==============================================================================
# WHAT THIS TEST CHECKS
#   1. normal release : image resolved to @sha256 digest, migration awaited
#                       (`--wait`), service updated, SERVICE_URL exported
#   2. rollback       : service updated, migration job NOT touched
#   3. image missing / migration fails : service is NOT updated
#   4. invalid tag    : rejected before any gcloud call
# ==============================================================================
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
TASK_TMP="$(mktemp -d)"
trap 'rm -rf "$TASK_TMP"' EXIT

export PROJECT_ID=release-test REGION=asia-southeast1
export IMAGE_TAG=1111111111111111111111111111111111111111
export CALL_LOG="$TASK_TMP/calls" GITHUB_ENV="$TASK_TMP/env"
export PATH="$TASK_TMP:$PATH"

cat > "$TASK_TMP/gcloud" <<'STUB'
#!/usr/bin/env bash
echo "$*" >> "$CALL_LOG"
case "$*" in
  'artifacts docker images describe '*)
    [[ "${FAIL_AT:-}" != image ]] || exit 1
    echo 'asia-southeast1-docker.pkg.dev/release-test/fasttrack-docker/fasttrack-app@sha256:abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890' ;;
  'run jobs execute '*) [[ "${FAIL_AT:-}" != migration ]] || exit 1 ;;
  'run services describe '*) echo 'https://fasttrack-demo.example.test' ;;
esac
STUB
chmod +x "$TASK_TMP/gcloud"

# Scenario 1: Normal release
export ROLLBACK=false
bash "$ROOT/deploy/release.sh"
grep -q 'run jobs execute .*--wait' "$CALL_LOG"
grep -q 'run services update .*@sha256:abcdef' "$CALL_LOG"
grep -q 'SERVICE_URL=https://fasttrack-demo.example.test' "$GITHUB_ENV"
echo 'PASS normal release uses digest and waits for migration'

# Scenario 2: Rollback
: > "$CALL_LOG"
export ROLLBACK=true
bash "$ROOT/deploy/release.sh"
if grep -q 'run jobs' "$CALL_LOG"; then
  echo 'Rollback ran migration unexpectedly' >&2
  exit 1
fi
grep -q 'run services update ' "$CALL_LOG"
echo 'PASS rollback reuses image without touching migration job'

# Scenario 3: Failures (image describe failure, migration failure)
for failure in image migration; do
  : > "$CALL_LOG"
  if ROLLBACK=false FAIL_AT="$failure" bash "$ROOT/deploy/release.sh"; then
    echo "Expected $failure failure but script succeeded" >&2
    exit 1
  fi
  if grep -q 'run services update' "$CALL_LOG"; then
    echo "Service changed after $failure failure" >&2
    exit 1
  fi
  echo "PASS $failure failure blocks service update"
done

# Scenario 4: Invalid tag
: > "$CALL_LOG"
if IMAGE_TAG='invalid;tag' bash "$ROOT/deploy/release.sh"; then
  echo 'Expected invalid tag failure' >&2
  exit 1
fi
test ! -s "$CALL_LOG"
echo 'PASS invalid tag rejected before GCP calls'
