# fastTrack application - technical guide

## Current implementation

The client/API scaffold includes a minimal React page, `/api/health`, safe JSON errors/request correlation, environment validation, a same-origin Vite proxy and TypeScript builds. PostgreSQL/Prisma schema/migrations/seed/fixtures and shared UI primitives are present.

The foundation check currently has **4 passing / 8 failing G1 cases**; see [the independent reproduction](docs/evidence/R1-G1-A-foundation.md). Authentication and team/milestone/submission/feedback endpoints are not implemented. Ordinary unit-test success does not mean the database foundation or a completed Sprint 1 application is accepted.

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
| SESSION_TTL_HOURS | Only 8 accepted; session behavior is not implemented yet |
| RELEASE_SHA | Safe local label for development/test; production requires a full 40-character lowercase commit SHA |
| DEMO_SEED_PASSWORD | Explicit seed input; no default password. Repeat seed currently has the name-preservation defect recorded in the audit. |

After provisioning your own database and supplying DATABASE_URL/DEMO_SEED_PASSWORD to the command environment, the verified workspace commands are:

```powershell
npm run db:migrate --workspace @fasttrack/server
npm run db:seed --workspace @fasttrack/server
```

Migrate applies ordered migrations; it is not a reset. There is no general reset command. Current schema/seed defects are documented; prefer the isolated audit command for reproducing findings without touching an existing DB.

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
- Ordinary Vitest/Supertest: 3 files / 51 tests passed in the latest reproduction; no database reset occurs.
- Build writes client/dist and server/dist. The server build generates Prisma, compiles TypeScript and copies its generated runtime assets. No running DB is needed for generation/build.
- Test files and G1 audit cases are excluded from the server build; generated source/build files remain ignored in Git.
- npm run test:watch is available for ordinary local unit tests.

## Independent G1 checks

With Docker Engine running, from Project_code:

```powershell
npm run test:g1:isolated
```

This verified command creates its own temporary PostgreSQL instance with a random loopback-only port and distinct development/test databases, generates Prisma, migrates both DBs, repeats migrate deploy, runs typecheck, the 51 ordinary tests, a production-mode build and the dedicated G1 assertions. It removes only the newly created container and temporary credential file afterwards. Random DB/seed credentials are not committed or printed.

The current expected exit is **1** because eight canonical contracts fail; do not treat that exit as an accepted gate. The runner prints a redacted JSON report path. Set G1_REPORT_PATH to choose that output file. [Committed results](docs/evidence/R1-G1-A-results.json) and [findings/reproduction](docs/evidence/R1-G1-A-foundation.md) distinguish actual successes, failures and unimplemented domain tests.

For an already prepared, dedicated empty test database, npm run test:g1 runs only the G1 cases. It requires NODE_ENV=test, TEST_DATABASE_URL and a distinct protected DATABASE_URL. These checks create/update synthetic data; use the isolated wrapper for routine reproduction. The current fixture-client factory misses a guard recheck after import; that defect is recorded rather than accepted.

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
  prisma.config.ts
  vitest.config.ts, vitest.g1.config.ts
  scripts/                 Isolated G1 runner and Prisma runtime packaging
  client/                  React entry, Vite config and shared design primitives
  server/
    .env.example
    prisma/                Schema, ordered migrations and explicit seed
    src/app.ts             Listener-free router composition
    src/index.ts           Validated startup/shutdown
    src/config.ts          Runtime validation
    src/http/              Safe errors, per-route JSON parsing, request IDs/logs
    src/db/                Prisma singleton, generated client and test guard
    src/testing/           Synthetic fixtures and independent G1 checks
    src/modules/           Domain entry point; domain routes not implemented
  e2e/                     Integrated browser journeys not implemented yet
  docs/contracts/          Accepted integration seams
  docs/decisions/          Source/ownership decisions
  docs/evidence/           Actual verification and unresolved findings
```

The shared design files exist, while full application screens and self-hosted font assets are not implemented. Return to the [application overview](../README.md). Team/task/branch instructions remain in [the development guide](../DEVELOPMENT_README.md).
