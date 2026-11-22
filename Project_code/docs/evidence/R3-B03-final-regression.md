# R3-B03 Final Authorization, UI, and Operational Regression

> - **Task:** `R3-B03` ([Issue #35](https://github.com/zerotwobook/fastTrack/issues/35))
> - **Owner / Reviewer:** B (`@Atip-Infa`) / A (`@zerotwobook`)
> - **Gate Basis:** Joint G3 acceptance recorded in [Issue #33](https://github.com/zerotwobook/fastTrack/issues/33) (`Done / PASSED / ACCEPTED`)
> - **Branch / Base:** `test/s3-b-final-regression` from synchronized `staging/sprint-3` (`6074f98eed54448237a65ee194ae4487a758ad52`)
> - **Final Tested App Commit:** `d3b07ba2eeefeb33596d37d4099c601e99f7de68` (`cleanWorkingTreeBeforeRun: true`)
> - **Assessed Release Candidate:** `v1.0.0-d2` (`main@7872a739147f7553e16e05a4d40b5d0de0c21f27`, Cloud Run revision `fasttrack-app-00005-rkz`, `100%` traffic, [Deploy run `44888588070`](https://github.com/zerotwobook/fastTrack/actions/runs/44888588070))

---

## 1. Summary of Execution & B-Owned Fix

1. **Test Plan & Baseline Reproduction (`2e2ed27`)**:
   - Authored the verification matrix in [R3-B03-test-matrix.md](R3-B03-test-matrix.md).
   - Reproduced the previously tracked out-of-range F-08B pager wording defect on clean baseline code (`2e2ed27`): requesting `/summary?teamId=<teamId>&status=PENDING&page=2&pageSize=8` when only 1 page of matches existed rendered `"Previous 1 Page 2 of 1 Next"`.
2. **B-Owned Fix (`d3b07ba`)**:
   - Updated [DrilldownList.tsx](../../client/src/features/summary/DrilldownList.tsx) so out-of-range pages (`filters.page > totalPages`) render `Page ${filters.page} (${totalPages} page/pages total)` instead of `"Page N of M"`, while keeping `"Page N of M"` for valid in-range pages.
   - Added unit assertions for multi-page and single-page overflow states in [DrilldownList.test.ts](../../client/src/features/summary/DrilldownList.test.ts).
   - Confirmed post-fix browser rendering at `d3b07ba`: `"Previous 1 Page 2 (1 page total) Next"`.
3. **Clean Post-Fix Verification (`d3b07ba`)**:
   - All post-fix suites executed after committing `d3b07ba` (`dirty: false`), capturing sanitized machine-readable evidence in [R3-B03-regression-results.json](R3-B03-regression-results.json) and screenshots under [assets/s3-b03/](assets/s3-b03/).

---

## 2. Clean-Checkout & Operational Verification (`d3b07ba`)

Environment: clean worktree `D:/FastTrack/wt-r3-b03`, pinned `Node v26.13.0`, `npm 11.20.0`, Docker Engine `29.4.3`, pinned image `postgres:16.8@sha256:301bcb60b8a3ee4ab7e147932723e3abd1cef53516ce5210b39fd9fe5e3602ae` (`PostgreSQL 16.8`).

| Check / Suite | Exact Command (`Project_code/` or repo root) | Scope & Result |
| --- | --- | --- |
| Clean install & Prisma client | `npm ci` + `npm run db:generate --workspace @fasttrack/server` | **PASS** (`316` packages; Prisma Client `v7.10.1`) |
| Workspace typecheck & build | `npm run typecheck` + `npm test` + `npm run build` | **PASS** (`17` files / `214` unit & contract tests passed, `0` failed; `Inter` & `Noto Sans Thai` fonts bundled in `client/dist`, compiled `server/dist`) |
| Isolated PostgreSQL 16 runtime | `npm run test:runtime:isolated` (isolated `G1_REPORT_PATH` & `A01_CONTAINER_REPORT`) | **PASS** (`14/14` stages, **`483` passed / `0` failed / `0` skipped** across `214` ordinary + `38` G1 + `46` Auth + `57` B01 + `54` A02 + `61` B02 + `1` J03 + `12` runtime; `7/7` migration upgrade scenarios passed) |
| Production container build & runtime | `npm run verify:container` (isolated `A01_CONTAINER_REPORT`) | **PASS** (`13/13` checks on clean clone of `d3b07ba`, including HTTP `APP_ORIGIN` rejection, non-root `USER node`, no `.env`/test fixtures in `runner`, and DB restart persistence) |
| UNIX-socket Cloud SQL emulation | `npm run verify:socket` (isolated `A01_CONTAINER_REPORT`) | **PASS** (`17/17` checks on clean clone of `d3b07ba`, TCP disabled, wrong socket password rejection -> readiness `503` + health `200`, restart + session retention) |
| Offline `deploy/` & migration gate | `bash -n deploy/*.sh`, `test_release_stub.sh`, `test_deploy_stub.sh`, `test_teardown_stub.sh`, `python -m unittest discover -s deploy/tests -p 'test_smoke.py' -v` | **PASS** (`9/9` release stub scenarios proving failed migration/digest/split-traffic block service rollout; `10/10` deploy stub; `16/16` teardown stub; `10/10` smoke unittest cases) |

---

## 3. Authorization, Session, Rate Limit (`429`) & Readiness Matrix (`d3b07ba`)

Executed via live compiled `server/dist` + `client/dist` over real HTTP (`TRUST_PROXY_HOPS=1`, `LOGIN_RATE_LIMIT_MAX_FAILURES=5`, `WINDOW=900s`, `LOCK=900s`) backed by ephemeral Docker PostgreSQL 16.8 with all 6 Prisma migrations deployed:

| Verification Group | Result | Observed Evidence |
| --- | --- | --- |
| `POST /api/auth/login` transport & cookies | **PASS** | Missing `X-fastTrack-Request` -> `403`; mismatched `Origin` -> `403`; `text/plain` -> `415`; bad credentials -> `401`; valid login sets `HttpOnly; SameSite=Lax` cookie |
| `GET /api/auth/me` & `POST /api/auth/logout` | **PASS** | Anon -> `401`; expired `expiresAt` -> `401`; bad CSRF on logout -> `403`; logout -> `204` + session replay rejected (`401`); no `passwordHash` or `tokenHash` serialized; `Cache-Control: no-store` |
| `GET /api/teams` & `GET /api/teams/:id` | **PASS** | Anon `401`; Student sees own team (`[]` for unassigned student); Supervisor scoped to owned teams only; foreign team & absent UUID return identical `404 NOT_FOUND` |
| `POST /api/teams` & `PATCH /api/teams/:id` | **PASS** | Anon `401`; Student `403`; bad CSRF `403`; `text/plain` `415`; foreign `PATCH` `404`; owner create `201` / rename `200` |
| `GET /api/students/available`, team member `POST`/`DELETE` | **PASS** | Student `403`; foreign team `404`; empty-body `DELETE` `204`; non-empty `text/plain` `DELETE` rejected (`400`) |
| Milestones (`POST/PATCH/cancel/GET list/GET detail`) | **PASS** | Anon `401`; Student mutations `403`; foreign access/mutations `404`; owner create `201`, update `200`, cancel `{}` `200` |
| Submissions & Revisions (`POST submissions`, `POST revisions`, `GET list`, `GET detail`) | **PASS** | Anon `401`; Supervisor writes `403`; foreign `404`; first submit `201`; duplicate `409`; stale `expectedVersion` revision `409`; valid revision (`expectedVersion: 1`) `201` (`version: 2`) |
| Feedback (`POST/GET /api/submissions/:id/feedback`) | **PASS** | Anon `401`; Student write `403`; foreign `404`; owner write `201`; idempotent `clientRequestId` replay `200`; `GET` foreign `404` / owner `200` |
| `GET /api/teams/:teamId/progress` | **PASS** | Anon `401`; foreign & absent UUID identical `404 NOT_FOUND`; owner `200` (`4/8` excluding cancelled) |
| `GET /api/summary` (F-08) | **PASS** | Anon `401`; Student `403`; invalid `status=BOGUS` & `pageSize=99` -> `400`; foreign `teamId` & absent UUID identical `404 NOT_FOUND`; Supervisor A multi-team totals `6/14 (42.9%)`, `15` unfiltered matches (`14` active + `1` cancelled), `status=CANCELLED` -> `1`, out-of-range page -> `items: []` preserving `matchedCount: 4`; Supervisor B summary excludes Team Alpha |
| Proxy-aware `429` throttling & cleanup | **PASS** | Under `TRUST_PROXY_HOPS=1`, 4 bad logins from `X-Forwarded-For: 198.51.100.77` returned `401` and the 5th returned **`429 LOGIN_RATE_LIMITED`** with `Retry-After: 900`; concurrent login from `198.51.100.88` succeeded (`200`); `cleanExpiredLoginKeys` deleted `3` backdated rows in a bounded batch |
| Health & readiness probes | **PASS** | `GET /api/health` -> `200` (`version`, `Cache-Control: no-store`, `X-Content-Type-Options: nosniff`, server-generated `X-Request-Id`); connected `/api/ready` -> `200`; unreachable DB `/api/ready` -> `503` without leaking DB password or port |
| Server JSON request log hygiene | **PASS** | Inspected `597` structured JSON logs; zero plaintext passwords, DB passwords, or `fasttrack_session` cookies |

---

## 4. UI Accessibility, Account Isolation, Responsive (`320`–`1440` px) & `200%` Zoom Verification

Tested in headless Chromium (`Playwright`) against the compiled production client & API:

- **Account Switching & Storage Hygiene (`PASS`)**:
  - Verified `localStorage.length === 0`, `sessionStorage.length === 0`, and `document.cookie` omits the `HttpOnly` `fasttrack_session` cookie.
  - Triggered `Sign out` during an intercepted slow `GET /api/teams` response (`SupA -> SupB`) and verified stale Supervisor A data never populated Supervisor B's view; verified Student visiting `/summary` sees `"Summary is restricted to supervisors"` with zero Supervisor data leaked.
- **Deep Links & `returnTo` Safety (`PASS`)**:
  - Signing in from unauthenticated `/summary?teamId=...&status=PENDING&page=1&pageSize=8` restored exact URL filters and rendered matching results.
  - `/login?returnTo=https%3A%2F%2Fevil.example%2Fphish` redirected safely within app origin (`/`) without navigating externally.
- **Fonts, Copy, Loading / Empty / Error Recovery, Keyboard & Focus (`PASS`)**:
  - Verified `0` external CDN font/script requests (`Inter` and `Noto Sans Thai` loaded strictly from local Vite bundle assets).
  - Verified loading -> `500` error `role="alert"` -> `Try again` recovery on `/summary`; verified English recovery UI on `/unknown-path-check`; verified Skip link moves focus to `#main-content`.
  - Verified mobile menu `<dialog>` opens at `390px` with focus inside dialog, closes on `Escape` restoring focus to `Menu`, and auto-closes when resized to `>= 1200px`; verified Cancel milestone confirmation `<dialog>` places initial focus on safe `Go back` button and closes on `Escape`.
- **Responsive Overflow & `200%` Zoom Matrix (`54 / 54 PASS`)**:
  - Audited `9` routes (`/login`, `/`, `/teams/new`, `/teams/:id/settings`, `/teams/:id/milestones/new`, `/summary`, `/teams/:id/progress`, `/milestones/:id`, `/submissions/:id`) across `320px`, `390px`, `768px`, `1280px`, `1440px`, and **`200%` reflow zoom (`640x400` at `deviceScaleFactor: 2`)**. Zero `documentElement.scrollWidth > innerWidth` overflow, zero undersized (`< 44px`) form buttons/inputs/selects, zero Thai text regressions in UI chrome, zero uncaught page errors.
- **WCAG Computed Contrast Audit (`17 / 17 PASS`)**:
  - Sampled rendered `/login` and `/summary` elements: text contrast ranged from **`6.35:1`** (status badge) / **`14.5:1`** (`<th>`) to **`15.96:1`** (`<p>`, `<label>`, `<td>`, `<button>`, `<a>`) against `>= 4.5:1`; button/input border contrast **`4.83:1`** against `>= 3.0:1`.

### Visual Evidence Captures (`d3b07ba`)

| Artifact | Purpose Verified | SHA-256 |
| --- | --- | --- |
| [summary-out-of-range-page.png](assets/s3-b03/summary-out-of-range-page.png) | Verified `"Page 2 (1 page total)"` fix + preserved filter recovery (`1280px`) | `127088807a5f1876c654c05818b08f0e75135465eee065d0db5faa12a9d5f091` |
| [320px-summary.png](assets/s3-b03/320px-summary.png) | Minimum `320px` mobile width: `42.9%` completion, wrapped layout, contained table scroll | `b3880296f797ebc96b113c9b08268cf0d56ff2618fddb423a0ebf5f6ef79c6e1` |
| [390px-home.png](assets/s3-b03/390px-home.png) | Mobile `390px` Supervisor team workspace and >=44px touch targets | `0b3c605b67d38c4a920afd4fb14f5cc83f3dfbc8d48f45721dec4449eeb25de7` |
| [1280px-summary.png](assets/s3-b03/1280px-summary.png) | Desktop `1280px` multi-team F-08 totals (`6/14 = 42.9%`) and status badges | `d1ee14d1b08c79642dc944e850d476ee52fced141284879bcb3fa4b8cb9d8066` |
| [200_-zoom_640x400_2x_-summary.png](assets/s3-b03/200_-zoom_640x400_2x_-summary.png) | `200%` reflow zoom (`640x400@2x`): responsive drawer transition and contained horizontal table scroll | `128b4dca285d20a06349aae97e09875c8626c72c2e4b2081decffadae2bc53ea` |

---

## 5. Assessed Hosted Candidate Identity (`v1.0.0-d2`) & Remaining Findings

| Item | Verified State (`2026-11-22`) |
| --- | --- |
| Release tag / `main` commit | `v1.0.0-d2` -> `7872a739147f7553e16e05a4d40b5d0de0c21f27` |
| Main CI / Deploy runs | CI [`44885899889`](https://github.com/zerotwobook/fastTrack/actions/runs/44885899889) (`483/483`, `7/7` upgrades); Deploy [`44888588070`](https://github.com/zerotwobook/fastTrack/actions/runs/44888588070) |
| Cloud Run migration / serving revision / traffic | `fasttrack-migrate-4lvx5` / `fasttrack-app-00005-rkz` / `100%` at `https://fasttrack-app-kpx7au3w2a-as.a.run.app` |
| Deployed Artifact Registry digests | Web index `sha256:7b868cd51b62db518dde4e22601930a9be7b8483bffb9409efd70742faf2c458` (amd64 `sha256:440b3a4ac8fc41c76e14e5b72defcf264f597c19a272dde2f481a9f5ee82269a`); Jobs `sha256:b49829f88464cc18f7aa6d2cb9be840e67cf9dd1b867eee18d3bf7e58ec4c718` |
| Live unauthenticated & bundle readback | `GET /api/health` -> `200` (`version: 7872a739...`, `no-store`, `nosniff`), `GET /api/ready` -> `200` (`database: connected`, `version: 7872a739...`), `GET /api/auth/me`, `/api/teams`, `/api/summary` -> `401 UNAUTHENTICATED`; `index-CjfMLH9_.js` & `index-CkpIPRkx.css` -> `200`, `leaksSecret: false`, `externalFontCdn: false` |
| Previously recorded hosted authenticated F-08/S1 evidence | Audited in [R3-B02-d2-post-deploy-readback.json](R3-B02-d2-post-deploy-readback.json) and G3 [Issue #33](https://github.com/zerotwobook/fastTrack/issues/33) (`6/14 = 42.9%`, Sprint 1 canonical SHA-256 match) |

### Open Findings & Operational Notes for Final Integration (#36)

1. **`npm audit` High Advisories (`3` high, `0` critical)**: Locked dependency tree (`prisma` -> `@prisma/config` -> `effect`, `GHSA-7589-6fvf-x4pw`) reports 3 high advisories (`npm audit` and `npm audit --omit=dev`). Root `package.json`/`package-lock.json` were intentionally left untouched in this task PR per shared-lockfile coordination rules and remain tracked under [Issue #33](https://github.com/zerotwobook/fastTrack/issues/33) / [Issue #36](https://github.com/zerotwobook/fastTrack/issues/36) prior to Final release.
2. **Hosted Deployment Scope**: Live Cloud Run currently serves `v1.0.0-d2` (`7872a739`), which predates the `d3b07ba` out-of-range summary pager wording fix until PR #147 merges into `staging/sprint-3` and Final release ([Issue #36](https://github.com/zerotwobook/fastTrack/issues/36)) promotes to `main` under [MAIN_RELEASE_GATE.md](../../../workflow/MAIN_RELEASE_GATE.md). Hosted `429 LOGIN_RATE_LIMITED` lockout was intentionally not triggered against shared production Cloud Run endpoints to avoid locking grading IPs; instead it was proven against the compiled server running `TRUST_PROXY_HOPS=1` over HTTP (`X-Forwarded-For` isolation verified).
3. **GitHub Environment Reviewer Configuration**: Querying `repos/zerotwobook/fastTrack/environments` confirms `demo` retains `Atip-Infa` as sole configured reviewer (`prevent_self_review` enforced); release deployments for Final must continue coordinating trigger vs independent approval between A (`@zerotwobook`) and B (`@Atip-Infa`).
