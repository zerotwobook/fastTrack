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
