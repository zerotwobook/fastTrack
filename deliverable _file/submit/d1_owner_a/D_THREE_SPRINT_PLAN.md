# Part D — Three-sprint plan

Whole-product plan as of accepted staging 3365a36, 7 November 2026. Official assessment dates use Asia/Bangkok, 23:59. Internal dates and effort estimates below are planning targets, not actual hours or completed work.

## D.1 Sprint goals and completion outcomes

| Sprint | Included features / goal | Dependencies | Completion outcome and checkpoint |
| --- | --- | --- | --- |
| 1 | F-01-F-04: real identity, milestone, immutable first submission and version-specific feedback through UI -> API -> PostgreSQL. | G0 agreed scope/interfaces; accepted scaffold/schema/seed; G1 foundation; G2 identity/milestone before submissions/feedback. | Complete two-role domain journey, rule/access/no-write/persistence checks, meaningful TDD, current setup and peer-reviewed main release. D1: 8 Nov 2026. |
| 2 | F-05-F-07: team/planning management, atomic revisions/history and team progress while retaining accepted S1 behavior. | Stable accepted S1; versioned S2 contracts; shared membership/lock/version/status rules; Lab 5 delivery. | Core expansion accepted with upgrade/regression/role tests and durable deployed data. Target finish 23-24 Nov to permit real S3 progress before D2 on 29 Nov. |
| 3 | F-08 summary/filter/drill-down; complete integration, error handling, UAT fixes and final verification. | Accepted S2 and canonical progress/status definitions; scoped aggregation contracts. | Meaningful implemented/tested S3 workflow by D2 on 29 Nov; whole baseline, final UAT/retests/readiness/release/report/video by 13 Dec. |

This is one evolving app, not three rewrites. Each sprint starts from the accepted predecessor. Keep immutable assessed releases and synchronize main ancestry back into active staging through reviewed sync PRs when needed.

## D.2 Allocation and interface ownership

| Round | A leads, B reviews | B leads, A reviews | Joint responsibility |
| --- | --- | --- | --- |
| S1 | Scaffold/config/test wiring; F-01; F-03; Parts A/B/D and domain/TDD evidence. | Schema/migrations/seed/shared UI; F-02; F-04; Parts C/E and access/feedback/UI evidence; PDF assembly. | Interface decisions, real integrated acceptance, regression, final Part F and reviewed release. Authorized corrections preserve the original owner's history and require the other member's review. |
| S2 | Docker/runtime, F-05 teams, F-07 progress and UAT/impact tests. | CI/release, F-05 milestone planning, F-06 revisions and approved maintenance implementation. | Cloud/durable data checks, independent UAT, defect retests, regression and release. |
| S3 | F-08 filters/totals, domain/data QA and traceability; D2 release coordination. | F-08 items/navigation, UI/access/operations QA and package assembly; Final release coordination. | Scope closure, final acceptance/UAT, both members' explanation/demo and submission checks. |

Feature owners implement UI/API/tests/evidence rather than splitting the team permanently into coder/document writer. Separate task branches and separate working directories are required. A coordinates app/API composition and manifests/lockfile; B coordinates schema/migrations/shared primitives. Concrete auth/submission/feedback/status seams are agreed before dependent integration.

## D.3 Sprint 1 sequence and current position

1. G0: agree actors, scope/rules/DTOs/ownership and available time. Accepted baseline PR #44.
2. A scaffold, then B schema/seed/shared UI with peer review. G1 corrections were accepted through PR #50; migration/fixture safety is verified, not inferred from the first scaffold merge.
3. F-01 and F-02 in parallel; integrate real guards and UI. Accepted PRs #54/#56. The remaining G2 UI check/acceptance was explicitly delegated by the user to A/AI using actual byte-identical-source results; it is not an unreported B browser run.
4. F-03 and F-04 on separate owned branches. F-03 is now accepted through B approval/merge of #57; B's F-04 is separate active work. A prepares its D1 sections/evidence concurrently.
5. G3: A tries B's feedback; B tries A's submission/deadline; verify the complete persisted workflow, access and retry with both real implementations.
6. G4: clean final setup, actual restart/retrieval, DB integrity, seed/migration preservation, UI/keyboard/mobile and full regression. Close gaps from the coverage table; test counts alone do not establish acceptance.
7. G5: B peer review of the release, accepted main commit/tag, self-contained PDF A-F with readable source evidence and real contribution/AI-use disclosure. Record LEB2 receipt only after actual submission.

The current baseline satisfies steps 1-3 and the F-03 part of step 4. It does not satisfy G3/G4/G5 or the complete S1 slice. Current-main application release is pending.

## D.4 Internal schedule, effort and risk control

| Period | Planned work / constraint |
| --- | --- |
| 6-7 Nov | Actual team availability was provided as broadly all day; complete foundation, F-01-F-04 and cross-review while collecting evidence. This is availability, not a recorded timesheet. |
| 8 Nov | Reserve time for full regression/restart, peer fixes, release and readable PDF assembly before D1 23:59. |
| 9-15 Nov | Lab 5 Docker/CI/GCP/durable DB and release proof; begin versioned S2 contracts from stable S1. Lab 5 due 15 Nov. |
| 16-22 Nov | Core F-05/F-06 and independent cross-team UAT/defects/retests. Lab 6 due 22 Nov. Select maintenance only for already-working behavior and obtain required approval. |
| 23-24 Nov | Target F-07/accepted S2; regress S1/S2 and migration/history preservation. |
| 25-29 Nov | Real F-08 workflow/tests, approved maintenance/metrics/readiness, D2 candidate. D2 and Lab 7 due 29 Nov as separate submissions. |
| 30 Nov-13 Dec | Bounded completion, final UAT/retests/hardening/release/report/video. Exams run 1-11 Dec; avoid postponing main workflows until 12-13 Dec. |

Initial S1 estimate: setup/auth 6-8, milestones 6-8, submissions/deadline 8-12, feedback 5-7, integration QA 8-12 and review/evidence/PDF 5-7 person-hours: 38-54 before contingency, approximately 46-65 with 20%. These are estimates from planning, not time actually spent. Reassess remaining effort at each gate using actual defects/review turnaround and availability.

Keep at most one dependent implementation active per person. While waiting for a gate, prepare agreed contracts, test designs, fixtures or owned report sections. If time is tight, cut optional decoration and disclose incomplete required work; do not remove security/domain tests, weaken assertions or relabel unfinished baseline behavior as maintenance.

## D.5 Change and release control

Use Issue -> specified scope -> Started before edits -> early Draft PR -> verified review -> accepted staging integration -> reviewed release into main. Fixing is used for actual findings, Done for actual accepted integration. Preserve RED/GREEN, substantive peer review, tested source and immutable releases; no fabricated stage, test, UAT or submission history.

Any changed deadline/revision/progress rule needs an explicit revised contract and impact/regression tests. Lab 7 maintenance requires its prescribed approval and a working prior behavior. Public hosting adds delivery/security decisions such as login throttling and secrets management; those are not claimed complete by a local S1 build.

Part A defines the baseline; Part B maps every requirement into these sprints; Part F records actual verification and remaining gaps. The final PDF's A-F navigation must use real exported page numbers and its submitted release, rather than the preparation snapshot used here.
