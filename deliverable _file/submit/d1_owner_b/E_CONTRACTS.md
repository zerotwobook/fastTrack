# Part E - Sprint 1 Engineering Contracts and Specifications

Original assembler: B (Atip Infa-udom / 67070503446), using both owners' feature contracts. Authorized review corrections: A / Codex, #64 / PR #65; B reviews these corrections. Application baseline: accepted staging `fe65b1962e2c62bf5a11a96e3fb536da9e3e98bc`. Final tested executable source: `e1ada71112cdfc0f9ddd985a3e49e82c8638c4a1`.

This is an implemented-contract compilation, not a claim that this new document existed before implementation. The pre-implementation baseline and accepted feature-contract history remain unchanged. [The original D1 baseline](../project_deliverable_1.md), [accepted current coverage](../../../Project_code/docs/evidence/R1-J03-coverage.md) and the source contracts below retain that chronology. G5/main/final PDF remain pending under R1-J04 / #12.

## E.0 Shared boundaries and DTOs

All routes below are under `/api`. Requests derive user/role from the DB-backed session, never a body/header identity. Domain writes run session -> required role -> source/CSRF -> JSON type/parser -> strict input -> scope/transaction/rule -> write. Login has its separate source/bootstrap guard; logout checks source and requires CSRF only for a valid session. Reads require a session and scope. Foreign/missing records share a generic 404; invalid identifiers may return 400 first. Student writes prohibited by role return 403 before resource scope is disclosed.

Successful JSON responses use `{data}`. Team, milestone, submission and feedback GETs add `meta: {serverTime}`; login/me return `{data:{user,csrfToken}}`. Logout is 204 with no body. Errors use `{error:{code,message,fields}}`; fields is a field-message object, possibly empty. `X-Request-Id` is a response header, not a request identity or body authority. Auth/private responses are `Cache-Control: no-store`.

Generated entity IDs are UUIDs. Generic team/resource checks and feedback UUID validation do not all enforce UUID v4; feedback payload validators accept RFC UUID versions 1-5 with valid variant bits and normalize to lowercase. The browser generates v4 request keys. Do not claim a stricter validator than the code implements. Response timestamps are UTC ISO strings with millisecond precision; UI displays Asia/Bangkok including seconds.

The exact allowlisted DTO shapes are:

```typescript
type Person = { id: string; displayName: string };
type AuthUser = Person & { role: 'student' | 'supervisor' };
type SessionData = { user: AuthUser; csrfToken: string };
type Team = { id: string; name: string; supervisor: Person; members: Person[] };
type LatestSubmission = { id: string; version: number; submittedAt: string; feedbackCount: number };
type Milestone = { id: string; teamId: string; title: string; description: string;
  dueAt: string; cancelledAt: string | null; createdAt: string;
  latestSubmission: LatestSubmission | null };
type Submission = { id: string; milestoneId: string; submittedBy: Person; version: number;
  title: string; description: string; url: string; submittedAt: string };
type Feedback = { id: string; submissionId: string; supervisor: Person;
  content: string; clientRequestId: string; createdAt: string };
```

Passwords/hashes, raw authentication tokens, email rosters, internal timestamps/relations and SQL diagnostics are not extra DTO properties. The CSRF token in SessionData is deliberate; the authentication token stays in its HttpOnly cookie.

## E.1 F-01 - Authentication and scoped team context

Owner A, reviewer B. FR-01/02, BR-01/02 and NFR-01/02/05. Source: [auth contract](../../../Project_code/docs/contracts/sprint-1-auth.md). The actual schema is the initial `20261106094006_init_sprint1_schema` plus applicable G1 corrections/canonical bounds from C.2; there is no separate feature-named auth migration.

| Method / route | Input and guard | Success | Relevant failures |
|---|---|---|---|
| POST /auth/login | Source plus X-fastTrack-Request: 1, JSON `{email,password}` only | 200 SessionData; host-only HttpOnly SameSite=Lax cookie, Secure for HTTPS, absolute Expires | 400 INVALID_INPUT; 401 INVALID_CREDENTIALS; 403 FORBIDDEN; 415 UNSUPPORTED_MEDIA_TYPE; safe 503 |
| GET /auth/me | Valid unrevoked/unexpired cookie session | 200 SessionData; no TTL sliding | 401 UNAUTHENTICATED; safe 503 |
| POST /auth/logout | Source; matching X-CSRF-Token if a valid session exists | 204; revoke only this session and clear cookie; no-session also 204 after source check | 403 FORBIDDEN; safe 503 |
| GET /teams | Session; query only own/supervised teams, stable name/id order | 200 Team[] and meta.serverTime; no-team student gets [] | 401; safe 503 |
| GET /teams/:id | Session, valid UUID, scope | 200 Team and meta.serverTime | 400 invalid ID; 401; equal missing/foreign 404; safe 503 |

Email is trimmed/lowercased for lookup. Empty/non-string/missing credentials or unknown keys return 400; unknown email and wrong password share a 401 and create no session. Re-login rotates session/CSRF and revokes the browser's previous cookie session. Keep the seed-compatible scrypt format and session source/CSRF/cache behavior in C.3.

| AC | Observable acceptance |
|---|---|
| AC-01.1 | Both roles authenticate to the correct allowlisted identity/session without password/hash/raw authentication token in JSON. |
| AC-01.2 | Unknown email/wrong password share 401 with no session; empty/invalid payload returns 400 and UI recovery. |
| AC-01.3 | Missing, forged, exactly expired or revoked sessions receive 401 with no private data. |
| AC-01.4 | Logout revokes/clears the current session; old-cookie replay fails; authenticated bad-CSRF mutation cannot write. |
| AC-01.5 | Team list/detail obey scope; no-team list is empty, cross-team detail is 404, seed/membership retain one-team-per-student. |

Feature DoD: T-01-T-05, T-23/T-27, real session/hash/scoped queries, UI login/logout/account-switch evidence and peer review of the actual implementation. Accepted feature merge is #54 / 0b99a28; later integration verification is separately recorded.

## E.2 F-02 - Team milestones

Original owner B; A repaired findings, B reviewed #56. FR-03, BR-02/03/08, NFR-02/05. Source: [milestone contract](../../../Project_code/docs/contracts/sprint-1-milestones.md). Schema: actual initial migration plus G1 corrections and canonical bounds; no `20261105010000_milestones` file is required or asserted.

| Method / route | Input and guard | Success | Relevant failures |
|---|---|---|---|
| POST /teams/:teamId/milestones | Assigned supervisor/session/source/CSRF; `{title,description,dueAt}` only | 201 Milestone | 400 INVALID_INPUT; 401; role/source/CSRF 403; foreign team 404; 415; safe 503 |
| GET /teams/:teamId/milestones | Scoped session | 200 Milestone[] plus meta.serverTime; dueAt/id ascending | 400 invalid ID; 401; foreign/missing 404; safe 503 |
| GET /milestones/:id | Scoped session | 200 Milestone plus meta.serverTime | Same protected-read failures |

Title 1-120 and description 1-4,000 trimmed Unicode code points are required. dueAt must be a real calendar instant with an explicit zone and supported millisecond precision. Creation locks/rechecks the assigned team and requires dueAt strictly after the DB wall clock read after waiting for that lock. Unknown/forged properties fail with field/form messages before writes. LatestSubmission is null or the actual highest-version record and its feedback count, scoped consistently in list/detail reads.

| AC | Observable acceptance |
|---|---|
| AC-02.1 | Assigned supervisor creates; subsequent scoped list/detail reads match persisted title/description/team/deadline. |
| AC-02.2 | Student create 403; foreign supervisor create/read 404; anonymous 401; no unauthorized write. |
| AC-02.3 | Empty/oversized text, invalid calendar/zone/precision or nonfuture dueAt return 400 with UI field recovery and no new row. |

Feature DoD: T-06-T-08/T-25, actual API/DB create/read/no-write negatives, Bangkok conversion and shared UI. Accepted corrected merge #56 / 78d0cca; delegated G2 evidence remains attributable to the user's explicit delegation.

## E.3 F-03 - First submission and deadline serialization

Owner A, reviewer B. FR-04, BR-02/03/04/05/08 and NFR-02/03/05. Source: [submission contract](../../../Project_code/docs/contracts/sprint-1-submissions.md). Schema: initial migration, `20261106094101_add_version_check_constraint`, G1 corrections and canonical bounds; the unique(milestoneId,version) and version>=1 constraints protect history.

| Method / route | Input and guard | Success | Relevant failures |
|---|---|---|---|
| POST /milestones/:id/submissions | Student/session/source/CSRF, scoped milestone; `{title,description,url}` only | 201 Submission, version 1, server-selected author/accepted timestamp | 400 INVALID_INPUT; 401; role/source/CSRF 403; foreign/missing 404; 409 MILESTONE_CANCELLED / ALREADY_SUBMITTED / DEADLINE_PASSED; 415; safe 503 |
| GET /milestones/:id/submissions | Scoped session | 200 Submission[] plus meta.serverTime; version descending | 400 invalid ID; 401; equal missing/foreign 404; safe 503 |
| GET /submissions/:id | Scoped session | 200 Submission plus meta.serverTime | Same protected-read failures |

Trimmed Unicode bounds: title 1-120, description 1-4,000, URL 1-2,048 code points. URL must be absolute HTTP(S), have a hostname and no embedded credentials. The server does not fetch it. Reject unknown/system identity/version/time properties. Scope -> team lock -> milestone lock -> scope recheck -> cancellation -> existing version -> single DB wall-clock read -> deadline -> insert occurs in one transaction. Accept acceptedAt<=dueAt and persist that same value; a late first attempt never writes. Only confirmed rolled-back contention can retry, at most three attempts. No HTTP clock override exists.

| AC | Observable acceptance |
|---|---|
| AC-03.1 | A student member submits valid work as version 1; new scoped API/UI reads match DB content/author/time. |
| AC-03.2 | Before/equal deadline accepted; +1ms rejected with 409 DEADLINE_PASSED/no write; equivalent timezone instants behave identically. |
| AC-03.3 | Duplicate or concurrent first submissions preserve exactly one version 1; other attempt returns 409 ALREADY_SUBMITTED without overwrite, including after dueAt. |
| AC-03.4 | Invalid/oversized/empty fields, unsafe URL or forged authority return 400 without partial writes. |
| AC-03.5 | Foreign student reads/writes are 404, supervisor submission is 403, anonymous is 401. Protected read scope applies to either role. |
| AC-03.6 | Actual process restart with the same DB preserves saved submission/session and subsequent API/UI reads. |

Feature DoD: T-09-T-16/T-25/T-26/T-31 local, meaningful deadline RED/GREEN, concurrency/lock/no-write/precision assertions and compiled restart/UI evidence. Accepted merge #57 / 3365a36; the older A03 partial UI-after-restart snapshot is supplemented by current J03 evidence, not silently rewritten.

## E.4 F-04 - Exact-version feedback and retry safety

Original owner B; A repaired #60/#61, B reviewed/merged. FR-05, BR-02/03/06/07/08 and NFR-02/03/05. Source: [feedback contract](../../../Project_code/docs/contracts/sprint-1-feedback.md). Actual initial migration plus G1 corrections/bounds includes the exact-submission FK and unique(supervisorId,clientRequestId); no separate fictional feedback migration.

| Method / route | Input and guard | Success | Relevant failures |
|---|---|---|---|
| POST /submissions/:id/feedback | Assigned supervisor/session/source/CSRF; `{content,clientRequestId}` only | 201 Feedback for new intent, 200 exact replay | 400 INVALID_INPUT; 401; role/source/CSRF 403; foreign/missing 404; 409 REQUEST_KEY_REUSED; 415; safe 503 |
| GET /submissions/:id/feedback | Scoped student/supervisor session | 200 Feedback[] plus meta.serverTime; createdAt/id ascending | 400 invalid ID; 401; equal missing/foreign 404; safe 503 |

Content is required trimmed Unicode text, 1-4,000 code points, rejecting NUL/unpaired surrogates. clientRequestId is a required valid normalized UUID; reject extra identity/target/time fields. Feedback remains append-only on one exact submission ID/version, even after its deadline. Same supervisor/key/target/trimmed body replays the original row; changed target or content conflicts. Scope is checked before the key lookup. C.5 describes the bounded, classified rollback retry and frozen client intent/reconciliation; there is no Idempotency-Key header or automatic POST retry.

| AC | Observable acceptance |
|---|---|
| AC-04.1 | Assigned supervisor appends; scoped readers see correct content/submissionId/version with no cross-target mixing. |
| AC-04.2 | Students cannot write (403); foreign readers/foreign supervisor writer get 404, anonymous gets 401; no unauthorized row or key oracle. |
| AC-04.3 | Empty/oversized/invalid-Unicode content, missing/invalid key or forged fields return 400; missing target 404; no new row. |
| AC-04.4 | Multiple entries retain association and stable order; actual process restart preserves their API/UI readback. |

Feature DoD: T-17-T-20/T-24/T-25/T-31 local; real source/CSRF/scope, no-write and concurrency/replay assertions; access excerpt; UI recovery; actual corrected-head peer review. Accepted #61 merge 514f34c and later J03/G3/G4 acceptance remain distinct facts.

## E.5 Sprint 1 acceptance extensions

| ID | Feature / planned check | Required behavior |
|---|---|---|
| S1-AC-EXT-01 | F-01 / T-23 | Login source/bootstrap guard, fresh rotated tokens, me restoration and no-write CSRF denial. |
| S1-AC-EXT-02 | F-04 / T-24 | Same-key/same-target/body replay 200 even concurrently; changed intent 409; scope before key lookup. |
| S1-AC-EXT-03 | F-02-F-04 / T-25 | Scoped list/detail latestSubmission and exact-version feedbackCount, null when empty, serverTime; real UI projection. |
| S1-AC-EXT-04 | F-03 / T-26 | Read DB clock after locks once; checked/stored instant identical; late first no-write, duplicate-after-due remains ALREADY_SUBMITTED. |
| S1-AC-EXT-05 | F-01 / T-27 | Purge private cache and stale requests on logout/account switch/401; no old-account flash; expired-cookie replay denied; external returnTo stays local. |

## E.6 Software test specification and actual execution

The planned stimuli/expected assertions are retained in baseline D1 E.5 (T-01-T-27 plus T-31 local) and each source contract above. The nine B-owned AC rows have [a resolvable exact test map](verification_map.json); the full current map covers all 18 feature ACs, five extensions and shared targets. Do not substitute this run summary for the individual test specifications.

The following **reuses A/Codex's finalized J03 clean-clone run**, Node 26.13.0/npm 11.20.0, pinned PostgreSQL 16.8. This table retains that historical run identity rather than relabeling it as B-owned. The separate fresh 310-case setup reproduction performed by A/Codex during #64 is documented in Part F and setup_reproduction.json with its own times/source. Ordinary tests do not require PostgreSQL; the isolated groups do.

| Group / selector | Cases passed | Scope |
|---|---:|---|
| npm test / ordinary *.test.ts files | 120 | Pure validation, config, HTTP envelope/logging and client state; seven files, no external DB required. |
| test:g1 / foundation.g1.ts and foundation-safety.g1.ts | 38 | DB constraints, guarded targets, add-only seed and foundation safety. |
| test:auth / sessions.auth.ts | 28 | Real session/hash/source/CSRF/scoped team lifecycle; browser account-switch evidence is separately attributed. |
| test:b01 / milestones-review.b01.ts and milestones.b01.ts | 33 | 26 real-session regressions plus seven retained explicit-actor service cases. |
| test:a02 / submissions.a02.ts | 48 | Deadline boundaries, locks/no-write, scope, duplicates, compiled process restart. |
| test:b02 / feedback-review.b02.ts and feedback.b02.ts | 42 | 29 real-session/transaction cases plus 13 retained explicit-actor service cases. |
| test:j03 / integrated-s1.j03.ts | 1 | Actual compiled HTTP cross-feature journey, all-table seed fingerprint and restart/session persistence. |
| **Total cases** | **310** | **0 failed; cases are not a coverage percentage.** |
| Migration scenarios, separately counted | 7 | Upgrade success and expected invalid-legacy-data rejection with history/data preservation. |

See [actual finalized report](../../../Project_code/docs/evidence/R1-J03-results.json), [verification narrative](../../../Project_code/docs/evidence/R1-J03-system-verification.md), and [Part F](F_B_VERIFICATION.md) for exact names, sources, chronology and manual/browser limits. B's recorded independent #61/#62 review checks are separate from this retained full run.

## E.7 Definition of Done and release boundary

The accepted engineering increment has actual feature peer reviews, DB constraints/migrations, source/CSRF/scope protection, automated regression and selected actual browser/restart evidence. Typing and build passed in the attributed J03 run; this correction does not claim new app tests merely because text changed.

The **D1 release DoD is still pending**: corrected source package needs B review of A's repairs; both owners' A-F content must be assembled into one self-contained English PDF with navigation/readable figures; exact candidate/tag and contributions/AI-use/limits must match; both real G5 decisions and the final pre-main review/user notification in #12 must occur. PDF assembly/review feeds G5; it is not deferred until after G5 acceptance. No main release or submission is accepted by this source-package PR.
