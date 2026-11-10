#!/usr/bin/env bash
# ==============================================================================
# fastTrack — release.sh (used by .github/workflows/deploy.yml)
# ==============================================================================
# WHAT THIS SCRIPT DOES
#   Updates pre-provisioned Cloud Run service and migration job.
#   Does not create SQL, IAM or secrets (handled by deploy/deploy.sh).
#   Normal release : validate ref/tag -> resolve web/jobs digests -> migrate -> rollout.
#   Rollback       : validate ref/tag -> resolve web digest -> rollout (NO migration/seed).
#
# INPUT (environment variables)
#   PROJECT_ID, REGION, IMAGE_TAG   required (IMAGE_TAG = full 40-char commit SHA)
#   SERVICE_NAME                    default: fasttrack-app
#   JOBS_IMAGE_NAME                 default: fasttrack-jobs
#   MIGRATE_JOB_NAME                default: fasttrack-migrate
#   REGISTRY_REPO                   default: fasttrack-docker
#   ROLLBACK                        true | false (default false)
#   GITHUB_REF                      if set, MUST equal refs/heads/main
#   GITHUB_ENV                      appends SERVICE_URL, DEPLOYED_IMAGE,
#                                   DEPLOYED_JOBS_IMAGE, SERVING_REVISION
#
# IMPORTANT
#   - Rejects non-main refs when GITHUB_REF is set before making any GCP call.
#   - If the migration job fails, `set -e` aborts BEFORE the service is updated.
#   - Images are resolved to immutable @sha256 digests so job and service are traceable.
#   - Offline test: deploy/tests/test_release_stub.sh
# ==============================================================================
set -euo pipefail

# ------------------------------------------------------------------------------
# 1. Read and validate inputs (fail before any GCP call)
# ------------------------------------------------------------------------------
if [[ -n "${GITHUB_REF:-}" && "$GITHUB_REF" != "refs/heads/main" ]]; then
  echo "Release ref rejected: expected refs/heads/main, got $GITHUB_REF" >&2
  exit 1
fi

: "${PROJECT_ID:?Required}" "${REGION:?Required}" "${IMAGE_TAG:?Required}"
SERVICE_NAME="${SERVICE_NAME:-fasttrack-app}"
JOBS_IMAGE_NAME="${JOBS_IMAGE_NAME:-fasttrack-jobs}"
MIGRATE_JOB_NAME="${MIGRATE_JOB_NAME:-fasttrack-migrate}"
REGISTRY_REPO="${REGISTRY_REPO:-fasttrack-docker}"
ROLLBACK="${ROLLBACK:-false}"

[[ "$IMAGE_TAG" =~ ^[0-9a-f]{40}$ ]] || { echo 'Invalid image tag: must be full 40-character lowercase hexadecimal SHA.' >&2; exit 1; }
[[ "$ROLLBACK" == true || "$ROLLBACK" == false ]] || { echo 'Invalid rollback mode: must be true or false.' >&2; exit 1; }

# ------------------------------------------------------------------------------
# 2. Find web image and pin it by immutable digest
# ------------------------------------------------------------------------------
APP_IMAGE="$REGION-docker.pkg.dev/$PROJECT_ID/$REGISTRY_REPO/$SERVICE_NAME:$IMAGE_TAG"
DIGEST_APP_IMAGE="$(gcloud artifacts docker images describe "$APP_IMAGE" --project="$PROJECT_ID" --format='value(image_summary.fully_qualified_digest)')"
[[ "$DIGEST_APP_IMAGE" == "$REGION-docker.pkg.dev/$PROJECT_ID/$REGISTRY_REPO/$SERVICE_NAME@sha256:"* ]] || { echo 'Web image digest not found or malformed.' >&2; exit 1; }

# ------------------------------------------------------------------------------
# 3. Database migration (normal release only; uses jobs image target)
#    A failure here aborts the script (set -e), leaving the service untouched.
# ------------------------------------------------------------------------------
DIGEST_JOBS_IMAGE=""
if [[ "$ROLLBACK" == false ]]; then
  JOBS_IMAGE="$REGION-docker.pkg.dev/$PROJECT_ID/$REGISTRY_REPO/$JOBS_IMAGE_NAME:$IMAGE_TAG"
  DIGEST_JOBS_IMAGE="$(gcloud artifacts docker images describe "$JOBS_IMAGE" --project="$PROJECT_ID" --format='value(image_summary.fully_qualified_digest)')"
  [[ "$DIGEST_JOBS_IMAGE" == "$REGION-docker.pkg.dev/$PROJECT_ID/$REGISTRY_REPO/$JOBS_IMAGE_NAME@sha256:"* ]] || { echo 'Jobs image digest not found or malformed.' >&2; exit 1; }

  echo "Updating migration job $MIGRATE_JOB_NAME with jobs image $DIGEST_JOBS_IMAGE..."
  gcloud run jobs update "$MIGRATE_JOB_NAME" --image="$DIGEST_JOBS_IMAGE" --project="$PROJECT_ID" --region="$REGION" --quiet
  echo "Executing database migration job..."
  gcloud run jobs execute "$MIGRATE_JOB_NAME" --wait --project="$PROJECT_ID" --region="$REGION" --quiet
  echo "Database migration completed successfully."
else
  echo "Rollback mode: reusing existing web image $DIGEST_APP_IMAGE; skipping migration and seed."
fi

# ------------------------------------------------------------------------------
# 4. Point Cloud Run service at web image, propagate RELEASE_SHA, and route 100% traffic
# ------------------------------------------------------------------------------
echo "Updating Cloud Run service $SERVICE_NAME..."
gcloud run services update "$SERVICE_NAME" \
  --image="$DIGEST_APP_IMAGE" \
  --update-env-vars="RELEASE_SHA=$IMAGE_TAG" \
  --project="$PROJECT_ID" \
  --region="$REGION" \
  --quiet
gcloud run services update-traffic "$SERVICE_NAME" --to-latest --project="$PROJECT_ID" --region="$REGION" --quiet

# ------------------------------------------------------------------------------
# 5. Inspect live URL and serving revision, and export to GITHUB_ENV
# ------------------------------------------------------------------------------
SERVICE_URL="$(gcloud run services describe "$SERVICE_NAME" --project="$PROJECT_ID" --region="$REGION" --format='value(status.url)')"
SERVING_REVISION="$(gcloud run services describe "$SERVICE_NAME" --project="$PROJECT_ID" --region="$REGION" --format='value(status.latestReadyRevisionName)')"
echo "Service URL: $SERVICE_URL"
echo "Serving Revision: ${SERVING_REVISION:-unknown}"
echo "Deployed Web Image: $DIGEST_APP_IMAGE"
if [[ -n "$DIGEST_JOBS_IMAGE" ]]; then
  echo "Executed Jobs Image: $DIGEST_JOBS_IMAGE"
fi

if [[ -n "${GITHUB_ENV:-}" ]]; then
  printf 'SERVICE_URL=%s\nDEPLOYED_IMAGE=%s\nDEPLOYED_JOBS_IMAGE=%s\nSERVING_REVISION=%s\n' \
    "$SERVICE_URL" "$DIGEST_APP_IMAGE" "$DIGEST_JOBS_IMAGE" "${SERVING_REVISION:-}" >> "$GITHUB_ENV"
fi
