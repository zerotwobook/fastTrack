# Project Deliverable 2 — Draft Parts B & E (`R3-B02` / Issue `#32`)

**Assembly Note:** This file contains Member B's draft of **Part B** and **Part E** for [Issue #32 (`R3-B02`)](https://github.com/zerotwobook/fastTrack/issues/32), authored in parallel with Member A's [Draft PR #139 (`R3-B01` / `deliverable _file/submit/project_deliverable_2.md`)](https://github.com/zerotwobook/fastTrack/pull/139) so Parts A–E can be merged cleanly during final assembly without editing conflicts. Final PDF export remains gated on team review, authorized D2 `main` deployment, and post-deploy readback completion per [MAIN_RELEASE_GATE.md](../../workflow/MAIN_RELEASE_GATE.md).

---

## Part B — Sprint 2 Feature Increment: F-05 to F-07, Demos & Engineering Quality (25 points)

**Accepted Release Baseline:** [`v1.0.0-sprint-2`](https://github.com/zerotwobook/fastTrack/tree/v1.0.0-sprint-2) at commit `f3ff8d9704c6e2a3705805412f538b2b216569ad` (Release PR [`#129`](https://github.com/zerotwobook/fastTrack/pull/129), merged `2026-11-20T10:30:51Z`; Sprint 2 G6 closed in [Issue #26](https://github.com/zerotwobook/fastTrack/issues/26) on `2026-11-20T12:01:52Z`).

### B.1 Sprint 2 Contracts (`F-05` to `F-07`) and Verification Summary

All Sprint 2 behavioral boundaries were agreed before implementation in [sprint-2-feature-interfaces.md](../../Project_code/docs/contracts/sprint-2-feature-interfaces.md) (`S2-AC-01` through `S2-AC-08` and `STS-01` through `STS-32`).

| Feature | Owner | Core API / UI Interface | Key Contract Invariants & Acceptance (`S2-AC-01..08`) | Automated / Release Status (`v1.0.0-sprint-2`) |
| --- | --- | --- | --- | --- |
| **F-05A — Team Creation & Member Management** | A | Team planning API (`STS-01..09`, `STS-28`); UI routes `/teams/new`, `/teams/:id/settings` (`TeamCreate`, `TeamSettings`) | Supervisor-only scoped team creation, rename, student candidate paging, and membership updates; one active team per student (`TeamMember`); membership locks once submission history exists (including cancelled milestones); foreign and absent lookups collapse identically. | Verified in `v1.0.0-sprint-2` `test:auth` (`46` passed, covering `F-05A STS-01..STS-09` & `STS-28`) and `test:g1` (`38` passed) |
| **F-05B — Milestone Edit & Cancel** | B | `PATCH /api/milestones/:id`, `POST /api/milestones/:id/cancel`, `MilestoneEdit`, `MilestoneDetail` | Assigned supervisor only (`403` for students, uniform `404` for foreign/absent milestones); millisecond-exact DB-clock `dueAt > now` check re-verified under row lock (`STS-13`); editing/cancelling blocked (`409 MILESTONE_HISTORY_LOCKED`) once any submission exists (`STS-11`); cancellation preserves record (`cancelledAt`) and rejects future writes (`409 MILESTONE_CANCELLED`, `STS-12`, `STS-14`). | Verified in `v1.0.0-sprint-2` `ordinary` + `test:b01` (`48` passed, including `STS-10..STS-14`, `STS-28`, `STS-30`) |
| **F-06 — Submission Revision History & Version-Pinned Feedback** | B | `POST /api/milestones/:id/revisions`, `GET /api/submissions/:id`, `GET /api/submissions/:id/feedback`, `RevisionCreate`, `SubmissionDetail`, `VersionHistoryList` | Requires existing `v1` and future/equal deadline in DB transaction lock (`STS-18`); requires `expectedVersion` matching latest row (`409 VERSION_CONFLICT` on stale/concurrent base, `STS-17`); inserts append-only `version = N + 1` leaving prior submissions and their `feedback.submissionId` links immutable (`STS-15..21`, `STS-28..30`). | Verified in `v1.0.0-sprint-2` `test:b02` (`61` passed, including `STS-15..STS-21`, `STS-28..STS-30`, plus Lab 7 `L7-STS-01..04`) |
| **F-07 — Team Progress Overview & Calculation** | A | Team progress endpoint (`STS-23..28`, `STS-32`); UI route `/teams/:id/progress` (`TeamProgress`) and shared progress calculation | Active completion excludes `CANCELLED` milestones from denominator; counts any non-cancelled milestone with `>= 1` submission once regardless of revision/feedback count; status precedence checks cancelled -> feedback on latest version -> submitted -> overdue (`asOf > dueAt`) -> pending (`asOf <= dueAt`). | Verified in `v1.0.0-sprint-2` `ordinary` (`198` passed) & `test:auth` (`46` passed, including `STS-23..STS-28` & `STS-32`) and reused as F-08's shared reporting contract |

#### Verified Automated Test & Build Results (`v1.0.0-sprint-2` @ `f3ff8d9704c6e2a3705805412f538b2b216569ad`)

| Verification Run | Command / Workflow | Scope | Result (`PASS / FAIL / SKIPPED`) |
| --- | --- | --- | --- |
| Main CI & Docker Build | [GitHub Actions run 44719877378](https://github.com/zerotwobook/fastTrack/actions/runs/44719877378) (`test-and-docker`) | Clean build, `postgres:16.8` migrations, ordinary + G1 + auth + B01 + A02 + B02 + J03 + runtime suites + legacy upgrade check | **458 passed, 0 failed, 0 skipped** (`198` ordinary, `38` G1, `46` auth, `48` B01, `54` A02, `61` B02, `1` J03, `12` runtime) + **7/7** legacy upgrades passed |
| Local Clean Checkout `B01` & `B02` Re-verification (B, `2026-11-21`) | `npx vitest run --config vitest.b01.config.ts server/src/testing/milestones-f05b.b01.ts --reporter=verbose`; `npm run test:b01`; `npm run test:b02` | Clean detached clone of `f3ff8d97` against disposable `postgres:16.8` container | Targeted `milestones-f05b.b01.ts`: **9 passed, 0 failed, 0 skipped** (`5.53s`); `test:b01`: **48 passed, 0 failed, 0 skipped**; `test:b02`: **61 passed, 0 failed, 0 skipped** |
| Sprint 2 Cloud Run Deployment | [GitHub Actions run 44719877524](https://github.com/zerotwobook/fastTrack/actions/runs/44719877524) | Migration job `fasttrack-migrate-8lncs`; Cloud Run revision `fasttrack-app-00004-jr2` (100% traffic) | Passed (`sha256:26916972...` web, `sha256:a26fb84e...` jobs); Sprint 1 production records preserved ([post-release readback](../../Project_code/docs/evidence/R2-J01-B-post-release-readback.json)) |

---

### B.2 Live Sprint 2 Demos with Direct PostgreSQL Readback (`v1.0.0-sprint-2`)

Both demos below were executed live on `2026-11-21` using headless Chromium (`1440x900`) against the compiled `client/dist` + `server/dist` build of **`v1.0.0-sprint-2`** (`f3ff8d9704c6e2a3705805412f538b2b216569ad`) backed by disposable `postgres:16.8`. Every step was cross-checked directly against PostgreSQL rows via Prisma (see [R3-B02-s2-demos.md](../../Project_code/docs/evidence/R3-B02-s2-demos.md) and [R3-B02-s2-demo-results.json](../../Project_code/docs/evidence/R3-B02-s2-demo-results.json)).

#### Demo B-1 — `F-05B` Milestone Edit, Cancellation & Post-Submission Locking (`S2-AC-03`)

- **Feature / AC:** `F-05B` (`S2-AC-03`, `STS-10..STS-14`).
- **Actor / Role:** Supervisor A (`supervisor.a@fasttrack.local`, `userId: 0c4b06e5-a4d3-49e7-a263-4abe23b92ad4`) for Team A (`dc5ae7bd-26c3-4dd4-9737-175b54c0c608`, `2` team members).
- **Preconditions:** Two future unsubmitted milestones created on Team A (`M1` `Demo M1 Initial`, `62d2794f-4abc-4a41-9f8e-65ff0510f5db`, due `2030-06-15T11:00:00.000Z`; `M2` `Demo M2 Sibling`, `e75f8527-c4e5-4340-ae56-2623ac3c0ae2`, due `2030-06-20T11:00:00.000Z`).
- **Steps Executed:**
  1. Supervisor A opens `M1`, clicks **Edit milestone**, updates title to `"Demo M1 Revised"`, description to `"Updated milestone scope approved after baseline check."`, and deadline to `2030-06-18 17:30 Asia/Bangkok` (`2030-06-18T10:30:00.000Z`), then clicks **Save changes**.
  2. Supervisor A opens sibling `M2`, clicks **Cancel milestone**, and confirms **Confirm cancel milestone** in the accessible modal dialog.
  3. Subsequent authenticated API calls test post-cancel rejection on `M2` (`PATCH` and `POST /submissions`), and post-submission locking on `M1` once Demo B-2 creates `v1`.
- **Expected vs. Actual Result:** `M1` updates in place with `"Milestone updated."` while keeping `id`, `teamId`, `createdById`, `createdAt`, sibling `M2`, and team memberships invariant; `M2` marks `cancelledAt` while staying visible read-only with `"Milestone cancelled."` and rejects writes with `409 MILESTONE_CANCELLED`; after `v1` is submitted on `M1`, UI hides edit/cancel controls and API returns `409 MILESTONE_HISTORY_LOCKED`. **Actual matched expected.**

| Record / Probe (`postgres:16.8`) | Before Action | After Edit / Cancel / Lock | Verified Invariant |
| --- | --- | --- | --- |
| `M1` (`62d2794f-...`) | `Demo M1 Initial`, `dueAt: 2030-06-15T11:00:00.000Z`, `createdAt = updatedAt = 2026-11-21T03:09:03.764Z`, `cancelledAt: null` | `Demo M1 Revised`, `dueAt: 2030-06-18T10:30:00.000Z`, `updatedAt: 2026-11-21T03:09:05.321Z`, `cancelledAt: null` | `id`, `teamId`, `createdById`, `createdAt` unchanged; Team A member count stayed `2` |
| `M2` (`e75f8527-...`) | `Demo M2 Sibling`, `cancelledAt: null` | Unchanged on `M1` edit; after cancel: `cancelledAt: 2026-11-21T03:09:06.232Z` | Sibling row untouched by `M1` edit; cancel preserves row cleanly |
| `M2` post-cancel `PATCH` / `POST /submissions` | — | HTTP `409` (`code: MILESTONE_CANCELLED`) on both calls | Cancelled precedence blocks edits and student submissions |
| `M1` post-`v1` `PATCH` & UI controls | Edit & Cancel buttons rendered | Edit/Cancel buttons removed; rail shows lock explanation; `PATCH` returns HTTP `409` (`MILESTONE_HISTORY_LOCKED`) | Prior submission permanently locks milestone definition |

![Figure B-1: Supervisor view after editing M1 in Demo B-1 on v1.0.0-sprint-2](../../Project_code/docs/evidence/assets/s3-b02/d2-demo1-f05b-edited.png)
*Figure B-1 — `F-05B` (`S2-AC-03`, Supervisor A on `v1.0.0-sprint-2@f3ff8d9`): updated milestone `Demo M1 Revised` displaying `"Milestone updated."` banner and `18 Jun 2030, 17:30:00 (Asia/Bangkok)` deadline while retaining identity.*

![Figure B-2: Supervisor view after cancelling sibling M2 in Demo B-1 on v1.0.0-sprint-2](../../Project_code/docs/evidence/assets/s3-b02/d2-demo1-f05b-cancelled.png)
*Figure B-2 — `F-05B` (`S2-AC-03`, Supervisor A on `v1.0.0-sprint-2@f3ff8d9`): cancelled sibling milestone `Demo M2 Sibling` displaying `"Milestone cancelled."`, `Cancelled` status badge, timestamp `21 Nov 2026, 10:09:06 (Asia/Bangkok)`, and disabled edit/cancel controls.*

---

#### Demo B-2 — `F-06` Revision History & Exact-Version Feedback Retention (`S2-AC-04`, `S2-AC-05`)

- **Feature / AC:** `F-06` (`S2-AC-04`, `S2-AC-05`, `STS-15..STS-22`).
- **Actors / Roles:** Student A1 (`student.a1@fasttrack.local`, `userId: 67e8b3e7-c18a-4046-9f97-c5ce1a3fd19f`) and Supervisor A (`supervisor.a@fasttrack.local`).
- **Preconditions:** Active future milestone `M1` (`62d2794f-4abc-4a41-9f8e-65ff0510f5db`) on Team A.
- **Steps Executed:**
  1. Student A1 submits `v1` (`Sprint 2 Architecture Draft`, `https://example.com/team-a/architecture-v1`).
  2. Supervisor A opens `v1` and saves feedback `"Feedback on version 1 baseline: clarify state diagram."` (`Save feedback` -> `"Feedback saved for version 1."`).
  3. Student A1 navigates to `/milestones/62d2794f-.../revisions/new` and submits `v2` (`Sprint 2 Architecture Revised`, `https://example.com/team-a/architecture-v2`).
  4. On `v2`, Student A1 confirms `No feedback for this version yet.`, then clicks **Open version 1** in the **Version history** list and inspects the retained `v1` submission and feedback.
- **Expected vs. Actual Result:** `v2` appears as `Latest` + `Current` with `0` feedback entries (`Feedback for version 2` panel empty); opening `v1` displays `"Viewing version 1; the latest version is version 2."`, a **View latest version** link, and `v1`'s exact original title/description/URL plus Supervisor A's feedback on `v1`. PostgreSQL confirms `v1` remained byte-for-byte immutable after `v2` creation. **Actual matched expected.**

| Table / Row (`postgres:16.8`) | Primary / Foreign IDs | Key Columns & Timestamp | Exactness Check |
| --- | --- | --- | --- |
| `submissions` (`v1`) | `id: 26aa7d8a-2712-473c-ae96-84b313b18063`, `milestoneId: 62d2794f-...`, `submittedById: 67e8b3e7-...` | `version: 1`, title `Sprint 2 Architecture Draft`, `submittedAt: 2026-11-21T03:09:07.409Z` | Deep-equal to pre-revision DB snapshot after `v2` saved |
| `feedback` (pinned to `v1`) | `id: 68158b43-5cbe-4128-aad4-86a0c9d916d7`, `submissionId: 26aa7d8a-...`, `clientRequestId: 97e2efe1-...` | `content: "Feedback on version 1 baseline: clarify state diagram."`, `createdAt: 2026-11-21T03:09:08.941Z` | Attached strictly to `v1.id`; zero migration onto `v2` |
| `submissions` (`v2`) | `id: 7dc92cdb-4c0d-451c-b1dc-f761d66bf901`, `milestoneId: 62d2794f-...`, `submittedById: 67e8b3e7-...` | `version: 2`, title `Sprint 2 Architecture Revised`, `submittedAt: 2026-11-21T03:09:09.734Z` | `feedback` count on `v2.id` = `0` |

![Figure B-3: Student view of latest revision v2 showing Version history and empty v2 feedback panel](../../Project_code/docs/evidence/assets/s3-b02/d2-demo2-f06-v2-latest.png)
*Figure B-3 — `F-06` (`S2-AC-04`, `S2-AC-05`, Student A1 on `v1.0.0-sprint-2@f3ff8d9`): newly submitted `Version 2` marked `Latest` + `Current` with an isolated empty `Feedback for version 2` panel and navigation to `Open version 1`.*

![Figure B-4: Student view of version 1 showing old-version banner and retained v1 supervisor feedback](../../Project_code/docs/evidence/assets/s3-b02/d2-demo2-f06-v1-retained.png)
*Figure B-4 — `F-06` (`S2-AC-04`, `S2-AC-05`, Student A1 on `v1.0.0-sprint-2@f3ff8d9`): navigating back to `Version 1` renders `"Viewing version 1; the latest version is version 2."`, a `View latest version` link, unmodified `v1` payload, and retained feedback bound to version 1.*

---

### B.3 Role, Ownership & Boundary Test Excerpt (Owner: B)

- **Tested Target:** `v1.0.0-sprint-2` (`f3ff8d9704c6e2a3705805412f538b2b216569ad`)
- **Test File:** [`Project_code/server/src/testing/milestones-f05b.b01.ts#L263-L299`](../../Project_code/server/src/testing/milestones-f05b.b01.ts#L263-L299) (`STS-28`)
- **Setup & Fixtures:** Runs against an isolated disposable PostgreSQL 16.8 test database with seeded real HTTP sessions (`supA`, `stuA1`), an assigned Team A milestone (`ownId = milestoneFuture.id`), a foreign Team B milestone owned by Supervisor B (`foreignId = milestoneBTeam.id`), and a nonexistent UUID (`absentId = randomUUID()`). Helper calls send real cookies, `Origin`, and `X-CSRF-Token` headers matching production security middleware.
- **Assertions (`STS-28` verbatim code):**

~~~ts
  it('STS-28 enforces auth, role, CSRF/origin, media type, UUID validation, and equal 404 for foreign/absent milestones', async () => {
    const foreignId = fixtures.milestones.milestoneBTeam.id;
    const absentId = randomUUID();
    const ownId = fixtures.milestones.milestoneFuture.id;

    // 401 unauthenticated
    await request(app()).patch(`/api/milestones/${ownId}`).set('Content-Type', 'application/json').send(JSON.stringify(validEdit())).expect(401);
    await request(app()).post(`/api/milestones/${ownId}/cancel`).set('Content-Type', 'application/json').send('{}').expect(401);

    // 403 student role
    await patchMilestone(ownId, validEdit(), stuA1).expect(403);
    await cancelMilestone(ownId, {}, stuA1).expect(403);

    // 403 CSRF & foreign origin
    await request(app()).patch(`/api/milestones/${ownId}`).set('Cookie', supA.cookie).set('Origin', origin).set('Content-Type', 'application/json').send(JSON.stringify(validEdit())).expect(403);
    await request(app()).post(`/api/milestones/${ownId}/cancel`).set('Cookie', supA.cookie).set('Origin', 'https://foreign.example').set('X-CSRF-Token', supA.csrf).set('Content-Type', 'application/json').send('{}').expect(403);

    // 415 non-JSON
    await request(app()).patch(`/api/milestones/${ownId}`).set('Cookie', supA.cookie).set('Origin', origin).set('X-CSRF-Token', supA.csrf).set('Content-Type', 'text/plain').send('plain').expect(415);

    // 400 malformed UUID
    await patchMilestone('not-a-uuid', validEdit()).expect(400);
    await cancelMilestone('not-a-uuid', {}).expect(400);

    // Equal 404 for foreign vs absent milestone
    const foreignPatch = await patchMilestone(foreignId, validEdit(), supA);
    const absentPatch = await patchMilestone(absentId, validEdit(), supA);
    expect(foreignPatch.status).toBe(404);
    expect(absentPatch.status).toBe(404);
    expect(foreignPatch.body).toEqual(absentPatch.body);

    const foreignCancel = await cancelMilestone(foreignId, {}, supA);
    const absentCancel = await cancelMilestone(absentId, {}, supA);
    expect(foreignCancel.status).toBe(404);
    expect(absentCancel.status).toBe(404);
    expect(foreignCancel.body).toEqual(absentCancel.body);
  });
~~~

- **Executed Command & Actual Output (`2026-11-21` on clean `v1.0.0-sprint-2@f3ff8d9` + disposable PostgreSQL `16.8`, `9 passed, 0 failed, 0 skipped`):**

~~~text
$ npx vitest run --config vitest.b01.config.ts server/src/testing/milestones-f05b.b01.ts --reporter=verbose

 ✓ server/src/testing/milestones-f05b.b01.ts > F-05B Milestone edit and cancel (STS-10..STS-14, STS-28, STS-30) > STS-28 enforces auth, role, CSRF/origin, media type, UUID validation, and equal 404 for foreign/absent milestones 404ms

 Test Files  1 passed (1)
      Tests  9 passed (9)
   Duration  5.53s (tests 85%, import 13%, transform 2%)
~~~

---

### B.4 Member B Issue -> PR -> Substantive Review -> Fix -> Release Chain (Sprint 2)

| Stage | Artifact / Event | Recorded Timestamp & Commit / ID | Concrete Detail |
| --- | --- | --- | --- |
| 1. Issue & Branch | [Issue #18 (`R2-B02`)](https://github.com/zerotwobook/fastTrack/issues/18) -> `feat/s2-b-f05b-milestones` | Commits `efa9b0b` (`15:54:15Z`), `876e09a` (`16:02:49Z`), `ea480fb` (`16:08:11Z`) | Implemented `F-05B` backend edit/cancel endpoints, lock/clock guards, `MilestoneEdit` UI, cancel modal, and `STS-10..14 / STS-28 / STS-30` tests. |
| 2. Pull Request | [PR #118](https://github.com/zerotwobook/fastTrack/pull/118) targeting `staging/sprint-2` | Opened `2026-11-19T15:54:48Z` | Submitted `F-05B` implementation + tests for Member A peer review. |
| 3. Substantive Review Finding | Peer review (`COMMENTED`) by `zerotwobook` | `2026-11-19T16:23:07Z` on `ea480fb` | Identified **P2 millisecond truncation** in `MilestoneEdit` (`2030-05-10T11:30:59.501Z -> 18:30 -> 11:30:00.000Z`, risking unintended deadline shift when saving an unchanged timestamp) and flagged `session.ts` coordination with `a130a9f` on `staging/sprint-2`. |
| 4. Fix & Re-review | Fix commits `369b27b`, `fd045f5` -> `APPROVED` review | `369b27b` (`16:29:52Z`), `fd045f5` (`16:32:11Z`); approved `2026-11-19T16:51:42Z` | Preserved sub-second deadline precision (`step={0.001}` in edit form / input conversion) and cleanly resolved `session.ts` staging alignment before `zerotwobook` approved `fd045f5`. |
| 5. Merge, G3 & Release | `PR #118` merge -> `G3 #21` -> `PR #129` -> **`v1.0.0-sprint-2`** | `#118` merged `16:56:25Z` (`09cdf9f`); `G3 #21` (`63e81d1`, `2026-11-20T03:15:07Z`); `PR #129` merged `10:30:51Z` (`f3ff8d9`, `#26` closed `12:01:52Z`) | Shipped to production via CI `44719877378` (`458 passed`) and deploy `44719877524` (`fasttrack-app-00004-jr2`); full release handoff recorded in [R2-J03-B-release-handoff.md](../../Project_code/docs/evidence/R2-J03-B-release-handoff.md). |

---

## Part E — Release Verification, Deployment & Clean Setup (15 points)

**Current Gate Status:** **Authorized `main` Release Deployed (`7872a739`, [Run `44888588070`](https://github.com/zerotwobook/fastTrack/actions/runs/44888588070)) & Post-Deploy Hosted Readback Completed (Direct Cloud SQL Query Recorded as Blocked from B Workspace).** Per [MAIN_RELEASE_GATE.md](../../workflow/MAIN_RELEASE_GATE.md), release PR [`#143`](https://github.com/zerotwobook/fastTrack/pull/143) received explicit owner authorization (`2026-11-21T08:35:06Z`), non-author peer approval (`@Atip-Infa`), and merged into `main` on `2026-11-21T08:39:25Z` as `7872a739147f7553e16e05a4d40b5d0de0c21f27`. After push run `44885899928` hit the `demo` self-review rule, `@zerotwobook` triggered [`Deploy demo` Run `44888588070`](https://github.com/zerotwobook/fastTrack/actions/runs/44888588070) on `main`, `@Atip-Infa` approved `demo`, and revision `fasttrack-app-00005-rkz` rolled out to `100%` traffic.

### E.1 Pre-Release Staging & `main` Release Verification

| Verification Source | Commit | Environment | Result Summary |
| --- | --- | --- | --- |
| Staging CI ([Run `44777769845`](https://github.com/zerotwobook/fastTrack/actions/runs/44777769845)) & `PR #143` CI ([`44874070498`](https://github.com/zerotwobook/fastTrack/actions/runs/44874070498), [`44881698859`](https://github.com/zerotwobook/fastTrack/actions/runs/44881698859)) | `84c4a31` -> `6db6a346f32f4d1cce7caa7cc77a1d6db4d872f2` | GitHub Actions, `postgres:16.8` (`Debian 16.8-1.pgdg120+1`) | **483 passed, 0 failed, 0 skipped** (`214` ordinary, `38` G1, `46` auth, `57` B01, `54` A02, `61` B02, `1` J03, `12` runtime) + `7/7` upgrades passed (`ci-runtime-report`); `PR #143` exact-head CI runs completed `success` |
| B Independent G2 & `PR #143` Review ([Issue #30](https://github.com/zerotwobook/fastTrack/issues/30)) | `84c4a31`, `6db6a34` | Separate clean checkouts (`npm ci`, `npm run test:runtime:isolated`, Docker `postgres:16.8`, Unix-socket images, headless Chromium) | **483 passed, 0 failed, 0 skipped**, **7/7** upgrade cases (`upgrades.passed: true`), **17/17** container/Unix-socket checks, DB/API/UI `1/10 (10.0%)` -> `2/10 (20.0%)` F-08 parity, filter/page `?status=PENDING&page=2&pageSize=8` preserved across milestone round-trip, student `403`, foreign supervisor `404`, `"Page 2 of 1"` label with working `Go to page 1` recovery; `GHSA-7589-6fvf-x4pw` (`effect@3.20.0`, `devOptional: true` via `@prisma/config@7.10.1` -> `prisma@7.10.1`) tracked as non-blocking post-D2 follow-up |
| Post-merge `main` CI & Docker Build ([Run `44885899889`](https://github.com/zerotwobook/fastTrack/actions/runs/44885899889)) | `7872a739147f7553e16e05a4d40b5d0de0c21f27` (`PR #143` merge) | GitHub Actions, `postgres:16.8` (`Debian 16.8-1.pgdg120+1`) | **483 passed, 0 failed, 0 skipped** (`214` ordinary, `38` G1, `46` auth, `57` B01, `54` A02, `61` B02, `1` J03, `12` runtime) + `7/7` upgrade cases (`upgrades.passed: true`) |

### E.2 Clean Setup & Verification Reproduction Steps (`NFR-04`)

All application source lives under `Project_code/` with runtime versions pinned in [`Project_code/.node-version`](../../Project_code/.node-version) (`Node 26.13.0`, `npm 11.20.0`) and base images pinned by SHA-256 digest in [`Project_code/Dockerfile`](../../Project_code/Dockerfile) and [`Project_code/compose.yaml`](../../Project_code/compose.yaml).

> **Documentation Sync Note:** [`Project_code/README.md`](../../Project_code/README.md) on `staging/sprint-3` / `main` still reflects the pre-sync Sprint 1/2 baseline; Member A updated `Project_code/README.md` (`Clean-container regression`, `Sprint 2 and Sprint 3 workflow checks`, updated layout) in open Draft PR [`#139`](https://github.com/zerotwobook/fastTrack/pull/139), pending merge into `staging/sprint-3`.

1. **Prerequisites & Environment Files (Non-Production Placeholders Only):**
   - Install Node `26.13.0` (`npm 11.20.0`) and Docker Engine / Docker Desktop.
   - For local manual runs without Compose, copy [`Project_code/server/.env.example`](../../Project_code/server/.env.example) to `Project_code/server/.env`, provision PostgreSQL on `127.0.0.1:5433`, and supply private synthetic hex values for `DATABASE_URL`, `TEST_DATABASE_URL`, and `DEMO_SEED_PASSWORD` (no default credential exists).
   - For Docker Compose runs, copy [`Project_code/compose.env.example`](../../Project_code/compose.env.example) to `Project_code/.env.compose` with synthetic `LOCAL_DB_PASSWORD`, optional `DEMO_SEED_PASSWORD`, and 40-char `RELEASE_SHA`.
2. **Reproducible Isolated Verification (Disposable PostgreSQL `16.8` Container):**

~~~bash
cd Project_code
npm ci
npm run db:generate --workspace @fasttrack/server
npm run typecheck
npm run test:runtime:isolated
~~~

3. **Optional Containerized Local App Startup (`compose.yaml`, loopback `127.0.0.1:8080`):**

~~~bash
cd Project_code
docker compose --env-file .env.compose up -d db
docker compose --env-file .env.compose --profile tools run --rm jobs npm run db:migrate --workspace @fasttrack/server
docker compose --env-file .env.compose --profile tools run --rm jobs npm run db:seed --workspace @fasttrack/server
docker compose --env-file .env.compose up --build app
~~~

Seeded synthetic accounts for local evaluation only: `supervisor.a@fasttrack.local`, `supervisor.b@fasttrack.local`, `student.a1@fasttrack.local`, `student.a2@fasttrack.local`, `student.b1@fasttrack.local` (all authenticated via the synthetic `DEMO_SEED_PASSWORD` provided at seed time).

---

### E.3 Post-Deploy D2 Release Evidence (`main@7872a739`, Deployed `2026-11-21T09:25Z`)

Actual post-deployment results captured from [`Deploy demo` Run `44888588070`](https://github.com/zerotwobook/fastTrack/actions/runs/44888588070), live `/api/health` + `/api/ready` HTTP probes, and Chromium + API readback in [`R3-B02-d2-post-deploy-readback.json`](../../Project_code/docs/evidence/R3-B02-d2-post-deploy-readback.json):

#### 1. Release Commit, Tag, CI & Container Artifacts

| Evidence Item | Target / Format | Status | Recorded Value |
| --- | --- | --- | --- |
| Accepted `main` release PR & merge SHA | Release PR, 40-char commit SHA | **Recorded** | [PR `#143`](https://github.com/zerotwobook/fastTrack/pull/143) (`6db6a346f32f4d1cce7caa7cc77a1d6db4d872f2` -> `f3ff8d9704c6e2a3705805412f538b2b216569ad`), merged `2026-11-21T08:39:25Z` as `7872a739147f7553e16e05a4d40b5d0de0c21f27` |
| Release Git tag | D2 release tag -> `7872a739147f7553e16e05a4d40b5d0de0c21f27` | Pending D2 closeout | `_PENDING_` (tag created at `#33` team submission closeout) |
| `main` CI & Docker Build run | GitHub Actions run URL + `PASS / FAIL / SKIPPED` totals (`ci-runtime-report`) | **Passed** | [Run `44885899889`](https://github.com/zerotwobook/fastTrack/actions/runs/44885899889): `483 passed, 0 failed, 0 skipped` (`214` ordinary, `38` G1, `46` auth, `57` B01, `54` A02, `61` B02, `1` J03, `12` runtime) + `7/7` upgrade cases (`upgrades.passed: true`); re-verified by `test / test-and-docker` (`136799431127`) in Run `44888588070` |
| `Deploy demo` workflow run | GitHub Actions deployment workflow (`demo` environment) | **Succeeded** | [Run `44888588070`](https://github.com/zerotwobook/fastTrack/actions/runs/44888588070) (`workflow_dispatch` on `main` triggered by `@zerotwobook`, `demo` approved by `@Atip-Infa`; `test` `136799431127` & `deploy` `136800312369` `completed/success` at `2026-11-21T09:25:55Z`; supersedes self-review-blocked push run [`44885899928`](https://github.com/zerotwobook/fastTrack/actions/runs/44885899928)) |
| Container image digests (`web` & `jobs`) | `sha256:...` pushed to Artifact Registry | **Recorded** | `web`: `asia-southeast1-docker.pkg.dev/fasttrack-se-002/fasttrack-docker/fasttrack-app@sha256:7b868cd51b62db518dde4e22601930a9be7b8483bffb9409efd70742faf2c458`; `jobs`: `asia-southeast1-docker.pkg.dev/fasttrack-se-002/fasttrack-docker/fasttrack-jobs@sha256:b49829f88464cc18f7aa6d2cb9be840e67cf9dd1b867eee18d3bf7e58ec4c718` |
| Cloud Run migration job & active service revision | Job execution ID, Cloud Run revision name (`100%` traffic) | **Recorded** | Job `fasttrack-migrate` execution **`fasttrack-migrate-4lvx5`** (`completed` `2026-11-21T09:25:17Z`); Cloud Run service `fasttrack-app` revision **`fasttrack-app-00005-rkz`** (`100%` traffic) |
| Public HTTPS URL & readiness endpoints | `https://...` + live HTTP `200` on `/api/health` and `/api/ready` (`version` matches `7872a739147f7553e16e05a4d40b5d0de0c21f27`) | **Passed** | Public URL: `https://fasttrack-app-kpx7au3w2a-as.a.run.app` (Cloud Run URL `https://fasttrack-app-970128017651.asia-southeast1.run.app`); smoke test passed (`/api/health`, `/api/ready`, `/`, `/api/nonexistent`); direct HTTPS probes returned HTTP `200` on `/api/health` (`{"status":"ok","version":"7872a739147f7553e16e05a4d40b5d0de0c21f27"}`) and `/api/ready` (`{"status":"ready","database":"connected","version":"7872a739147f7553e16e05a4d40b5d0de0c21f27"}`) |

#### 2. Original Sprint 1 Production Persistence Readback (Preserved Across Upgrades)

Live browser + API verification (`2026-11-21T09:30Z`, recorded in [`R3-B02-d2-post-deploy-readback.json`](../../Project_code/docs/evidence/R3-B02-d2-post-deploy-readback.json)) confirmed all Lab 5 baseline records documented in [`R2-J01-B-post-release-readback.json`](../../Project_code/docs/evidence/R2-J01-B-post-release-readback.json) (`canonicalRecordsSha256: c5396255105bfccd8f13ec0b8469aae6d1ab2a3a7923a13a55253e582bbe0f4e`) remain completely intact on revision `fasttrack-app-00005-rkz`:

- [x] **Team A preserved:** `teamId = 7c600ee0-a595-4c52-a093-f0ed5e08fded` (`GET /api/teams/7c600ee0-a595-4c52-a093-f0ed5e08fded` HTTP `200`, `2` team members)
- [x] **Original Sprint 1 Milestone preserved:** `milestoneId = b19ae7d5-d2a1-4ace-9b11-d2a94cb8177d` (`GET /api/milestones/b19ae7d5-d2a1-4ace-9b11-d2a94cb8177d` HTTP `200`)
- [x] **Original Sprint 1 Submission preserved:** `submissionId = baa3eb8d-e37f-44c2-93fc-dc9f8e5463fd` (`GET /api/submissions/baa3eb8d-e37f-44c2-93fc-dc9f8e5463fd` HTTP `200` for both Supervisor A and Student A1; `"C04 initial submission"`)
- [x] **Original Sprint 1 Feedback preserved:** `feedbackId = b9ebf7f7-a542-4b89-95a8-8f1de22a5357` (`GET /api/submissions/baa3eb8d-e37f-44c2-93fc-dc9f8e5463fd/feedback` HTTP `200` for both Supervisor A and Student A1; exact `canonicalRecordsSha256` baseline match = `true`)

![Figure E-1: Preserved Sprint 1 C04 submission and feedback on hosted Cloud Run D2 deployment](../../Project_code/docs/evidence/assets/s3-b02/d2-prod-s1-preserved.png)
*Figure E-1 — Hosted D2 Cloud Run (`fasttrack-app-00005-rkz`, `7872a739`) preserving Sprint 1 baseline `C04 initial submission` (`baa3eb8d-...`) and its version-1 feedback (`b9ebf7f7-...`) unmodified after migration `fasttrack-migrate-4lvx5`.*

#### 3. Post-Deploy Hosted `F-08` Scope & Functional Verification Re-run

- [x] **Supervisor A `/summary` & `GET /api/summary`:** Verified on hosted UI and API (`asOf: 2026-11-21T09:30:22.331Z`): `/summary` displays `42.9%` (`submitted: 6`, `total: 14`, `pending: 0`, `overdue: 8`), reconciling exactly against `GET /api/summary` and per-team `GET /api/teams/:id/progress` (`Team A`: `6 / 14 = 42.9%`). Filtering `?teamId=7c600ee0-a595-4c52-a093-f0ed5e08fded&status=OVERDUE&page=2&pageSize=1`, clicking milestone `b001b3df-...`, and returning via both **Back to summary** and browser **Back** preserved `?teamId=7c600ee0-a595-4c52-a093-f0ed5e08fded&status=OVERDUE&page=2&pageSize=1` cleanly. *(Blocked check recorded honestly: direct SQL readback against Cloud SQL `fasttrack_prod` is blocked/unavailable from Member B's workspace environment because no `gcloud` CLI, GCP credential, Cloud SQL Proxy, or production `DATABASE_URL` is configured here.)*
- [x] **Student role enforcement:** Signed-in `student.a1@fasttrack.local` navigation rendered `0` `/summary` links, `/summary` rendered `"Summary is restricted to supervisors"`, and `GET /api/summary` returned HTTP **`403`** (`FORBIDDEN`).
- [x] **Cross-supervisor ownership isolation:** Signed-in `supervisor.b@fasttrack.local` `/summary` returned only Supervisor B's `1` team (`supBSummaryContainsTeamA: false`); `GET /api/summary?teamId=7c600ee0-a595-4c52-a093-f0ed5e08fded`, `GET /api/milestones/b19ae7d5-d2a1-4ace-9b11-d2a94cb8177d`, and `GET /api/submissions/baa3eb8d-e37f-44c2-93fc-dc9f8e5463fd` all returned HTTP **`404`** (`NOT_FOUND`), and `/milestones/b19ae7d5-...` showed `"Milestone unavailable"` with zero Team A disclosure.
- [x] **Page-label follow-up disposition (`F08-AC-05/08`):** Hosted probe `/summary?teamId=7c600ee0-...&status=OVERDUE&page=99&pageSize=8` (`matchedCount: 8`) rendered a working `Go to page 1` recovery link (`goToPage1Visible: true`); the non-blocking `"Page 2 of 1"` wording follow-up remains tracked for post-D2 maintenance.

![Figure E-2: Hosted F-08 Supervisor A Summary overview showing 42.9% (6/14) completion](../../Project_code/docs/evidence/assets/s3-b02/d2-prod-f08-summary.png)
*Figure E-2 — Hosted `F-08` Supervisor A `/summary` (`42.9%`, `6` submitted / `14` active) on `7872a739` matching `/api/teams/:id/progress`.*

![Figure E-3: Hosted F-08 Student restriction notice on /summary (403 on GET /api/summary)](../../Project_code/docs/evidence/assets/s3-b02/d2-prod-f08-student-403.png)
*Figure E-3 — Hosted `F-08` Student A1 `/summary` omitting navigation link and rendering `"Summary is restricted to supervisors"` (`GET /api/summary` HTTP `403`).*

![Figure E-4: Hosted F-08 Supervisor B foreign milestone denial (404 Milestone unavailable)](../../Project_code/docs/evidence/assets/s3-b02/d2-prod-f08-foreign-404.png)
*Figure E-4 — Hosted `F-08` Supervisor B request for Supervisor A's milestone showing generic `"Milestone unavailable"` (`404 NOT_FOUND`) without disclosing Team A titles.*

#### 4. Final Timeline, AI & Human Accountability Statement

| Milestone | Target Date (`Asia/Bangkok`) | Owner / Gate |
| --- | --- | --- |
| D2 `main@7872a739` Cloud Run rollout ([Run `44888588070`](https://github.com/zerotwobook/fastTrack/actions/runs/44888588070)) -> `fasttrack-app-00005-rkz` (`100%`) -> Sprint 1 & hosted `F-08` readback | Completed `2026-11-21` | `@zerotwobook` (`workflow_dispatch`) + `@Atip-Infa` (`demo` approval + readback) |
| Closeout of PR `#138`, PR `#139`, and B's PR `#142` (`#141` Lab 7 archive merged `6db6a34`) | Before `2026-11-29` | A & B (`G3` staging integration & PR review) |
| Final D2 PDF (`#33`) & Lab 7 submission (+ D2 release Git tag) | `2026-11-29 23:59` | A submits Lab 7; B/A assemble D2 PDF and submit with receipts |
| Course final project maintenance / closeout window (`"Page 2 of 1"` fix, `GHSA-7589-6fvf-x4pw` follow-up, final UAT) | `2026-12-01` – `2026-12-13 23:59` | A & B per [03_SPRINT3_D2_FINAL.md](../../workflow/03_SPRINT3_D2_FINAL.md) |

- **Human & AI Usage Disclosure:** Member A authored Sprint 1 core fixes (`#23`), F-05A, F-07, F-08A, and D2 Parts A/C/D; Member B authored Sprint 1 DB schema/seed, F-05B, F-06, F-08B, D2 Parts B/E, and release verification. AI coding assistants helped draft test harnesses, Playwright verification scripts, and English documentation under direct human/tool verification; every SHA, CI count, DB row UUID, timestamp, and screenshot cited above was inspected against executed tool output and live deployed/database/browser state rather than unverified memory.
- **Known Scope Limits Recorded Honestly:** All pre-deploy (`v1.0.0-sprint-2@f3ff8d9`, `staging/sprint-3@6db6a34`) and post-deploy hosted Cloud Run (`main@7872a739`, revision `fasttrack-app-00005-rkz`, [Run `44888588070`](https://github.com/zerotwobook/fastTrack/actions/runs/44888588070)) UI/API checks in Parts B & E are complete with zero skipped verifications beyond explicit access boundaries: (1) direct Cloud SQL DB readback against production `fasttrack_prod` is blocked/unavailable from Member B's workspace environment without `gcloud` / Cloud SQL Proxy / `DATABASE_URL` (totals reconciled via `/api/teams/:id/progress` + `/api/summary`), (2) the D2 release Git tag and final PDF assembly belong to closeout Issue `#33` after `#138`/`#139`/`#142` merge into `staging/sprint-3`, and (3) non-blocking follow-ups (`"Page 2 of 1"` empty-page label under `F08-AC-05/08`, and upgrading `effect@3.20.0` under `GHSA-7589-6fvf-x4pw`) are tracked for post-D2 work (`1–13 Dec`).
