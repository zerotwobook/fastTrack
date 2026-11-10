# R2-J01 Cloud Runtime and Provisioning Plan

| Field | Value |
|---|---|
| Task / Issue | R2-J01 / [#16](https://github.com/zerotwobook/fastTrack/issues/16) |
| Owner / peer reviewer | A (`zerotwobook`) / B (`Atip-Infa`) |
| Branch / PR | `ops/s2-a-cloud-runtime` / [#89](https://github.com/zerotwobook/fastTrack/pull/89) |
| Target base observed on 11 November 2026 | `staging/sprint-2` at `7936ebb35ad79490b46f05c23ef26fdcddfeee33` |
| Original plan | `438b3e741298031cac59b02143f7f4a144540063`, originally based on `8edab6f30c051a1a8f6c0d1a2222af5f2125fc9e` |
| Execution mode | Preparation and review corrections only |
| Delivery readiness | **BLOCKED for cloud execution**: account/resource discovery, connection verification, costs, bootstrap settings and authorizations remain pending |

## 1. Scope, ownership and evidence boundaries

This is the reviewable A/07 runtime proposal and resume record. It does not certify completion of Phase A/B, first deployment, C-01-C-06 or Issue #16. The user authorized corrections after assisted review; this is not authorization to change cloud resources, GitHub deployment protection or `main`.

A owns this handoff, runtime/resource discovery, the connection proposal and external verification. B owns WIF/deployer trust, GitHub environment/check settings and release orchestration. The accepted [B handoff](R2-B01_B_LIVE_GATE_PLAN.md), corrected at `441b7e5` and merged through [PR #88](https://github.com/zerotwobook/fastTrack/pull/88) as `7936ebb`, is the companion plan. Its snapshots are historical observations; reread settings before execution. Changes to B-owned workflows/scripts or the shared deployment guide require coordination with B. This correction changes only this Markdown handoff.

Use existing paths: application/runtime source in `Project_code/`, Actions in `.github/workflows/`, scripts in `deploy/`, and the canonical [deployment guide](../../docs/labs/lab-05/deployment.md). No app, migration or release implementation is introduced here. Unaccepted F-05-F-07 features, later restart/redeploy evidence and C-02 remain outside this preparation.

`origin/main` was fetched as `b7174a7eb5acd0eca7fa0b0ef0bec078954e2d82`. It contains the accepted S1 application and historical D1 artifacts, but not the Sprint 2 delivery Dockerfile/workflows/scripts. Deploy only the subsequently reviewed and accepted main source. The [main-release gate](../MAIN_RELEASE_GATE.md) and cloud-action authorization are separate.

## 2. Discovery record and remaining unknowns

### Verified observations on 11 November 2026

| Check | Result and limit |
|---|---|
| `Get-Command gcloud -ErrorAction SilentlyContinue` | No command found on PATH. This does not prove no installation elsewhere or no existing cloud resource. |
| `git --version` | `2.56.0.windows.3`; fetched main/staging refs and inspected the task branch. |
| Git Bash `--version` | `5.3.15(2)-release`; path `C:\Program Files\Git\bin\bash.exe`. |
| `python --version` | `3.13.16`. |
| `docker --version` | Client `29.9.2`, build `a82e528`; configuration access warning. This does not establish daemon availability or an image build. |
| `gh api repos/zerotwobook/fastTrack/environments` | `total_count: 0`; no configured `demo` environment or required-reviewer hold. |
| Issue #16 and PR #89 Project cards before edits | Both read back `Fixing / FAILED / PENDING` after actual findings; the Issue log records the transition. |

The original plan's Git/Bash versions are superseded by these observations. Historical exact test durations are not fresh evidence. No authenticated GCP session was established, and no GCP query or mutation was performed during this correction. The account holder can complete discovery in Cloud Console or an approved existing CLI session; no password, token or key file is needed in chat.

### Proposed resource inventory

All identifiers below are **proposal leads**, not verified ownership, existing resources or approved execution targets.

| Resource | Proposed identity / configuration | State / missing verification |
|---|---|---|
| Project | `fasttrack-se-002`, number `970128017651` | UNKNOWN: verify both identifiers and account access together. |
| Account / billing | Handout-compliant account; no prepayment or Upgrade | UNKNOWN: account type, billing linkage, credit balance/expiry and quota. |
| Region | `asia-southeast1` | Proposal; confirm capacity, cost and approved region. |
| Artifact Registry | `fasttrack-docker` | UNKNOWN: repository/location and permissions. |
| SQL | `fasttrack-db`, PostgreSQL 16 Enterprise `db-f1-micro`, 10 GB SSD | UNKNOWN: support/quota, storage auto-increase, backups, deletion protection and existing data. |
| Database / user | `fasttrack_prod` / `fasttrack_user` | UNKNOWN: existence and credential ownership; preserve existing credentials. |
| Runtime / deployer | `sa-fasttrack-runtime` / `sa-fasttrack-deployer` | UNKNOWN: identities/effective scoped IAM; deployer is B-owned. |
| DB secret | `fasttrack-database-url` | UNKNOWN: metadata/version availability and per-secret IAM; do not access payload. |
| Optional seed secret | `fasttrack-demo-password` | UNKNOWN; excluded from ordinary web runtime and initial bootstrap unless separately selected. |
| Migration job / service | `fasttrack-migrate` / `fasttrack-app` | UNKNOWN: verify both before selecting bootstrap versus normal release. |
| Public origin | `https://fasttrack-app-970128017651.asia-southeast1.run.app` | Predicted URL only; no live service/HTTPS/auth verification. |

Permission failure means UNKNOWN. A successful inventory establishing no matching resource is required before VERIFIED ABSENT. Never interpret a failed `describe` as permission to create or reset something.

### Read-only discovery for the account holder

Run these Bash commands in an approved authenticated session. Confirm project ID/number first; stop and revise the proposal if they differ. These commands do not provision resources.

```bash
gcloud projects describe fasttrack-se-002 --format='json(projectId,projectNumber,lifecycleState)'
gcloud billing projects describe fasttrack-se-002 --format='json(projectId,billingEnabled)'
gcloud services list --enabled --project=fasttrack-se-002 --format='value(config.name)'
gcloud artifacts repositories list --location=asia-southeast1 --project=fasttrack-se-002 --format='table(name,format)'
gcloud sql instances list --project=fasttrack-se-002 --format='table(name,region,databaseVersion,settings.tier)'
gcloud iam service-accounts list --project=fasttrack-se-002 --format='table(email,disabled)'
gcloud secrets list --project=fasttrack-se-002 --format='value(name)'
gcloud run jobs list --region=asia-southeast1 --project=fasttrack-se-002 --format='value(metadata.name)'
gcloud run services list --region=asia-southeast1 --project=fasttrack-se-002 --format='table(metadata.name,status.url)'
```

After the instance/secret is confirmed present, inspect metadata only:

```bash
gcloud sql instances describe fasttrack-db --project=fasttrack-se-002 --format='json(connectionName,region,databaseVersion,settings.edition,settings.tier,settings.dataDiskSizeGb,settings.dataDiskType,settings.storageAutoResize,settings.backupConfiguration,settings.deletionProtectionEnabled)'
gcloud sql databases list --instance=fasttrack-db --project=fasttrack-se-002 --format='value(name)'
gcloud sql users list --instance=fasttrack-db --project=fasttrack-se-002 --format='value(name)'
gcloud secrets versions list fasttrack-database-url --project=fasttrack-se-002 --format='table(name,state,createTime)'
gcloud secrets get-iam-policy fasttrack-database-url --project=fasttrack-se-002 --format=json
```

Privately verify the active account, billing/credit expiry, regional quota and effective IAM. Record sanitized results, source and timestamp per inventory row. Do not publish billing identifiers, secret payloads, full service env dumps or connection strings.

## 3. Change matrix and execution prerequisites

**Every row remains PROPOSED / NOT EXECUTED.** This is a preparation review, not a blanket execution request while discovery, costs, storage policy and bootstrap protection are unresolved. Before requesting execution, attach final commands generated from reviewed source and verified values, source SHA/image digests, current-state readbacks and selected action IDs. Replace proposed names if discovery finds different targets.

| Action | Resource / proposed operation | Prerequisites and impact | Verification / recovery boundary |
|---|---|---|---|
| A07-01 | Project APIs listed in `deploy/deploy.sh` section 1, only where needed | Verified account/project/billing and account-holder authorization. API enablement alone is not a cost estimate. | Read enabled API names. No automatic disabling of APIs used by existing services. |
| A07-02 | `asia-southeast1/fasttrack-docker`, create only if VERIFIED ABSENT | Verified location, storage/network estimate and scoped IAM. | Describe repository; preserve existing images. No automatic deletion. |
| A07-03 | `fasttrack-db`, PostgreSQL 16 Enterprise `db-f1-micro`, proposed 10 GB SSD/daily backup | Verify tier/quota, storage auto-increase policy, retention, protection and regional estimate. Current script defaults do not resolve these choices. | Filtered SQL metadata; inspect partial provisioning before retry. No automatic deletion. |
| A07-04 | `fasttrack_prod`, create only if VERIFIED ABSENT | Confirm instance/existing data and DB authorization. | List databases. No DROP/reset/schema-push recovery. |
| A07-05 | Runtime `sa-fasttrack-runtime`, create if absent; grant Cloud SQL Client at supported project scope | IAM authorization. This project-level role is not instance-only; B reviews scope. | Read SA existence and effective IAM, not SA existence alone. Correct only identified erroneous bindings with authorization. |
| A07-06 | `fasttrack_user` and `fasttrack-database-url`, private credential input and per-secret access | Inspect both first; preserve credentials. Missing secret with an existing user requires a separately reviewed recovery/rotation decision. | User/secret metadata, scoped IAM and private connection result; no automatic password reset. |
| A07-07 | Web `fasttrack-app` and `jobs` images from exact accepted main | Clean main equals fetched `origin/main`; release and cloud build/push authorization. Context `Project_code`. | Full source SHA, both tags and validated immutable digests. Tags can move; digests identify content. |
| A07-08 | Create/configure `fasttrack-migrate`, then execute migration | A07-03..07, tested connection, approved bootstrap hold, exact jobs digest. Command `npm run db:migrate --workspace @fasttrack/server`, one task, zero retries. | Describe image/command/identity/secret reference; record execution `--wait` success. Inspect schema before recovery. |
| A07-09 | Create initial `fasttrack-app` or update established service | Migration success, exact web digest, HTTPS origin, pool/proxy/instance configuration and public-access authorization. | Ready revision/resolved image/traffic/URL. Rollback requires compatible schema and an actual previous revision. |
| A07-10 | External public/auth verification | Verified URL/SHA; optional approved synthetic credentials through private config. | Section 6. Public checks read endpoints; optional login/logout writes sessions. No automatic rollback/retry on failure. |

All cloud-action authorizations are **PENDING**. The correction request authorizes documentation, checks, commits and the existing staging PR handoff, not cloud actions or B-owned settings changes.

### Command preview and existing-script limits

From the repository root, this preview uses proposal identifiers and makes no cloud calls:

```bash
PROJECT_ID=fasttrack-se-002 PROJECT_NUMBER=970128017651 REGION=asia-southeast1 DRY_RUN=1 bash deploy/deploy.sh
```

It reads local Git and generates local random values. It previews the creation path and SHA-tagged images; real execution resolves digests afterward. It does not establish existing-resource behavior, prices, permissions or socket compatibility. The reviewed source/failure tests govern rerun paths.

The script is not resource-only: it combines API/IAM/DB/secret mutation, image build/push, migration and rollout. Its missing-secret path can reset an existing DB user's password; `--demo` adds a seed-secret version and does not run a seed. Failed resource lookups can be treated as absence. Complete inventory first; use a separately reviewed subset or code correction if actual state differs. No `teardown.sh`, reset or blind rerun belongs to this plan.

## 4. Runtime and database contract

### Images, migration and seed

Intended registry prefix: `asia-southeast1-docker.pkg.dev/fasttrack-se-002/fasttrack-docker`. Images: `fasttrack-app` (runner) and `fasttrack-jobs` (`--target jobs`). Both use the full accepted-main source SHA as tag/build argument. Record immutable digests before use. PR head, main merge SHA and image digest are different identities.

The jobs image retains Prisma CLI/source/config/migrations. Migration is explicit, one task, parallelism one, zero retries and awaited before rollout. Failure requires schema inspection. Image rollback skips migration/seed and cannot reverse schema/data. Demo seed is explicit/add-only; `DEMO_SEED_PASSWORD` belongs only to the authorized seed job, never ordinary web runtime or Vite builds.

### Connection proposal and required validation

Proposed Cloud Run Cloud SQL socket attachment: `fasttrack-se-002:asia-southeast1:fasttrack-db`. This is a **non-secret template**, not a usable connection string:

```text
postgresql://fasttrack_user:<PRIVATE_PASSWORD>@127.0.0.1:5432/fasttrack_prod?host=/cloudsql/fasttrack-se-002:asia-southeast1:fasttrack-db
```

Runtime uses `PrismaPg` in `Project_code/server/src/db/runtime-client.ts`; migration CLI reads `DATABASE_URL` from `Project_code/prisma.config.ts`. Offline shell stubs inspect command construction/secret plumbing. **They do not validate either consumer's socket connection.**

Connection validation is NOT RUN. A must test both consumers with pinned runtime/jobs images and private synthetic credentials on an approved disposable Linux/socket PostgreSQL fixture: run the real migration entrypoint, then a real adapter query/readiness check. Retain source/image identity and sanitized results. Before rollout, repeat via the real Cloud Run migration job/socket and `/api/ready`. Never point cleanup-capable fixtures at cloud/shared data. If consumers need different URL encoding/configuration, coordinate a tested A/B correction before creating the production secret.

Generate new approved credentials privately with `openssl rand -hex 24`, and send the URL to Secret Manager via stdin (`--data-file=-`) as implemented. No printing or shell tracing. gcloud receives a password argument during SQL user creation/reset; this does not mean secrets never exist in process memory/arguments. Metadata checks do not prove payload authentication.

### Runtime configuration

| Setting | Proposed value / verification requirement |
|---|---|
| Port / memory | Cloud Run 8080; proposed 512 MiB. Verify server binding and a ready instance. |
| `NODE_ENV`, `RELEASE_SHA` | `production`, exact lowercase 40-hex built main SHA. |
| `APP_ORIGIN` | Predicted HTTPS URL, no path/trailing slash; verify metadata/browser origin before business access. |
| Session policy | `SESSION_TTL_HOURS=8`; externally verify Secure/HttpOnly/SameSite attributes without retaining values. |
| Proxy | Proposed `TRUST_PROXY_HOPS=1`; verify real forwarded-header topology before claiming spoofing resistance. |
| Pool / deadlines | Implemented defaults: pool 2, connect/statement 1000 ms, query 1500 ms, readiness 3000 ms. Check effective configuration. |
| Instances / concurrency | Proposed min 0/max 2. Approve effective concurrency against DB capacity. Four web connections is only steady-state pool arithmetic; include jobs/admin connections and rollout overlap/headroom. |
| IAM | Runtime: Cloud SQL Client and individual required secrets. Separate B-owned deployer. No project-wide Secret Accessor, Owner/Editor or JSON keys. |

The predicted URL follows [Cloud Run HTTPS documentation](https://docs.cloud.google.com/run/docs/triggering/https-request), including its DNS-length condition. It does not establish the real project number or running service. Preserve exact origin/custom-header/CSRF checks; no wildcard origin workaround.

## 5. First-deployment sequence with existing code

### Creation is required before normal release

`deploy/release.sh` uses `gcloud run jobs update` and `gcloud run services update`; both resources must exist. The main-push workflow builds images but does not create these resources. `deploy/deploy.sh` creates them but requires clean accepted `main` matching fetched `origin/main`; it cannot bootstrap from this staging branch in advance.

### Proposed route: hold automatic deployment, bootstrap accepted main, then reject the waiting duplicate

This is a concrete proposal for B/account-holder review, **not a configured hold**. Environments API currently returns zero environments. B must incorporate the required-reviewer hold below into the authorized B08-02 settings delta before the first main release. Branch-only restrictions do not hold a deployment job.

1. Complete verified inventory/cost/connection discovery and scoped A07 authorization. B prepares WIF/main-only `demo` configuration. Separately authorize a required deployment reviewer (proposed B, `Atip-Infa`), prevent-self-review and no administrative bypass. Verify eligibility/availability and read back protection before main authorization. GitHub documents that environment protection gates jobs before execution; see [environment management](https://docs.github.com/en/actions/how-tos/deploy/configure-and-manage-deployments/manage-environments). If this hold cannot be configured/verified, keep the main candidate Draft and have B prepare a tested bootstrap-capable workflow. Do not rely on racing to cancel a running migration.
2. Record exact main-candidate head/base, user release decision, peer/protection checks, authorized cloud subset and bootstrap operator. Prepare an isolated clean release checkout and working Docker/gcloud tools; preserve this task worktree. No other main release, manual deploy or seed may run during bootstrap.
3. After the authorized merge, automatic CI runs; the `deploy` job must remain awaiting `demo` review. Record its run/status. Do not approve or bypass it yet. A main merge does not mean deployment succeeded.
4. In the isolated checkout, fetch/synchronize accepted `main`. Verify clean status and equality of HEAD, `origin/main` and the authorized merge SHA. Review preview and actual existing-resource branches. Only with authorization covering the **whole script's actual effects**, use the future bootstrap command below. Otherwise prepare a reviewed narrower sequence first. Omit optional `--demo`.
5. Bootstrap builds accepted-main images, validates digests, creates/configures the migration job, awaits success, then creates the service. Independently inspect ready revision/resolved image/traffic/URL and run smoke. On partial failure leave Actions waiting, inspect the failure/schema, and do not blindly rerun or approve the pending job.
6. B reviews bootstrap evidence. The waiting Actions job would build the same tags again and migrate again; do not approve it as an assumed no-op. The proposed bounded route is to **reject this waiting initial deployment before its deploy job starts**. Record its actual unsuccessful/cancelled conclusion and link the manual accepted-main bootstrap evidence. This is not a successful automatic deployment or C-06 proof. Use normal deployment review; do not disable/delete the workflow or weaken protection.
7. Later authorized main releases use the normal WIF pipeline against established resources, with environment review preserved. The later reviewed visible change supplies C-06 and the distinct C-05 redeploy after original records/restart evidence exist. It is not released automatically during this preparation.

Future command, only after all conditions above, at the root of the isolated accepted-main checkout:

```bash
PROJECT_ID=fasttrack-se-002 PROJECT_NUMBER=970128017651 REGION=asia-southeast1 bash deploy/deploy.sh
```

Identifiers must match verified inventory/authorization. Record actual main SHA and reviewed preview before execution. Bootstrap does not validate traffic as thoroughly as `release.sh`; independently verify resolved image, ready revision and intended single 100% assignment. On a first-ever deployment there may be no rollback revision; recovery is diagnosis/roll-forward, not an invented rollback target.

This hold/bootstrap/reject route remains **PENDING B review and settings/cloud/main decisions**. If a bootstrap-capable workflow is chosen instead, B owns implementation, failure tests and renewed exact-candidate review. Do not silently substitute routes after authorization.

Proposed addition for B's settings review, without applying it in this task:

| Setting | Observed before | Proposed delta / verification |
|---|---|---|
| `demo` required reviewer | Environment absent | Reviewer user `Atip-Infa` (ID `186546670`, verify before apply), `prevent_self_review: true`, `can_admins_bypass: false`. Preserve B's exact-main-branch deployment policy and WIF claim restrictions. |
| Before main decision | No actual gate exists | Read back environment protection and reviewer eligibility. Include this configuration in the main/cloud authorization package. If unavailable, the bootstrap route stays blocked. |
| Initial deployment disposition | No run yet | Observe waiting deploy job, execute authorized manual bootstrap, then B rejects the still-waiting job. Preserve its real failed/cancelled result and manual source/image/revision chain. |

## 6. External verification and corrected smoke invocation

After deployment, set `EXPECTED_RELEASE_SHA` and `SERVICE_URL` privately from verified release output. This PowerShell invocation requires the exact identity before requests:

```powershell
if ($env:EXPECTED_RELEASE_SHA -cnotmatch '^[0-9a-f]{40}$') { throw 'Set EXPECTED_RELEASE_SHA to the exact deployed source commit.' }
if ([string]::IsNullOrWhiteSpace($env:SERVICE_URL)) { throw 'Set SERVICE_URL to the verified HTTPS service origin.' }
python deploy/smoke_test.py $env:SERVICE_URL
if ($LASTEXITCODE -ne 0) { throw 'Public smoke verification failed.' }
```

The script accepts **one positional argument**, URL; SHA comes from `EXPECTED_RELEASE_SHA`. A second positional SHA exits with usage error before HTTP requests. Confirm HTTPS/exact canonical origin before optional login; do not put credentials on the command line.

Public smoke verifies health/release identity, DB readiness, root HTML branding and exact API 404 envelope. It does **not** fetch every asset/font/deep link or prove both business roles, proxy trust, cookie attributes or persistence. Check those separately using safe fixtures. Missing both optional credentials means authenticated SKIP; configured login/logout writes session state and uses the approved synthetic account. Health alone does not establish C-04/C-05/C-06.

## 7. Cost inputs, availability and dated sources

Official sources checked on **11 November 2026** are estimate inputs, not an account-specific quote or proof of trial eligibility:

| Item | Estimate inputs / source |
|---|---|
| SQL | Select `asia-southeast1` Enterprise shared-core rate, running hours, SSD, backups and network from [Cloud SQL pricing](https://cloud.google.com/sql/pricing). The default region is not a Singapore quote. Replace the unsupported USD 10-15/month assertion with a dated regional calculation before approval. |
| Cloud Run | Estimate service CPU/memory/request time, startup, jobs, region/network separately; min 0/max 2 is not a cost cap. Free allowance depends on billing mode/account aggregation; see [Cloud Run pricing](https://cloud.google.com/run/pricing). |
| Registry / secrets | Measure image storage/retention/transfer; two images alone does not establish a USD 0.10 bill. See [Artifact Registry pricing](https://cloud.google.com/artifact-registry/pricing). Secret costs depend on active **versions**, accesses and replication, not names; see [Secret Manager pricing](https://cloud.google.com/secret-manager/pricing). |
| Trial / availability | General published offer: USD 300 over 90 days, subject to eligibility; actual balance/expiry UNKNOWN. See [Google Cloud Free Program](https://docs.cloud.google.com/free/docs/free-cloud-features). Follow the handout account method; payment/Upgrade errors require account-holder/TA action. |

Before paid-resource authorization, record region/SKUs, operating window, storage/backup/traffic assumptions, currency/tax, credit expiry and estimate timestamp. An optional USD 10 budget alert needs owner selection; no THB conversion is asserted. Alerts notify rather than terminate usage. Keep services available through grading/UAT; no assumed pause/deletion optimization.

## 8. Verification record and review handoff

Actual findings were invalid smoke arguments, missing first-deploy creation order, unsupported socket/cost/proxy claims, incomplete inventory and mismatched status/whitespace evidence. Corrections preserve scripts and state their limits. Live transitions belong in [Issue #16](https://github.com/zerotwobook/fastTrack/issues/16); this file is a dated snapshot.

### Correction-session checks

Delivery scripts are unchanged from `438b3e7`; merging staging `7936ebb` only added B's handoff. The final document commit/current CI are recorded on PR #89.

| Check | Result |
|---|---|
| Shell syntax | PASS: `bash -n` run separately for `deploy/deploy.sh` and `deploy/release.sh`. |
| Provisioning suite | PASS: `bash deploy/tests/test_deploy_stub.sh`; first-run, rerun, partial-secret, migration-failure, demo, dry-run and source-guard checks. Only stubs execute. |
| Release suite | PASS: `bash deploy/tests/test_release_stub.sh`; ten normal/rollback/ref/image/migration/digest/tag/traffic scenarios. Only stubs execute. |
| Smoke suite | PASS: `python -m unittest discover -s deploy/tests -p test_smoke.py`; 10 mocked-network tests. |
| Smoke command shape | PASS: one-argument document invocation matches CLI/env source; old two-argument invocation returns usage error before HTTP. Existing tests assert expected-SHA success and mismatch failure. |
| Document checks | PASS: 3 local Markdown links resolve, no Thai text/trailing whitespace, 4 Bash snippets and 1 PowerShell snippet parse; `git diff --check origin/staging/sprint-2` passes. |
| Exact proposal preview | PASS: section 3's `DRY_RUN=1` command completes on the task branch; no cloud execution. This is command generation, not validation of gcloud flags against an installed SDK. |
| GCP / real socket adapter+CLI / public flow / deployment / costs | NOT RUN; no authenticated cloud session, private fixture or approved execution target. |

Offline tests simulate gcloud, Docker and HTTP. Their PASS establishes their assertions, not cloud success. Application/DB/image CI belongs to its actual run/event/source; no fresh app result is inferred from prose. The original PR-body claim of zero trailing whitespace is superseded by the corrected verification record.

### Resume and acceptance

- **Correction stage:** Fixing until checks/PR handoff are complete; then read back both cards PR Review. Do not replay earlier stages or change completed cards.
- **Verification:** document/offline checks only, based on actual results; cloud NOT RUN.
- **Acceptance:** PENDING. B review, staging integration, overall #16 acceptance and main/cloud release are separate.
- **Next owners:** B reviews hold/bootstrap/reject and B08-02 impact; account holder completes read-only inventory/cost inputs; A validates both socket consumers on a disposable fixture. Resolve these before requesting cloud execution or a main-candidate decision.
- **Remaining gates:** final commands/verified targets, settings/WIF evidence, scoped cloud authorization, exact main-candidate user decision, real peer/protection checks, then deployment and later C-01-C-06 evidence. No merge, deployment, lab completion or submission is claimed.
