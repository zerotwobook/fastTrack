# R1-A00 scaffold verification

Date: 6 November 2026, Asia/Bangkok. Owner: A (`zerotwobook`). Reviewer: B (`Atip-Infa`). Issue: [#3](https://github.com/zerotwobook/fastTrack/issues/3). Branch: `build/s1-a-scaffold`; integration target: `staging/sprint-1`.

## Preconditions and scope

G0 was explicitly approved and merged by Atip-Infa in [PR #44](https://github.com/zerotwobook/fastTrack/pull/44), source head `d57b3eca4c60092667291ac314d5255dc09f137f`, staging merge `30fc5ef9fa6e0aa39332a0127541341f5b5e1fcf`. A00 started from that accepted merge. No main release is included.

This evidence concerns configuration, API/bootstrap/build/test infrastructure and the minimal client only. It is not proof of authentication, PostgreSQL persistence, the domain T01-T27/T31 cases, G1-G5 or a completed Sprint 1.

## Actual verification

Environment: Windows x64, Node 26.13.0, npm 11.20.0. Commands run from Project_code unless otherwise specified.

| Check | Actual result |
|---|---|
| `npm ci --no-fund --no-audit` | PASSED, 298 packages installed from the single lockfile after stopping dev processes; pinned Prisma/esbuild install-script policy applied |
| `npm ls --depth=0` | PASSED, workspace dependencies resolved without missing/invalid peers |
| `npm exec --workspace @fasttrack/server -- prisma --version` | PASSED, CLI and client both 7.10.1; no schema/client generation/migration claimed |
| `npm run typecheck` | PASSED for client and server, including typed tests |
| `npm test` | PASSED: 3 files, 51 tests; config boundaries, protected test-DB identity/override rejection, API composition, safe errors/logging/request IDs, JSON limits/order and built-shell routing |
| `npm run build` | PASSED: Vite client bundle and compiled API; tests excluded from API build |
| `npm run dev` | PASSED: API port 3000 and Vite strict port 5173 started together |
| HTTP smoke via `http://127.0.0.1:5173` | PASSED: shell, proxied /api/health body/header/no-store, unimplemented auth route JSON 404 even with HTML Accept |
| Initial Edge browser smoke via Playwright CLI | Minimal English page rendered; 375px viewport had document width 375px. Initial missing favicon 404 was corrected with an empty data favicon; fresh browser/production verification is recorded below. |
| PostgreSQL version discovery, repository-root `docker run --rm --network none --entrypoint postgres postgres:16.8 --version` | PostgreSQL 16.8 Debian build; process exited without starting a DB or mounting data. This is not migration/seed/integration evidence. |

Early command attempts were corrected: running build at the repository root returned ENOENT (the package is under Project_code); running npm ci while dev binaries were active returned Windows EPERM. Stopping the owned dev process allowed a successful clean install. These failures are not counted as passing checks or domain TDD evidence.

## Review and remaining gates

- A00 peer acceptance and merge: PENDING. Do not close Issue #3 or mark its acceptance accepted before real B review/integration.
- B00: still depends on the reviewed/merged A00 scaffold. B owns schema, Prisma config/adapter/client, migrations/seed/fixtures and shared UI.
- No destructive reset helper or schema is implemented; the safety guard has isolated tests only. Real protected-DB/fixture behavior must be verified with B00.
- No database readiness, domain acceptance, integrated role journey, deadline RED/GREEN, cloud deployment, TLS verification or main release is claimed.
- B should reproduce README install/build/test steps, check router/parser ownership and safe errors, then approve/request changes on the actual PR head. G1 requires the real B foundation and joint reproduction afterwards.
