#!/usr/bin/env bash
set -euo pipefail

# ==============================================================================
# fastTrack — Google Cloud Run & Cloud SQL Teardown Script
# ==============================================================================
# Usage:
#   ./deploy/teardown.sh
#
# Environment Variables (Optional):
#   PROJECT_ID   GCP Project ID (defaults to active gcloud config project)
#   REGION       GCP Region (default: asia-southeast1)
#   DRY_RUN      Set DRY_RUN=1 to print all gcloud commands without executing
#
# WHAT THIS SCRIPT DOES
#   Deletes the selected app resources after confirmation and successful discovery.
#   Stops on protection, permission, deletion or verification failure; never disables
#   SQL deletion protection or reports an unverified partial cleanup as complete.
# ==============================================================================

DRY_RUN="${DRY_RUN:-0}"
REGION="${REGION:-asia-southeast1}"

run_cmd() {
  if [ "$DRY_RUN" = "1" ]; then
    echo "[DRY_RUN] $*"
  else
    echo "+ $*"
    "$@"
  fi
}

if [ "$DRY_RUN" = "1" ]; then
  PROJECT_ID="${PROJECT_ID:-fasttrack-se-002}"
else
  PROJECT_ID="${PROJECT_ID:-$(gcloud config get-value project 2>/dev/null || true)}"
  if [ -z "$PROJECT_ID" ]; then
    echo "Error: PROJECT_ID is not set and no active gcloud project was found." >&2
    exit 1
  fi
fi

REPO_NAME="fasttrack-docker"
SQL_INSTANCE="fasttrack-db"
SERVICE_NAME="fasttrack-app"
MIGRATE_JOB_NAME="fasttrack-migrate"
SA_NAME="sa-fasttrack-runtime"
SA_EMAIL="${SA_NAME}@${PROJECT_ID}.iam.gserviceaccount.com"

SECRET_DB_URL="fasttrack-database-url"
SECRET_DEMO_PASS="fasttrack-demo-password"

contains_name() {
  local names="$1" target="$2" name
  while IFS= read -r name; do
    if [ "${name##*/}" = "$target" ]; then return 0; fi
  done <<< "$names"
  return 1
}

read_names() {
  local names
  if ! names="$(gcloud "$@" 2>/dev/null)"; then
    echo 'Could not verify cloud inventory. Teardown stopped; inspect access and remaining resources.' >&2
    return 1
  fi
  printf '%s\n' "$names"
}

load_inventory() {
  SERVICE_NAMES="$(read_names run services list --project "$PROJECT_ID" --region "$REGION" --format='value(metadata.name)' --quiet)" || return 1
  JOB_NAMES="$(read_names run jobs list --project "$PROJECT_ID" --region "$REGION" --format='value(metadata.name)' --quiet)" || return 1
  SQL_NAMES="$(read_names sql instances list --project "$PROJECT_ID" --format='value(name)' --quiet)" || return 1
  REPO_NAMES="$(read_names artifacts repositories list --project "$PROJECT_ID" --location "$REGION" --format='value(name)' --quiet)" || return 1
  SECRET_NAMES="$(read_names secrets list --project "$PROJECT_ID" --format='value(name)' --quiet)" || return 1
  SA_NAMES="$(read_names iam service-accounts list --project "$PROJECT_ID" --format='value(email)' --quiet)" || return 1
}

delete_if_present() {
  local names="$1" target="$2"
  shift 2
  if [ "$DRY_RUN" = 1 ] || contains_name "$names" "$target"; then
    if ! run_cmd "$@"; then
      echo 'Deletion failed. Teardown stopped; resources may remain. Inspect before retrying.' >&2
      return 1
    fi
  else
    printf 'Skipping verified absent resource: %s\n' "$target"
  fi
}

SERVICE_NAMES='' JOB_NAMES='' SQL_NAMES='' REPO_NAMES='' SECRET_NAMES='' SA_NAMES=''

echo "=================================================================="
echo "WARNING: This will permanently delete fastTrack resources in:"
echo "  Project : ${PROJECT_ID}"
echo "  Region  : ${REGION}"
echo "Resources to be deleted:"
echo "  - Cloud Run Service : ${SERVICE_NAME}"
echo "  - Cloud Run Job     : ${MIGRATE_JOB_NAME}"
echo "  - Cloud SQL Instance: ${SQL_INSTANCE} (ALL DATABASE DATA WILL BE LOST)"
echo "  - Artifact Registry : ${REPO_NAME}"
echo "  - Secrets           : ${SECRET_DB_URL}, ${SECRET_DEMO_PASS}"
echo "  - Service Account   : ${SA_EMAIL}"
echo "=================================================================="

if [ "$DRY_RUN" != "1" ]; then
  read -r -p "Type the project ID (${PROJECT_ID}) to confirm deletion: " CONFIRM_PROJECT
  if [ "$CONFIRM_PROJECT" != "$PROJECT_ID" ]; then
    echo "Aborted: confirmation did not match ${PROJECT_ID}."
    exit 1
  fi
fi

if [ "$DRY_RUN" != 1 ]; then
  # Complete every discovery before the first deletion, including optional targets.
  load_inventory
  if contains_name "$SQL_NAMES" "$SQL_INSTANCE"; then
    if ! SQL_PROTECTION="$(gcloud sql instances describe "$SQL_INSTANCE" --project "$PROJECT_ID" --format='value(settings.deletionProtectionEnabled)' --quiet 2>/dev/null)"; then
      echo 'Could not verify SQL deletion protection; no resources were deleted.' >&2
      exit 1
    fi
    case "$SQL_PROTECTION" in
      True|true)
        echo 'SQL deletion protection is enabled; no resources were deleted. Any protection change requires separate authorization.' >&2
        exit 1 ;;
      False|false|'') ;; # The API may omit its default false boolean.
      *) echo 'SQL deletion protection state is unknown; no resources were deleted.' >&2; exit 1 ;;
    esac
  fi
fi

delete_if_present "$SERVICE_NAMES" "$SERVICE_NAME" gcloud run services delete "$SERVICE_NAME" --region "$REGION" --project "$PROJECT_ID" --quiet
delete_if_present "$JOB_NAMES" "$MIGRATE_JOB_NAME" gcloud run jobs delete "$MIGRATE_JOB_NAME" --region "$REGION" --project "$PROJECT_ID" --quiet
delete_if_present "$SQL_NAMES" "$SQL_INSTANCE" gcloud sql instances delete "$SQL_INSTANCE" --project "$PROJECT_ID" --quiet

if [ "$DRY_RUN" != 1 ]; then
  SQL_NAMES="$(read_names sql instances list --project "$PROJECT_ID" --format='value(name)' --quiet)"
  if contains_name "$SQL_NAMES" "$SQL_INSTANCE"; then
    echo 'SQL deletion could not be confirmed; dependent registry, secrets and runtime account were preserved.' >&2
    exit 1
  fi
fi

delete_if_present "$REPO_NAMES" "$REPO_NAME" gcloud artifacts repositories delete "$REPO_NAME" --location "$REGION" --project "$PROJECT_ID" --quiet
delete_if_present "$SECRET_NAMES" "$SECRET_DB_URL" gcloud secrets delete "$SECRET_DB_URL" --project "$PROJECT_ID" --quiet
delete_if_present "$SECRET_NAMES" "$SECRET_DEMO_PASS" gcloud secrets delete "$SECRET_DEMO_PASS" --project "$PROJECT_ID" --quiet
delete_if_present "$SA_NAMES" "$SA_EMAIL" gcloud iam service-accounts delete "$SA_EMAIL" --project "$PROJECT_ID" --quiet

if [ "$DRY_RUN" = 1 ]; then
  echo 'Teardown preview complete; no cloud calls made.'
else
  load_inventory
  if contains_name "$SERVICE_NAMES" "$SERVICE_NAME" || contains_name "$JOB_NAMES" "$MIGRATE_JOB_NAME" ||
    contains_name "$SQL_NAMES" "$SQL_INSTANCE" || contains_name "$REPO_NAMES" "$REPO_NAME" ||
    contains_name "$SECRET_NAMES" "$SECRET_DB_URL" || contains_name "$SECRET_NAMES" "$SECRET_DEMO_PASS" ||
    contains_name "$SA_NAMES" "$SA_EMAIL"; then
    echo 'Teardown is incomplete; managed resources remain. Inspect before retrying.' >&2
    exit 1
  fi
  echo 'Teardown complete.'
fi
