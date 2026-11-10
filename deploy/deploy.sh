#!/usr/bin/env bash
set -euo pipefail

# ==============================================================================
# fastTrack — Idempotent Google Cloud Run Deployment Script
# ==============================================================================
# Usage:
#   ./deploy/deploy.sh [--demo]
#
# Environment Variables (Optional):
#   PROJECT_ID   GCP Project ID (defaults to active gcloud config project)
#   REGION       GCP Region (default: asia-southeast1)
#   DRY_RUN      Set DRY_RUN=1 to print all gcloud commands without executing
#
# WHAT THIS SCRIPT DOES (one-time / manual initial setup; safe to re-run)
#   Creates every cloud resource the app needs and performs initial deployment:
#   1 enable APIs     2 Artifact Registry  3 Cloud SQL instance  4 database
#   5 runtime SA+IAM  6 DB user + secret   7 demo password (optional)
#   (secret access)   8 build image        9 migrate job         10 Cloud Run service
# ==============================================================================

DRY_RUN="${DRY_RUN:-0}"
REGION="${REGION:-asia-southeast1}"
SEED_DEMO_DATA="false"

for arg in "$@"; do
  case "$arg" in
    --demo)
      SEED_DEMO_DATA="true"
      ;;
    *)
      echo "Unknown argument: $arg" >&2
      echo "Usage: $0 [--demo]" >&2
      exit 1
      ;;
  esac
done

run_cmd() {
  local arg
  if [ "$DRY_RUN" = "1" ]; then
    printf '[DRY_RUN] '
  else
    printf '+ '
  fi
  for arg in "$@"; do
    case "$arg" in
      --password=*) printf '%s ' '--password=<REDACTED>' ;;
      *) printf '%q ' "$arg" ;;
    esac
  done
  printf '\n'
  if [ "$DRY_RUN" != "1" ]; then
    "$@"
  fi
}

if [ "$DRY_RUN" = "1" ]; then
  PROJECT_ID="${PROJECT_ID:-fasttrack-se-002}"
  PROJECT_NUMBER="${PROJECT_NUMBER:-970128017651}"
else
  PROJECT_ID="${PROJECT_ID:-$(gcloud config get-value project 2>/dev/null || true)}"
  if [ -z "$PROJECT_ID" ]; then
    echo "Error: PROJECT_ID is not set and no active gcloud project was found." >&2
    echo "Run: gcloud config set project YOUR_PROJECT_ID" >&2
    exit 1
  fi
  PROJECT_NUMBER="${PROJECT_NUMBER:-$(gcloud projects describe "$PROJECT_ID" --format='value(projectNumber)')}"
fi

# Resource names (matching docs/labs/lab-05/deployment.md & sprint-2-lab-05-delivery-contract.md)
REPO_NAME="fasttrack-docker"
SQL_INSTANCE="fasttrack-db"
DB_NAME="fasttrack_prod"
DB_USER="fasttrack_user"
SERVICE_NAME="fasttrack-app"
JOBS_IMAGE_NAME="fasttrack-jobs"
MIGRATE_JOB_NAME="fasttrack-migrate"
SA_NAME="sa-fasttrack-runtime"
SA_EMAIL="${SA_NAME}@${PROJECT_ID}.iam.gserviceaccount.com"
SQL_CONN_NAME="${PROJECT_ID}:${REGION}:${SQL_INSTANCE}"
APP_ORIGIN="${APP_ORIGIN:-https://${SERVICE_NAME}-${PROJECT_NUMBER}.${REGION}.run.app}"
IMAGE_URI="${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPO_NAME}/${SERVICE_NAME}:latest"
JOBS_IMAGE_URI="${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPO_NAME}/${JOBS_IMAGE_NAME}:latest"

SECRET_DB_URL="fasttrack-database-url"
SECRET_DEMO_PASS="fasttrack-demo-password"

echo "=================================================================="
echo "fastTrack Cloud Run Deployment"
echo "Project : ${PROJECT_ID}"
echo "Region  : ${REGION}"
echo "Demo    : ${SEED_DEMO_DATA}"
echo "Dry Run : ${DRY_RUN}"
echo "=================================================================="

# 1. Enable required APIs
run_cmd gcloud services enable \
  run.googleapis.com \
  sqladmin.googleapis.com \
  artifactregistry.googleapis.com \
  cloudbuild.googleapis.com \
  secretmanager.googleapis.com \
  iam.googleapis.com \
  --project "$PROJECT_ID"

# 2. Artifact Registry repository (idempotent)
if [ "$DRY_RUN" = "1" ]; then
  run_cmd gcloud artifacts repositories describe "$REPO_NAME" --location "$REGION" --project "$PROJECT_ID"
  run_cmd gcloud artifacts repositories create "$REPO_NAME" --repository-format=docker --location "$REGION" --description="fastTrack container repository" --project "$PROJECT_ID"
else
  if ! gcloud artifacts repositories describe "$REPO_NAME" --location "$REGION" --project "$PROJECT_ID" >/dev/null 2>&1; then
    run_cmd gcloud artifacts repositories create "$REPO_NAME" \
      --repository-format=docker \
      --location "$REGION" \
      --description="fastTrack container repository" \
      --project "$PROJECT_ID"
  fi
fi

# 3. Cloud SQL PostgreSQL instance (idempotent)
if [ "$DRY_RUN" = "1" ]; then
  run_cmd gcloud sql instances describe "$SQL_INSTANCE" --project "$PROJECT_ID"
  run_cmd gcloud sql instances create "$SQL_INSTANCE" --database-version=POSTGRES_16 --edition=enterprise --tier=db-f1-micro --region="$REGION" --storage-size=10GB --storage-type=SSD --backup-start-time=03:00 --project "$PROJECT_ID"
else
  if ! gcloud sql instances describe "$SQL_INSTANCE" --project "$PROJECT_ID" >/dev/null 2>&1; then
    run_cmd gcloud sql instances create "$SQL_INSTANCE" \
      --database-version=POSTGRES_16 \
      --edition=enterprise \
      --tier=db-f1-micro \
      --region="$REGION" \
      --storage-size=10GB \
      --storage-type=SSD \
      --backup-start-time=03:00 \
      --project "$PROJECT_ID"
  fi
fi

# 4. Create Database
if [ "$DRY_RUN" = "1" ]; then
  run_cmd gcloud sql databases describe "$DB_NAME" --instance="$SQL_INSTANCE" --project "$PROJECT_ID"
  run_cmd gcloud sql databases create "$DB_NAME" --instance="$SQL_INSTANCE" --project "$PROJECT_ID"
else
  if ! gcloud sql databases describe "$DB_NAME" --instance="$SQL_INSTANCE" --project "$PROJECT_ID" >/dev/null 2>&1; then
    run_cmd gcloud sql databases create "$DB_NAME" --instance="$SQL_INSTANCE" --project "$PROJECT_ID"
  fi
fi

# 5. Service Account (idempotent)
if [ "$DRY_RUN" = "1" ]; then
  run_cmd gcloud iam service-accounts describe "$SA_EMAIL" --project "$PROJECT_ID"
  run_cmd gcloud iam service-accounts create "$SA_NAME" --display-name="fastTrack Cloud Run Runtime" --project "$PROJECT_ID"
else
  if ! gcloud iam service-accounts describe "$SA_EMAIL" --project "$PROJECT_ID" >/dev/null 2>&1; then
    run_cmd gcloud iam service-accounts create "$SA_NAME" \
      --display-name="fastTrack Cloud Run Runtime" \
      --project "$PROJECT_ID"
  fi
fi

# Grant Cloud SQL Client
run_cmd gcloud projects add-iam-policy-binding "$PROJECT_ID" \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/cloudsql.client" \
  --condition=None \
  --quiet

# 6. Database User and Secret Manager (idempotent)
DB_USER_EXISTS=0
if [ "$DRY_RUN" != "1" ]; then
  if gcloud sql users list --instance="$SQL_INSTANCE" --project="$PROJECT_ID" --format="value(name)" 2>/dev/null | grep -qx "$DB_USER"; then
    DB_USER_EXISTS=1
  fi
fi

DB_SECRET_EXISTS=0
if [ "$DRY_RUN" != "1" ]; then
  if gcloud secrets describe "$SECRET_DB_URL" --project="$PROJECT_ID" >/dev/null 2>&1; then
    DB_SECRET_EXISTS=1
  fi
fi

if [ "$DB_USER_EXISTS" = "0" ] || [ "$DB_SECRET_EXISTS" = "0" ]; then
  NEW_DB_PASSWORD="$(openssl rand -hex 24)"
  if [ "$DB_USER_EXISTS" = "0" ]; then
    run_cmd gcloud sql users create "$DB_USER" \
      --instance="$SQL_INSTANCE" \
      --password="$NEW_DB_PASSWORD" \
      --project="$PROJECT_ID"
  else
    run_cmd gcloud sql users set-password "$DB_USER" \
      --instance="$SQL_INSTANCE" \
      --password="$NEW_DB_PASSWORD" \
      --project="$PROJECT_ID"
  fi

  DATABASE_URL_VALUE="postgresql://${DB_USER}:${NEW_DB_PASSWORD}@127.0.0.1:5432/${DB_NAME}?host=/cloudsql/${SQL_CONN_NAME}"

  if [ "$DRY_RUN" = "1" ]; then
    run_cmd gcloud secrets describe "$SECRET_DB_URL" --project "$PROJECT_ID"
    run_cmd gcloud secrets create "$SECRET_DB_URL" --replication-policy=automatic --project "$PROJECT_ID"
    printf '%s' "$DATABASE_URL_VALUE" | run_cmd gcloud secrets versions add "$SECRET_DB_URL" --data-file=- --project "$PROJECT_ID"
  else
    if ! gcloud secrets describe "$SECRET_DB_URL" --project "$PROJECT_ID" >/dev/null 2>&1; then
      run_cmd gcloud secrets create "$SECRET_DB_URL" --replication-policy=automatic --project "$PROJECT_ID"
    fi
    printf '%s' "$DATABASE_URL_VALUE" | run_cmd gcloud secrets versions add "$SECRET_DB_URL" --data-file=- --project "$PROJECT_ID"
  fi
fi

# Grant secretAccessor on database URL secret
run_cmd gcloud secrets add-iam-policy-binding "$SECRET_DB_URL" \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/secretmanager.secretAccessor" \
  --project "$PROJECT_ID" \
  --quiet

# 7. Demo password secret (if --demo)
if [ "$SEED_DEMO_DATA" = "true" ]; then
  DEMO_PASS="$(openssl rand -base64 16)"
  if [ "$DRY_RUN" = "1" ]; then
    run_cmd gcloud secrets describe "$SECRET_DEMO_PASS" --project "$PROJECT_ID"
    run_cmd gcloud secrets create "$SECRET_DEMO_PASS" --replication-policy=automatic --project "$PROJECT_ID"
    printf '%s' "$DEMO_PASS" | run_cmd gcloud secrets versions add "$SECRET_DEMO_PASS" --data-file=- --project "$PROJECT_ID"
  else
    if ! gcloud secrets describe "$SECRET_DEMO_PASS" --project "$PROJECT_ID" >/dev/null 2>&1; then
      run_cmd gcloud secrets create "$SECRET_DEMO_PASS" --replication-policy=automatic --project "$PROJECT_ID"
    fi
    printf '%s' "$DEMO_PASS" | run_cmd gcloud secrets versions add "$SECRET_DEMO_PASS" --data-file=- --project "$PROJECT_ID"
  fi
  run_cmd gcloud secrets add-iam-policy-binding "$SECRET_DEMO_PASS" \
    --member="serviceAccount:${SA_EMAIL}" \
    --role="roles/secretmanager.secretAccessor" \
    --project "$PROJECT_ID" \
    --quiet
fi

# 8. Build initial web and jobs images (using Project_code context)
RELEASE_SHA="$(git rev-parse HEAD 2>/dev/null || echo '0000000000000000000000000000000000000000')"
run_cmd gcloud auth configure-docker "${REGION}-docker.pkg.dev" --quiet
run_cmd docker build --build-arg RELEASE_SHA="$RELEASE_SHA" -t "$IMAGE_URI" Project_code
run_cmd docker push "$IMAGE_URI"
run_cmd docker build --target jobs --build-arg RELEASE_SHA="$RELEASE_SHA" -t "$JOBS_IMAGE_URI" Project_code
run_cmd docker push "$JOBS_IMAGE_URI"

# 9. Create Cloud Run Job for migrations (idempotent, uses jobs image target)
if [ "$DRY_RUN" = "1" ]; then
  run_cmd gcloud run jobs describe "$MIGRATE_JOB_NAME" --region="$REGION" --project="$PROJECT_ID"
  run_cmd gcloud run jobs create "$MIGRATE_JOB_NAME" \
    --image="$JOBS_IMAGE_URI" \
    --region="$REGION" \
    --project="$PROJECT_ID" \
    --service-account="$SA_EMAIL" \
    --set-cloudsql-instances="$SQL_CONN_NAME" \
    --set-secrets="DATABASE_URL=${SECRET_DB_URL}:latest" \
    --command="npm" \
    --args="run,db:migrate,--workspace,@fasttrack/server"
  run_cmd gcloud run jobs execute "$MIGRATE_JOB_NAME" --wait --region="$REGION" --project="$PROJECT_ID"
else
  if ! gcloud run jobs describe "$MIGRATE_JOB_NAME" --region="$REGION" --project="$PROJECT_ID" >/dev/null 2>&1; then
    run_cmd gcloud run jobs create "$MIGRATE_JOB_NAME" \
      --image="$JOBS_IMAGE_URI" \
      --region="$REGION" \
      --project="$PROJECT_ID" \
      --service-account="$SA_EMAIL" \
      --set-cloudsql-instances="$SQL_CONN_NAME" \
      --set-secrets="DATABASE_URL=${SECRET_DB_URL}:latest" \
      --command="npm" \
      --args="run,db:migrate,--workspace,@fasttrack/server"
  fi
  run_cmd gcloud run jobs execute "$MIGRATE_JOB_NAME" --wait --region="$REGION" --project="$PROJECT_ID"
fi

# 10. Deploy Cloud Run Service
run_cmd gcloud run deploy "$SERVICE_NAME" \
  --image="$IMAGE_URI" \
  --region="$REGION" \
  --project="$PROJECT_ID" \
  --service-account="$SA_EMAIL" \
  --set-cloudsql-instances="$SQL_CONN_NAME" \
  --set-secrets="DATABASE_URL=${SECRET_DB_URL}:latest" \
  --set-env-vars="NODE_ENV=production,APP_ORIGIN=${APP_ORIGIN},SESSION_TTL_HOURS=8,TRUST_PROXY_HOPS=1,RELEASE_SHA=${RELEASE_SHA}" \
  --port=8080 \
  --memory=512Mi \
  --min-instances=0 \
  --max-instances=2 \
  --allow-unauthenticated

if [ "$DRY_RUN" != "1" ]; then
  SERVICE_URL="$(gcloud run services describe "$SERVICE_NAME" --region="$REGION" --project="$PROJECT_ID" --format='value(status.url)')"
  echo "Deployment complete! Service URL: $SERVICE_URL"
fi
