# R1-A01 authentication and scoped team verification

Date: 6 November 2026, Asia/Bangkok. Owner A / zerotwobook; reviewer B / Atip-Infa. [Issue #5](https://github.com/zerotwobook/fastTrack/issues/5), [PR #54](https://github.com/zerotwobook/fastTrack/pull/54), branch `feature/s1-a-auth`, target `staging/sprint-1`.

**Current status: Verification PASSED; peer Acceptance ACCEPTED in staging.** Executable tested source: `2899d1b3a91e54b52a759e3f12ecd9f5fcf7b8d4`; approved docs-only head: `70dd0ce`. This is an accepted feature increment, not a main release or G2 acceptance.

## Accepted integration update

B approved PR #54 at head 70dd0ce on 2026-11-06T16:35:19Z, reporting local session/CSRF/accessibility/role-isolation and API/browser checks. B merged it into staging as 0b99a285deb0c6a40aede22e816a578ffa0b62d5 at 16:49:14Z. A verified the approved merge tree and reconciled #5/#54 as Done/PASSED/ACCEPTED; #5 is closed. The sections below describe the original A01 source/scope and preserve its pre-acceptance handoff statements and JSON. Current milestone corrections and joint G2 acceptance are separate; see [B01 review](R1-B01-A-review.md).

## Scope and actual prerequisite

G1 was accepted after B's real approval of PR #50 head 6a5de5f and merge ff5975c. A verified the approved merge tree against the tested foundation; B's prior A00 reproduction remains the B command evidence. See [G1 history](R1-G1-A-foundation.md). This feature implements project detail 3/7.5/8/9 and D1 E.1, AC-01.1-01.5 / T-01-T-05/T-23/T-27. It does not accept G2 or the whole Sprint 1 increment.

Implemented: DB-backed opaque sessions; existing scrypt hash verification; exact eight-hour lifetime; re-login rotation/current-session logout; HttpOnly/SameSite/HTTPS Secure cookies; source/CSRF and JSON protection; fail-closed session/role middleware; authorized team queries/DTOs; login/team UI; memory-only client state with stale-response/history isolation; safe errors and recovery.

No changes to B's schema, migrations, seed, fixtures, shared design primitives, active milestone branch or the dependency lockfile. A composes auth/teams only. B reported adapting PR #52's protection pipeline; A has not independently reviewed or integrated that candidate here. The [auth contract](../contracts/sprint-1-auth.md) identifies the exact available exports.

## Clean-clone verification

Source was cloned without hardlinks into a new OS temporary directory, `fasttrack-a01-verify-2899d1b`. `npm ci` installed 316 packages without copied environment files or generated client. Verified environment: Windows x64, Node 26.13.0, npm 11.20.0, Prisma 7.10.1 and pinned PostgreSQL 16.8. The final run started 2026-11-06T16:15:26.644Z and finished 16:17:44.525Z (23:15-23:17 Asia/Bangkok).

From Project_code:

```powershell
npm ci
npm run test:auth:isolated
```

The final clean-clone run used the review variant below, which runs that same complete check pipeline before serving the built app and then verifies graceful cleanup:

```powershell
$env:AUTH_REVIEW_PASSWORD = Read-Host 'Choose a synthetic review password'
npm run review:auth
# Open the printed AUTH_REVIEW_URL.
# In a second terminal in this same clone's Project_code:
npm run review:auth:stop
```

| Check | Actual result |
|---|---|
| Clean install, client generation, fresh dev/test migrations, repeated deploy | PASS |
| Typecheck | PASS, both workspaces |
| Ordinary tests including client state/return-to regressions | **4 files / 67 tests passed** |
| Dedicated real-DB auth/team tests | **28 passed / 0 failed**, no failed suites |
| Production-mode client/server build and compiled Prisma DB access | PASS |
| Foundation regression | **38 passed / 0 failed** |
| Existing-data migration/rejection scenarios | **7/7 passed** |
| Final clean-clone supervisor login, reload, team read, logout and cookie replay | PASS, old cookie returns 401 |
| Graceful review stop and runner exit | PASS, exit 0 |
| Container/credential/review-state cleanup | PASS; no audit container remains |
| Clean clone Git status | Clean |

Structured result: [R1-A01-results.json](R1-A01-results.json). Its report contains no DB connection URLs, passwords, session cookies or CSRF values. No existing developer database was reset or changed. Four intentionally rejected migration attempts count as passing only after the expected SQLSTATE, data/schema and completed-history preservation assertions succeed.

## Traceability and meaningful assertions

| Targets | Actual checks |
|---|---|
| T-01 / AC-01.1 | Both roles use real fixture scrypt hashes; token hash differs from cookie; exact eight-hour DB lifetime; independent CSRF; DTO allowlist; HttpOnly/SameSite and HTTPS Secure headers; me identity and no sliding expiration |
| T-02 / AC-01.2 | Unknown user and bad password have identical 401 bodies and no session writes; empty/wrong-shaped/spoofed payloads fail; UI retains email and focuses a useful error |
| T-03 / AC-01.3 | Missing/forged/header-spoofed/exact-expired/revoked/duplicate-cookie sessions fail; DB session lookup failure is safe 503; no private data |
| T-04 / AC-01.4 | Missing/wrong CSRF does not revoke; valid logout revokes only the current session; replay fails; another device remains valid; anonymous logout validates source |
| T-05 / AC-01.5 | Student and both supervisor scopes; foreign/missing team share 404; UUID validation follows session; no-team student; multiple assigned teams and stable ordering; exact Team DTO and serverTime |
| T-23 / S1-AC-EXT-01 | Origin/Referer priority, missing/foreign/null source, required login header, form rejection, rotation, no-store, fail-closed middleware and immutable identity; guard order precedes parsing |
| T-27 / S1-AC-EXT-05 | Client generation tests reject late private data/old 401 after account switch; clear on logout/expiry/navigation; failed sign-out retains a safe retry; unsafe return-to rejected; browser cases below |

API/DB cases are in `server/src/testing/sessions.auth.ts`; client isolation tests are in `client/src/features/auth/session.test.ts`. Assertions include actual DB session counts/revocation/expiry and response data, not status codes alone. This is F-01 regression evidence, not the later F-03 deadline TDD chain.

## Browser and visual verification

Playwright CLI drove a real Chromium browser against the compiled client/API and newly seeded disposable PostgreSQL. Initial visual/flow checks used the same application source and final built asset hashes as 2899d1b; the final fresh clone repeated supervisor login/reload/team read/logout/replay.

- Student A1 login showed Team A and its real members/supervisor; team detail persisted on reload.
- After logout, Supervisor B logged in at the former Team A URL and saw a generic denial with no Team A/member names. Overview showed Team B; browser Back still denied the old Team A URL.
- Logout removed private UI; explicit replay of the captured prior HttpOnly cookie returned 401. The token value was kept only in the temporary test function, not evidence/output.
- The review-only unassigned student saw the no-team state. An external returnTo stayed on the local root. Expiring only that synthetic user's session in the verified disposable DB made reload show login without private identity.
- At 320px, login/team pages had scrollWidth equal to viewport width. Menu opened a native modal; Escape closed it and restored focus to Menu. Keyboard input focus had a visible black 2px outline with 2px offset.
- Offline login displayed a useful error, retained email and cleared password; restoring connectivity and retrying succeeded.
- document.cookie did not expose the session token; localStorage and sessionStorage had no application state.
- Visual review found weak inherited input borders. A's scoped form CSS now uses measured rgb(138,138,138) on white (**3.45:1**), 16px input text, 48px controls and the existing monochrome design. B's shared component files remain unchanged.

Local screenshots are under repository `output/playwright/` (ignored, not published): a01-login-desktop.png, a01-login-mobile.png, a01-team-desktop.png and a01-team-mobile.png. Final login screenshots include the contrast/focus changes; earlier team screenshots precede the button-font adjustment. Browser snapshots/logs are local ignored artifacts. The initial real-browser check caught an unbound Fetch receiver error; it was fixed and a receiver-specific unit regression was added. Setup/automation errors are not domain RED evidence.

Limits: Chromium/local HTTP only; no public TLS/deployment, full screen-reader audit, load test or completed milestone/submission/feedback journey is claimed. Secure cookie behavior was checked at the API header level for HTTPS configuration. Shared external font loading/fallback is retained; self-hosted assets are still pending. No new GitHub Actions CI gate was installed.

## Peer handoff

B must review the current PR #54 head, reproduce the commands and both roles, inspect token hashing/session lifecycle/CSRF/scoped DTOs and account-switch recovery, and accept/merge into staging when satisfied. Keep Issue #5 OPEN and Acceptance PENDING until that real decision/merge. Do not self-approve or start A02 before G2. Coordinate `requireRole('supervisor')` with B's `requireSupervisor` dependency and recheck scoped writes within the same transaction at G2.

Compatibility references for the implemented APIs: [Node crypto](https://nodejs.org/api/crypto.html), [Express 5](https://expressjs.com/en/5x/api/). The source and executed checks, rather than these references, establish this implementation's actual results.
