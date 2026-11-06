# R1-B02 Verification Evidence

**Task:** R1-B02 — Implement F-04 version-specific feedback and retry safety
**Branch:** `feature/s1-b-b02-feedback` (branched from accepted `staging/sprint-1` head `78d0cca`)
**Date:** 2026-11-07
**Owner:** B — Atip Infa-udom (Atip-Infa)
**Reviewer:** A — Supapanya Yathip (zerotwobook)

---

## 1. Implemented Scope

### Backend (`server/src/modules/feedback/`)
- `dto.ts`: Canonical DTO allowlists (`FeedbackDto`, `FeedbackSupervisorDto`, `CreateFeedbackInput`).
- `service.ts`:
  - `FeedbackService.createFeedback`: Scoped team authorization (assigned supervisor only), UUID verification, trimmed content bounds (1–4,000 Unicode code points), `clientRequestId` idempotency check (200 replay vs 409 conflict), and concurrent unique-constraint race handling.
  - `FeedbackService.listFeedback`: Scoped team authorization (assigned supervisor or team student members), ordered by `createdAt` ascending then `id` ascending.
  - Identical 404 responses for absent vs out-of-scope submissions to prevent information disclosure.
- `router.ts`: Router factory `createFeedbackRouter(deps)` with mandatory fail-closed guards:
  - `POST /submissions/:id/feedback`: `requireSession → requireSupervisor → requireMutation → requireJsonBody → parseJsonBody → controller`
  - `GET /submissions/:id/feedback`: `requireSession → controller` (scope checked in domain service)

### Shared Validation (`shared/feedback.mjs`, `shared/feedback.d.mts`)
- Pure Unicode code-point counting (`countCodePoints`) and regex validation shared between client and server.

### Frontend (`client/src/features/feedback/`)
- `FeedbackPanel.tsx` and `feedback.module.css`:
  - Monochrome UI following DEC-08 and DEC-10 design system.
  - Clear submission version context.
  - Chronological feedback list with supervisor name and Asia/Bangkok datetime formatting with seconds precision (`DD MMM YYYY, HH:mm:ss (Asia/Bangkok)`).
  - Supervisor creation form with clientRequestId generation, retry preservation, and 4,000 character bound.
  - Loading, empty, saving, and error states with English copy.
  - Student read-only view.

---

## 2. Automated Test Verification

Command:
```powershell
cd Project_code
$env:NODE_ENV="test"
$env:DATABASE_URL="postgresql://fasttrack_dev:fasttrack_dev_local@127.0.0.1:5433/fasttrack_dev"
$env:TEST_DATABASE_URL="postgresql://fasttrack_test:fasttrack_test_local@127.0.0.1:5433/fasttrack_test"
npm test
```

Results:
- `client/src/features/feedback/input.test.ts`:
  - ✓ Counts Unicode code points accurately without surrogate pair splitting
  - ✓ Validates feedback content within 1 to 4000 code points
  - ✓ Validates clientRequestId as UUID
  - ✓ Validates submissionId as UUID
- `server/src/modules/feedback/feedback.test.ts`:
  - ✓ T-17: Assigned supervisor can create feedback for a team submission (201 Created)
  - ✓ T-18: Student cannot create feedback (403 Forbidden)
  - ✓ T-19: Unassigned supervisor cannot create feedback for another team submission (404 Not Found)
  - ✓ T-20: Assigned supervisor and team members can list feedback; out-of-scope users receive 404
  - ✓ T-24: Identical retry with same clientRequestId returns 200 replay without duplicate rows
  - ✓ T-24: Reusing same clientRequestId with different content returns 409 REQUEST_KEY_REUSED
  - ✓ T-24: Reusing same clientRequestId for a different submission returns 409 REQUEST_KEY_REUSED
  - ✓ Rejects empty or whitespace-only feedback content (400 Bad Request)
  - ✓ Rejects feedback content exceeding 4000 code points (400 Bad Request)
  - ✓ Rejects invalid clientRequestId UUID (400 Bad Request)
  - ✓ Rejects invalid submissionId UUID (400 Bad Request)
- Full Project Suite: **98 tests passed** across 7 test files (100%).
- TypeScript Check: **0 errors** (`npm run typecheck`).
- Client & Server Build: **PASSED** (`npm run build`).

---

## 3. Status

- **Verification:** PASSED (98/98 tests passing on PostgreSQL test database, 0 type errors, production build verified)
- **Seam Alignment:** Ready for G3 composition with A's `feature/s1-a-submissions`
- **Acceptance:** PENDING (Awaiting G3 teammate review)
