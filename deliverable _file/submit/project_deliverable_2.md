# Project Deliverable 2 - fastTrack

**CPE 334 Software Engineering | Semester 1/2026**<br>
**Theme 6 - Course Project Management System**<br>
**Report draft | 21 November 2026 | Due 29 November 2026 at 23:59 Asia/Bangkok**

| Item | Record |
| --- | --- |
| Member A | `zerotwobook`; add full name and student ID in the course submission copy. |
| Member B | `Atip-Infa`; add full name and student ID in the course submission copy. |
| Repository | [zerotwobook/fastTrack](https://github.com/zerotwobook/fastTrack) |
| Accepted Sprint 1 | [v1.0.0-sprint-1](https://github.com/zerotwobook/fastTrack/tree/v1.0.0-sprint-1) at `ae7a60a6e3ed0a363dcee920ac1774a02f4f4ab8` |
| Accepted Sprint 2 | [v1.0.0-sprint-2](https://github.com/zerotwobook/fastTrack/tree/v1.0.0-sprint-2) at `f3ff8d9704c6e2a3705805412f538b2b216569ad` |
| Locally tested D2 application source | [Staging 84c4a31](https://github.com/zerotwobook/fastTrack/tree/84c4a31220898957be96c9a54cff0d6e37832821), verified with real sessions and PostgreSQL. |
| Submitted D2 tag/commit and deployed URL/version | Pending exact release authorization, deploy verification and package acceptance. |

| Rubric | Report location | Assessment pages |
| --- | --- | --- |
| A - Sprint 1 continuity and change status (5) | [Part A](#part-a---sprint-1-continuity-and-change-status) | Assign during assembly |
| B - Sprint 2 contracts and working increment (25) | B's contribution under [#32](https://github.com/zerotwobook/fastTrack/issues/32) | Assign during assembly |
| C - Sprint 3 contracts and working progress (15) | [Part C](#part-c---sprint-3-contracts-and-working-progress) | Assign during assembly |
| D - Updated requirements and test traceability (10) | [Part D](#part-d---updated-requirements-and-test-traceability) | Assign during assembly |
| E - Integrated release candidate (15) | B's contribution under [#32](https://github.com/zerotwobook/fastTrack/issues/32) | Assign during assembly |

## Part A - Sprint 1 continuity and change status

### A.1 Accepted baseline and original journey

The accepted Sprint 1 increment established one course context with seeded supervisor and student identities, milestone planning, on-time first submission and feedback attached to the exact submission. The accepted Sprint 2 release preserved that workflow and added planning, revisions and progress. D2's locally tested source contains both baselines plus the Sprint 3 supervisor Summary.

**A-01. Supervisor creates a milestone, a student submits, and the team retrieves feedback after restart.** F-01 through F-04, S1-AC-EXT-02/03 and tests T-21/22/25/31. Roles are an assigned supervisor, a student and teammate, and a supervisor assigned to another team. The compiled server starts with a seeded, disposable PostgreSQL database. The supervisor creates a future milestone, the student retrieves it and submits version 1, and the supervisor appends two messages with distinct request keys. The teammate retrieves the messages and confirms each references the saved submission. The test repeats seed, restarts the compiled app, and retrieves the same work and feedback. It expects durable records, a safe repeat seed, scoped access and one version 1.

**Observed at `84c4a31`.** The compiled HTTP journey passed. Responses preserved the same submission and feedback after restart and the database fingerprint stayed stable. A foreign supervisor received HTTP 404, a student feedback write received 403, and a duplicate first submission received 409 `ALREADY_SUBMITTED`. The guarded production-image socket run separately passed 17 checks, including the compiled business flow, restart, repeated seed and database outage readiness. [Test source](../../Project_code/server/src/testing/integrated-s1.j03.ts) · [Candidate run and results](https://github.com/zerotwobook/fastTrack/blob/70f0d6401ed4c701354242aa23405a84c75df053/Project_code/docs/evidence/R3-J01-f08-integration.md)

**A-02. Deadline and ownership continuity.** F-03, BR-04/05, S1-AC-EXT-04 and T-26. Applicable to the assigned student, with an unsubmitted milestone. The boundary tests check exact equality and a request delayed beyond the deadline while waiting for a database lock. Equality may be accepted. A late first submit returns 409 with zero new rows. The candidate's submission/deadline suite passed 54 cases. The independent Lab 6 hosted deadline retest is historical evidence for its own corrected release. [Deadline regression](../../Project_code/server/src/testing/deadline-lab6.a02.ts) · [Lab 6 independent deadline retest](../../docs/labs/lab-06/simulation-3.5/coursepms-retest.md)

## Part C - Sprint 3 contracts and working progress

Source contract, acceptance and local application evidence are versioned under [#27](https://github.com/zerotwobook/fastTrack/issues/27) and [#30](https://github.com/zerotwobook/fastTrack/issues/30). F-08 is the remaining baseline feature after Sprint 2. F-08A and F-08B are implemented in the locally tested source; both increments have independent staging acceptance. Hosted D2 verification is open.

## Part D - Updated requirements and test traceability

Part D uses the English product baseline in [project detail](../../Project_doc/project_detail.md), the accepted Sprint 2 contract and the frozen Sprint 3 contract. The Lab 7 change revises BR-08 for feedback and preserves the existing submission deadline, roles and version association. Detailed SRS, inventory, system design and verification matrix follow in this draft.