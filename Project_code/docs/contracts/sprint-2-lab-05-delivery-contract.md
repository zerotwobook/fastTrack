# Sprint 2 Lab 5 Delivery and Architecture Contract (R2-J00)

**Task ID:** `R2-J00` / [Issue #13](https://github.com/zerotwobook/fastTrack/issues/13)
**Authors:** A (`zerotwobook`) — Delivery Lead; B (`Atip-Infa`) — CI & Schema Lead
**Status:** PROPOSED BY A (Pending independent cross-review by B in Prompt 02)
**Creation Date:** 10 November 2026
**Target Milestone:** Lab 5 — Delivery (GCP Cloud Run & PostgreSQL)

---

## 1. Baseline Identification and Scope

### 1.1 S1 Release and Staging Lineage
* **Immutable S1 Release Tag:** `v1.0.0-sprint-1`
* **S1 Commit SHA:** `ae7a60a6e3ed0a363dcee920ac1774a02f4f4ab8`
* **Remote `main` Current Head:** `b7174a7` (contains PR #78 D1 upload and PR #82 D1 PDF update).
* **Executable Differences since S1:** **Zero (0) executable code differences**. Only non-executable Deliverable 1 PDF documents under `Deliverables/D1/` and `deliverable _file/submit/d1/` were merged into `main` after `v1.0.0-sprint-1`.
* **Sprint 2 Staging Lineage:** `staging/sprint-2` was bootstrapped from `origin/main` (`b7174a7`), with PR #81 merged at commit `83b974dd5e9d0cedecc3e3ae75bcf0c55bb24961` (incorporating the Lab 5 delivery plan and prompt runbooks).
* **Historical Verification Baseline:** S1 application foundation passed 340 automated tests, 7 schema migration scenarios, and 108 role/viewport matrix combinations. This historical evidence remains preserved; fresh tests for Lab 5 will record actual new executions.

### 1.2 Scope Boundary
This contract governs the **Lab 5 containerization, operational endpoints, PostgreSQL rate limiting, GCP deployment, and CI/CD release pipeline**.
> [!IMPORTANT]
> Unfinished Sprint 2 feature increments (F-05 Team/Milestone Planning, F-06 Revisions, F-07 Progress Calculations) are explicitly excluded from the initial Cloud Run release and remain on their respective task branches. Issue #13 tracks both Lab 5 delivery contracts and broader S2 feature interfaces; this phase freezes the Lab 5 delivery subset only.

---

## 2. Application Architecture and Runtime Environment

### 2.1 Monorepo Layout and Runtime Pins
fastTrack is organized as an npm workspace monorepo located under `Project_code/`:
* `Project_code/client/`: React 18, TypeScript 5+, Vite 8+, Tailwind CSS / PostCSS, bundled fonts (Inter, Noto Sans Thai).
* `Project_code/server/`: Node.js, Express 5.3.0, Prisma 7.10.1 (`@prisma/client`, `@prisma/adapter-pg`).
* `Project_code/package.json`: Configures npm workspaces `["client", "server"]`, package manager `npm@11.20.0`, Node engines `>=26.13.0 <27`.
* **Prisma Generated Runtime:** Generated via `npm run db:generate` to `server/src/db/generated/client` with `copy-prisma-runtime.mjs`.

### 2.2 Baseline Security and Session Integrity
* **Server-side Sessions:** Stored in PostgreSQL `sessions` table. Token hashing via SHA-256 (`tokenHash`).
* **CSRF Protection:** Cryptographic CSRF token generated per session (`csrfToken`), validated on all mutating requests (`POST`, `PUT`, `PATCH`, `DELETE`).
* **Cookie Attributes:** `HttpOnly`, `SameSite=Lax`, `Path=/`, and `Secure` strictly enforced when `NODE_ENV=production`.
* **Session Lifetime:** Enforces strict 8-hour absolute TTL (`expiresAt`).
* **HTTP Security Headers:** `X-Content-Type-Options: nosniff`, `Cache-Control: no-store` on `/api` routes, and `x-powered-by` disabled.

---

## 3. Container Specification and Build Packaging

### 3.1 Build Context and Multi-Stage Dockerfile
* **Build Context:** `Project_code/` (root of application workspace).
* **Target Architecture:** `linux/amd64` (for Google Cloud Run compatibility).
* **Base Image:** `node:22-bookworm-slim` (minimal attack surface, standard glibc for Prisma engine compatibility).
* **Multi-Stage Structure:**
  1. `stage deps`: Installs full workspace dependencies via `npm ci`.
  2. `stage builder`: Generates Prisma client (`npm run db:generate --workspace @fasttrack/server`), compiles client bundle (`npm run build --workspace @fasttrack/client`), and compiles TypeScript server (`npm run build --workspace @fasttrack/server`).
  3. `stage pruner`: Prunes devDependencies via `npm prune --omit=dev`.
  4. `stage runner`: Production image. Copies pruned `node_modules`, compiled `client/dist/`, compiled `server/dist/`, and Prisma schema/migration files.

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
* **Agreed Resolution:**
  1. Database migrations are **never run automatically on web container startup**. Running migrations on every container start creates race conditions when Cloud Run scales horizontally to multiple instances.
  2. Migrations are executed as an **explicit pre-deployment step** in the CD pipeline (or via a dedicated Cloud Run Job) before rolling out a new application revision:
     * Command: `npx prisma migrate deploy --config ../prisma.config.ts` executed in an environment retaining `devDependencies` (e.g. CI runner connected via Cloud SQL Auth Proxy).
  3. **Seed Tooling:**
     * Production seed is strictly explicit, executed on-demand only (never automated on startup).
     * Seed script is compiled or executed with an explicit non-destructive script that performs upsert only and preserves all existing user/milestone/submission records.

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
* **Mechanism:** Executes `SELECT 1` via Prisma raw query with an explicit 3-second timeout guard (`AbortSignal.timeout(3000)` or `Promise.race`).
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
| `PORT` | Server | No | Cloud Run Injected | Integer (default: `8080`) |
| `APP_ORIGIN` | Server | No | Cloud Run Env | `https://<service-name>-<hash>-as.a.run.app` (Strict HTTPS URL, no trailing slash) |
| `DATABASE_URL` | Server | **Yes** | Secret Manager | `postgresql://<user>:<password>@localhost:5432/<dbname>?host=/cloudsql/<instance_connection_name>` |
| `RELEASE_SHA` | Server | No | Cloud Run Env | Exactly 40 lowercase hexadecimal characters (`/^[a-f0-9]{40}$/`) |
| `SESSION_TTL_HOURS` | Server | No | Cloud Run Env | Fixed string `'8'` |

### 5.1 Canonical Environment Template
The canonical environment template is maintained at [`Project_code/.env.example`](file:///e:/sum%20Un/P_3-1/software%20eng/Final_PJ/Project_code/.env.example). No real secrets or passwords may ever be committed to git.

### 5.2 Service URL Discovery and `APP_ORIGIN` Bootstrap
1. Cloud Run generates a deterministic or unique URL upon first service creation.
2. In accordance with security policy, **CSRF protection is never disabled**.
3. During initial cloud provisioning, the service URL is queried via `gcloud run services describe fasttrack-app --format="value(status.url)"`, and `APP_ORIGIN` is configured to match this exact HTTPS origin before business traffic is routed.

---

## 6. Public Login Throttling and Rate Limiting Specification

### 6.1 Policy and Parameters
* **Target Endpoint:** `POST /api/auth/login`
* **Threshold:** 5 failed login attempts.
* **Window Duration:** 15 minutes (900 seconds).
* **Lockout Period:** 15 minutes from the 5th failed attempt.
* **Key Generation:** Client IP address.
* **Proxy Trust:** `app.set('trust proxy', 1)` enabled in Express to securely read client IP from `X-Forwarded-For` header set by Google Cloud Run frontend proxy.

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
* **Under Threshold (Failed Attempt):** Returns HTTP 401 Unauthorized with generic message: `{"error": "Invalid email or password."}` (prevents user enumeration).
* **Threshold Reached (Locked Out):** Returns `HTTP 429 Too Many Requests` with response:
  ```json
  {
    "error": "Too many failed login attempts. Please try again later."
  }
  ```
  and header `Retry-After: <seconds_remaining>`.
* **Successful Login:** Resets failed attempts for the client IP key upon valid authentication.
* **Automated Cleanup:** Expired rows (`lockedUntil < NOW() - INTERVAL '1 hour'` or `updatedAt < NOW() - INTERVAL '1 hour'`) are pruned periodically or on maintenance trigger.

---

## 7. External Database and Cloud Architecture Plan

### 7.1 Confirmed Google Cloud Platform Identities
* **Project Name:** `fasttrack-se-002`
* **Project ID:** `fasttrack-se-002`
* **Project Number:** `970128017651`
* **Region:** `asia-southeast1` (Singapore)

### 7.2 Cloud Resources Specification
* **Artifact Registry:**
  * Repository: `asia-southeast1-docker.pkg.dev/fasttrack-se-002/fasttrack-docker`
  * Format: Docker
* **Cloud Run Service:**
  * Service Name: `fasttrack-app`
  * Ingress: All (public HTTPS)
  * Authentication: Allow unauthenticated invocations (public web application)
  * CPU/Memory: 1 vCPU, 512 MiB (cost-effective tier within free tier/credits)
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

### 7.3 IAM and Service Account Separation (Least Privilege)
1. **Runtime Service Account:** `sa-fasttrack-runtime@fasttrack-se-002.iam.gserviceaccount.com`
   * Roles: `roles/cloudsql.client`, `roles/secretmanager.secretAccessor`.
   * Assigned to Cloud Run service runtime. Cannot deploy or mutate infrastructure.
2. **Deployer / GitHub Actions Service Account:** `sa-fasttrack-deployer@fasttrack-se-002.iam.gserviceaccount.com`
   * Roles: `roles/run.admin`, `roles/artifactregistry.writer`, `roles/iam.serviceAccountUser` (bound only to runtime SA), `roles/cloudsql.client`.
   * Authenticated strictly via **Workload Identity Federation (WIF)**. No JSON keys.
   * WIF Pool: `github-pool`, Provider: `github-provider`, mapped to `repository == "zerotwobook/fastTrack"`.

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
   * Action: Trigger Cloud Run instance replacement (e.g. updating a non-breaking environment comment or scaling to 0 and back).
   * Post-check: Confirm `/api/ready` is 200, users can log in, and submitted milestone/feedback are identical.
2. **Redeploy Experiment:**
   * Action: Deploy a new container revision with updated `RELEASE_SHA`.
   * Post-check: Verify `/api/health` reflects the new SHA while existing database rows, user accounts, and sessions remain completely intact.

---

## 9. Decision Table for Peer Review (B)

| Decision Item | Proposed Direction | Rationale | Alternatives Evaluated | B Review Verdict |
|---|---|---|---|---|
| **Rate Limit Store** | PostgreSQL table `auth_rate_limits` | Zero extra cloud cost; reuses existing ACID persistence and backups. | Redis / Memorystore (rejected: extra cost, violates budget minimization rule). | Pending B Review |
| **Migration Timing** | Pre-deployment pipeline step / Cloud Run Job | Prevents concurrency collisions across auto-scaled Cloud Run containers. | On-startup migration (rejected: unsafe for multi-instance deployments). | Pending B Review |
| **Prisma Pruning** | Separate runner with full devDependencies for migrations | Allows production web container to prune 100+ MB of build tooling while keeping migration CLI functional. | Retaining devDependencies in production image (rejected: bloats image size and CVE surface). | Pending B Review |
| **Readiness Query** | `SELECT 1` with 3s timeout guard | Sanitized failure prevents credential leakage while guaranteeing real DB liveness. | Static constant return (rejected: cannot detect database outages). | Pending B Review |
| **WIF vs JSON Key** | Workload Identity Federation (WIF) | Industry-standard keyless authentication; zero credential leakage risk. | Long-lived Service Account JSON keys (rejected: high security risk). | Pending B Review |

---

## 10. Next Steps and Handoff

1. Commit this contract on branch `docs/s2-a-cloud-contracts`.
2. Push branch and open Early Draft PR targeting `staging/sprint-2`.
3. Hand off to teammate B (`Atip-Infa`) for independent peer review under prompt **`prompt_project/prompt_lab5/B/02_R2-J00_CONTRACT_REVIEW.md`**.
4. Awaits B's cross-review and explicit human acceptance before starting application code implementation in R2-A01.
