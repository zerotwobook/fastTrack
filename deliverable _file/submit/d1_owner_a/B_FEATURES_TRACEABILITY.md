# Part B — Feature inventory and traceability

Baseline: accepted staging 3365a36e4cd1fcdd7410cca2086447ec4ae5dc33, 7 November 2026, Asia/Bangkok. A prepared this inventory; B reviews it. It covers the whole product. Execution labels apply to this baseline, not B's unaccepted active feedback candidate or a future release.

## B.1 Inventory, ownership and dependencies

| Feature | Purpose / dependencies | Sprint and primary allocation | Baseline result |
| --- | --- | --- | --- |
| F-01 Identity/team context | Real login/me/logout, immutable identity and scoped teams; schema/seed prerequisite. | 1 / A; B reviews | Accepted through PR #54 |
| F-02 Milestones | Supervisor create, both-role scoped track/list/detail; F-01. | 1 / B original; authorized A correction, B peer review | Accepted through PR #56 |
| F-03 First submission | Student version 1, locks/deadline/duplicates, saved read/recovery; F-01/F-02. | 1 / A; B reviews | Accepted through PR #57 |
| F-04 Feedback | Supervisor append/read, exact submission/version association and retry key; F-01/F-03. | 1 / B; A reviews | Active separate work, not integrated in this baseline |
| F-05 Teams/planning | Eligible membership, rename and unsubmitted-milestone edit/cancel; F-01-F-04. | 2 / A teams, B milestone planning | Planned |
| F-06 Revisions | Atomic version/expectedVersion/history; F-03/F-04. | 2 / B; A reviews | Planned |
| F-07 Team progress | Canonical statuses, count-based percentage and scoped board; F-05/F-06. | 2 / A; B reviews | Planned |
| F-08 Summary | Assigned-team aggregate/filter/drill-down with consistent data/time; F-07. | 3 / A filters/totals, B details/navigation | Planned |

Each member owns their assigned feature's UI/API/tests/evidence. Shared composition/schema/lockfile changes are coordinated through the workflow. Foundation/migration, auth, delivery and accessibility are named system responsibilities rather than additional invented feature IDs.

## B.2 Functional coverage

| Requirement | Feature(s) | Establish / planned verification |
| --- | --- | --- |
| FR-01 | F-01 | S1 AC-01.1-01.4; T-01-T-04/T-23/T-27 |
| FR-02 | F-01/F-02 plus every protected domain read | S1 AC-01.5/02.1/03.5/04.2, T-05/T-07/T-14/T-18/T-25; expand S2-S3 |
| FR-03 | F-02 | S1 AC-02.1-02.3, T-06-T-08 |
| FR-04 | F-03 | S1 AC-03.1-03.6, T-09-T-16/T-26 |
| FR-05 | F-04 | S1 AC-04.1-04.4, T-17-T-20/T-24/T-25 |
| FR-06 | F-05 team service | S2 eligible/multiple assignment, history lock and scoped team CRUD; T-28 extension |
| FR-07 | F-05 milestone planning | S2 future deadline/edit/cancel/history-lock and concurrent first submission; T-28 |
| FR-08 | F-06 | S2 S1-data upgrade, stale expectedVersion, preserved IDs/history/feedback; T-29 |
| FR-09 | F-07 | S2 canonical status/zero/cancelled/revision and count-based progress; T-30 |
| FR-10 | F-08 | S3 aggregate/filter/drill-down/asOf, weighted totals and scope; T-30 |

## B.3 Rule coverage

| Requirement | Feature / system responsibility | Sprint / planned verification |
| --- | --- | --- |
| BR-01 | Foundation seed/constraints, F-01 and F-05 membership | S1 real unique/FK/seed tests; S2 assignment concurrency |
| BR-02 | Auth/team scope, F-01-F-08 | S1 method/path matrix and no-write/equal-404; extend every sprint |
| BR-03 | Required role guards and domain scope in F-02/F-03/F-04 | S1 T-07/T-14/T-18; direct API requests despite hidden controls |
| BR-04 | F-03 deadline; later F-06 | S1 T-10-T-12/T-26 exact 1ms, offset, DB clock after lock; repeat for revisions |
| BR-05 | F-03 and unique milestone/version constraint | S1 T-13/T-26 duplicate/concurrent write and immutable original data |
| BR-06 | F-06 and F-04 exact association | S2 T-29, stale revision/migration preservation/version-specific feedback |
| BR-07 | F-04 | S1 T-17-T-20/T-24 private append/read/replay; preserve in S2 history |
| BR-08 | Shared validation in F-02-F-06 | S1 T-08/T-15/T-19 Unicode/type/key/URL boundaries; extend S2 |
| BR-09 | Team/milestone transaction coordination in F-05 | S2 T-28 race/history protection; S1 submissions already use team -> milestone locks |
| BR-10 | F-07/F-08 read models | S2-S3 T-30 zero/cancelled/version statuses and weighted totals |

## B.4 Quality coverage

| Requirement | Named responsibility | Sprint and practical verification |
| --- | --- | --- |
| NFR-01 | Hash/session/source/CSRF lifecycle and safe errors/logs | S1 T-01-T-04/T-23; regress every sprint |
| NFR-02 | DB-scoped API/service reads and writes | S1 T-05/T-07/T-14/T-18/T-25/T-27; S2/S3 negative aggregates/planning |
| NFR-03 | Durable DB, immutable history, data-preserving migration/restart | S1 T-16/T-20/T-31 local; Lab 5 redeploy; final data integrity |
| NFR-04 | Lockfile/config, guarded fixtures, README and clean install | S1 T-22/T-31; clean-checkout checks again for final assessed release |
| NFR-05 | Shared UI plus feature forms/track/recovery/keyboard/mobile | S1 selected browser checks/T-21/T-27; inspect each added screen |
| NFR-06 | Required-check/release/deployment identity and smoke | Lab 5 CI/Docker/GCP; verify failures block normal merge/release, then final |

## B.5 Actual evidence and explicit gaps

The detailed A-owned AC/test/source map and results are embedded in [Part F](F_A_VERIFICATION.md). Accepted F-01/F-03 evidence is actual, including peer review; F-02's independent verification is retained separately. Test inventory IDs T-01-T-31 describe planned scenarios, not the count of runner cases.

| Scope | Current evidence / remaining work |
| --- | --- |
| F-01 | 28 real auth/API/DB cases at 2899d1b plus browser/client-state checks; accepted PR #54. |
| F-02 | 33 B01 cases at 3b7b2cc: 7 retained test-actor service cases + 26 real-session cases; browser checks; accepted PR #56. |
| F-03 | 48 API/DB/service cases at 1bf8d63 plus real browser recovery/privacy/deadline checks; accepted PR #57. |
| F-04 / T-17-T-20/T-24 | NOT VERIFIED for accepted baseline 3365a36. B owns the separate candidate; A has not claimed it passes. |
| T-21 complete normal journey | NOT RUN with accepted feedback; G3 required. Partial create/submit/read flow is verified and labelled partial. |
| T-22/T-31 | Accepted-source clean setup, guarded seed/migration and compiled submission restart pass; final S1/feedback restart and assessed-release reproduction still require G4. |
| Combined browser UI immediately after actual process restart | API process-restart and independent browser reload checks pass; this combined scenario is not separately recorded and remains a G4 follow-up. |
| NFR-06, F-05-F-08, T-28-T-30 | Later-sprint/Lab 5 verification, not S1 completion claims. |
| Final D1 release/PDF | G3/G4/G5, immutable main reference, B-owned C/E/F completion and PDF pagination/assembly are pending. |

No baseline requirement is silently removed to fit the deadline. Later-sprint AC/tests will be elaborated and versioned before those implementations. Reconcile these status rows against the final release instead of copying candidate results as release evidence.
