#!/usr/bin/env bash
# ==============================================================================
# Offline test for deploy/release.sh (fake `gcloud`, no GCP access, no cost)
# ==============================================================================
# WHAT THIS TEST CHECKS
#   1. normal release : web/jobs digests resolved, migration awaited (--wait)
#                       with jobs image, service updated with web image and RELEASE_SHA,
#                       SERVICE_URL / DEPLOYED_IMAGE / DEPLOYED_JOBS_IMAGE / SERVING_REVISION exported
#   2. rollback       : service updated with web image, migration job NOT touched
#   3. ref guard      : non-main GITHUB_REF rejected before any gcloud call
#   4. image / jobs_image / migration fails : service is NOT updated
#   5. invalid tag    : rejected before any gcloud call
# ==============================================================================
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
TASK_TMP="$(mktemp -d)"
trap 'rm -rf "$TASK_TMP"' EXIT

export PROJECT_ID=release-test REGION=asia-southeast1
export IMAGE_TAG=1111111111111111111111111111111111111111
export CALL_LOG="$TASK_TMP/calls" GITHUB_ENV="$TASK_TMP/env"
export PATH="$TASK_TMP:$PATH"
export GITHUB_REF="refs/heads/main"

cat > "$TASK_TMP/gcloud" <<'STUB'
#!/usr/bin/env bash
echo "$*" >> "$CALL_LOG"
case "$*" in
  'artifacts docker images describe '*fasttrack-app:*)
    [[ "${FAIL_AT:-}" != image ]] || exit 1
    echo 'asia-southeast1-docker.pkg.dev/release-test/fasttrack-docker/fasttrack-app@sha256:abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890' ;;
  'artifacts docker images describe '*fasttrack-jobs:*)
    [[ "${FAIL_AT:-}" != jobs_image ]] || exit 1
    echo 'asia-southeast1-docker.pkg.dev/release-test/fasttrack-docker/fasttrack-jobs@sha256:9999991234567890abcdef1234567890abcdef1234567890abcdef1234567890' ;;
  'run jobs execute '*) [[ "${FAIL_AT:-}" != migration ]] || exit 1 ;;
  'run services describe '*status.url*) echo 'https://fasttrack-demo.example.test' ;;
  'run services describe '*latestReadyRevisionName*) echo 'fasttrack-app-00001-abc' ;;
esac
STUB
chmod +x "$TASK_TMP/gcloud"

# Scenario 1: Normal release on refs/heads/main
export ROLLBACK=false
bash "$ROOT/deploy/release.sh"
grep -q 'run jobs update fasttrack-migrate .*fasttrack-jobs@sha256:999999' "$CALL_LOG"
grep -q 'run jobs execute .*--wait' "$CALL_LOG"
grep -q "run services update fasttrack-app .*fasttrack-app@sha256:abcdef.*--update-env-vars=RELEASE_SHA=${IMAGE_TAG}" "$CALL_LOG"
grep -q 'SERVICE_URL=https://fasttrack-demo.example.test' "$GITHUB_ENV"
grep -q 'SERVING_REVISION=fasttrack-app-00001-abc' "$GITHUB_ENV"
grep -q 'DEPLOYED_IMAGE=asia-southeast1-docker.pkg.dev/release-test/fasttrack-docker/fasttrack-app@sha256:abcdef' "$GITHUB_ENV"
grep -q 'DEPLOYED_JOBS_IMAGE=asia-southeast1-docker.pkg.dev/release-test/fasttrack-docker/fasttrack-jobs@sha256:999999' "$GITHUB_ENV"
echo 'PASS normal release uses web/jobs digests, awaits migration, and sets RELEASE_SHA'

# Scenario 2: Rollback
: > "$CALL_LOG"
export ROLLBACK=true
bash "$ROOT/deploy/release.sh"
if grep -q 'run jobs' "$CALL_LOG"; then
  echo 'Rollback ran migration unexpectedly' >&2
  exit 1
fi
grep -q "run services update fasttrack-app .*fasttrack-app@sha256:abcdef.*--update-env-vars=RELEASE_SHA=${IMAGE_TAG}" "$CALL_LOG"
echo 'PASS rollback reuses web image without touching migration job'

# Scenario 3: Non-main ref rejected before any GCP call
: > "$CALL_LOG"
if GITHUB_REF='refs/heads/staging/sprint-2' ROLLBACK=false bash "$ROOT/deploy/release.sh" 2>/dev/null; then
  echo 'Expected non-main ref rejection' >&2
  exit 1
fi
test ! -s "$CALL_LOG"
echo 'PASS non-main GITHUB_REF rejected before GCP calls'

# Scenario 4: Failures (web image describe, jobs image describe, migration failure)
for failure in image jobs_image migration; do
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

# Scenario 5: Invalid tag
: > "$CALL_LOG"
if IMAGE_TAG='invalid;tag' bash "$ROOT/deploy/release.sh" 2>/dev/null; then
  echo 'Expected invalid tag failure' >&2
  exit 1
fi
test ! -s "$CALL_LOG"
echo 'PASS invalid tag rejected before GCP calls'