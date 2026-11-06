# fastTrack application - technical guide

## Implemented scope

This is the A00 foundation: a minimal React page, Express app factory, `/api/health`, safe errors/request correlation, environment validation, TypeScript builds, Vitest/Supertest and a same-origin Vite proxy. No authentication, database schema/client connection, migration/seed, team, milestone, submission or feedback feature is implemented.

`GET /api/health` returns `200 {"status":"ok","version":"<RELEASE_SHA>"}`. It reports process liveness only. There is no database readiness endpoint yet; unimplemented API routes return JSON 404. No protected feature route or test identity bypass is exposed.

## Verified toolchain

| Tool | Verified version |
|---|---|
| Node.js / npm | 26.13.0 / 11.20.0 on Windows x64 |
| React / React DOM | 19.3.1 / 19.3.1 |
| Vite / React plugin | 8.3.6 / 6.2.1 |
| TypeScript / Express | 7.0.2 / 5.3.0 |
| Vitest / Supertest | 5.1.0 / 7.3.1 |
| Prisma CLI / client | Both 7.10.1; CLI version command verified, no generated client or database integration yet |
| Available local PostgreSQL image | `postgres:16.8` reports PostgreSQL 16.8, Debian build. Version discovery only; no database was started. The DB foundation will pin its actual tested runtime. |

`package.json` enforces Node 26 and npm 11 for this baseline; `.node-version` records the verified version. Other OS/runtime versions have not been verified. Direct dependencies use exact versions; one npm workspace lockfile lives here. Run installs from this directory. Do not create client/server lockfiles. The package manifest pins the necessary Prisma/esbuild install-script approvals; see [npm install-script policy](https://docs.npmjs.com/cli/v11/commands/npm-install-scripts/).

## Install and local configuration

From the repository root in PowerShell:

```powershell
Set-Location Project_code
node --version
npm --version
npm ci
Copy-Item server/.env.example server/.env
```

Copy the example only when `server/.env` does not already exist. Keep local credentials in that ignored server file. The supplied URLs are development placeholders. The scaffold validates their shape but does not connect to them; a running PostgreSQL database is not needed for scaffold-only checks.

| Server variable | Contract |
|---|---|
| `NODE_ENV` | `development` (default), `test` or `production` |
| `PORT` | Integer 1-65535; default 3000 |
| `APP_ORIGIN` | Exact origin without trailing slash/path/query/credentials; local `http://127.0.0.1:5173`; production must explicitly use HTTPS |
| `DATABASE_URL` | Required server-side PostgreSQL URL; never a browser variable |
| `TEST_DATABASE_URL` | Separate reserved test database URL for future database fixtures |
| `SESSION_TTL_HOURS` | Only 8 accepted; session implementation is still pending |
| `RELEASE_SHA` | Safe local label in development/test; production requires a full 40-character lowercase commit SHA |
| `DEMO_SEED_PASSWORD` | Reserved for B's future explicit seed input; no default credential/seed runs in A00 |

Never put database URLs, passwords, session tokens or CSRF tokens in `VITE_*`, client code, logs or Git. The client uses relative `/api` paths; no client environment file is needed.

## Run and check

All commands below run from `Project_code/`:

```powershell
npm run dev
```

Open `http://127.0.0.1:5173`. Vite uses strict port 5173 and proxies `/api` to `http://127.0.0.1:3000`, preserving same-origin browser requests. Use the same `127.0.0.1` hostname as APP_ORIGIN. If changing the backend port, update the Vite proxy target with it. There is no credentialed CORS setup. Ctrl+C stops both development processes.

```powershell
Invoke-RestMethod http://127.0.0.1:5173/api/health
```

Stop dev processes before `npm ci`, especially on Windows where running binaries can lock dependency files. In a separate terminal, or after stopping dev:

```powershell
npm run typecheck
npm test
npm run build
```

- `typecheck`: both workspaces, including typed unit/API tests.
- `test`: Vitest with Supertest; no DB creation/reset or network listener started at import time.
- `build`: client to `client/dist`, API to `server/dist`; tests are excluded from server output.
- `test:watch`: optional local Vitest watch mode.

## Built server

After `npm run build`, the compiled server can serve the built client and `/api` under one origin. In PowerShell, from `Project_code/`:

```powershell
$env:NODE_ENV = 'production'
$env:APP_ORIGIN = 'https://fasttrack.example.edu'
$env:RELEASE_SHA = (git rev-parse HEAD)
npm start
```

The example HTTPS hostname must be replaced for a real deployment. The server listens on PORT behind a future HTTPS reverse proxy; the local smoke check does not demonstrate public hosting or TLS. `server/.env` still supplies DATABASE_URL when no process value is set. Production refuses to start without the built client. Unknown `/api/*` paths remain JSON 404 instead of receiving HTML; ordinary browser routes receive the built shell.

## Test database boundary

`server/src/db/test-database.ts` exports `requireTestDatabase(env, protectedDatabaseUrls)`. Future fixture/reset code must call it **before** creating a destructive DB connection. It requires explicit NODE_ENV=test, TEST_DATABASE_URL, protected DATABASE_URL, a separate named database ending `_test`, and rejects protected identities independently of credentials/localhost spellings. Pass every additional known protected DB URL as an argument. Equal database names on other hosts are rejected conservatively; unsafe connection overrides are rejected. Pure URL checks cannot resolve arbitrary DNS aliases; use a DB role with access only to the test database.

No reset/migrate/seed command exists in A00. B will add and verify Prisma 7 config, adapter/client generation, migrations, safe repeat seed and real test fixtures before those commands are documented here. Do not run an invented `migrate reset` command against the example URLs.

## Source map

```text
Project_code/
  package.json, package-lock.json, .npmrc, .node-version
  vitest.config.ts
  client/                 Vite/React entry and build config
  server/
    .env.example
    src/app.ts            Listener-free API factory and router composition
    src/index.ts          Validated startup and shutdown
    src/config.ts         Runtime validation
    src/http/             Public errors, per-route JSON parsing, request IDs/logs
    src/db/               Pure test-database safety guard
    src/modules/          Domain module entry point; no domain implementation
  e2e/                    Integrated browser-test location (not implemented yet)
  docs/contracts/         Reviewed integration seams
  docs/decisions/         Accepted source/ownership baseline
  docs/evidence/          Actual verification records
```

The minimal page uses the agreed black/white direction and font fallback stack. Font files, reusable tokens/components and full application screens are not supplied by this scaffold.

See [verification evidence](docs/evidence/R1-A00-scaffold.md) for actual results and limits, or return to the [application overview](../README.md). Team/task/branch instructions remain in [the development guide](../DEVELOPMENT_README.md).
