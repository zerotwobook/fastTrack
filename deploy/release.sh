#!/usr/bin/env bash
# ==============================================================================
# fastTrack — release.sh (used by .github/workflows/deploy.yml)
# ==============================================================================
# WHAT THIS SCRIPT DOES
#   Updates pre-provisioned Cloud Run service and migration job.
#   Does not create SQL, IAM or secrets (handled by deploy/deploy.sh).
#   Normal release : verify image -> run migration job -> update service.
#   Rollback       : verify image -> update service (NO migration, NO seed).
#
# INPUT (environment variables)
#   PROJECT_ID, REGION, IMAGE_TAG   required (IMAGE_TAG = full 40-char commit SHA)
#   SERVICE_NAME                    default: fasttrack-app
#   MIGRATE_JOB_NAME                default: fasttrack-migrate
#   REGISTRY_REPO                   default: fasttrack-docker
#   ROLLBACK                        true | false (default false)
#   GITHUB_ENV                      appends SERVICE_URL and DEPLOYED_IMAGE
#
# IMPORTANT
#   - If the migration job fails, `set -e` aborts BEFORE the service is updated.
#   - The image is resolved to an immutable @sha256 digest so the job and service
#     run the exact same image.
#   - Offline test: deploy/tests/test_release_stub.sh
# ==============================================================================
set -euo pipefail

# ------------------------------------------------------------------------------
# 1. Read and validate inputs (fail before any GCP call)
# ------------------------------------------------------------------------------
: "${PROJECT_ID:?Required}" "${REGION:?Required}" "${IMAGE_TAG:?Required}"
SERVICE_NAME="${SERVICE_NAME:-fasttrack-app}"
MIGRATE_JOB_NAME="${MIGRATE_JOB_NAME:-fasttrack-migrate}"
REGISTRY_REPO="${REGISTRY_REPO:-fasttrack-docker}"
ROLLBACK="${ROLLBACK:-false}"

[[ "$IMAGE_TAG" =~ ^[0-9a-f]{40}$ ]] || { echo 'Invalid image tag: must be full 40-character lowercase hexadecimal SHA.' >&2; exit 1; }
[[ "$ROLLBACK" == true || "$ROLLBACK" == false ]] || { echo 'Invalid rollback mode: must be true or false.' >&2; exit 1; }

# ------------------------------------------------------------------------------
# 2. Find the image and pin it by immutable digest
# ------------------------------------------------------------------------------
IMAGE="$REGION-docker.pkg.dev/$PROJECT_ID/$REGISTRY_REPO/$SERVICE_NAME:$IMAGE_TAG"
DIGEST_IMAGE="$(gcloud artifacts docker images describe "$IMAGE" --project="$PROJECT_ID" --format='value(image_summary.fully_qualified_digest)')"
[[ "$DIGEST_IMAGE" == "$REGION-docker.pkg.dev/$PROJECT_ID/$REGISTRY_REPO/$SERVICE_NAME@sha256:"* ]] || { echo 'Image digest not found or malformed.' >&2; exit 1; }

# ------------------------------------------------------------------------------
# 3. Database migration (normal release only; `--wait` blocks until finished)
#    A failure here aborts the script (set -e), leaving the service untouched.
# ------------------------------------------------------------------------------
if [[ "$ROLLBACK" == false ]]; then
  echo "Updating migration job $MIGRATE_JOB_NAME with image $DIGEST_IMAGE..."
  gcloud run jobs update "$MIGRATE_JOB_NAME" --image="$DIGEST_IMAGE" --project="$PROJECT_ID" --region="$REGION" --quiet
  echo "Executing database migration job..."
  gcloud run jobs execute "$MIGRATE_JOB_NAME" --wait --project="$PROJECT_ID" --region="$REGION" --quiet
  echo "Database migration completed successfully."
else
  echo "Rollback mode: reusing existing image $DIGEST_IMAGE; skipping migration and seed."
fi

# ------------------------------------------------------------------------------
# 4. Point Cloud Run service at image and route 100% traffic
# ------------------------------------------------------------------------------
echo "Updating Cloud Run service $SERVICE_NAME..."
gcloud run services update "$SERVICE_NAME" --image="$DIGEST_IMAGE" --project="$PROJECT_ID" --region="$REGION" --quiet
gcloud run services update-traffic "$SERVICE_NAME" --to-latest --project="$PROJECT_ID" --region="$REGION" --quiet

# ------------------------------------------------------------------------------
# 5. Report URL and export to GITHUB_ENV
# ------------------------------------------------------------------------------
SERVICE_URL="$(gcloud run services describe "$SERVICE_NAME" --project="$PROJECT_ID" --region="$REGION" --format='value(status.url)')"
echo "Service URL: $SERVICE_URL"
echo "Deployed Image: $DIGEST_IMAGE"

if [[ -n "${GITHUB_ENV:-}" ]]; then
  printf 'SERVICE_URL=%s\nDEPLOYED_IMAGE=%s\n' "$SERVICE_URL" "$DIGEST_IMAGE" >> "$GITHUB_ENV"
fi
