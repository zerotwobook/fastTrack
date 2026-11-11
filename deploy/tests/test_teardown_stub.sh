#!/usr/bin/env bash
# All cloud operations are local stubs; no real resources or credentials are used.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
TASK_PARENT="$(cd "${TMPDIR:-/tmp}" && pwd -P)"
TASK_ROOT="$(mktemp -d "$TASK_PARENT/fasttrack-teardown-test.XXXXXX")"
case "$TASK_ROOT" in "$TASK_PARENT"/fasttrack-teardown-test.*) ;; *) exit 2 ;; esac
readonly TASK_ROOT
trap 'rm -rf -- "$TASK_ROOT"' EXIT
mkdir -p "$TASK_ROOT/bin" "$TASK_ROOT/state"
export TASK_STATE="$TASK_ROOT/state" TASK_CALLS="$TASK_ROOT/calls"
export PROJECT_ID=review-fixture REGION=asia-southeast1 DRY_RUN=0
export PATH="$TASK_ROOT/bin:$PATH"

cat > "$TASK_ROOT/bin/gcloud" <<'STUB'
#!/usr/bin/env bash
set -euo pipefail
printf '%s\n' "$*" >> "$TASK_CALLS"
case "${1:-} ${2:-} ${3:-}" in
  'run services list')
    if [ "$TASK_MODE" = verification_error ] && [ -f "$TASK_STATE/deletions-started" ]; then exit 1; fi
    [ ! -f "$TASK_STATE/app" ] || echo fasttrack-app ;;
  'run jobs list') [ ! -f "$TASK_STATE/job" ] || echo fasttrack-migrate ;;
  'sql instances list')
    [ "$TASK_MODE" != discovery_error ] || exit 1
    if [ "$TASK_MODE" = sql_postread_error ] && [ -f "$TASK_STATE/deletions-started" ]; then exit 1; fi
    [ ! -f "$TASK_STATE/sql" ] || echo fasttrack-db ;;
  'sql instances describe')
    [ "$TASK_MODE" != protection_error ] || exit 1
    case "$TASK_MODE" in protected) echo True ;; invalid_protection) echo unknown ;; *) echo False ;; esac ;;
  'artifacts repositories list')
    [ ! -f "$TASK_STATE/repo" ] || echo projects/review-fixture/locations/asia-southeast1/repositories/fasttrack-docker ;;
  'secrets list --project')
    [ "$TASK_MODE" != secret_inventory_error ] || exit 1
    [ ! -f "$TASK_STATE/db-secret" ] || echo projects/review-fixture/secrets/fasttrack-database-url
    [ ! -f "$TASK_STATE/demo-secret" ] || echo projects/review-fixture/secrets/fasttrack-demo-password ;;
  'iam service-accounts list')
    [ ! -f "$TASK_STATE/sa" ] || echo sa-fasttrack-runtime@review-fixture.iam.gserviceaccount.com ;;
  'run services delete')
    [ "$TASK_MODE" != service_delete_error ] || exit 1
    touch "$TASK_STATE/deletions-started"; rm -f "$TASK_STATE/app" ;;
  'run jobs delete') touch "$TASK_STATE/deletions-started"; rm -f "$TASK_STATE/job" ;;
  'sql instances delete')
    case "$TASK_MODE" in protected|sql_delete_error) exit 1 ;; esac
    touch "$TASK_STATE/deletions-started"
    [ "$TASK_MODE" = sql_still_present ] || rm -f "$TASK_STATE/sql" ;;
  'artifacts repositories delete') touch "$TASK_STATE/deletions-started"; rm -f "$TASK_STATE/repo" ;;
  'secrets delete fasttrack-database-url')
    touch "$TASK_STATE/deletions-started"
    [ "$TASK_MODE" = secret_still_present ] || rm -f "$TASK_STATE/db-secret" ;;
  'secrets delete fasttrack-demo-password') touch "$TASK_STATE/deletions-started"; rm -f "$TASK_STATE/demo-secret" ;;
  'iam service-accounts delete') touch "$TASK_STATE/deletions-started"; rm -f "$TASK_STATE/sa" ;;
  *) echo 'Unexpected stub command' >&2; exit 97 ;;
esac
exit 0
STUB
chmod +x "$TASK_ROOT/bin/gcloud"

reset_state() {
  rm -f "$TASK_STATE/app" "$TASK_STATE/job" "$TASK_STATE/sql" "$TASK_STATE/repo" \
    "$TASK_STATE/db-secret" "$TASK_STATE/demo-secret" "$TASK_STATE/sa" "$TASK_STATE/deletions-started"
  : > "$TASK_CALLS"
  if [ "$TASK_MODE" != absent ]; then
    touch "$TASK_STATE/app" "$TASK_STATE/job" "$TASK_STATE/sql" "$TASK_STATE/repo" \
      "$TASK_STATE/db-secret" "$TASK_STATE/demo-secret" "$TASK_STATE/sa"
  fi
  if [ "$TASK_MODE" = partial ]; then rm -f "$TASK_STATE/app" "$TASK_STATE/demo-secret"; fi
}

for TASK_MODE in protected discovery_error protection_error invalid_protection secret_inventory_error \
  sql_delete_error service_delete_error sql_still_present sql_postread_error verification_error secret_still_present success partial absent; do
  export TASK_MODE
  reset_state
  if printf 'review-fixture\n' | bash "$ROOT/deploy/teardown.sh" > "$TASK_ROOT/output" 2>&1; then
    TASK_EXIT=0
  else TASK_EXIT=$?; fi
  case "$TASK_MODE" in
    success|partial|absent)
      test "$TASK_EXIT" -eq 0
      grep -q '^Teardown complete\.$' "$TASK_ROOT/output"
      for resource in app job sql repo db-secret demo-secret sa; do test ! -f "$TASK_STATE/$resource"; done
      if [ "$TASK_MODE" = absent ]; then ! grep -q ' delete ' "$TASK_CALLS"; fi
      if [ "$TASK_MODE" = partial ]; then
        ! grep -q '^run services delete ' "$TASK_CALLS"
        ! grep -q '^secrets delete fasttrack-demo-password ' "$TASK_CALLS"
      fi ;;
    *)
      if [ "$TASK_EXIT" -eq 0 ]; then echo "FAIL: $TASK_MODE reported success" >&2; exit 1; fi
      ! grep -q '^Teardown complete\.$' "$TASK_ROOT/output"
      case "$TASK_MODE" in
        protected|discovery_error|protection_error|invalid_protection|secret_inventory_error)
          ! grep -q ' delete ' "$TASK_CALLS"
          test -f "$TASK_STATE/app"; test -f "$TASK_STATE/db-secret" ;;
        sql_delete_error|sql_still_present|sql_postread_error)
          if [ "$TASK_MODE" != sql_postread_error ]; then test -f "$TASK_STATE/sql"; fi
          test -f "$TASK_STATE/repo"
          test -f "$TASK_STATE/db-secret"; test -f "$TASK_STATE/sa"
          ! grep -Eq '^artifacts repositories delete |^secrets delete |^iam service-accounts delete ' "$TASK_CALLS" ;;
        secret_still_present) test -f "$TASK_STATE/db-secret" ;;
      esac ;;
  esac
  ! grep -q 'instances patch' "$TASK_CALLS"
  echo "PASS teardown $TASK_MODE"
done

export TASK_MODE=protected
reset_state
if printf 'wrong-project\n' | bash "$ROOT/deploy/teardown.sh" > "$TASK_ROOT/output" 2>&1; then
  echo 'FAIL: wrong confirmation was accepted' >&2; exit 1
fi
test ! -s "$TASK_CALLS"
echo 'PASS teardown wrong confirmation makes no cloud calls'

DRY_RUN=1 bash "$ROOT/deploy/teardown.sh" > "$TASK_ROOT/output" 2>&1
test ! -s "$TASK_CALLS"
grep -q '^\[DRY_RUN\] gcloud sql instances delete ' "$TASK_ROOT/output"
echo 'PASS teardown dry run makes no cloud calls'
