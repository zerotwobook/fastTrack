# R1-B02 Verification Evidence

**Task:** R1-B02 — Implement F-04 version-specific feedback and retry safety
**Branch:** `feature/s1-b-b02-feedback` (branched from accepted `staging/sprint-1` head `78d0cca`)
**Date:** 2026-11-07
**Owner:** B — Atip Infa-udom (Atip-Infa)
**Reviewer:** A — Supapanya Yathip (zerotwobook)

---

## 1. Implemented Scope

### Backend (`server/src/modules/feedback/`)
- `dto.ts`: Canonical DTO allowlists (`FeedbackDto`, `CreateFeedbackInput`).
- `service.ts`:
  - `FeedbackService.createFeedback`: Scoped team authorization (assigned supervisor only), UUID verification, trimmed content bounds (1–4,000 characters), `clientRequestId` idempotency check (200 replay vs 409 conflict).
  - `FeedbackService.listFeedback`: Scoped team authorization (assigned supervisor or team student members), ordered by `createdAt` ascending then `id` ascending.
- `router.ts`: Router factory `createFeedbackRouter(deps)` with mandatory fail-closed guards:
  - `POST /submissions/:id/feedback`
  - `GET /submissions/:id/feedback`

### Shared Validation (`shared/feedback.mjs`, `shared/feedback.d.mts`)
- Pure Unicode code-point counting and regex validation shared between client and server.

### Frontend (`client/src/features/feedback/`)
- `FeedbackPanel.tsx` and `feedback.module.css`:
  - Monochrome UI following DEC-08 and DEC-10 design system.
  - Clear submission version context.
  - Chronological feedback list with supervisor name and Asia/Bangkok datetime formatting.
  - Supervisor creation form with clientRequestId generation, retry preservation, and 4,000 character bound.
  - Loading, empty, saving, and error states with English copy.

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

Verification status: NOT RUN (Initial contract setup)
Acceptance status: PENDING
