# Feedback integration contract

Owner B for implementation; reviewer A. Issue #8 / task R1-B02 on branch `feature/s1-b-b02-feedback`, based on accepted Sprint 1 merge `78d0cca3231acf2e6d956b76aa9a9d30f7f91e36`. A correction is tracked in #60 / PR #61 on `fix/s1-a-b02-review`, preserving B head `687c568` and accepted staging `5b35fc1`. B reviews A corrections before integration. This specifies F-04 feedback creation, scoped listing, version association, and retry safety.

## Module and routes

- `createFeedbackRouter` requires Prisma, `getAuthContext`, `requireSession`, `requireSupervisor` and `requireMutation`.
- Mandatory guards pipeline for mutations:
  `requireSession → requireSupervisor → requireMutation → requireJsonBody → parseJsonBody → controller`
- Guard pipeline for reads:
  `requireSession → controller` (team scope and access verified inside `FeedbackService`).
- Declared routes (relative to `/api`):
  - `POST /submissions/:id/feedback`: `{ content, clientRequestId }`
  - `GET /submissions/:id/feedback`: returns `{ data: FeedbackDto[], meta: { serverTime } }`

## Domain and authorization rules

- **Role & Scope:** Only the assigned supervisor of the team owning the submission's milestone may write feedback. Both the assigned supervisor and members of that team may read feedback.
- **Equal 404 errors:** Out-of-scope or absent submissions return identical 404 `NOT_FOUND` envelopes with the generic message `The requested resource was not found.` to prevent leaking the existence of foreign submissions.
- **Append-only & Version-specific:** Feedback is strictly appended to an exact submission record (representing an immutable submission version); no update, delete, or floating latest-version mutation is permitted.
- **Idempotency & Retry safety (§9.5):**
  - Scope and authorization are enforced before looking up or reserving `clientRequestId`.
  - Same supervisor, same `clientRequestId`, same `submissionId`, and same trimmed `content`: returns existing record with `200 OK` without creating a duplicate row.
  - Same supervisor and same `clientRequestId` with changed `content` or different `submissionId`: returns `409 Conflict` with code `REQUEST_KEY_REUSED`.
  - Concurrent retries are protected by database unique constraint `@@unique([supervisorId, clientRequestId])`.

## Validation and DTOs

- Shared validation module (`shared/feedback.mjs`) counts Unicode code points:
  - `content`: trimmed string, 1 to 4,000 characters.
  - `clientRequestId`: valid RFC 4122 UUID.
  - `id` (submissionId): valid RFC 4122 UUID.
- Canonical DTO:
  `Feedback = { id, submissionId, supervisor: { id, displayName }, content, clientRequestId, createdAt }`
- Chronological ordering: `createdAt` ascending, then `id` ascending.

## Transaction and recovery corrections

Writes use one explicit Prisma transaction: scoped exact-submission lookup, shared team row lock, assignment/submission scope recheck, supervisor/key lookup, replay/conflict decision and insert. Reads scope and fetch the ordered DTOs inside one repeatable-read transaction. The feedback UUID unique conflict is classified before error sanitization, including the pinned PostgreSQL adapter constraint shape. Only confirmed rolled-back contention or that exact unique conflict may start another scoped transaction (at most three attempts). Unknown/commit-outcome errors remain sanitized 503; no blind technical retry.

Content rejects NUL and unpaired surrogates before PostgreSQL, while accepting 4,000 Unicode code points including astral characters. UUID input is normalized to lowercase. No deadline restriction is added to feedback on existing work.

App mounts FeedbackPanel through SubmissionDetail.renderFeedback using the exact persisted submission ID/version and current role. SessionStore supplies current CSRF, same-origin/no-store requests and stale-account/401 protection. The UI reuses shared Field/Textarea/Button and the established two-thirds work/one-third feedback layout, with a stacked narrow-screen rail.

A new save creates one UUID bound to the trimmed immutable draft. On an unknown POST result, the UI locks that draft and GETs this version's saved feedback. A matching supervisor/key/target/content confirms the existing row. A successful GET without that row allows a manual retry with the same body/key; it does not prove an in-flight POST rolled back. A failed recovery GET keeps save blocked and offers Check saved feedback. A definitive 4xx rejection allows a new edited intent; success clears the intent. No automatic mutation retry, body identity override, grade or approval action is introduced.

Ordinary npm test is database-independent. Database cases use `*.b02.ts` and the reserved test-database guard through `npm run test:b02:isolated`; retained B service tests explicitly stub actors, while A regressions use actual login/session/source/CSRF middleware and PostgreSQL. G3/G4 peer acceptance remains a separate checkpoint.
