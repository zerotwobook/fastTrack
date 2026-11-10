# fastTrack application - technical guide

## Current implementation

The React client and API implement login/me/logout, DB-backed eight-hour sessions, source/CSRF protection, authorized team list/detail, milestone create/list/detail, first-submission create/list/detail and append-only exact-version feedback create/list. Students see actionable work before separate overdue/submitted groups, with a direct action for eligible submissions. Assigned supervisors save exact-version feedback with an immutable UUID/body intent and checked recovery after unknown outcomes. Older feedback reads merge with confirmed writes. Visibility verification masks private content and preserves drafts only for the same verified user/role/session; logout, expiry or session changes discard them. The interface includes role-aware navigation, mobile menu, locally bundled typography, shared monochrome controls and loading/empty/error/retry states. PostgreSQL/Prisma schema/migrations/seed/fixtures, safe errors/request correlation, validated configuration and TypeScript builds are present.

Historical Sprint 1 verification at `17f4398`: **144 ordinary tests, 42 feedback cases, 48 first-submission cases, 39 milestone DB cases, 28 auth cases, 38 G1 cases and one compiled cross-feature system case: 340 automated cases plus seven separate migration scenarios**, all passed with owned cleanup. Generation/typecheck/build pass. [Current runner](docs/evidence/R1-J04-REFRESH-system.json) and [compiled-browser results](docs/evidence/R1-J04-REFRESH-browser.json) record the new run, including 108 role/viewport combinations. This run used the existing workspace with fresh disposable databases. The earlier accepted correction reproduced a clean clone with 316 packages; [its evidence](docs/evidence/R1-A-REVIEW-FIX.md), [earlier feedback verification](docs/evidence/R1-B02-A-review.md) and [historical integrated verification](docs/evidence/R1-J03-system-verification.md) retain their actual sources, 310-case history and manual-zoom provenance. B accepted the corrections in #71 and UI in #73; the subsequent S1 release was merged through #67. New Lab 5 author checks and peer acceptance are recorded separately.

`GET /api/health` returns `200 {"status":"ok","version":"<RELEASE_SHA>"}` for process liveness. The Lab 5 runtime adds real bounded `/api/ready` DB checks (200/503), a bounded PostgreSQL pool and shared PostgreSQL login throttling with compatible 401/429 errors. No test identity bypass is exposed. See [the runtime/container guide](../docs/labs/lab-05/deployment.md) for exact configuration, explicit jobs, local Compose and the separate unverified cloud handoff.

The responsive UI refinement adds consistent control borders, readable status badges, team/feedback frames, aligned form actions and keyboard navigation that closes on desktop resize. Its compiled-browser checks passed 108 Student/Supervisor page-and-viewport combinations, plus login, empty/loading/error and recovery checks. [Actual verification and screenshots](docs/evidence/R1-A-UI-POLISH.md) distinguish the early 340-case pipeline from final affected-client checks; native 200% zoom and physical mobile devices were not verified for this refinement.

## Verified toolchain

| Tool | Version verified by the independent reproduction |
|---|---|
| Node.js / npm | 26.13.0 / 11.20.0 on Windows x64 |
| React / React DOM | 19.3.1 / 19.3.1 |
| Vite / React plugin | 8.3.6 / 6.2.1 |
| TypeScript / Express | 7.0.2 / 5.3.0 |
| Vitest / Supertest | 5.1.0 / 7.3.1 |
| Prisma CLI / client / PostgreSQL adapter | All 7.10.1; client generation and real DB access verified |
| Isolated audit PostgreSQL | 16.8 Debian build, pinned image digest in the result JSON |

Other OS/runtime combinations are not verified here. B's original evidence records a separate PostgreSQL 14 setup on port 5433; that machine-specific port is not universal. Configure the actual port in your own URLs. The isolated audit chooses an ephemeral loopback port automatically.

The package manifest enforces Node 26/npm 11; `.node-version` records the verified exact Node version. Direct dependencies are pinned and there is one npm workspace lockfile in Project_code. Do not create child lockfiles. Necessary Prisma/esbuild install scripts have version-pinned approvals under the [npm install-script policy](https://docs.npmjs.com/cli/v11/commands/npm-install-scripts/).

## Install and configuration

From the repository root in PowerShell:

```powershell
Set-Location Project_code
node --version
npm --version
npm ci
npm run db:generate --workspace @fasttrack/server
```

Copy server/.env.example to server/.env only if the local file does not already exist:

```powershell
Copy-Item server/.env.example server/.env
```

The supplied database URLs are placeholders. Replace them only with your actual local configuration. Runtime and seed scripts load server/.env; Prisma CLI configuration reads process DATABASE_URL, so supply that environment value explicitly when migrating. Do not put database credentials or session/CSRF tokens in client code, logs, Git or VITE_* variables. The browser uses relative /api paths and needs no client .env.

| Server variable | Contract |
|---|---|
| NODE_ENV | development (default), test or production |
| PORT | Integer 1-65535; default 3000 |
| APP_ORIGIN | Exact origin without trailing slash/path/query/credentials; local http://127.0.0.1:5173; production explicitly uses HTTPS |
| DATABASE_URL | Required server-side PostgreSQL URL for runtime/CLI |
| TEST_DATABASE_URL | Distinct reserved test-database URL; never reuse the development/production DB |
| SESSION_TTL_HOURS | Only 8 accepted; absolute lifetime, with no sliding refresh |
| RELEASE_SHA | Safe local label for development/test; production requires a full 40-character lowercase commit SHA |
| DEMO_SEED_PASSWORD | Explicit seed input; no default password. Repeat seed preserves existing names, password hashes, membership and history. |

After provisioning your own database and supplying DATABASE_URL/DEMO_SEED_PASSWORD to the command environment, the verified workspace commands are:

```powershell
npm run db:migrate --workspace @fasttrack/server
npm run db:seed --workspace @fasttrack/server
```

The migrate command deploys pending ordered migrations. There is no general reset command. Before upgrading a database created from the unmerged PR #53 proposal, read [the migration adoption note](docs/decisions/0002-g1-migration-adoption.md); its third migration was amended before acceptance. Use the isolated audit command for review without changing an existing database.

## Run, build and ordinary tests

All following commands run from Project_code:

```powershell
npm run dev
```

Open http://127.0.0.1:5173. Vite uses strict port 5173 and proxies /api to http://127.0.0.1:3000. Keep the hostname consistent with APP_ORIGIN and update the proxy target if changing the backend port. Production uses one origin; there is no wildcard credentialed CORS setup. Ctrl+C stops the two dev processes. Stop them before npm ci on Windows to release dependency binaries.

```powershell
npm run typecheck
npm test
npm run build
```

- Generate the Prisma client before standalone typecheck on a fresh clone.
- Ordinary Vitest/Supertest/client-state checks: 8 files / 144 tests pass; no database reset occurs.
- Build writes client/dist and server/dist. The server build generates Prisma, compiles TypeScript and copies its generated runtime assets. No running DB is needed for generation/build.
- Test files, G1 cases and auth DB cases are excluded from the server build; generated source/build files remain ignored in Git.
- npm run test:watch is available for ordinary local unit tests.

## Independent G1 checks

With Docker Engine running, from Project_code:

```powershell
npm run test:g1:isolated
```

This command creates its own temporary PostgreSQL instance with a random loopback-only port and distinct development/test databases, generates Prisma, migrates both DBs, repeats migrate deploy, runs typecheck, the 144 ordinary tests, a production-mode build and 38 dedicated G1 assertions. It also creates seven historical-schema databases inside that same new container to check upgrades and safe rejection. It removes only the newly created container and temporary credential file afterwards. Random DB/seed credentials are not committed or printed.

The current expected exit is **0**. The runner prints a redacted JSON report path. Set G1_REPORT_PATH to choose that output file. Four negative upgrade scenarios intentionally receive a failed migration exit and pass only when the expected PostgreSQL error, existing records, schema and completed migration checksums are preserved. [Foundation results](docs/evidence/R1-G1-A-remediation-results.json) and [findings/reproduction](docs/evidence/R1-G1-A-foundation.md) preserve their actual pre-acceptance snapshots; the later real G1 approval/merge is recorded separately.

For an already prepared, dedicated empty test database, npm run test:g1 runs only the 38 G1 cases. It requires NODE_ENV=test, TEST_DATABASE_URL and a distinct protected DATABASE_URL. These checks create/update synthetic data; use the isolated wrapper for routine reproduction. Fixture setup/cleanup accepts only clients returned by createTestPrisma(), bound to the currently validated test URL. Passing an arbitrary Prisma client or changing the configured target after client creation is rejected before cleanup queries. Cleanup uses a transaction.

## Authentication checks and disposable browser review

From Project_code with Docker Engine available:

```powershell
npm ci
npm run test:auth:isolated
```

This includes the ordinary/build/G1/migration checks above plus 28 real-DB auth/team cases. The expected exit is 0. `npm run test:auth` runs only those DB cases and requires a prepared reserved test database and the same guards; use the isolated wrapper by default.

For local browser review without changing your existing database:

```powershell
$env:AUTH_REVIEW_PASSWORD = Read-Host 'Choose a synthetic review password'
npm run review:auth
```

After checks/build, the runner explicitly seeds its new disposable database and prints an `AUTH_REVIEW_URL` on a random loopback port. Open that URL and use your chosen password with `supervisor.a@fasttrack.local`, `supervisor.b@fasttrack.local`, `student.a1@fasttrack.local`, `student.b1@fasttrack.local` or the review-only `unassigned@fasttrack.local`. These are synthetic local accounts. The review server serves the compiled client and real API under one HTTP origin; it does not establish public hosting or TLS.

Stop from a second terminal in this same clone's Project_code:

```powershell
npm run review:auth:stop
```

Wait for the original terminal's cleanup report. This graceful stop was verified on Windows and removes the newly created container, temporary credential file and review state file. Interrupting the entire process tree can interrupt report writing; use the stop command for review. The state file contains only the local URL/container/stop-marker identifiers, not credentials.

Authentication uses the existing scrypt seed format, a random opaque cookie token stored only as a hash, and independent in-memory CSRF tokens. Cookies are host-only, HttpOnly, SameSite=Lax and Secure for an HTTPS APP_ORIGIN. Source checks reject foreign/missing Origin/Referer; login also requires `X-fastTrack-Request: 1`. Logout validates CSRF for a valid session, revokes only that session and prevents replay. Team queries derive identity/scope from the database. Browser private state is memory-only and invalidated on logout, expiry, account changes and history restoration. See [the module contract](docs/contracts/sprint-1-auth.md).

## Milestone checks and browser review

```powershell
npm run test:b01:isolated
```

This runs all ordinary/build/auth/G1/upgrade checks plus 39 milestone DB cases: seven retained service cases with explicit test actors and 32 real-session regressions, including six invalid-Unicode/no-write checks. Expected exit 0. For only those DB cases, `npm run test:b01` requires a prepared reserved test database and the usual guards. Ordinary `npm test` remains DB-independent.

For the compiled milestone app, set a synthetic AUTH_REVIEW_PASSWORD as above and run `npm run review:b01`. Stop with `npm run review:auth:stop` in the same clone. Supervisor A can create a milestone in Team A, open its saved detail and reload it; Student A1 can read but cannot create; Supervisor B cannot read/write Team A. Dates entered in the labeled Asia/Bangkok field use seconds 00 and convert correctly even if the browser host zone differs. Title/description use shared Unicode code-point validation; errors preserve the draft. Unconfirmed mutation results direct the user to check the list before creating again.

[Independent B01 review/results](docs/evidence/R1-B01-A-review.md) and [the integration contract](docs/contracts/sprint-1-milestones.md) identify actual coverage and subsequent milestone acceptance. No inert submission/revision/feedback actions are exposed in this increment.

## Feedback checks and browser review

```powershell
npm run test:b02:isolated
```

This adds **42 F-04 PostgreSQL cases** to the full inherited foundation/auth/milestone/submission pipeline. It creates its own protected disposable database, runs real-session/source/CSRF, scope, Unicode, exact-version, replay/conflict, concurrent HTTP and forced unique-conflict/lock-wait checks, then removes its own container. Expected exit 0. `npm run test:b02` runs only the feedback DB files against an explicitly prepared reserved test database. Ordinary npm test does not load those fixtures.

For a compiled app, set a synthetic AUTH_REVIEW_PASSWORD as described above and run `npm run review:b02`; stop with `npm run review:auth:stop` from the same clone. Supervisor A can open a submitted version, write feedback and reload it; Student A1 reads without a write form; Supervisor B cannot read it. The save UI checks persisted feedback after an unknown result and blocks further saves while that recovery read fails. A successful read with no matching row permits a manual retry of the same frozen UUID/body. [Contract](docs/contracts/sprint-1-feedback.md), [review](docs/evidence/R1-B02-A-review.md) and [actual results](docs/evidence/R1-B02-A-results.json) distinguish real DB behavior from controlled browser faults.

## Integrated Sprint 1 verification

```powershell
npm run test:j03:isolated
```

This runs the complete inherited chain plus one compiled cross-feature system case: **340 automated cases and seven separate migration scenarios** in the correction verification. The system case verifies real login/milestone/submission/feedback requests, latest-version feedback counts, same-key replay/conflict, seed preservation of all seven tables, actual process restart/session readback, role/scope/duplicate rejection and logout replay. It uses protected disposable PostgreSQL and cleans its own container. `npm run test:j03` selects only the system case on a prepared reserved test database, after build/generation because it launches compiled artifacts.

For interactive checks, set a synthetic AUTH_REVIEW_PASSWORD and run `npm run review:j03`; stop with `npm run review:auth:stop` in the same clone. The full JSON reporter output is finalized during teardown. [Correction results](docs/evidence/R1-A-REVIEW-FIX-results.json), [actual browser outcomes](docs/evidence/R1-A-REVIEW-FIX-browser.json) and [reusable CLI functions](e2e/README.md) cover the new regressions. Native browser 200% zoom was not rerun for this correction; the earlier user report in the historical integrated record retains its original source/provenance.

## Built server

After npm run build, the compiled server can serve the client/API under one origin. From Project_code in PowerShell:

```powershell
$env:NODE_ENV = 'production'
$env:APP_ORIGIN = 'https://fasttrack.example.edu'
$env:RELEASE_SHA = (git rev-parse HEAD)
npm start
```

Replace the HTTPS example origin for a real deployment. The listener uses PORT behind a future HTTPS reverse proxy. Prior local shell/API smoke is recorded in the A00 evidence; this foundation reproduction does not establish public hosting or TLS. Production requires the built client. Unknown /api paths stay JSON 404; browser routes receive the built shell.

## First-submission checks and browser review

```powershell
npm run test:a02:isolated
```

This runs the full existing pipeline plus **48 F-03 API/DB/service cases**, including internal exact-clock boundaries, real DB-clock team/milestone lock waits, concurrent version-1 writes and an actual compiled process restart that preserves the saved record/session. Ordinary npm test remains DB-independent. `npm run test:a02` runs just the F-03 suite against an explicitly configured reserved test database, after build/generation because the restart case launches compiled artifacts.

For the compiled app, set a synthetic AUTH_REVIEW_PASSWORD and run `npm run review:a02`; stop with `npm run review:auth:stop` in the same clone. Supervisor A creates a future milestone; Student A1 submits a title/description/HTTP(S) link, opens saved detail and reloads; the assigned supervisor can read and cannot submit. The server enforces inclusive database-time deadlines after team-then-milestone locks, one immutable S1 version and scoped reads. Saved links are never fetched by the server.

After a lost response, the form checks saved submissions and shows the actual author/time. A teammate's work is attributed to that teammate. If the outcome remains unknown, check saved work before an explicit retry; POST is never retried automatically. Validation/domain/network failures retain the draft. [Actual RED/GREEN/API/DB/browser results](docs/evidence/R1-A02-submissions.md) and [B's integration seam](docs/contracts/sprint-1-submissions.md) record technical verification and subsequent peer acceptance of the submission increment.

## Source layout

```text
Project_code/
  package.json, package-lock.json, .npmrc, .node-version
  prisma.config.ts, prisma.g1-history.config.ts
  vitest.config.ts, vitest.g1.config.ts, vitest.auth.config.ts, vitest.b01.config.ts, vitest.a02.config.ts
  shared/                  Pure milestone/submission/feedback validation used by client and API
  scripts/                 Isolated G1/auth/milestone/submission/feedback checks, compiled restart/browser review
  client/                  Real login/team/milestone/submission/feedback UI, Vite and shared primitives
  server/
    .env.example
    prisma/                Schema, ordered migrations and explicit seed
    src/app.ts             Listener-free router composition
    src/index.ts           Validated startup/shutdown
    src/config.ts          Runtime validation
    src/http/              Safe errors, per-route JSON parsing, request IDs/logs
    src/db/                Prisma singleton, generated client and test guard
    src/testing/           Guarded fixtures and G1/auth/milestone/submission/feedback regression
    src/modules/           Real auth/teams/milestones/submissions/feedback
  e2e/                     Later repeatable browser automation; actual local journeys recorded in evidence
  docs/contracts/          Accepted seams and pending candidate contracts
  docs/decisions/          Source/ownership decisions
  docs/evidence/           Actual verification and unresolved findings
```

Login/team/milestone/submission/feedback screens are implemented. Inter and Noto Sans Thai are bundled locally with their [licenses, pinned provenance and hashes](client/src/design/fonts/README.md); the app no longer imports Google Fonts at runtime. Preserve the Project_code workspace layout when running the compiled API: server/dist imports the tracked shared/milestones.mjs, shared/submissions.mjs and shared/feedback.mjs modules, which the browser build bundles separately. Return to the [application overview](../README.md). Team/task/branch instructions remain in [the development guide](../DEVELOPMENT_README.md).
