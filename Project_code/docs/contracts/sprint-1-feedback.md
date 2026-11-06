# Feedback integration contract

Owner B for implementation; reviewer A. Issue #8 / task R1-B02 on branch `feature/s1-b-b02-feedback`, based on accepted Sprint 1 merge `78d0cca3231acf2e6d956b76aa9a9d30f7f91e36`. This specifies F-04 feedback creation, scoped listing, version association, and retry safety.

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
- **Equal 404 errors:** Out-of-scope or absent submissions return identical 404 `NOT_FOUND` envelopes (`{ error: { code: 'NOT_FOUND', message: 'Submission not found.', fields: {} } }`) to prevent leaking the existence of foreign submissions.
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
