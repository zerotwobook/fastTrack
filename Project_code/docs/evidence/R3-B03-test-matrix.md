# R3-B03 Verification Plan & Test Matrix (Issue #35)

> **Task:** `R3-B03` ([Issue #35](https://github.com/zerotwobook/fastTrack/issues/35)) — Run final authorization, UI and operational regression  
> **Owner / Reviewer:** B (`@Atip-Infa`) / A (`@zerotwobook`)  
> **Gate Basis:** Joint G3 acceptance recorded in [Issue #33](https://github.com/zerotwobook/fastTrack/issues/33) (`Done / PASSED / ACCEPTED`)  
> **Branch / Base:** `test/s3-b-final-regression` from `staging/sprint-3` (`6074f98eed54448237a65ee194ae4487a758ad52`)  
> **Assessed Candidate Target:** `v1.0.0-d2` (`main@7872a739147f7553e16e05a4d40b5d0de0c21f27`, Cloud Run `fasttrack-app-00005-rkz`, `100%` traffic, [Deploy run `44888588070`](https://github.com/zerotwobook/fastTrack/actions/runs/44888588070))

---

## Scope & Execution Status (Initial Draft Commit — Execution Pending)

Results below are **PLANNED / PENDING EXECUTION** except where an executed offline command is explicitly noted. All automated, browser, clean-checkout, and live verification outputs will be recorded in `R3-B03-final-regression.md` with supporting machine-readable artifacts once executed.

### 1. Auth, Session Expiry, Logout, CSRF & 20-Endpoint Role/Scope Matrix
- **Session & Auth Guards (`auth/`, `security.ts`)**: `POST /api/auth/login` (`Origin`/`Referer`, `X-fastTrack-Request: 1`, JSON content-type, payload allowlist, previous-session revocation, `HttpOnly`/`SameSite=Lax`/`Secure` cookie rules), `GET /api/auth/me` (fixed 8h TTL expiry at exact boundary & `revokedAt` rejection, `Cache-Control: no-store`), `POST /api/auth/logout` (`Origin`, `X-CSRF-Token`, session revocation, `Clear-Cookie`, replay rejection across protected routes), `DELETE` empty-body enforcement.
- **Role & Team-Scope Isolation Across All 20 `/api/*` Endpoints**: Anonymous `401`, Student vs Supervisor `403`, invalid query/UUID `400`, identical generic `404 NOT_FOUND` for foreign-team vs non-existent resources across `/auth/*`, `/teams/*`, `/students/available`, `/milestones/*`, `/submissions/*`, `/feedback`, `/progress`, and `/summary` (`F-08`).
- **Browser Account Switching, Cache Clearing, Deep Links & `returnTo`**: `SessionStore` generation guard during concurrent/delayed reads (`Supervisor A -> Supervisor B` and `Supervisor A -> Student A1`), `visibilitychange` masking, `pagehide`/`pageshow` bfcache revalidation, draft clearing on logout/expiry/account change, zero `localStorage`/`sessionStorage` token persistence, internal `returnTo` & `/summary` deep-link sanitization (`https://`, `//`, `\`, invalid query parameters), and sanitized error/log redaction.

### 2. UI Accessibility, Visual States & Responsive Matrix (`320`, `390`, `768`, `1280`, `1440` px + `200%` Zoom)
- **Routes Covered**: `/login`, `/`, `/teams/new`, `/teams/:id`, `/teams/:id/settings`, `/teams/:id/progress`, `/teams/:id/milestones/new`, `/milestones/:id`, `/milestones/:id/submissions/new`, `/milestones/:id/revisions/new`, `/submissions/:id`, `/summary`, and unknown route recovery.
- **Viewports & Zoom**: Automated headless Chromium measurements and screenshot checks at `320`, `390`, `768`, `1280`, and `1440` CSS px plus native **`200%` browser zoom** (`documentElement.scrollWidth <= innerWidth`, contained horizontal table scroll, `>= 44x44px` mobile controls).
- **Accessibility & Copy**: Skip link to `#main-content`, focus outlines (`>= 3:1`), modal `<dialog>` focus trap / `Escape` close / focus restoration / `>= 1200px` resize close, cancel confirmation initial focus (`Go back`), visible labels/`aria-invalid`/`aria-describedby`/live regions, rendered text (`>= 4.5:1`) and border (`>= 3:1`) contrast audit, local bundled `Inter` + `Noto Sans Thai` fonts, English UI copy, loading/empty/error/recovery states, and disposition of the documented B-owned out-of-range `"Page 2 of 1"` label in `DrilldownList.tsx`.

### 3. Clean-Checkout Reproduction & Operational / Deployment Verification
- **Clean-Checkout Verification**: Fresh detached clone/worktree at exact candidate source with pinned Node `26.13.0` / npm `11.20.0`: `npm ci`, `db:generate`, `npm run typecheck`, `npm test`, `npm run build`, `npm run test:runtime:isolated`, `npm run verify:container`, and `npm run verify:socket`.
- **Rate Limiting (`429 LOGIN_RATE_LIMITED`) & Secret Hygiene**: Real PostgreSQL + compiled `TRUST_PROXY_HOPS=1` proxy-topology throttling checks (`401` x4 -> `429` + `Retry-After` -> expiry unlock -> `cleanup-rate-limits.js` bounded batch deletion) without risking shared-IP lockout against grading accounts on live Cloud Run; image/bundle/log secret hygiene inspection.
- **Health, Readiness, Migration Gate & Deployed Identity**: Offline `deploy/` syntax and stub suites (`test_release_stub.sh`, `test_deploy_stub.sh`, `test_teardown_stub.sh`, `test_smoke.py`), `/api/health` (`200`) and `/api/ready` (`200` connected vs `503` disconnected/timeout), and traceability verification matching `v1.0.0-d2` (`7872a739147f7553e16e05a4d40b5d0de0c21f27`), CI `44885899889`, deploy `44888588070`, `fasttrack-migrate-4lvx5`, Artifact Registry digests, Cloud Run `fasttrack-app-00005-rkz` (`100%` traffic), and live `/api/health` + `/api/ready`.
