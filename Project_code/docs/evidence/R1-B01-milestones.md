# R1-B01 Verification Evidence

**Task:** R1-B01 — Implement F-02 milestone creation, listing and details
**Branch:** `feature/s1-b-b01-milestones` (branched fresh from latest `staging/sprint-1` head `ff5975c`)
**Date:** 2026-11-06
**Owner:** B — Atip Infa-udom (Atip-Infa)
**Reviewer:** A — Supapanya Yathip (zerotwobook)

---

## 1. Implemented Scope

### Backend (`server/src/modules/milestones/`)
- `dto.ts`: Frozen DTO allowlists (`MilestoneDto`, `LatestSubmissionSummary`, `CreateMilestoneInput`).
- `service.ts`:
  - `MilestoneService.createMilestone`: Scoped team authorization (assigned supervisor only), valid UUID verification, title bounds (1–120 chars per canonical schema), description bound (<= 2000 chars), future `dueAt` check with mandatory ISO 8601 timezone offset format.
  - `MilestoneService.listMilestones`: Scoped team authorization, batch join for `latestSubmission` and `feedbackCount` (preventing N+1 queries), ordered by `dueAt` ascending then `id` ascending.
  - `MilestoneService.getMilestone`: Scoped single milestone detail with latest submission projection.
- `router.ts`: Router factory `createMilestoneRouter(deps)` exposing:
  - `POST /teams/:teamId/milestones`
  - `GET /teams/:teamId/milestones`
  - `GET /milestones/:id`

### Frontend (`client/src/features/milestones/`)
- `MilestoneTrack.tsx` and `milestones.module.css`:
  - Monochrome UI following DEC-08 and DEC-10 design system.
  - Milestone timeline with Asia/Bangkok datetime formatting with seconds precision (`DD MMM YYYY, HH:mm:ss (Asia/Bangkok)`).
  - Role-scoped creation form for assigned supervisors.
  - Status indicators using `StatusBadge` (Pending, Submitted, Overdue, Feedback available).
  - Handles loading, empty, and validation error states cleanly.

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
- `server/src/modules/milestones/milestones.test.ts`:
  - ✓ T-05: Assigned supervisor can create a milestone with future dueAt (201 Created)
  - ✓ T-06: Student cannot create a milestone (403 Forbidden)
  - ✓ T-07: Unassigned supervisor cannot create milestone for another team (404 Not Found)
  - ✓ Rejects milestone with past dueAt (400 Bad Request)
  - ✓ Rejects milestone title exceeding canonical bound of 120 chars (400 Bad Request)
  - ✓ T-08: Student can list milestones for their assigned team (200 OK)
  - ✓ Student cannot list milestones of an unassigned team (404 Not Found)
- Full Project Suite: **58 tests passed** across 4 test files (100%).
- TypeScript Check: **0 errors** (`npm run typecheck`).
- Client & Server Build: **PASSED** (`npm run build`).

---

## 3. Status

- **Verification:** PASSED (58/58 tests passing on PostgreSQL test database)
- **Acceptance:** PENDING (Awaiting G2 teammate review)
