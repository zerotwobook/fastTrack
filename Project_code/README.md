# fastTrack application - technical guide

## Current implementation

The React client and API implement login/me/logout, DB-backed eight-hour sessions, source/CSRF protection and authorized team list/detail. The interface includes login, role-aware navigation, mobile menu, team members/supervisor and loading/empty/error/retry states. PostgreSQL/Prisma schema/migrations/seed/fixtures, shared UI primitives, `/api/health`, safe errors/request correlation, validated configuration and TypeScript builds are present.

The latest clean-clone checks pass **67 ordinary tests, 28 auth/API/database tests, 38 G1 cases and seven migration scenarios**. G1 was accepted through PR #50's real peer approval/merge. The F-01 increment is awaiting peer review in PR #54; see [F-01 evidence](docs/evidence/R1-A01-auth.md) and [G1 history](docs/evidence/R1-G1-A-foundation.md). Milestone/submission/feedback integration and a complete Sprint 1 application are still pending.

`GET /api/health` returns `200 {"status":"ok","version":"<RELEASE_SHA>"}` for process liveness only. There is no database readiness endpoint yet; unimplemented API routes return JSON 404. No test identity bypass is exposed.

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
- Ordinary Vitest/Supertest/client-state checks: 4 files / 67 tests pass; no database reset occurs.
- Build writes client/dist and server/dist. The server build generates Prisma, compiles TypeScript and copies its generated runtime assets. No running DB is needed for generation/build.
- Test files, G1 cases and auth DB cases are excluded from the server build; generated source/build files remain ignored in Git.
- npm run test:watch is available for ordinary local unit tests.

## Independent G1 checks

With Docker Engine running, from Project_code:

```powershell
npm run test:g1:isolated
```

This verified command creates its own temporary PostgreSQL instance with a random loopback-only port and distinct development/test databases, generates Prisma, migrates both DBs, repeats migrate deploy, runs typecheck, the 67 ordinary tests, a production-mode build and 38 dedicated G1 assertions. It also creates seven historical-schema databases inside that same new container to check upgrades and safe rejection. It removes only the newly created container and temporary credential file afterwards. Random DB/seed credentials are not committed or printed.

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

## Built server

After npm run build, the compiled server can serve the client/API under one origin. From Project_code in PowerShell:

```powershell
$env:NODE_ENV = 'production'
$env:APP_ORIGIN = 'https://fasttrack.example.edu'
$env:RELEASE_SHA = (git rev-parse HEAD)
npm start
```

Replace the HTTPS example origin for a real deployment. The listener uses PORT behind a future HTTPS reverse proxy. Prior local shell/API smoke is recorded in the A00 evidence; this foundation reproduction does not establish public hosting or TLS. Production requires the built client. Unknown /api paths stay JSON 404; browser routes receive the built shell.

## Source layout

```text
Project_code/
  package.json, package-lock.json, .npmrc, .node-version
  prisma.config.ts, prisma.g1-history.config.ts
  vitest.config.ts, vitest.g1.config.ts, vitest.auth.config.ts
  scripts/                 Isolated G1/auth checks, disposable browser review and Prisma packaging
  client/                  Login/session/team UI, Vite config and shared design primitives
  server/
    .env.example
    prisma/                Schema, ordered migrations and explicit seed
    src/app.ts             Listener-free router composition
    src/index.ts           Validated startup/shutdown
    src/config.ts          Runtime validation
    src/http/              Safe errors, per-route JSON parsing, request IDs/logs
    src/db/                Prisma singleton, generated client and test guard
    src/testing/           Synthetic fixtures and independent G1 checks
    src/modules/           Real auth/teams and composition; other domain routes pending
  e2e/                     Full milestone/submission/feedback journeys still pending
  docs/contracts/          Accepted integration seams
  docs/decisions/          Source/ownership decisions
  docs/evidence/           Actual verification and unresolved findings
```

Login/team screens are implemented; the full milestone/submission/feedback screens and self-hosted font assets are pending. Existing shared typography includes an external Google Fonts import with a local fallback. Return to the [application overview](../README.md). Team/task/branch instructions remain in [the development guide](../DEVELOPMENT_README.md).
