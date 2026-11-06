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

## Committed-source reproduction and browser follow-up

Tested source commit: `68b1dffc1cb0a4400e184e1893348c23bd2af1ee`. Subsequent changes in this task update workflow/evidence only; application code and lockfile remain identical to this tested source.

- A separate clean local clone of this committed branch ran `npm ci --no-fund --no-audit` (298 packages), `npm run typecheck`, `npm test` (51/51) and `npm run build`: all PASSED. It had no copied local `.env` or database and ended with a clean Git tree. This is A's reproducibility check, not B's peer acceptance.
- The original checkout ran documented `npm start` with production mode, an HTTPS example APP_ORIGIN and RELEASE_SHA equal to the full source SHA above. HTTP checks PASSED for shell/deep link, built JS asset, exact commit in /api/health and JSON 404 for unknown API/assets. No TLS terminator or public deployment was exercised.
- A fresh Playwright CLI session using installed Edge rendered the production client. Console: 0 errors, 0 warnings. The 375x812 screenshot was visually inspected: readable English copy, black on white, no content clipping; local artifact `output/playwright/a00-production-mobile.png` is ignored. Self-hosted fonts/shared UI are still B00 work.
- Whitespace and relative-reference checks passed; real `.env`, node_modules, dist and local browser artifacts are ignored. No domain test is marked passed by these scaffold checks.

## Review and remaining gates

- A00 peer acceptance and merge: PENDING. Do not close Issue #3 or mark its acceptance accepted before real B review/integration.
- B00: still depends on the reviewed/merged A00 scaffold. B owns schema, Prisma config/adapter/client, migrations/seed/fixtures and shared UI.
- No destructive reset helper or schema is implemented; the safety guard has isolated tests only. Real protected-DB/fixture behavior must be verified with B00.
- No database readiness, domain acceptance, integrated role journey, deadline RED/GREEN, cloud deployment, TLS verification or main release is claimed.
- B should reproduce README install/build/test steps, check router/parser ownership and safe errors, then approve/request changes on the actual PR head. G1 requires the real B foundation and joint reproduction afterwards.

## B handoff

1. Review the A00 PR against Issue #3 and the concrete module-boundary exports. Use your own clone/worktree; do not switch A's working directory.
2. Fetch and inspect `origin/build/s1-a-scaffold` in an isolated review checkout. From Project_code, follow the README and run `npm ci`, `npm run typecheck`, `npm test`, `npm run build`, then local dev and proxied `/api/health`. Record only your actual results.
3. Approve or request changes on the actual head; resolve changes on this same task branch. Merge only into staging/sprint-1 when review/protection permits. Native Project automation handles the tracked PR's Done status after merge; Issue #3 acceptance/closure must then be reconciled from evidence.
4. After that merge, sync your `feature/s1-b-foundation` with `origin/staging/sprint-1` without rewriting shared history. Implement Issue #4 schema/migrations/safe seeds/fixtures/shared UI in B's branch and request A review. Coordinate any Prisma adapter/driver/generator dependencies with A, the manifest/lockfile owner.
5. A reproduces B00 and both record G1 before F-01/F-02 integrated implementation. A can prepare auth contract/test designs independently while waiting; that preparation is not a passed G1 or a main release.
