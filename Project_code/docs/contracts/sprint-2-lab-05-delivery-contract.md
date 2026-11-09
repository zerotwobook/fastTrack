# Sprint 2 Lab 5 Delivery and Architecture Contract (R2-J00)

**Task ID:** `R2-J00` / [Issue #13](https://github.com/zerotwobook/fastTrack/issues/13)
**Author:** A (`zerotwobook`). Independent reviewer and schema/CI integrator: B (`Atip-Infa`); B authorship or acceptance is not claimed.
**Status:** CORRECTED PROPOSAL BY A (pending B's actual delivery-specific acceptance)
**Creation Date:** 10 November 2026
**Target Milestone:** Lab 5 — Delivery (GCP Cloud Run & PostgreSQL)

This is a design and implementation/test handoff. No new application test, image build, cloud inspection, deployment or persistence PASS is claimed. See [the Lab 5 plan](../../../workflow/04_LAB5_DELIVERY_PLAN.md), [Project stages](../../../workflow/GITHUB_PROJECT_AUTOMATION.md) and [main release gate](../../../workflow/MAIN_RELEASE_GATE.md).

---

## 1. Baseline Identification and Scope

### 1.1 S1 Release and Staging Lineage
* **Immutable S1 Release Tag:** `v1.0.0-sprint-1`
* **S1 Commit SHA:** `ae7a60a6e3ed0a363dcee920ac1774a02f4f4ab8`
* **Remote `main` Current Head:** `b7174a7` (contains PR #78 D1 upload and PR #82 D1 PDF update).
* **Executable Differences since S1:** **Zero (0) executable code differences** at the inspected main `b7174a7eb5acd0eca7fa0b0ef0bec078954e2d82`. The actual diff contains the PDF under `deliverable _file/submit/d1/`; no `Deliverables/D1/` path is claimed. These are dated observations, not permanent latest-head assertions.
* **Sprint 2 Staging Lineage:** `staging/sprint-2` was bootstrapped from `origin/main` (`b7174a7`), with PR #81 merged at commit `83b974dd5e9d0cedecc3e3ae75bcf0c55bb24961` (incorporating the Lab 5 delivery plan and prompt runbooks).
* **Historical Verification Baseline:** S1 application foundation passed 340 automated tests, 7 schema migration scenarios, and 108 role/viewport matrix combinations. This historical evidence remains preserved; fresh tests for Lab 5 will record actual new executions.

### 1.2 Scope Boundary
This contract governs the **Lab 5 containerization, operational endpoints, PostgreSQL rate limiting, GCP deployment, and CI/CD release pipeline**.
> [!IMPORTANT]
> Unfinished Sprint 2 feature increments (F-05 Team/Milestone Planning, F-06 Revisions, F-07 Progress Calculations) are explicitly excluded from the initial Cloud Run release and remain on their respective task branches. Issue #13 tracks both Lab 5 delivery contracts and broader S2 feature interfaces; this phase proposes the Lab 5 subset for an actual A/B checkpoint, without freezing it on B's behalf or accepting broader S2 work.

---

## 2. Application Architecture and Runtime Environment

### 2.1 Monorepo Layout and Runtime Pins
fastTrack is organized as an npm workspace monorepo located under `Project_code/`:
* `Project_code/client/`: React `19.3.1`, TypeScript `7.0.2`, Vite `8.3.6`, and bundled Inter/Noto Sans Thai fonts. Do not introduce an unverified styling stack.
* `Project_code/server/`: Node.js, Express 5.3.0, Prisma 7.10.1 (`@prisma/client`, `@prisma/adapter-pg`).
* `Project_code/package.json`: Configures npm workspaces `["client", "server"]`, package manager `npm@11.20.0`, Node engines `>=26.13.0 <27`.
* **Prisma Generated Runtime:** Generated via `npm run db:generate` to `server/src/db/generated/client` with `copy-prisma-runtime.mjs`.
* **Actual toolchain checks:** `.node-version` is `26.13.0`; npm engines are `>=11.20.0 <12`; `.npmrc` enables `engine-strict`. Local correction inspection observed Node `26.13.0` and npm `11.20.0`, which does not verify any Docker image.

### 2.2 Baseline Security and Session Integrity
* **Server-side Sessions:** Stored in PostgreSQL `sessions` table. Token hashing via SHA-256 (`tokenHash`).
* **CSRF Protection:** Existing authenticated mutations validate independent session CSRF and allowed source. Login retains Origin/Referer validation and `X-fastTrack-Request: 1`, without requiring a pre-existing session CSRF token; sessionless logout retains its accepted source-validation behavior. Preserve [the auth contract](sprint-1-auth.md).
* **Cookie Attributes:** `HttpOnly`, `SameSite=Lax`, `Path=/`, and `Secure` strictly enforced when `NODE_ENV=production`.
* **Session Lifetime:** Enforces strict 8-hour absolute TTL (`expiresAt`).
* **HTTP Security Headers:** `X-Content-Type-Options: nosniff`, `Cache-Control: no-store` on `/api` routes, and `x-powered-by` disabled.

---

## 3. Container Specification and Build Packaging

### 3.1 Build Context and Multi-Stage Dockerfile
* **Build Context:** `Project_code/` (root of application workspace).
* **Target Architecture:** `linux/amd64` (for Google Cloud Run compatibility).
* **Base Image:** A verified Debian/glibc Node 26 image satisfying `>=26.13.0 <27`, with npm `11.20.0`. Candidate tag `node:26.13.0-bookworm-slim` must be resolved/inspected during R2-A01; its registry availability/digest is **not verified here**. If unavailable, record the external dependency and agree a verified compatible Node 26 image with B. Never downgrade to Node 22 or disable engine checks. Record the tested base digest and actual Node/npm versions in the build environment.
* **Multi-Stage Structure:**
  1. `stage deps`: Installs full workspace dependencies via `npm ci`.
  2. `stage builder`: Generates Prisma client (`npm run db:generate --workspace @fasttrack/server`), compiles client bundle (`npm run build --workspace @fasttrack/client`), and compiles TypeScript server (`npm run build --workspace @fasttrack/server`).
  3. `stage jobs`: Builder-derived dedicated migration/seed target, retaining full workspace dependencies, Prisma CLI, `tsx`, configuration, schema/migrations, seed source and generated source client. Build from the same source SHA as the web image.
  4. `stage pruner`: Prunes web devDependencies via `npm prune --omit=dev`; inspect workspace links and required production assets.
  5. `stage runner`: Non-root web image with `/app` working directory, pruned `node_modules`, root/workspace package manifests, `client/dist/`, `server/dist/` including copied Prisma runtime, and **`shared/milestones.mjs`, `shared/submissions.mjs`, `shared/feedback.mjs`**. Preserve relative `/app/client`, `/app/server`, `/app/shared` layout: compiled server modules import those shared files outside `server/dist`. Include built fonts/licenses; exclude real env/Git/credentials/local dependencies/output using `.dockerignore`. Verify the final image, not only the builder.

### 3.2 Non-Root User and Listener
* **Runtime User:** Non-root standard user `node` (UID 1000, GID 1000). All files owned or readable by `node`.
* **Port and Host Binding:**
  * Cloud Run injects `PORT` environment variable (default: `8080`).
  * Server binds explicitly to host `0.0.0.0` (not `127.0.0.1` or `localhost`).
* **Entrypoint:** `ENTRYPOINT ["node", "server/dist/index.js"]`.

### 3.3 Graceful Shutdown
* Server handles `SIGTERM` and `SIGINT` signals.
* On signal: stops accepting new HTTP connections via `server.close()`, drains in-flight requests (with a 10-second timeout guard), and disconnects Prisma cleanly (`prisma.$disconnect()`).

### 3.4 Client Asset Serving and SPA Deep Linking
* Built client artifacts in `client/dist/` are served statically by Express at root `/` with `Cache-Control: public, max-age=31536000, immutable` for hashed assets.
* Unmatched non-API paths (`GET /*` where `req.accepts('html')`) serve `index.html` with `Cache-Control: no-cache` to ensure correct SPA deep-linking.

### 3.5 Production Migration and Seed Tooling Resolution
* **The Dependency Pruning Problem:** Pruning devDependencies removes `prisma` CLI and `tsx` from the production runtime image.
* **A's Proposed Resolution (B acceptance pending):**
  1. Database migrations are **never run automatically on web container startup**. Running migrations on every container start creates race conditions when Cloud Run scales horizontally to multiple instances.
  2. Migrations execute as an **explicit pre-deployment Cloud Run Job** orchestrated by the CD pipeline before rolling out a new application revision:
     * Chosen mechanism: the dedicated `jobs` image retains the full tooling/source. From `Project_code/` (or `/app` in that image), run `npm run db:migrate --workspace @fasttrack/server`. Its workspace script supplies the correct relative Prisma config path. Do not copy `--config ../prisma.config.ts` into an unspecified working directory.
     * Cloud Run Jobs use explicit command/args, the scoped runtime/job identity and private DB reference; successful migration is required before service update. CI does not gain DB/IAM provisioning rights for normal releases. Record web/job digests built from the actual same main source SHA; a release PR head may differ from the deployed main merge SHA.
  3. **Seed Tooling:**
     * Production seed is strictly explicit, executed on-demand only (never automated on startup).
     * From the full-tool jobs image/workspace root, execute `npm run db:seed --workspace @fasttrack/server` with privately supplied `DATABASE_URL` and `DEMO_SEED_PASSWORD`. Preserve the existing add-only seed: never reset passwords, names, membership or domain history. Seed is not an automatic normal-release step.
  4. Verify both jobs commands on fresh and S1-data disposable databases. Migration failure stops rollout; inspect partial state before retry/recovery. No reset/schema-push/development migrations against cloud DB. Image rollback skips migration/seed and never reverses schema/data.

---

## 4. Operational Endpoints and Smoke Validation Contract

### 4.1 Liveness Endpoint: `GET /api/health`
* **Purpose:** Proves HTTP process liveness without database overhead.
* **HTTP Status:** `200 OK`
* **Response Headers:** `Content-Type: application/json; charset=utf-8`, `Cache-Control: no-store`
* **JSON Schema:**
  ```json
  {
    "status": "ok",
    "version": "<RELEASE_SHA_40_HEX>"
  }
  ```

### 4.2 Readiness Endpoint: `GET /api/ready`
* **Purpose:** Verifies real database connectivity and readiness to process traffic.
* **Mechanism:** Minimal real `SELECT 1` with a 3-second response deadline **and bounded underlying DB work**. A standalone `Promise.race`/unused AbortSignal does not cancel or bound a query. Configure supported connection/driver/server statement deadlines and bounded pool, handle late rejection and release connections. Proposed connection/statement/query/response defaults: 1000/1000/1500/3000 ms, pool size 2; verify adapter support, deadline relationships and actual behavior in R2-A01.
* **Healthy Case (Database Connected):**
  * HTTP Status: `200 OK`
  * JSON Body:
    ```json
    {
      "status": "ready",
      "database": "connected",
      "version": "<RELEASE_SHA_40_HEX>"
    }
    ```
* **Failure Case (Database Down / Unreachable / Timed Out):**
  * HTTP Status: `503 Service Unavailable`
  * JSON Body (Sanitized):
    ```json
    {
      "status": "unavailable",
      "database": "disconnected",
      "version": "<RELEASE_SHA_40_HEX>"
    }
    ```
  * **Sanitization Guarantee:** Must never leak connection strings, database credentials, hostnames, or internal stack traces in the 503 response.

### 4.3 Smoke Test Assertions (Lead: B)
B's automated smoke test suite (`scripts/smoke-test.mjs` or CI smoke step) validates:
1. `GET /api/health` returns HTTP 200, `status: "ok"`, and `version` matching the expected 40-char release commit SHA.
2. `GET /api/ready` returns HTTP 200, `status: "ready"`, and `database: "connected"`.
3. `GET /` returns HTTP 200 and HTML containing fastTrack title.
4. `GET /api/nonexistent` returns HTTP 404 with standard sanitized JSON error envelope.

---

## 5. Environment and Secrets Inventory

| Variable Name | Scope | Secret? | Source in GCP | Format & Validation |
|---|---|---|---|---|
| `NODE_ENV` | Server | No | Cloud Run Env | Strictly `production` |
| `PORT` | Server | No | Cloud Run Injected | Integer 1-65535; Cloud Run normally injects 8080, current app fallback is 3000; do not silently change it. |
| `APP_ORIGIN` | Server | No | Cloud Run Env | Exact canonical HTTPS origin, no path/query/trailing slash; bootstrap and verify under section 5.2. |
| `DATABASE_URL` | Server | **Yes** | Secret Manager | `postgresql://<user>:<password>@localhost:5432/<dbname>?host=/cloudsql/<instance_connection_name>` |
| `RELEASE_SHA` | Server | No | Cloud Run Env | Exactly 40 lowercase hexadecimal characters (`/^[a-f0-9]{40}$/`) |
| `SESSION_TTL_HOURS` | Server | No | Cloud Run Env | Fixed string `'8'` |
| `TEST_DATABASE_URL` | Isolated tests only | **Yes** | Guarded disposable DB runner | Never cloud/shared production or client bundle. |
| `DEMO_SEED_PASSWORD` | Explicit seed only | **Yes** | Private secret input | Existing required nonempty input, no default; not web runtime/client/image/log/chat. |
| `TRUST_PROXY_HOPS` | Server (proposed) | No | Runtime config | Validated 0/1; local 0; cloud 1 only after real proxy-path verification. |
| `DB_POOL_MAX` | Server (proposed) | No | Runtime config | Bounded positive integer; proposed 2, reviewed against connection budget. |
| `DB_CONNECT_TIMEOUT_MS` | Server (proposed) | No | Runtime config | Bounded positive integer; proposed 1000. |
| `DB_STATEMENT_TIMEOUT_MS` | Server (proposed) | No | Runtime config | Bounded positive integer; proposed 1000. |
| `DB_QUERY_TIMEOUT_MS` | Server (proposed) | No | Runtime config | Bounded positive integer; proposed 1500. |
| `READINESS_TIMEOUT_MS` | Server (proposed) | No | Runtime config | Bounded positive integer; proposed 3000; validate ordering. |
| `LOGIN_RATE_LIMIT_MAX_FAILURES` | Server (proposed) | No | Runtime config | Bounded positive integer; proposed 5. |
| `LOGIN_RATE_LIMIT_WINDOW_SECONDS` | Server (proposed) | No | Runtime config | Bounded positive integer; proposed 900. |
| `LOGIN_RATE_LIMIT_LOCK_SECONDS` | Server (proposed) | No | Runtime config | Bounded positive integer; proposed 900. |
| `LOGIN_RATE_LIMIT_RETENTION_SECONDS` | Maintenance (proposed) | No | Job config | Bounded positive integer; proposed 3600, longer than window/lock. |
| `GCP_PROJECT_ID`, `GCP_REGION` | Workflow/provisioning variables | No | Verified team configuration | Project ID differs from project number. |
| `WIF_PROVIDER`, `WIF_SERVICE_ACCOUNT` | Workflow variables | No | Reviewed provider/deployer identity | Identifiers, not passwords/JSON keys. |
| `SMOKE_EMAIL`, `SMOKE_PASSWORD` | Optional smoke | Password only | Dedicated low-privilege private input | Configure as a pair; missing pair means SKIP login, invalid configured credentials fail. |
| `AUTH_REVIEW_PASSWORD` and existing isolated-runner controls | Local review/test | Credential only | Current guarded runner contract | Do not forward into public runtime; preserve existing safe controls. |

### 5.1 Canonical Environment Template
The existing canonical local template is [server/.env.example](../../server/.env.example). Proposed variables above are **not implemented env reads yet**: R2-A01 adds validated config, placeholder examples and tests after B acceptance. Audit actual app/scripts/jobs/test env reads before calling the implementation inventory complete. Document every variable's purpose/secret/source/scope in root `docs/labs/lab-05/deployment.md`; never pass server/job secrets to Vite.

### 5.2 Service URL Discovery and `APP_ORIGIN` Bootstrap
1. For an existing service, inspect its actual URL/config and agree one canonical origin. For a genuinely new service use the documented deterministic `https://SERVICE_NAME-PROJECT_NUMBER.REGION.run.app` format. Current recorded inputs derive `https://fasttrack-app-970128017651.asia-southeast1.run.app`; identity/existence/reachability still need actual cloud verification.
2. Set that exact origin in the initial accepted-main deployment. Keep business handoff gated until service metadata, actual browser host, health/readiness and reachability agree. A nondeterministic alias must not silently become a second allowed mutation origin.
3. If the deterministic URL is disabled/unavailable or inputs differ, prepare a reviewed update using the actual canonical URL. Never require `describe` on a nonexistent service, disable CSRF or accept wildcard origins. Source: [Cloud Run HTTPS URL formats](https://docs.cloud.google.com/run/docs/triggering/https-request).
4. Required runtime/workflow changes first reach main through exact user/peer gates; initial bootstrap never permits deploying unmerged staging source.

---

## 6. Public Login Throttling and Rate Limiting Specification

### 6.1 Policy and Parameters
* **Target Endpoint:** `POST /api/auth/login`
* **Threshold:** 5 failed login attempts.
* **Window Duration:** 15 minutes (900 seconds).
* **Lockout Period:** 15 minutes from the 5th failed attempt.
* **Key Generation:** Client IP address.
* **Proxy Trust:** `TRUST_PROXY_HOPS=0` locally; cloud 1 only after actual topology/right-to-left hop selection and forged/multiple forwarded-header tests. Hop count is not an unconditional security guarantee. Normalize IPv4-mapped IPv6; derive a versioned SHA-256 IP key within 128 characters, without email/password. Hashing is not a claim of anonymity. Do not log raw credentials; block public-readiness handoff if identity can be spoofed. Source: [Express proxy guidance](https://expressjs.com/en/guide/behind-proxies/).

### 6.2 PostgreSQL Storage Schema
To prevent recurring third-party costs (such as Redis or Google Cloud Memorystore), rate limiting utilizes PostgreSQL via an ordered migration managed by B:

```prisma
// Proposed Prisma Model: AuthRateLimit
model AuthRateLimit {
  key         String    @id @db.VarChar(128)
  attempts    Int       @default(0)
  firstAt     DateTime  @default(now()) @map("first_at") @db.Timestamptz
  lockedUntil DateTime? @map("locked_until") @db.Timestamptz
  updatedAt   DateTime  @updatedAt @map("updated_at") @db.Timestamptz

  @@index([lockedUntil])
  @@map("auth_rate_limits")
}
```

### 6.3 Behavior and Responses
* **Under Threshold:** First four failed attempts return existing generic HTTP 401: `{"error":{"code":"INVALID_CREDENTIALS","message":"Email or password is incorrect. Check and try again.","fields":{}}}`. Unknown email and wrong password remain equivalent.
* **Threshold Reached (Locked Out):** Returns `HTTP 429 Too Many Requests` with response:
  ```json
  {
    "error": {"code":"LOGIN_RATE_LIMITED","message":"Too many sign-in attempts. Please try again later.","fields":{}}
  }
  ```
  The **fifth failed attempt** starts the lock and returns 429/no-store with integer-ceiling remaining-seconds `Retry-After` (minimum 1). R2-A01 adds 429 to the error-status type and tests the client's existing nested code/message/fields parsing.
* **Successful Login:** Resets only an unlocked key. Active lock rejects valid and invalid credentials alike without creating/revoking sessions. At exact window/lock expiry reset expired state before counting the next attempt.
* **Cleanup:** Explicit reviewed maintenance command/job deletes only rows older than retention **and** outside active lock/window, in indexed batches at most 100 with bounded transactions and no contended-key sweep. Agree command/authorized target/schedule/index tests with B. No instance-dependent timer, full-table cleanup on every login or touching users/sessions/domain data.

### 6.4 Atomic concurrency and committed failure outcomes

1. Apply existing source/header/JSON/shape checks first; malformed/foreign-source calls do not mutate limiter state or create sessions.
2. In a bounded transaction, conflict-safely insert the key if missing, then lock the row; handle concurrent first inserts. Do not use unprotected read/write increments or per-instance memory for security state.
3. Read current DB time after lock; apply exact expiry and reject an active lock before credential/session effects.
4. Serialize credential verification and state/session effects for that key in the bounded transaction. Failed attempts increment once; fifth sets lock from current DB time. Valid unlocked login resets state and retains existing session rotation atomically.
5. Return an outcome and **commit before converting failed/locked outcomes to HTTP AppError**. Throwing a business failure inside the transaction must not roll back the failed-attempt increment. DB rollback/unknown outcome cannot produce a successful session or invented counter result.
6. Bound lock/transaction waits; persistent contention/unavailability returns sanitized 503. No unbounded retry; any bounded retry re-reads clock/state and cannot duplicate committed session/password effects. Exact supported Prisma/SQL implementation is reviewed/tested in R2-A01, not claimed verified here.

---

## 7. External Database and Cloud Architecture Plan

### 7.1 Recorded Cloud Inputs (Not Cloud-Verified in This Correction)
* **Project Name:** `fasttrack-se-002`
* **Project ID:** `fasttrack-se-002`
* **Project Number:** `970128017651`
* **Region:** `asia-southeast1` (Singapore)

These values were recorded in the prior proposal. This correction has not inspected actual project/resource existence, billing, IAM, account access or connectivity. Recheck read-only with the account holder before provisioning; do not treat proposed resource names as confirmed infrastructure.

### 7.2 Cloud Resources Specification
* **Artifact Registry:**
  * Repository: `asia-southeast1-docker.pkg.dev/fasttrack-se-002/fasttrack-docker`
  * Format: Docker
* **Cloud Run Service:**
  * Service Name: `fasttrack-app`
  * Ingress: All (public HTTPS)
  * Authentication: Allow unauthenticated invocations (public web application)
  * Proposed CPU/Memory: 1 vCPU, 512 MiB; review current pricing/credits/quotas, connection pools and concurrency. No guarantee of free operation.
  * Min instances: 0, Max instances: 2
* **Cloud SQL for PostgreSQL:**
  * Instance Name: `fasttrack-db`
  * Database Version: `POSTGRES_16`
  * Tier: `db-f1-micro` (or `db-custom-1-3840`)
  * Storage: 10 GiB SSD
  * Connectivity: Cloud SQL Auth Proxy / Unix socket connector enabled for Cloud Run.
  * Database Name: `fasttrack_prod`
  * Database User: `fasttrack_user`
* **Secret Manager:**
  * Secret Name: `DATABASE_URL` (holds connection string formatted for Cloud SQL socket).

Validate URL encoding/socket mount/credentials and real connectivity for both PrismaPg runtime and Prisma CLI jobs without exposing a real URL. Review SQL edition/tier/storage/backup costs before action. Budget alerts do not cap spending. No prepayment/Upgrade or unspecified billing/IAM/DB mutation is authorized.

### 7.3 IAM and Service Account Separation (Least Privilege)
1. **Runtime Service Account:** `sa-fasttrack-runtime@fasttrack-se-002.iam.gserviceaccount.com`
   * Cloud SQL Client as required; Secret Accessor only on the specific required secrets. Use the reviewed runtime/job identity for DB jobs; no rollout/infrastructure administration.
   * Assigned to Cloud Run service runtime. Cannot deploy or mutate infrastructure.
2. **Deployer / GitHub Actions Service Account:** `sa-fasttrack-deployer@fasttrack-se-002.iam.gserviceaccount.com`
   * Cloud Run Developer with minimum supported service/job scope for actual update commands, Artifact Registry Writer on the intended repository, Service Account User only on the chosen runtime/job identity. Review additionally required job-execution permissions/scope. Provisioning/public-invoker bindings are separate authorized owner actions; normal CI does not get Owner/Editor/Cloud Run Admin or create DB/IAM each run.
   * Authenticated strictly via **Workload Identity Federation (WIF)**. No JSON keys.
   * Proposed pool/provider: `github-pool` / `github-provider`; existence is unverified. WIF principal receives Workload Identity User on the intended deployer only, scoped by immutable repository ID.

Read-only GitHub API inspection identified repository ID `1446690639` and owner ID `135503171`. Recheck these and actual sanitized OIDC claim metadata before IAM setup; never retain/paste a raw token. Proposed condition for the agreed default subject, `.github/workflows/deploy.yml` and environment `demo`:

```text
assertion.repository_id == '1446690639' &&
assertion.repository_owner_id == '135503171' &&
assertion.repository == 'zerotwobook/fastTrack' &&
assertion.ref == 'refs/heads/main' &&
assertion.workflow_ref == 'zerotwobook/fastTrack/.github/workflows/deploy.yml@refs/heads/main' &&
assertion.sub == 'repo:zerotwobook/fastTrack:environment:demo' &&
(assertion.event_name == 'push' || assertion.event_name == 'workflow_dispatch')
```

Map `google.subject=assertion.sub` and reviewed numeric repo/owner attributes; principal binding uses intended repo ID and GitHub environment policy permits main only. Reusable workflows/custom subjects/changed filenames need claim inspection and a complete reviewed replacement condition, never repo-name-only trust. Test allowed main and rejected wrong repo/owner/ref/workflow/environment/event before accepting live setup. Sources: [Google WIF pipeline guidance](https://docs.cloud.google.com/iam/docs/workload-identity-federation-with-deployment-pipelines), [GitHub OIDC reference](https://docs.github.com/en/actions/reference/security/oidc).

---

## 8. File Ownership, Integration Order, and Evidence Matrix

### 8.1 Responsibility Matrix

| Path / Scope | Primary Author | Reviewer / Integrator | Notes |
|---|---|---|---|
| `Project_code/Dockerfile`, `.dockerignore` | A | B | Production multi-stage build |
| `Project_code/server/src/app.ts`, `config.ts`, `index.ts` | A | B | Readiness endpoint, graceful shutdown, listener |
| `Project_code/server/src/middleware/rate-limiter.ts` | A | B | PostgreSQL rate limiting implementation |
| `Project_code/server/prisma/` & migrations | B | A | B leads schema integration and ordered migrations |
| `.github/workflows/ci.yml` | B | A | PR validation: test, typecheck, build, docker |
| `.github/workflows/deploy.yml` | B | A | Main release pipeline with WIF & migration job |
| `docs/labs/lab-05/deployment.md` | Joint | Joint | Deployment guide: A (app/env/DB), B (CI/CD/smoke) |
| `docs/labs/lab-05/` evidence index | Joint | Joint | Traceable Markdown evidence for C-01 - C-06 |

### 8.2 Rubric Evidence (C-01 through C-06)

* **C-01 (PR CI Execution):** Lead: B. Captured from real GitHub Actions run on pull request.
* **C-02 (Branch Protection / Failing Check Proof):** Lead: B, witnessed by A. Dedicated temporary proof PR to `main` with a real failing test demonstrating merge is blocked; closed unmerged without weakening protection.
* **C-03 (Docker & Local Reproducibility):** Lead: A, verified by B. Clean checkout build and execution evidence.
* **C-04 (Public Cloud Run Domain Workflow):** Joint (A records, B verifies). End-to-end Student submission and Supervisor feedback on live HTTPS Cloud Run URL.
* **C-05 (Data Persistence across Restart and Redeploy):** Lead: A, verified by B. Distinct before/after database queries proving data survives container restart AND new revision rollout.
* **C-06 (Release Traceability & Identity):** Lead: B + A. Traceability table proving Git SHA -> Artifact Registry image digest -> Cloud Run serving revision -> `/api/health` `version`.

### 8.3 Data Persistence Verification Procedures (C-05)
1. **Restart Experiment:**
   * Pre-condition: A student submits milestone URL; a supervisor reviews and submits feedback.
   * Record original milestone/submission/feedback IDs/content/relations, valid-session TTL, image digest, source SHA, serving revision and traffic before disruption.
   * In an explicitly authorized bounded window before grading/UAT, use **service-level manual scaling** to zero, verify old instances stopped, restore previous automatic mode, and request the URL to start a new instance. Record actual instance/startup logs and the unchanged serving revision/digest. Restore original settings even on failure. Do not substitute an environment change.
   * Proposed operations are `gcloud run services update SERVICE --scaling=0` then `--scaling=auto`, with explicit verified project/region. They are **not authorized or executed by this document**. Google documents that this mode/count change does not create a revision: [manual scaling](https://docs.cloud.google.com/run/docs/configuring/services/manual-scaling). Verify actual feature/permissions/zero-instance provenance; if unavailable, leave proof pending and obtain TA agreement on an alternative.
   * Post-check: Real readiness and public UI/API readback of the **same original IDs** and relationships; valid-session readback only within its real TTL. Keep operation times/tester/provenance.
2. **Redeploy Experiment:**
   * Only after original records/restart proof: release a small visible accepted-S1 change through reviewed staging PR, exact-head/base user authorization for main, protected peer integration and the main pipeline. Build actual main source SHA, record web/jobs digests and migration execution, then verify serving revision/traffic/health version.
   * Read the same original IDs/content/associations after redeploy. No replacement seed, schema reversal, volume deletion or public terminate endpoint. Natural session expiry followed by new login is not old-session persistence; state those claims separately. Keep public availability outside the approved disruption window.

---

## 9. Decision Table for Peer Review (B)

| Decision Item | Proposed Direction | Rationale | Alternatives Evaluated | B Review Verdict |
|---|---|---|---|---|
| **Rate Limit Store** | PostgreSQL table with atomic row-lock outcomes and bounded cleanup | Reuses current DB; added query/storage cost still requires review. | Separate cache service requires an explicit cost/architecture decision; not inherently forbidden. | Pending B Review |
| **Migration Timing** | Pre-deployment pipeline step / Cloud Run Job | Prevents concurrency collisions across auto-scaled Cloud Run containers. | On-startup migration (rejected: unsafe for multi-instance deployments). | Pending B Review |
| **Prisma Pruning** | Dedicated same-source full-tool jobs image, pruned web image with shared/generated artifacts | Separates explicit DB jobs from startup without assuming pruned tools exist. | Image size/security effects must be measured; no unverified MB claim. | Pending B Review |
| **Readiness Query** | `SELECT 1` with 3s timeout guard | Sanitized failure prevents credential leakage while guaranteeing real DB liveness. | Static constant return (rejected: cannot detect database outages). | Pending B Review |
| **WIF vs JSON Key** | Numeric identity plus main/workflow/environment/event-restricted WIF | Avoids a stored long-lived key; tokens/trust still need secure handling. | No JSON-key workaround or claim of zero risk. | Pending B Review |

---

## 10. Next Steps and Handoff

1. Continue branch `docs/s2-a-cloud-contracts` and the existing early Draft PR #83 targeting `staging/sprint-2`; do not open a duplicate PR for corrections.
2. Push scoped corrected contract/handoff, run actual author consistency checks and record current head/base and real results. Preserve historical log rows with an explicit evidence-based correction, not invented replacement timestamps.
3. At verified staging handoff, mark ready, move/read back actual Issue/PR cards to PR Review and request B (`Atip-Infa`) using **`prompt_project/prompt_lab5/B/02_R2-J00_CONTRACT_REVIEW.md`**. No self-approval or merge.
4. Wait for B's actual current-head cross-review and explicit delivery-specific checkpoint before R2-A01 application implementation. Broader #13 scope and all cloud execution remain separately pending.

Author checks and contract merge do not manufacture B acceptance. The delivery-specific checkpoint must name the exact accepted head and remaining broader #13 scope. Follow [B/02](../../../prompt_project/prompt_lab5/B/02_R2-J00_CONTRACT_REVIEW.md), then [A/03](../../../prompt_project/prompt_lab5/A/03_R2-A01_CONTAINER_AND_RUNTIME.md) only after that actual checkpoint and integrated/synchronized staging. R2-A01 remains unimplemented until its own branch/code/tests/review; independent specification/test planning is allowed while waiting.

## 11. Planned Acceptance Cases and Implementation Entry Checklist

All cases below are **PLANNED / NOT RUN** for new Lab 5 work; each actual result later needs test/file, command/run, environment, outcome/counts and tested source SHA. Existing commands from `Project_code/`: `npm ci`, `npm run typecheck`, `npm test`, `npm run build`, `npm run test:j03:isolated`. Inspect current scripts; preserve DB guards and never point cleanup fixtures at cloud/shared data. Historical results keep their actual source/time.

| Case | Required assertion | Owner / witness |
|---|---|---|
| A01-01 | Clean clone and actual build/jobs images satisfy pinned Node/npm without engine bypass | A; B reproduction. |
| A01-02 | Final runner shared/generated assets, non-root, injected port, HTML/assets/deep links/API 404 and bounded SIGTERM | A. |
| A01-03 | Jobs image really migrates/seeds; fresh/S1 upgrade/repeated seed preserve passwords/membership/domain records | A with B migration integration. |
| A01-04 | Readiness real success/failure/timeout, sanitized 503 and bounded underlying DB work/pool | A, isolated DB faults. |
| A01-05 | Exact production origin/port/SHA/deadline/limiter config validation and complete scoped examples | A. |
| A01-06 | Four failed logins 401; fifth 429/Retry-After; locked valid/invalid requests have no session effects | A, real DB/API. |
| A01-07 | Exact window/lock expiry, unlocked success reset, unknown/wrong equivalence; failure counts commit | A, controlled clock/state. |
| A01-08 | Concurrent first insert/increments/multi-instance locking; timeout/rollback fail closed without corrupt counts/sessions | A, real PostgreSQL concurrency. |
| A01-09 | Trusted/direct/forged/multiple headers and IPv4-mapped IPv6 select accepted identity without spoof bypass | A/B actual proxy check. |
| A01-10 | Cleanup bounded/indexed, active rows and every domain/session record preserved | A/B disposable fixtures. |
| A01-11 | Existing source/CSRF/cookie/expiry/revocation/scope/replay plus relevant full S1 DB regression | A; report actual counts. |
| A01-12 | Local original-record/session readback after actual app restart with DB retained | A/B; not cloud C-05. |

B's release code tests must prove migration-failure-no-rollout and rollback-no-migration. C-04 includes public sign-in/business action **and a safe rule/access rejection without unauthorized write**. C-05 requires original IDs across two distinct experiments. C-06 includes actual specific peer review, user-authorized main PR, run, main SHA/digests/revision/traffic. No smoke-only or mock-only substitutes.

Before application edits: record accepted dependency/head, actual owner/branch/base, shared integrator and meaningful checks; save/read back Specified then Started when those real milestones occur. Open early Draft after the first coherent push. C-02 needs exact never-merge proof authorization and a normal non-Draft failed-check observation before closing unmerged. Every main PR remains Draft until exact current-candidate user authorization; billing/IAM/DB actions have separate concrete gates. No self-approval/merge, invented timeline, secret sharing, PDF export or coursework submission is granted by this contract.
