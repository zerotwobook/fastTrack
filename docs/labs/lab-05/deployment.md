# fastTrack Lab 5 deployment guide

This guide covers implemented R2-A01 runtime/container behavior and the separate cloud/release handoff. Local commands require the pinned toolchain, Docker Engine and the current committed candidate. Local verification does not establish public GCP availability, TLS, C-04-C-06 or teammate acceptance.

## 1. Stack and artifact layout

React/TypeScript/Vite client; Express/TypeScript API; Prisma with PostgreSQL adapter; one npm workspace under `Project_code/`. The compiled API serves the built frontend and tracked shared modules under one origin. The Lab 5 starter is a reference, not a second app. Existing auth/source/CSRF/role/team/deadline/version contracts remain enforced.

- [Dockerfile](../../../Project_code/Dockerfile): pinned Node 26.13.0 Debian base, npm 11.20.0, full build/jobs targets and a non-root pruned web runner.
- [.dockerignore](../../../Project_code/.dockerignore): no real env/Git/local dependency/output context.
- [Compose](../../../Project_code/compose.yaml): local isolated DB/network with a persistent named volume; explicit jobs and loopback HTTP app.
- [Server env example](../../../Project_code/server/.env.example), [Compose env example](../../../Project_code/compose.env.example).
- [Accepted delivery contract](../../../Project_code/docs/contracts/sprint-2-lab-05-delivery-contract.md) and [Lab 5 workflow](../../../workflow/04_LAB5_DELIVERY_PLAN.md) define owned interfaces and gates.

The jobs image retains Prisma CLI/tsx/source/config and uses the same source SHA as the web image. The web image contains built client/server, fonts/licenses, runtime dependencies, copied generated Prisma assets and all three runtime `shared/*.mjs` modules. It starts only the HTTP server: no automatic migration, seed or cleanup.

## 2. Prerequisites and local configuration

Use Node `26.13.0`, npm `11.20.0`, Docker Engine with Linux containers, Git and the tracked lockfile. From `Project_code/`, `npm ci` installs the workspace. No child lockfile or engine-check bypass is needed. Real integration tests use newly created guarded disposable PostgreSQL, not an existing shared/cloud database.

Copy examples privately; never commit actual env values, passwords, connection strings, cookies or tokens. The root ignore rules exclude `.env.compose` and server `.env`. Use generated URL-unreserved hexadecimal values for the local DB password in Compose; changing that env value does not reset an existing volume's DB password.

### Runtime and operational environment

| Variable | Purpose / validation and default | Secret? / value source |
|---|---|---|
| `NODE_ENV` | development/test/production; production requires exact HTTPS origin/SHA | No; runtime config. |
| `PORT` | Integer 1-65535; app default 3000, runner default 8080 | No; Cloud Run injects its listener port. |
| `APP_ORIGIN` | Exact allowed origin; production HTTPS, no trailing slash/path/query | No; canonical verified service URL. Local Compose uses explicit development HTTP. |
| `DATABASE_URL` | PostgreSQL connection URL; external DB, never client bundle | Yes; private local env or scoped Secret Manager reference. |
| `SESSION_TTL_HOURS` | Fixed 8-hour absolute session lifetime | No; runtime config, default 8. |
| `RELEASE_SHA` | Production full lowercase 40-hex source commit; image build argument and runtime identity | No; exact source built by pipeline. |
| `DB_POOL_MAX` | Integer 1-20, default 2; account for instance/job connection budget | No; runtime config. |
| `DB_CONNECT_TIMEOUT_MS` | Positive bounded connection/pool-acquisition timeout, default 1000 | No; runtime config. |
| `DB_STATEMENT_TIMEOUT_MS` | Positive bounded PostgreSQL statement timeout, default 1000 | No; runtime config. |
| `DB_QUERY_TIMEOUT_MS` | Positive bounded driver timeout, default 1500 | No; runtime config. |
| `READINESS_TIMEOUT_MS` | Positive bounded response deadline, default 3000; query deadline must be lower | No; runtime config. |
| `TRUST_PROXY_HOPS` | Only 0 or 1; default 0. Cloud 1 requires actual verified proxy path | No; runtime config, never blindly trust caller headers. |
| `LOGIN_RATE_LIMIT_MAX_FAILURES` | Positive bounded threshold, default 5 | No; runtime policy config. |
| `LOGIN_RATE_LIMIT_WINDOW_SECONDS` | Positive bounded failure window, default 900 | No; runtime policy config. |
| `LOGIN_RATE_LIMIT_LOCK_SECONDS` | Positive bounded lock duration, default 900 | No; runtime policy config. |
| `LOGIN_RATE_LIMIT_RETENTION_SECONDS` | Default 3600; greater than window and lock | No; maintenance policy config. |
| `DEMO_SEED_PASSWORD` | Required only for explicit add-only demo seed; no default | Yes; private seed input, not normal web runtime. |
| `CONFIRM_RATE_LIMIT_CLEANUP` | Exact `auth-rate-limits-only` acknowledgement for one explicit cleanup batch | No; deliberate maintenance invocation only. |
| `LOCAL_DB_PASSWORD` | Compose DB/app/jobs connection; hexadecimal URL-unreserved value | Yes; private `.env.compose`, not image build args. |

### Test/review/report settings

`TEST_DATABASE_URL` is a secret for a separately reserved, guarded test DB; never a cloud/shared DB. `AUTH_REVIEW_PASSWORD` is private disposable-browser-review input. `AUTH_REVIEW_STATE_PATH`, `AUTH_REVIEW_STOP_FILE` and `RESTART_PROTECTED_DATABASE_URL` are existing local runner controls; the last is secret. They do not belong in public runtime configuration.

The isolated runner sets `G1_AUDIT_CONTAINER_ID`, `G1_LEGACY_MIGRATIONS_DIR`, `G1_CANDIDATE_MIGRATIONS_DIR`, `G1_HISTORY_MIGRATIONS_DIR`, `G1_UPGRADE_REPORT_PATH` and the `G1_REVIEW_AUTH`, `G1_AUTH_CHECKS`, `G1_B01_CHECKS`, `G1_A02_CHECKS`, `G1_B02_CHECKS`, `G1_J03_CHECKS`, `G1_A01_CHECKS` selectors internally. Do not supply spoofed audit identity/unsafe DB targets. `G1_REPORT_PATH` chooses a non-secret result destination. `A01_CONTAINER_REPORT` optionally chooses the container-verification JSON destination. npm supplies `npm_execpath` internally; invoke the wrappers through npm.

## 3. Tests and build commands

From `Project_code/`:

```powershell
npm ci
npm run typecheck
npm test
npm run build
$env:G1_REPORT_PATH = Join-Path (Get-Location) 'docs/evidence/R2-A01-regression.json'
npm run test:runtime:isolated
```

Build/generation needs a privately configured local DB URL or a documented synthetic build-only generation URL; it must never connect a build to production. The isolated test wrapper supplies its own disposable DB/credentials, runs the inherited full S1 chain, new runtime cases and migration-history checks, then removes only its own audit container.

The container verifier requires committed source. It creates a fresh local Git clone with the exact HEAD, builds final web/jobs targets, uses newly generated private credentials only in temporary env files, runs real local DB/business/seed/restart checks and removes its own containers/network/credential files:

```powershell
npm run verify:container
```

Its report distinguishes the tested source commit, actual image IDs, original record IDs and outcomes. It does not verify cloud deployment or browser TLS. Readiness RED history is retained on the task branch; an intentionally failing RED commit is never a protected-branch merge candidate.

## 4. Persistent local Compose run

From `Project_code/`, copy `compose.env.example` to ignored `.env.compose`, fill private passwords and set `RELEASE_SHA` to the exact source commit. Then:

```powershell
docker compose --env-file .env.compose --profile tools build app jobs
docker compose --env-file .env.compose up -d db
docker compose --env-file .env.compose run --rm jobs run db:migrate --workspace @fasttrack/server
# Only when deliberately creating synthetic demo accounts:
docker compose --env-file .env.compose run --rm jobs run db:seed --workspace @fasttrack/server
docker compose --env-file .env.compose up -d app
```

Open `http://127.0.0.1:8080`. This is explicitly **development HTTP mode** serving compiled assets; production image defaults still require HTTPS origin, Secure cookies and a full SHA. The example does not establish cloud TLS. Port 8080 must be free. Migrations/seed are explicit jobs; app startup does not invoke them.

For an ordinary app restart, use `docker compose --env-file .env.compose restart app`, then read the same original records/session. Stop with `docker compose --env-file .env.compose stop app`. The named `local-db` volume retains data. Do not delete volumes/reset the DB to test persistence. Keep the original private DB password for an existing volume.

## 5. Readiness, login limits and maintenance

`GET /api/health` returns `{"status":"ok","version":"<SHA>"}` without querying DB. `GET /api/ready` actually queries DB; healthy JSON is `{"status":"ready","database":"connected","version":"<SHA>"}`, failure is sanitized 503 `{"status":"unavailable","database":"disconnected","version":"<SHA>"}`. Responses are no-store. Concurrent pending probes share one query; connection/driver/statement limits also bound underlying work.

The first four failed logins return generic 401; the fifth returns 429 `LOGIN_RATE_LIMITED` in the existing nested error envelope with integer `Retry-After`. Shared PostgreSQL state serializes a canonical selected-IP key. Active locks reject even valid credentials without session effects; exact expiry resets state. Successful unlocked login clears its key. Invalid source/shape does not write limiter/session state. Forwarded identity is accepted only under configured verified topology; local tests do not certify the live Cloud Run header path.

Cleanup is a separate explicit command, after checking/authorizing the intended target DB privately:

```powershell
$env:CONFIRM_RATE_LIMIT_CLEANUP = 'auth-rate-limits-only'
node --env-file-if-exists=server/.env server/dist/operations/cleanup-rate-limits.js
Remove-Item Env:CONFIRM_RATE_LIMIT_CLEANUP
```

It deletes at most 100 expired limiter rows in a bounded indexed transaction with `SKIP LOCKED`, preserving active windows/locks and every session/domain table. It prints only count/status. The flag is an acknowledgement, not independent cloud-mutation permission. Schedule further batches only through the reviewed maintenance plan; nothing runs automatically at HTTP startup.

## 6. Cloud provisioning review plan (not executed by R2-A01)

Recorded proposed inputs: project `fasttrack-se-002`, number `970128017651`, region `asia-southeast1`; service `fasttrack-app`; registry `fasttrack-docker`; SQL `fasttrack-db`, database `fasttrack_prod`; runtime/deployer identities `sa-fasttrack-runtime` / `sa-fasttrack-deployer`. Cloud existence, billing/credits, current costs, IAM, connection and public URL require read-only verification by the account holder. No resource is certified present from its name alone.

| Proposed change | Review before execution | Expected verification / owner |
|---|---|---|
| Registry/web and jobs images | Existing repo/location, source SHA and separate immutable digests | Actual image metadata; A runtime/B pipeline. |
| Persistent SQL and connection | Existing instance/edition/tier/storage/backup, actual prices/credits/quota, socket/proxy URL and supported PrismaPg/CLI behavior | Authorized fresh/S1-compatible migration job and safe connection result; A/B. |
| Runtime/job identity and secrets | Cloud SQL Client, specific Secret Accessor resources; no deploy privilege | Actual scoped bindings/secret references without values; account holder/A. |
| Deployer/WIF | Numeric repo/owner, main/workflow/environment/event restriction, scoped registry/service/job/runtime impersonation | Allowed main and rejected wrong claims, no JSON keys; B. |
| Service rollout | Accepted main source, full SHA/digests, canonical origin, port, pool/concurrency/min/max limits | Real serving revision/traffic/health/readiness/public business result; joint. |
| Restart experiment | Bounded approved downtime before grading/UAT, same-revision zero-instance/start provenance and original IDs | Separate restart/redeploy observations, restored settings; joint. |

Proposed runtime uses min 0/max 2 instances, bounded pool and no extra cache service. Review capacity and current charges before creating anything; budget alerts are not a cap. Human inspects exact commands/resource identities/permission/cost impact before billing/IAM/DB changes. No prepayment/Upgrade or broad IAM workaround. Destructive migration/recovery uses a reviewed backup/restore plan and separate environment.

For first origin bootstrap use the accepted deterministic service URL format, then verify the actual canonical URL/metadata and browser path before business access. Never disable CSRF to work around creation ordering. Socket/Cloud SQL commands and passwords remain unexecuted/private until the actual authorized cloud phase.

## 7. CI, normal release, rollback and version lookup

B implements and maintains root CI/deploy workflows, deployment scripts, offline tests and smoke tests under task R2-B01:

- **CI Workflow ([.github/workflows/ci-docker.yml](../../../.github/workflows/ci-docker.yml))**:
  - Triggers on pull requests and pushes to `main` and `staging/sprint-*`, as well as reusable `workflow_call`.
  - Job ID is strictly **`test-and-docker`** (emits stable check for branch protection). Cancels in-progress PR runs on update while preserving pushes and release runs.
  - Sequence: script syntax and offline stub tests -> `Project_code` lockfile install (`npm ci`) -> `db:generate` -> typecheck -> unit tests -> production build -> isolated Docker PostgreSQL suite (`npm run test:runtime:isolated`) -> artifact upload (`ci-runtime-report`) -> production Dockerfile builds (both `runner` and `jobs` targets).
- **Deploy Workflow ([.github/workflows/deploy.yml](../../../.github/workflows/deploy.yml))**:
  - Main-only automatic trigger on `push` to `main`, and manual `workflow_dispatch` for rollback. `deploy/release.sh` additionally rejects any non-main `GITHUB_REF` before calling GCP.
  - Concurrency group `deploy-main` with `cancel-in-progress: false` ensures active migrations are never aborted mid-flight.
  - Environment: `demo` with scoped variables (`GCP_PROJECT_ID`, `GCP_REGION`, `WIF_PROVIDER`, `WIF_SERVICE_ACCOUNT`).
  - Sequence: calls CI `test-and-docker` -> authenticates via WIF -> builds and pushes `fasttrack-app` (web) and `fasttrack-jobs` (`--target jobs`) tagged with `IMAGE_TAG` -> resolves immutable `@sha256:` digests -> executes `deploy/release.sh` (migrates via `fasttrack-jobs`, updates `fasttrack-app` with web digest and `RELEASE_SHA=$IMAGE_TAG`, captures `SERVING_REVISION`) -> executes `deploy/smoke_test.py` -> publishes factual summary to GitHub Step Summary.
- **Smoke Checks (`deploy/smoke_test.py`)**:
  - Public checks validate `/api/health` (status `ok` and `version == EXPECTED_RELEASE_SHA`), `/api/ready` (`status: ready`, `database: connected`, matching version), `/` (HTML containing `fastTrack`), and `/api/nonexistent` (HTTP 404 sanitized JSON error envelope).
  - Optional private smoke runs when both `SMOKE_EMAIL` and `SMOKE_PASSWORD` are configured, exercising cookie jar, `X-fastTrack-Request: 1`, `Origin`, `X-CSRF-Token`, `/api/auth/me`, read-only scoped `GET /api/teams`, and guaranteed `/api/auth/logout` in `finally`. Missing credentials print `SKIP login`; partial or invalid credentials fail the check.
- **Offline Deployment Script Tests**:
  - `bash deploy/tests/test_release_stub.sh`: Verifies normal web/jobs digest release, awaited migration, `RELEASE_SHA` propagation, rollback without migration, non-main `GITHUB_REF` rejection, image/jobs_image/migration failure blocking rollout, and invalid tag rejection.
  - `bash deploy/tests/test_deploy_stub.sh`: Verifies idempotent provisioning (`fasttrack_user`, `APP_ORIGIN`, `TRUST_PROXY_HOPS=1`), Cloud SQL enterprise edition, no project-wide `secretAccessor`, zero leaked secrets in stdout, and migration failure abortion.
  - `python3 -m unittest discover -s deploy/tests -p 'test_smoke.py'`: Verifies health, version match enforcement, DB readiness failure, `/api/nonexistent` 404, scoped `/api/teams`, and session logout guarantees.
- **Rollback Procedure**:
  - Rollback is triggered manually via GitHub Actions `Deploy demo` workflow dispatch by providing the full 40-character `image_tag` of an existing known image.
  - The script sets `ROLLBACK=true`, resolves the existing image digest, points Cloud Run at the image, and sets traffic to 100%. Build, migration, and seed steps are deliberately skipped.
  - Rollback requires schema compatibility; it does not reverse database migrations or recover mutated data.

Every main-targeted candidate follows [the user gate](../../../workflow/MAIN_RELEASE_GATE.md). Queue releases without cancelling migrations. On migration failure stop before rollout and inspect partial schema state. Rollback deploys a known compatible existing image and skips migration/seed; it does not undo DB data/schema. Do not blindly retry or assume automatic rollback after smoke failure.

Version proof compares actual built main SHA (possibly different from PR head), web/jobs tag/digest, migration execution, serving revision/traffic and health version. A report-only commit can differ from the serving source; record both. C-04 public domain flow, C-05 distinct cloud restart/redeploy and C-06 main pipeline trace remain later joint checks, not local-container claims.

## 8. Diagnosis and evidence

Read the failed stage before fixing it. For missing runtime modules inspect final shared/generated layout. For unavailable readiness inspect private DB configuration/deadlines/migration state without printing URLs. For login/source failure verify canonical origin, cookie/source/CSRF and trusted proxy path; do not loosen authorization. For image/job failure verify actual tool pins/entrypoint/workspace working directory.

Keep actual test outputs under [application evidence](../../../Project_code/docs/evidence). Current RED/GREEN/regression/container records identify their real source/commands; the final A01 handoff records actual verified results and remaining peer/cloud limits. Keep repo/service available through grading/UAT and preserve CI/contract history for later labs. Markdown report preparation does not authorize PDF export/upload or coursework submission.

### PR #85 review corrections

Bootstrap with `deploy/deploy.sh` requires a clean local `main` checkout matching the fetched `origin/main`; fetch and synchronize it first. This source check does not grant cloud authorization. `DRY_RUN=1` permits command preview from a task branch without cloud calls. Both web and jobs images use the full source SHA tag and are resolved to validated 64-hex immutable digests before migration or rollout. Provisioning reruns update the existing migration job to the selected jobs image before execution.

Bootstrap and normal release configure one migration task with `--max-retries=0`, reset its command to `npm run db:migrate --workspace @fasttrack/server`, and await completion. A migration failure requires inspection before any deliberate retry. Rollback leaves the migration job untouched. Normal release verifies the actual traffic revision and a single 100% traffic assignment before exporting its result; split traffic is a failure rather than a successful summary.

The authenticated smoke check fails with a sanitized error if logout fails. The API 404 must match the implemented `NOT_FOUND` envelope exactly, including empty fields and no extra diagnostic keys. Offline tests cover these failures; they do not establish live WIF, public cloud behavior or C-02 acceptance. `--demo` prepares a seed-password secret; this provisioning script does not run a seed automatically. Seed remains a separate explicitly authorized operation.
