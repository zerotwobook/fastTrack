# Sprint 2 feature interfaces: F-05-F-07

Task R2-J00 / Issue #13. Author A (`zerotwobook`); peer B (`Atip-Infa`). This is a proposed implementation contract for joint review. It does not implement endpoints, certify tests, or establish joint G0 acceptance. The accepted Lab 5 contract remains [separate](sprint-2-lab-05-delivery-contract.md).

## 1. Sources and compatibility

Use [project detail](../../../Project_doc/project_detail.md) sections 5, 7.3-7.5, 9-11; [Sprint 2](../../../workflow/02_SPRINT2_LABS5-7.md) sections 6-10; and the accepted [module boundaries](sprint-1-module-boundaries.md), [auth](sprint-1-auth.md), [milestones](sprint-1-milestones.md), [first submissions](sprint-1-submissions.md) and [feedback](sprint-1-feedback.md). The proposed S2 additions below require B's current-head review before dependent implementation.

Existing source has scoped team reads, milestone creation/reads, first submissions/history reads and exact-version feedback. S2 team mutations, planning mutations, revisions and progress are not implemented by this document. Preserve S1 URLs, DTO fields, auth/session/CSRF behavior and error envelopes.

## 2. Common HTTP and data rules

- All endpoint paths below include `/api`. JSON keys are camelCase; resource IDs are UUIDs; timestamps have explicit offsets and at most millisecond precision, returned in UTC. UI displays Asia/Bangkok.
- Domain success is `{data: ...}`; domain reads also have `meta.serverTime`. Errors remain `{error:{code,message,fields}}`, with generated `X-Request-Id` in the header. Never add a competing top-level error envelope.
- Real session -> required role -> origin/CSRF protection for mutations -> media type/JSON -> strict input -> scoped resource -> domain rules -> transaction/write. Reads require a real session and DB-derived scope. Unknown body/query keys, malformed UUIDs and invalid fields return 400 `INVALID_INPUT`.
- Preserve 401 for absent/expired/revoked sessions; 403 for forbidden roles or failed source/CSRF checks; identical 404 `NOT_FOUND` for missing/foreign resources; 415 for unsupported media type; sanitized 500/503 for technical failures. Resolve scope before disclosing any resource-specific domain error.
- Accepted mutation fields are exact allowlists. Derive supervisor, author, accepted time and new version from the server. Reject authority/time/version overrides. Use the existing shared Unicode code-point, trim, timestamp and HTTP(S) URL rules; do not fetch submitted URLs.
- Every private response is `Cache-Control: no-store`. Browser state uses existing session generation checks and clears on logout/account changes. No automatic POST retry after an uncertain outcome.
- Keep existing Team, Milestone, Submission and Feedback DTOs from project-detail 9.4. `displayName` maps from stored `User.name`; stored roles are lowercase `student` / `supervisor`. Do not implement stale uppercase-role/database-column examples literally.

## 3. Ownership and integration seams

| Surface | Author/integrator | Peer / obligation |
|---|---|---|
| Team creation, rename, membership, candidate API/UI/tests (F-05A / #17) | A | B checks privacy, uniqueness and submission races. |
| Milestone edit/cancel API/UI/tests (F-05B / #18) | B | A checks role/scope, deadline and submission races. |
| Revisions/history API/UI/tests (F-06 / #20) | B | A checks first-submission compatibility, versions and feedback association. |
| Progress API/UI/calculation (F-07 / #19) | A | B compares scoped DB fixtures and latest-feedback behavior. |
| Prisma schema/migrations/seed fixtures | B integrates | A proposes changes; neither rewrites applied migrations. |
| Team/milestone lock, DB clock and confirmed-rollback contention helpers | A integrates | B reviews/reuses one interface and lock order. |
| Existing team/scope helpers, server/client route composition | A integrates | B provides owned router exports; no competing registration or scope helper. |
| Milestone/submission/feedback DTO projections and owned module exports | B for milestones/feedback/revisions; A for existing first submissions | Proposed shared changes are reviewed together before downstream use. |
| Package manifests, lockfile and application shell | A integrates after B coordination | No dependency or UI implementation change in this contract PR. |

Existing seams to reuse: `scopedTeamWhere`, `requireTeamAccess`, `requireUuid` in `server/src/modules/teams/index.ts`; `submissionDatabaseClock`, `isRolledBackContention`, `isSubmissionUniqueConflict` in `server/src/modules/submissions/service.ts`; and existing DTO allowlists. The existing submission service currently owns inline locks. A will extract reviewed internal helpers before B depends on them; this document does not claim the extraction exists.

Proposed helper semantics: acquire only authorized team rows, then authorized milestone rows; use the caller's transaction client; recheck scope after locks; read the existing millisecond DB clock after locks; retry only confirmed rolled-back contention, at most three attempts. Each implementation PR must preserve those semantics and source-compatible S1 behavior. Concrete helper signatures must be reviewed with B before extraction/consumption; no implementation imports may target a prose-only export.

## 4. Endpoint matrix for review

| Method / path | Role / accepted input | Result / owner |
|---|---|---|
| POST `/api/teams` | Supervisor; `{name}` | 201 Team; A. |
| PATCH `/api/teams/:id` | Owning supervisor; `{name}` | 200 Team; A. |
| GET `/api/students/available` | Supervisor; proposed `limit`, `after` query | 200 minimal candidate page; A. |
| POST `/api/teams/:id/members` | Owning supervisor; `{studentId}` | 200 updated Team; A. |
| DELETE `/api/teams/:id/members/:studentId` | Owning supervisor; no body | 204, no body; A. |
| PATCH `/api/milestones/:id` | Owning supervisor; `{title,description,dueAt}` | 200 existing Milestone DTO; B. |
| POST `/api/milestones/:id/cancel` | Owning supervisor; empty JSON `{}` | 200 existing Milestone DTO with `cancelledAt`; B. |
| POST `/api/milestones/:id/revisions` | Current student member; `{title,description,url,expectedVersion}` | 201 existing Submission DTO; B. |
| GET `/api/teams/:id/progress` | Assigned supervisor/current student member; no query | 200 scoped progress; A. |

PATCH operations accept the complete listed editable-field set and reject omissions/extra keys; partial-patch semantics are not inferred. JSON-body mutations require `application/json`. DELETE has no body parser, still requires origin/CSRF protection, and rejects any supplied body as 400 `INVALID_INPUT` without introducing a new media-type exception for writes with JSON bodies. Proposed endpoint/error/pagination details are awaiting peer acceptance, not an implemented API promise.

## 5. Team planning and minimal candidates (F-05A)

Team `name` is trimmed valid Unicode, 1-120 code points, rejecting null/unpaired-surrogate text. Names are not unique. Creation accepts only `{name}`, creates an empty team, and assigns `supervisorId` from the real session. Repeated create requests are separate intentions; after a timeout reload the list before another attempt. Rename changes only name and remains allowed after submissions; IDs, supervisor and membership remain unchanged.

Candidate paging proposal:

- GET `/api/students/available?limit=20&after=<uuid>`; `limit` defaults to 20 and accepts decimal integers 1-100; `after` is optional UUID. Reject repeated/unknown keys, invalid limits and malformed cursors as 400 `INVALID_INPUT`.
- Select only users with role `student` and no TeamMember row. Return only `{id,displayName}` per candidate. Order by UUID ascending using database UUID comparison; `after` is an exclusive ID bound, not a row-existence assertion.
- In one read-only repeatable-read transaction, count all eligible students before cursor/limit and fetch `limit+1` candidates after the bound. Return up to limit and expose `nextCursor` as the last returned ID only if another row exists; otherwise null. Empty pages return `data:[]` and `nextCursor:null`.
- Metadata is `{serverTime,totalAvailable,nextCursor}`; totalAvailable counts the full eligible set for that transaction, not only the page. A later page is a new snapshot: membership changes may change counts/eligibility. Refresh from the beginning after assignment/conflict; do not promise a historical cursor snapshot or silently truncate the list.
- No email, role-edit action, password, existing-team identifier or other team's history is returned. Query parameters cannot choose another supervisor or bypass eligibility.

Example candidate page (synthetic data, proposed shape):

```json
{"data":[{"id":"00000000-0000-4000-8000-000000000101","displayName":"Student One"}],"meta":{"serverTime":"2026-11-11T07:00:00.000Z","totalAvailable":1,"nextCursor":null}}
```

For add/remove: scope and lock the supervisor's team, then recheck scope and whether any submission exists for any milestone in that team. Any version locks membership, including when the requested member operation would otherwise be redundant. Return 409 `TEAM_HISTORY_LOCKED` without changing rows. Cancellation does not unlock a team that has submission history.

Add requires a valid student-role candidate; a missing/non-student candidate returns generic 400 `INVALID_INPUT` on studentId without private identity details. A candidate already assigned to this or another team returns 409 `MEMBERSHIP_CONFLICT`, with no foreign-team ID. Preserve the DB unique studentId constraint and translate only its known conflict; simultaneous assignment to two teams yields one success, one conflict, and one final membership. Do not use a read-before-insert check as the only concurrency protection.

Remove requires that studentId is currently in the authorized team; otherwise generic 404 `NOT_FOUND`. Successful remove returns 204 with no body. Never transfer membership/ownership or delete a user's submissions/feedback. Recheck student role and the history rule in the same transaction as each write. Rename/add return the canonical Team DTO; reads keep existing name/id ordering and do not adopt candidate UUID ordering accidentally.

## 6. Milestone planning (F-05B)

PATCH accepts exactly title/description/dueAt and reuses the existing shared milestone validation, field errors and DTO. Both edit and cancel derive ownership from the milestone's team, acquire team -> milestone locks and recheck scope. Error precedence after input/scope: cancelled -> any existing submission -> edit's future-dueAt rule -> write.

- Cancelled milestones return 409 `MILESTONE_CANCELLED` for further edit/cancel/submit/revise. Cancellation is terminal.
- A milestone with any submission returns 409 `MILESTONE_HISTORY_LOCKED`; preserve all content, dueAt, IDs and associations. This locks only that milestone; creating a new milestone in the same team remains allowed.
- An active/unsubmitted milestone can be edited, including after its old due date, only when the new dueAt is strictly after the DB clock read after locks. Equality/past returns 400 `INVALID_INPUT` with a dueAt field error, as in existing creation validation.
- Cancel requires `{}` and stores one server DB-clock cancelledAt. It preserves the row and history; an unsubmitted overdue milestone may be cancelled. There is no reopen, hard-delete or implicit deadline extension.
- Concurrent first submit versus edit/cancel must produce a valid serial result. If submit wins, planning is rejected for history; if cancellation wins, submit is rejected as cancelled; if edit wins, submit checks the new dueAt after acquiring locks. Never accept a stale pre-lock deadline.

Mutation responses use the existing Milestone DTO and latestSubmission projection. No new stored status, grade or approval field is introduced.

## 7. Revisions and exact-version feedback (F-06)

This section is the proposed S2 extension to the accepted F-03 first-submission contract. POST `/api/milestones/:id/submissions` continues to create only version 1; if any version exists it returns 409 `ALREADY_SUBMITTED`. Existing history/detail paths and Submission DTO remain compatible. B adds the revision route through the existing required-protection router composition rather than creating a permissive second submission router.

Revision payload accepts exactly title/description/url/expectedVersion. Validate the three content fields using the existing shared submission rules; expectedVersion must be a JSON integer from 1 through 2147483647, matching the existing PostgreSQL Int column, never a numeric string. A latest version at 2147483647 returns 409 `VERSION_LIMIT_REACHED` without insert after the expectedVersion comparison; out-of-range input is 400 `INVALID_INPUT`. Author, acceptedAt and new version are server-derived.

Inside one transaction/client: scoped milestone lookup -> team lock -> milestone lock -> membership/scope recheck -> cancelled check -> latest submission query -> expectedVersion comparison -> version-capacity check -> DB acceptedAt -> deadline check -> insert latest+1. Domain precedence is 409 `MILESTONE_CANCELLED`, then 409 `SUBMISSION_REQUIRED` if no version exists, then 409 `VERSION_CONFLICT` if stale, then 409 `DEADLINE_PASSED` when acceptedAt > dueAt. Do not reveal these errors for a foreign milestone.

Concurrent requests with the same expectedVersion produce exactly one 201 with latest+1 and one 409 `VERSION_CONFLICT`; keep unique(milestoneId,version) as the final guard. Translate a known version-unique conflict to VERSION_CONFLICT, preserve rollback, and do not retry that business conflict as a new intent. Only confirmed rolled-back technical contention gets the common bounded transaction retry with all scope/rules/time reread. Unknown commit outcomes are not automatically retried.

All prior Submission rows and Feedback.submissionId values are immutable. Feedback may still be added to an old version by the assigned supervisor, including after the deadline. Milestone latestSubmission.feedbackCount and derived status use only the highest-version submission's feedback. New revision does not transfer old feedback, overwrite an older submission or increase the count of submitted milestones.

History stays descending version with deterministic ID tie-break; exact detail stays by submission ID. After stale error preserve the draft in memory, reload history and require the user to review the latest version before another intent. After timeout inspect history/author/time; a matching version number or content alone is not proof that the caller's request succeeded. Never auto-increment expectedVersion in the browser or auto-repeat a revision POST.

## 8. Progress projection and shared calculation (F-07)

GET `/api/teams/:id/progress` returns `{data:{teamId,asOf,total,submitted,progressPercent,milestones},meta:{serverTime}}`. Scope the team from the real session and read its milestones, highest-version submissions and exact latest feedback counts in one read-only repeatable-read transaction. Read the DB clock as asOf in the same operation; meta.serverTime equals asOf. Neither field is a historical snapshot token. A refreshed request may observe new data.

Each milestones item is the existing Milestone DTO plus `status`, ordered by dueAt then id. Include cancelled items to explain history, but exclude them from numerator and denominator. Read all scoped rows for this course-sized S2 view without silent limits; any future pagination must version items/count semantics first. Derive per-item status once, in this order:

| Condition | Status |
|---|---|
| cancelledAt is non-null | CANCELLED |
| Latest submission exists and its feedbackCount > 0 | FEEDBACK_AVAILABLE |
| Latest submission exists without latest-version feedback | SUBMITTED |
| No submission and asOf > dueAt | OVERDUE |
| Otherwise, including equality at dueAt | PENDING |

`total` is the count of non-cancelled milestones; `submitted` is the count in that set with any submission, regardless of version count. `progressPercent = total === 0 ? 0 : Math.round(submitted * 1000 / total) / 10`. Return a JSON number and display one decimal place in the UI. Feedback is not a grade; revisions do not increase completion. The progress API has no status/team-filter query in this version.

Example aggregate (synthetic empty team):

```json
{"data":{"teamId":"00000000-0000-4000-8000-000000000001","asOf":"2026-11-11T07:00:00.000Z","total":0,"submitted":0,"progressPercent":0,"milestones":[]},"meta":{"serverTime":"2026-11-11T07:00:00.000Z"}}
```

Proposed A-owned pure export `calculateProgress(milestones, asOf)` in `server/src/modules/progress/calculation.ts`: input readonly canonical Milestone DTOs and a valid Date from the server; output `{total,submitted,progressPercent,milestones}` with derived statuses. It performs no I/O, takes no actor/browser authority, does not call its own clock and does not mutate input. The authenticated service owns snapshot/scoping and serialization of teamId/asOf/meta. S3 must reuse the calculation/status semantics; weighted cross-team completion uses sum(submitted)/sum(total), not the mean of team percentages.

## 9. Concrete transaction seams and schema upgrade

The following are proposed A-owned exports for `server/src/modules/shared/transactions.ts`; none exists merely because it appears here:

```ts
type Actor = Pick<AuthContext, 'userId' | 'role'>;
type LockedTeam = Readonly<{ id: string }>;
type LockedMilestone = Readonly<{ id: string; teamId: string; dueAt: Date; cancelledAt: Date | null }>;
lockScopedTeam(tx: Prisma.TransactionClient, actor: Actor, teamId: string): Promise<LockedTeam>;
lockScopedMilestone(tx: Prisma.TransactionClient, actor: Actor, teamId: string, milestoneId: string): Promise<LockedMilestone>;
readDatabaseTimeMs(tx: Prisma.TransactionClient): Promise<Date>;
runDomainTransaction<T>(prisma: PrismaClient, operation: (tx: Prisma.TransactionClient) => Promise<T>): Promise<T>;
```

These are interface notation, not standalone executable TypeScript. lockScopedMilestone requires the caller to hold the same team's lock first, locks only the identified scoped milestone, and rechecks current DB scope. Neither helper nests transactions or commits independently. readDatabaseTimeMs preserves the accepted submissionDatabaseClock implementation. runDomainTransaction uses the existing 5000 ms acquisition wait / 10000 ms transaction timeout and at most three attempts for confirmed rollback contention only; exhausted/unknown technical outcomes map to sanitized 503 TEMPORARILY_UNAVAILABLE. Domain AppError values pass through unchanged. Separate domain code supplies known constraint-to-domain mapping.

A first reviews an S1-compatible helper extraction with B, including the existing real lock-wait/clock/duplicate tests, before either owner consumes the new path. Required helper dependencies cannot have production allow-all or injected HTTP-clock fallbacks. A continues owning the existing first-submission module; B implements revisions against the accepted seam.

Existing schema already contains Team/TeamMember, Milestone.cancelledAt, Submission.version and unique(milestoneId,version), and exact Feedback.submissionId. Do not assume a new migration is required to implement routes. B audits indexes/checks against actual migrations; any required change is additive in a new migration, peer reviewed before use. Never rewrite applied S1/Lab 5 migrations, move feedback to latest, reset passwords or reseed on startup. Verify fresh DB plus upgrade from a disposable S1 database copy, retaining original IDs, membership, version 1, feedback FKs and session/password data. Cleanup-capable fixtures use the existing isolated test guard and never the Cloud database.

## 10. Acceptance criteria and planned verification

The scenarios below are test designs, all NOT RUN for S2. They are not additional passing tests, implemented features or a replacement for independent peer acceptance. For every case retain actual command, source commit, fixture/role, expected/actual result, row/readback assertions and failures when implemented. Use real session middleware and real isolated PostgreSQL for scope, locks and constraints.

| AC | Requirement / planned cases | Acceptance |
|---|---|---|
| S2-AC-01 | FR-06, BR-01/02/03/08; STS-01..04 | Server-owned empty-team creation/rename with exact validation and scoped privacy. |
| S2-AC-02 | FR-06, BR-01/02/09; STS-05..09 | Minimal candidate paging and atomic, history-safe membership. |
| S2-AC-03 | FR-07, BR-02/04/08/09; STS-10..14 | Edit/cancel follows clock, terminal state and first-submit serialization. |
| S2-AC-04 | FR-08, BR-04/05/06/08; STS-15..19 | Revisions append one atomic version and preserve first-submit behavior. |
| S2-AC-05 | FR-08, BR-02/06/07; STS-20..22 | Exact-version history/feedback/privacy and honest timeout/conflict recovery. |
| S2-AC-06 | FR-09, BR-02/10; STS-23..27 | Snapshot-scoped progress/status/formula, including zero/cancelled/latest feedback. |
| S2-AC-07 | NFR-01/02/03/04/05; STS-28..31 | Safe auth/errors/cache, compatible schema, source-preserving S1 regression and usable UI. |
| S2-AC-08 | Shared ownership and handoff; STS-32 | Reviewed helpers, shared exports and real cross-owner integration before acceptance. |

| Scenario | Owner | Fixture / expected assertions |
|---|---|---|
| STS-01 | A | Supervisor creates an empty team: 201, session supervisor ID, zero membership rows; supervisorId/body authority rejected. |
| STS-02 | A | Rename after existing submission: 200 name-only change; original IDs, ownership, membership and history unchanged. |
| STS-03 | A | Anonymous 401, student mutation 403, foreign/missing team identical 404; no foreign name or existence disclosure. |
| STS-04 | A | Team name blank/min/max/over-max, valid escaped Unicode, null/surrogate and extra-field cases; no-write on 400. |
| STS-05 | A | Candidate pages with tied names: UUID order, default/max limit, full-set count, nextCursor/end/empty and no email/team fields. |
| STS-06 | A | Invalid/repeated/unknown query, malformed after and invalid-role/missing candidate: safe 400; student candidate GET denied. |
| STS-07 | A | Add unassigned student then remove: correct Team/204 and row readback; duplicate/cross-team add 409, absent member 404. |
| STS-08 | A | Barrier-synchronized two-team assignment: exactly one 200, one 409 and one membership row; no partial/orphan writes. |
| STS-09 | A+B | Membership add/remove versus first submission, both lock orders; valid serial outcome, history lock persists and no ownership shift. |
| STS-10 | B | Active unsubmitted milestone edit retains ID/team/createdAt; complete field validation and future dueAt after locks. |
| STS-11 | B | Edit/cancel after any submission 409; original values/history intact; creating another milestone still succeeds. |
| STS-12 | B | Cancel active/overdue-unsubmitted once: stored cancelledAt and retained row; later edit/cancel/first-submit/revise 409. |
| STS-13 | B | DueAt before/equal/after DB clock by 1 ms, offset/precision/Unicode boundaries; stored precision and no-write rejection. |
| STS-14 | B+A | Barrier-synchronized edit/cancel versus first submit, both orders; submit rechecks changed dueAt and valid final state. |
| STS-15 | B | First submit 201 version 1; revision without base 409; first-submit endpoint with any existing version ALREADY_SUBMITTED. |
| STS-16 | B | Sequential revisions expectedVersion 1 then 2 create versions 2 then 3 with exact actor/DB time and immutable older rows. |
| STS-17 | B | Stale/same-expectedVersion concurrent revisions: one new row, one VERSION_CONFLICT; schema uniqueness remains enforced. |
| STS-18 | B | Revision before/equal/after due by 1 ms and lock wait crossing due; checked/stored acceptedAt identical; no late insert. |
| STS-19 | B | Revision content/URL/identity/expectedVersion validation, integer/column limit and error precedence; no SSRF/content normalization. |
| STS-20 | B | Feedback on version 1 then create version 2: old FK/content preserved; latest feedbackCount zero until version 2 feedback exists. |
| STS-21 | B | Version list ordering, exact-ID detail, old-version feedback after due, two supervisors/students: correct scope and no private leak. |
| STS-22 | B | Real UI conflict/unknown-outcome flow: draft retained, saved history inspected, explicit resubmission; no automatic increment/POST retry. |
| STS-23 | A | Five milestones, one cancelled, three of remaining submitted: total 4, submitted 3, progressPercent 75; revision does not change numerator. |
| STS-24 | A | Empty/all-cancelled teams: total/submitted/percent zero; cancelled rows stay visible with CANCELLED status. |
| STS-25 | A | Each status precedence, old versus latest feedback, exact due equality and +1 ms; one supplied asOf drives all statuses. |
| STS-26 | A | Real DB snapshot with a concurrent new submission/feedback: counts/DTOs/statuses from one snapshot and equal asOf/meta. |
| STS-27 | A | Student sees own team, supervisor assigned teams, foreign/missing equal 404; pure calculation agrees with DB/API, including 1/1 plus 0/9 weighted 10%. |
| STS-28 | A+B | All new routes: real cookie/session, expired/revoked, CSRF/origin/JSON/parser order, invalid UUIDs, safe errors/no-store and account-switch clearing. |
| STS-29 | B | Fresh migrations and upgrade of disposable S1 copy: original submission/feedback/member/session/password records survive; repeated explicit seed does not reset history. |
| STS-30 | A+B | Existing S1 auth/milestone/first-submit/feedback regression plus real clock/lock/constraint failures; retry only confirmed rollback, safe 503 after bound. |
| STS-31 | A+B | Owned UI happy/error/empty/locked/conflict states, keyboard/focus, mobile/200% zoom, English copy and source-backed browser/API/DB agreement. |
| STS-32 | A+B | B exercises A's team/progress and A exercises B's planning/revisions on the same integrated commit; record actual gates and unresolved findings. |

Definition of Done for each feature: accepted contract revision and required predecessor gate; owned UI/API/meaningful unit/API-DB/browser cases; guarded fresh/upgrade fixtures where affected; S1 regression; current relevant CI; safe source/setup evidence; actual non-author review and integration. Preparation fixtures/mocks do not accept integrated G3 or certify deployed behavior. Keep actual test counts/results separate from these 32 planned scenarios.

## 11. Gate sequence and explicit peer decisions

1. B reviews this exact proposed contract, especially candidate count/cursor semantics, complete-field PATCH, no-body DELETE, conflict/error precedence and shared helper signatures. Record actual head/decision and corrections. A resolves its authored proposal; no author self-approval.
2. Jointly accept the feature-specific interface checkpoint and shared ownership before #17/#18 dependent implementation. Overall #13 closure separately requires the external/baseline evidence in the closure handoff; a partial checkpoint must state its limits.
3. A integrates reviewed helper extraction first; B integrates necessary additive schema/migrations before dependent routes. A/#17 and B/#18 then work on separate branches/clones. Keep unfinished feature commits out of the initial Lab 5 main-release candidate.
4. After accepted #17/#18 and shared DTOs, A prepares #19 progress while B implements #20 revisions. Preparation fixtures can run independently, but #21 acceptance needs the real integrated system and STS-32.
5. Every main-targeted candidate remains Draft until the user reviews/authorizes the concrete head/base under the existing main-release gate. This staging contract does not authorize Cloud mutations, main release, UAT/TA messages or lab submission.
