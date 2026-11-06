# R1-A01 authentication contract and verification plan

Owner A; reviewer B. Issue #5 / PR #54, branch `feature/s1-a-auth`, based on accepted Sprint 1 merge `ff5975c9ed96ec7cc528897a5437c9722105048b`. The exports and behavior below are implemented and verified at `2899d1b3a91e54b52a759e3f12ecd9f5fcf7b8d4`; peer acceptance remains pending. See [actual evidence](../evidence/R1-A01-auth.md).

## Accepted prerequisite

PR #50 head `6a5de5f` was approved by Atip-Infa at 2026-11-06T14:50:03Z and merged by Atip-Infa at 14:50:20Z. Its merge tree equals that approved head; executable files equal tested source `6f3601e`. A's real reproduction passed 51 unit tests, 38 G1 tests and seven migration scenarios. B's prior A00 reproduction is recorded in PR #45. These real checks and current-head peer acceptance satisfy G1; no new B command result or adoption of an existing persistent database is claimed.

## API and security

Implement project detail 7.5/9 and D1 E.1 without changing schema or B's milestone module:

- POST `/api/auth/login`: only `{email,password}`; source Origin, or Referer origin when Origin is absent, must match APP_ORIGIN; `X-fastTrack-Request: 1`; JSON only. Unknown email and wrong password share a 401 response and create no session.
- Preserve the seed's scrypt salt/hash format. Use asynchronous password comparison and constant-time comparison. Do not migrate passwords implicitly.
- Generate independent random authentication/CSRF tokens. Store only the authentication token hash. Return the CSRF token in the allowlisted login/me DTO. Keep the authentication token in a host-only HttpOnly, SameSite=Lax cookie, Secure for HTTPS, with an absolute eight-hour expiration. Re-login revokes the browser's previous cookie session.
- GET `/api/auth/me`: valid, unexpired, unrevoked DB session only; do not extend its expiration. Unknown/expired/revoked tokens return 401.
- POST `/api/auth/logout`: validate source; require matching CSRF for a valid session; revoke only that session and clear the cookie; no valid session still returns 204 after source validation.
- GET `/api/teams` and `/api/teams/:id`: session first, UUID input then scoped DB query. Student membership / assigned supervisor determine scope. Return identical 404 errors for absent/out-of-scope teams. Use exact Team DTOs from section 9.4, stable name/id ordering and read meta.serverTime.
- All private/auth responses are no-store. Never log credentials, raw cookies, authentication/CSRF tokens or SQL errors. Database failures return safe 503 errors.

## Module seam for B

`server/src/modules/auth/index.ts` exports `createAuthRouter` and `createSessionProtection({prisma,config})`. Protection provides `requireSession`, `requireRole(role)`, `requireMutation` and asynchronous `getAuthContext(req)` returning an immutable `{userId,role,sessionId}`. Pass `requireRole('supervisor')` for B's `requireSupervisor` dependency. No header/body/query identity fallback is permitted. Missing/invalid sessions fail closed.

B must mount protection before JSON parsing: session -> role -> source/CSRF -> JSON type/parser -> input -> scoped service. The current unmerged milestone router's `x-user-id` / `x-user-role` fallback is not an integration contract and must be removed before production composition/G2. A will not mount that candidate unchanged or edit B's active branch. A owns real auth/teams and composition; B owns adapting the milestone router to required protection dependencies.

`server/src/modules/teams/index.ts` exports `createTeamsRouter`, `scopedTeamWhere(auth)`, `requireUuid(value)` and `requireTeamAccess(db,auth,id)`. Pass the explicit Prisma/transaction client into the scope check. Mutations must recheck within their transaction; a prior route check is not sufficient for later mutations. A composes only real auth/teams in `server/src/modules/index.ts`; milestone integration still requires reviewed B code and G2.

B reported removing the old header fallback and adapting its middleware pipeline in PR #52 at `043af8d` on 6 November. That report is coordination evidence, not A's independent review or G2 acceptance.

## UI and state

Use project detail 8.3-8.6 and SKILL_UI. Login is a quiet white, single-column form (maximum 400px), fastTrack wordmark, visible labels, black primary action and English recovery copy. Reuse B's Field/Input/Button/EmptyState primitives and monochrome tokens. No new theme or decorative hero is introduced.

The role-aware shell and team list/detail use real authorized API data. Unimplemented milestone/submission/progress actions are not exposed. Preserve the future milestone-track space without inventing milestone data. Use 224px desktop navigation and a keyboard-accessible drawer below 1200px. Include skip navigation, loading/empty/error/retry states and 320px layout support.

Keep session/CSRF/private data only in memory. On logout, account change, 401 or restored browser history, invalidate requests and clear private state before rendering login/another account. Do not let an old in-flight request repopulate private state. Return-to permits same-origin application paths only and the destination still rechecks authorization.

## Verification plan

T-01/T-02: both roles, real scrypt hashes, generic bad credentials, invalid inputs/source/type/header and no-write assertions. T-03/T-04: missing/forged/exact-expired/revoked sessions, no TTL sliding, logout/replay, wrong/missing CSRF and other-device preservation. T-05: scoped list/detail, no-team student, multiple assigned teams, absent/cross-team equality and DTO allowlists. T-23: Origin/Referer/bootstrap/session rotation and no-store. T-27: browser account switch, stale request/history/expiry behavior and safe return-to.

Use dedicated disposable PostgreSQL for API/DB checks. Preserve all G1 checks and ordinary tests. Record actual browser coverage and any unverified cases. Draft PR stays Started until implementation, relevant checks and evidence are complete; peer acceptance remains pending until B reviews the actual head.
