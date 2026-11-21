# R3-B02 Sprint 2 Demo & Role/Ownership Verification Log

**Target tag and commit:** [`v1.0.0-sprint-2`](https://github.com/zerotwobook/fastTrack/tree/v1.0.0-sprint-2) at `f3ff8d9704c6e2a3705805412f538b2b216569ad`
**Task / Issue:** `R3-B02` ([Issue #32](https://github.com/zerotwobook/fastTrack/issues/32))
**Owner:** B (`@Atip-Infa`)
**Database engine:** Disposable `postgres:16.8@sha256:301bcb60b8a3ee4ab7e147932723e3abd1cef53516ce5210b39fd9fe5e3602ae` (`PostgreSQL 16.8 (Debian 16.8-1.pgdg120+1)`)
**Machine-readable capture:** [R3-B02-s2-demo-results.json](R3-B02-s2-demo-results.json)

## 1. Automated Verification on Clean `v1.0.0-sprint-2` Checkout

Executed in a detached temporary clone of `f3ff8d9704c6e2a3705805412f538b2b216569ad` (`npm ci`, `npm run db:generate --workspace @fasttrack/server`, `npm run build`, `db:migrate`) against disposable PostgreSQL 16.8:

| Check | Command | Observed Result |
| --- | --- | --- |
| Targeted `STS-28` & `F-05B` suite | `npx vitest run --config vitest.b01.config.ts server/src/testing/milestones-f05b.b01.ts --reporter=verbose` | `1` file, `9 passed`, `0 failed` (`Duration 5.53s`) |
| Full `B01` real-DB milestone/summary suite (`v1.0.0-sprint-2`) | `npm run test:b01` | `48 passed`, `0 failed` |
| Full `B02` real-DB feedback/revision suite (`v1.0.0-sprint-2`) | `npm run test:b02` | `61 passed`, `0 failed` |

Exact `STS-28` line observed from the `--reporter=verbose` run:

~~~text
✓ server/src/testing/milestones-f05b.b01.ts > F-05B Milestone edit and cancel (STS-10..STS-14, STS-28, STS-30) > STS-28 enforces auth, role, CSRF/origin, media type, UUID validation, and equal 404 for foreign/absent milestones 404ms
~~~

Full `v1.0.0-sprint-2` main CI reference: [Actions run 44719877378](https://github.com/zerotwobook/fastTrack/actions/runs/44719877378) (`458 passed, 0 failed, 0 skipped` across `198` ordinary, `38` G1, `46` auth, `48` B01, `54` A02, `61` B02, `1` J03, and `12` runtime cases, plus `7/7` legacy upgrade scenarios).

## 2. Live Compiled Browser & Direct Database Demos (`v1.0.0-sprint-2`)

Executed via headless Chromium (`1440x900`) against the compiled `client/dist` SPA and `server/dist` API seeded with synthetic non-production accounts (`supervisor.a@fasttrack.local`, `student.a1@fasttrack.local`) and verified directly against Prisma/PostgreSQL 16.8 rows.

### Demo 1 — `F-05B` Milestone Edit & Cancel (`Team A`: `dc5ae7bd-26c3-4dd4-9737-175b54c0c608`)

1. **Create baseline milestones (`M1`, `M2`)**:
   - `M1` (`62d2794f-4abc-4a41-9f8e-65ff0510f5db`): `Demo M1 Initial`, due `2030-06-15T11:00:00.000Z` (`18:00 Asia/Bangkok`), `createdAt: 2026-11-21T03:09:03.764Z`, `cancelledAt: null`.
   - `M2` (`e75f8527-c4e5-4340-ae56-2623ac3c0ae2`): `Demo M2 Sibling`, due `2030-06-20T11:00:00.000Z` (`18:00 Asia/Bangkok`), `cancelledAt: null`.
2. **Edit `M1` through UI (`Edit milestone` -> `Save changes`)**:
   - UI confirms `Milestone updated.`, displays `Demo M1 Revised`, description `Updated milestone scope approved after baseline check.`, and deadline `18 Jun 2030, 17:30:00 (Asia/Bangkok)`.
   - PostgreSQL readback confirms `id`, `teamId`, `createdById` (`0c4b06e5-a4d3-49e7-a263-4abe23b92ad4`), `createdAt` (`2026-11-21T03:09:03.764Z`), `cancelledAt: null`, sibling `M2`, and Team A membership count (`2` -> `2`) remain untouched while `updatedAt` advances to `2026-11-21T03:09:05.321Z`.
   - Screenshot: [d2-demo1-f05b-edited.png](assets/s3-b02/d2-demo1-f05b-edited.png)
3. **Cancel `M2` through UI (`Cancel milestone` -> `Confirm cancel milestone`)**:
   - UI confirms `Milestone cancelled.` and `Cancelled on 21 Nov 2026, 10:09:06 (Asia/Bangkok).`
   - PostgreSQL readback confirms `cancelledAt = 2026-11-21T03:09:06.232Z`.
   - Subsequent authenticated `PATCH /api/milestones/e75f8527-c4e5-4340-ae56-2623ac3c0ae2` and `POST /api/milestones/e75f8527-c4e5-4340-ae56-2623ac3c0ae2/submissions` both return HTTP `409` with error code `MILESTONE_CANCELLED`.
   - Screenshot: [d2-demo1-f05b-cancelled.png](assets/s3-b02/d2-demo1-f05b-cancelled.png)
4. **Post-submission lock verification on `M1`**:
   - Once Student A1 submits `v1` on `M1`, Supervisor A's UI hides edit/cancel actions and renders `"A submission already exists for this milestone, so it cannot be edited or cancelled."`
   - Authenticated `PATCH /api/milestones/62d2794f-4abc-4a41-9f8e-65ff0510f5db` returns HTTP `409` with error code `MILESTONE_HISTORY_LOCKED`.

### Demo 2 — `F-06` Revision History & Exact-Version Feedback (`M1`: `62d2794f-4abc-4a41-9f8e-65ff0510f5db`)

1. **Submit `v1` (`Sprint 2 Architecture Draft`)**:
   - Row `26aa7d8a-2712-473c-ae96-84b313b18063`, `version: 1`, `submittedById: 67e8b3e7-c18a-4046-9f97-c5ce1a3fd19f`, `submittedAt: 2026-11-21T03:09:07.409Z`, `url: https://example.com/team-a/architecture-v1`.
2. **Supervisor A saves feedback on `v1`**:
   - Row `68158b43-5cbe-4128-aad4-86a0c9d916d7`, `submissionId: 26aa7d8a-2712-473c-ae96-84b313b18063`, `supervisorId: 0c4b06e5-a4d3-49e7-a263-4abe23b92ad4`, `clientRequestId: 97e2efe1-6a8d-40d5-a729-1fda6f30767b`, `createdAt: 2026-11-21T03:09:08.941Z`, content `"Feedback on version 1 baseline: clarify state diagram."`
3. **Student A1 submits revision `v2` (`Sprint 2 Architecture Revised`) via `/revisions/new`**:
   - Row `7dc92cdb-4c0d-451c-b1dc-f761d66bf901`, `version: 2`, `submittedAt: 2026-11-21T03:09:09.734Z`, `url: https://example.com/team-a/architecture-v2`.
   - On `v2` detail view, UI renders `Feedback for version 2` -> `No feedback for this version yet.` (DB feedback count on `v2` = `0`) alongside `Version history` listing `Version 2 (Latest, Current)` and `Version 1 (Open version 1)`.
   - Screenshot: [d2-demo2-f06-v2-latest.png](assets/s3-b02/d2-demo2-f06-v2-latest.png)
4. **Navigate back to `v1` via `Open version 1`**:
   - UI renders notice `"Viewing version 1; the latest version is version 2."` with `View latest version` link and preserves `"Feedback on version 1 baseline: clarify state diagram."` under `Feedback for version 1`.
   - Final PostgreSQL readback confirms `2` submissions (`v1` fields byte-for-byte unchanged compared to pre-revision snapshot) and `1` feedback row bound to `v1.id`.
   - Screenshot: [d2-demo2-f06-v1-retained.png](assets/s3-b02/d2-demo2-f06-v1-retained.png)
