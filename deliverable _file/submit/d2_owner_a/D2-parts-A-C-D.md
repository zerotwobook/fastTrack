# fastTrack Project Deliverable 2

**Parts A, C and D working draft** · CPE334 · InfaCompany · EN-028 · Section 31 · Semester 1/2026

| Field | Record |
| --- | --- |
| Members | Supapanya Yathip · 67070503443 · [zerotwobook](https://github.com/zerotwobook) and Atip Infa-udom · 67070503446 · [Atip-Infa](https://github.com/Atip-Infa) |
| Theme and product | Theme 6. fastTrack tracks team milestones, student submissions and supervisor feedback. |
| Repository | [zerotwobook/fastTrack](https://github.com/zerotwobook/fastTrack) |
| Public service | [fastTrack on Cloud Run](https://fasttrack-app-kpx7au3w2a-as.a.run.app) |
| Snapshot | 20 November 2026. UTC for recorded test, review and merge times. Asia/Bangkok for submission and planning dates. |
| D2 submission | 29 November 2026, 23:59 Asia/Bangkok. The assessed Git SHA or tag, deployed source and PDF page ranges are pending. |

[Assignment handout](../../../deliverable%20_file/project_deliverable_2_v1.pdf) · [Task #31](https://github.com/zerotwobook/fastTrack/issues/31) · [Team roster and theme](../../../docs/labs/lab-05/report.md#answer-part-0-team-and-evidence-index)

| Part | Section and evidence IDs |
| --- | --- |
| A | [Sprint 1 continuity and change status](#part-a-sprint-1-continuity-and-change-status) · D2-A01, D2-A02 |
| B | Sprint 2 increment and contracts · [B's handoff](../../../Project_code/docs/evidence/R2-J03-B-release-handoff.md) · [#32](https://github.com/zerotwobook/fastTrack/issues/32) |
| C | [Sprint 3 contracts and working progress](#part-c-sprint-3-contracts-and-working-progress) · D2-C01, F08-AC-01 through F08-AC-08 |
| D | [Updated requirements and test traceability](#part-d-updated-requirements-and-test-traceability) · D2-D01 through D2-D05 |
| E | Integrated release candidate · [#32](https://github.com/zerotwobook/fastTrack/issues/32) and [#33](https://github.com/zerotwobook/fastTrack/issues/33) |

## Part A. Sprint 1 continuity and change status

### D2-A01 Version and continuity evidence

| Evidence role | Recorded source and outcome |
| --- | --- |
| Accepted Sprint 1 tag | `v1.0.0-sprint-1` resolves to `ae7a60a6e3ed0a363dcee920ac1774a02f4f4ab8`. [Tag](https://github.com/zerotwobook/fastTrack/releases/tag/v1.0.0-sprint-1) |
| Accepted Sprint 1 public reference | `main@8e637e537cd037d630a5fffc1b5672d1b44371a8`, serving revision `fasttrack-app-00003-rc7` in the release record. On 20 November at 08:11:37 UTC, both public health and readiness returned HTTP 200 and this SHA. Readiness reported the database connected. [Public release and UAT](../../../docs/labs/lab-06/sessions/2026-11-19-lab6-closeout.md) · [Recorded readback](https://github.com/zerotwobook/fastTrack/issues/13) |
| Accepted Sprint 2 integration baseline | `staging/sprint-2@63e81d1a91f7f288825100b47786823460943e5c`. Joint G3 evidence includes 445 automated cases and seven migration upgrade scenarios passed. [G3 decision](https://github.com/zerotwobook/fastTrack/issues/21) · [CI 44663918612](https://github.com/zerotwobook/fastTrack/actions/runs/44663918612) |
| Tested Sprint 2 release candidate | `staging/sprint-2@1185f3ffc3954a18dd883e451767dc6ad8a3ee6f`, including Lab 7 and the merged UI refinement. Push CI 44697610558 passed **458 cases, 0 failed, 0 skipped**, and **7/7 upgrade cases**. This includes one compiled Sprint 1 journey. [Candidate CI and ci-runtime-report artifact](https://github.com/zerotwobook/fastTrack/actions/runs/44697610558) · [Draft release #129](https://github.com/zerotwobook/fastTrack/pull/129) |
| Accepted Sprint 2 main tag and assessed D2 release | Pending authorized release and the Sprint 3 increment. Record the accepted Sprint 2 SHA, D2 main SHA, CI/deployment runs, image digests, Cloud Run revision and serving version when available. [G6 #26](https://github.com/zerotwobook/fastTrack/issues/26) · [D2 acceptance #33](https://github.com/zerotwobook/fastTrack/issues/33) |

**Original Sprint 1 journey.** F-01 through F-04, T-21/T-22/T-25/T-31. The candidate CI starts the compiled server and client against disposable PostgreSQL 16.8. It seeds an assigned supervisor, two same-team students and a foreign supervisor. It exercises the original workflow with authenticated HTTP requests. [Executed compiled system test](../../../Project_code/server/src/testing/integrated-s1.j03.ts) · [Candidate run](https://github.com/zerotwobook/fastTrack/actions/runs/44697610558)

| Step and actor | Expected | Observed in candidate CI |
| --- | --- | --- |
| Assigned supervisor creates a future milestone. Team student opens it and submits title, description and an HTTPS work link. | Scoped visibility, successful first submission and version 1 with the submitted-by identity derived from the session. | Create and submit returned 201. Student read back the milestone and original author. |
| Assigned supervisor posts feedback, repeats the same request, then adds a second message. A teammate reads the submission. | One row for the repeated request, a second row for the independent append, exact-version binding. | Replay returned 200 with the original row. Changed intent on the same key returned 409 `REQUEST_KEY_REUSED`. The teammate read both messages attached to v1. |
| Repeat the explicit seed and restart the compiled process against the same database. | Same stored IDs, records and scoped reads. | A different process ID served the same submission, feedback and milestone. Database fingerprints remained equal. One submission and two feedback records remained. |
| Foreign supervisor reads the feedback. A student tries writing feedback. A teammate tries submitting a duplicate. The original student signs out. | Scope and role denials, one preserved first submission and revoked access. | Returned 404, 403 and 409 `ALREADY_SUBMITTED` respectively. Signed-out `/auth/me` returned 401. Database fingerprints stayed equal. |
| Exercise the deadline boundary with a waiting transaction. | Accept the exact deadline and reject 1 ms late with zero writes for the rejected milestone. | The separate F-03 suite executed 54 cases with zero failures or skips on the same candidate, including post-lock clock and deadline boundaries. [Submission boundary suite](../../../Project_code/server/src/testing/submissions.a02.ts) |

**D2 release follow-up.** Rerun the original browser journey and selected HTTP checks on the exact assessed D2 release. Record creation and retrieval of the same submission ID and feedback IDs after deployment and an authorized persistence check. Capture the late and foreign-actor denials from the deployed API and label screenshots with role, version and actual result. This run remains pending.

### D2-A02 Change and defect register

| ID and source | Requirements and decision | Fix or release | Status and retest |
| --- | --- | --- | --- |
| C-01–C-06 · Lab 5 #16 | NFR-03/04/06. Adopt required CI, container builds, Cloud Run and Cloud SQL persistence. | Public Sprint 1 `8e637e5`, revision `fasttrack-app-00003-rc7`. Peer-reviewed evidence merged in #104. | Lab 5 closed and accepted. Required-check proof and restart/redeploy comparison retained the same domain records. Full session-survival coverage remains a documented limitation. [Delivery evidence](../../../docs/labs/lab-05/evidence-index.md) · [#16](https://github.com/zerotwobook/fastTrack/issues/16) |
| UAT-01–08 · CoursePMS #22/#23 | FR-02–05, BR-02/03/04/05/07 and NFR-02/03. Preserve Sprint 1 domain, ownership and persistence rules. | Tested public `8e637e5`. | CoursePMS accepted all eight product UAT cases with zero outstanding application defects in that scope. [Lab 6 closeout](../../../docs/labs/lab-06/sessions/2026-11-19-lab6-closeout.md) |
| Section 3.5 deadline exercise · #23/#115 | FR-04, BR-04. Restore the accepted deadline guard in the controlled defect exercise. | Isolated corrected preview `1bbe187c088b86d104a16e420058f17425f18828` and evidence integration `03d5b13`. | The deliberate defect allowed a late write. The corrected preview returned 409 `DEADLINE_PASSED` and empty saved lists. CoursePMS accepted 16/16 retest comparisons. [Execution and source versions](../../../docs/labs/lab-06/simulation-3.5/execution-report.md) |
| CR-L7-01 · TA, #24/#25 | FR-05, BR-08. Increase feedback from 4,000 to 6,000 Unicode code points after trim so supervisors can provide fuller guidance. Preserve the assigned-supervisor write rule and exact-version association. | GREEN `2368d71`, staging merge `7357fd2` through #128. Candidate `1185f3f`. | TA approval and RED/GREEN retained. Local and candidate tests passed. Deployed 5,999/6,000/6,001 with emoji and surrounding whitespace, plus preserved access, remain pending. [Contract and STS](../../../Project_code/docs/contracts/lab-7-feedback-limit.md) · [#128](https://github.com/zerotwobook/fastTrack/pull/128) |
| D2-RISK-01 · Runtime timezone | NFR-04/06. Retain the local PostgreSQL 14.23 fixture finding and verify the effective current app database session timezone. | No app release change applied for this finding. Authorized read-only preflight returned UTC for the prior deployed configuration. | Local Asia/Bangkok fixture had 11 passed and one failure. UTC rerun passed 12/12. The effect on lockouts created by the live login path was unverified. Verify the next revision's configured session timezone. [B's finding](https://github.com/zerotwobook/fastTrack/issues/21#issuecomment-7028845827) · [UTC preflight #26](https://github.com/zerotwobook/fastTrack/issues/26) |
| R2-A-UI-01 · #130/#131 | NFR-05. Improve navigation, responsive alignment and tap targets with a monochrome palette and readable status labels. | Approved head `133f986`, merged as `1185f3f`. | 195 Chromium layout checks across 13 sizes, four interaction walkthroughs and two touch-emulated journeys passed on the approved UI head. Deployed verification follows the release. [UI review evidence](https://github.com/zerotwobook/fastTrack/pull/131) |

## Part C. Sprint 3 contracts and working progress

### D2-C01 F-08 contract draft

**Status as of 20 November 2026** · F-08A and F-08B are planned. Executed evidence below refers to the F-07 building blocks in Sprint 2. F-08 implementation, test execution and acceptance await joint Sprint 3 entry and interface decisions in #27. This draft proposes numbered contract and test IDs for A/B review.

**Scope** · FR-10, BR-02, BR-10 and NFR-02/05. Supapanya owns F-08A summary, filters and weighted totals. Atip owns F-08B filtered results, pagination and drill-down. Both use the existing progress status semantics and agree the shared query and response contract in #27. [F-08A #28](https://github.com/zerotwobook/fastTrack/issues/28) · [F-08B #29](https://github.com/zerotwobook/fastTrack/issues/29) · [Sprint 3 plan](../../../workflow/03_SPRINT3_D2_FINAL.md)

| Area | Proposed feature design for #27 review |
| --- | --- |
| User workflow | A supervisor opens Summary, chooses a team or all assigned teams, optionally filters by status, then opens a scoped milestone through the filtered results. Show completion totals and filtered match count with distinct labels. Overview, items and detail share applicable URL filter state. Back, forward and refresh preserve navigable state while the session is valid. |
| F-08A UI and API | Supervisor-only `/summary` requests `GET /api/summary?teamId=…&status=…`. Omitted team uses assigned teams. The response provides `asOf`, `filters`, `totals`, `teams`, `matchedCount` and `items`. Aggregate and item fields use allowlisted data. |
| F-08B UI and data query | Scoped rows carry team and milestone identifiers, safe titles, deadline, latest version/status where relevant, and a detail link. Apply the same filters, actor scope and `asOf` in the coordinator's snapshot. Use stable due-date order with a milestone ID tie-breaker and an opaque page cursor for items. Exact cursor shape, page limit and whether a separate items endpoint is needed remain #27 decisions. |
| Counts and status | `total` counts active milestones in the selected team scope. `submitted` counts each active milestone with any saved version once. Combine counts across teams before rounding to one decimal. Status filters affect `matchedCount` and `items`. Cancellation stays visible where allowed by the status filter and excluded from completion counts. Feedback status uses the latest submission and a shared database clock. A zero denominator shows 0.0%. |
| Access and validation | Anonymous calls return 401. Students receive 403 for summary. An unassigned or missing team returns the same generic 404 for an authenticated supervisor. Invalid UUID, unsupported or repeated filter, or invalid paging yields 400 `INVALID_INPUT`. Detail uses existing domain authorization. On account changes, clear previous query and draft state and require the new actor's scope. |
| Persistence and consistency | Use the existing team, milestone, submission and feedback relations for a read-only projection. Emit `asOf` from the common snapshot. A refresh after data changes can produce new totals and a later `asOf`. Recompute matching rows and counts on that snapshot. |
| Recovery and accessibility | Provide loading, no assigned teams, no matches, empty last page, validation error, and retry states. Use keyboard-operable filters and detail links, visible focus, responsive layouts and table-contained scrolling at narrow widths and 200% zoom. |

### F-08 acceptance criteria and planned STS

All rows below are **Planned / NOT RUN** for F-08. Their IDs are proposed.

| AC / planned test | Owner and level | Fixture and expected result |
| --- | --- | --- |
| F08-AC-01 / F08-STS-01 | A · API/DB | Assigned teams 1/1 and 0/9. A foreign team has records. Returned aggregate is 1/10 and 10.0%, team rows match the authorized counts, and foreign records contribute zero. |
| F08-AC-02 / F08-STS-02 | A · Unit and API/DB | Empty and cancelled-only teams yield 0.0%. Add a revision and feedback to an old version. Counts stay stable, latest version drives feedback state, exact due equality remains pending and +1 ms becomes overdue when unsubmitted. |
| F08-AC-03 / F08-STS-03 | A and B · API/DB | Combine team and status filters. The status filter changes `matchedCount` and rows while completion stays tied to selected teams. One response uses the same snapshot for totals, count and item status. |
| F08-AC-04 / F08-STS-04 | A and B · API/DB | Anonymous, student, another supervisor, malformed filter and missing team. Assert 401, 403, generic 404 parity or 400 as appropriate, with no foreign team names, totals or feedback. |
| F08-AC-05 / F08-STS-05 | B · API/DB | Tied due dates, several page sizes, invalid cursors and an empty last page. IDs appear once under a fixed fixture, all pages use the agreed order, and totals and matched count stay independent of page size. |
| F08-AC-06 / F08-STS-06 | B with A · UI/API | Save work between fetches. Refresh returns a later `asOf` and corresponding counts. Browser Summary → items → detail → Back/Forward/Refresh retains the intended filters. |
| F08-AC-07 / F08-STS-07 | B · UI and authorization | Switch supervisor accounts in the same browser and attempt a direct foreign detail link. The prior team's rows stay private. Generic denial appears for the foreign item, including after refresh. |
| F08-AC-08 / F08-STS-08 | A and B · UI/system | Verify keyboard interaction, empty/error/retry states, phone and tablet reflow and 200% zoom. Compare the browser totals and filtered rows against the API and persisted fixture. |

**Definition of Done.** A and B freeze AC, STS, scope, paging and snapshot behavior under #27. Both slices gain reviewable UI/API implementations and authenticated tests on accepted Sprint 2. The integrated candidate passes relevant Sprint 1/2 regressions and records at least one executed F-08 workflow with its achieved AC and exact tested commit before D2 review. [Integration #30](https://github.com/zerotwobook/fastTrack/issues/30)

### Remaining work and dated targets

Dates are internal planning targets. Confirm capacity for the 1–11 December examination period.

| Work | Current evidence and dependency | Owner and target | Acceptance evidence to add |
| --- | --- | --- | --- |
| Sprint 2 release and G6 · #26 | Staging source `1185f3f` passed CI. Main authorization, deployed confirmation and joint G6 are pending. | A and B · by 24 Nov | Authorized release, accepted main SHA/tag, Cloud Run readback, persistence, and Lab 7 live record. |
| F-08 contract and startup · #27 | Proposed above, with joint approval and accepted Sprint 2 handoff pending. | A and B · 25 Nov | Agreed query, ownership, DTO, paging, AC/STS and Sprint 3 baseline. |
| F-08A and F-08B · #28/#29 | Planned. F-07 single-team semantics are verified on Sprint 2 and supply the input design. | A and B respectively · 26–27 Nov | Exact tested SHAs, actual weighted totals, filtered rows, negative cases and browser walkthrough. |
| Cross-feature D2 regression and deployed checks · #30/#33 | Depends on accepted integration and an authorized main candidate. | A and B · 28–29 Nov | Demonstrated continuity, at least one meaningful F-08 workflow, release evidence and independent access/persistence checks. |
| Assemble D2 and close Lab 7 · #31/#32/#33 | Working draft and staging records available. Final integrated candidate and assessed evidence pending. | A and B · 29 Nov before 23:59 | Parts A–E, page ranges, tested SHA and separate D2 and Lab 7 receipts. |
| Final completion · #34–#39 | Triage D2 findings on 30 Nov, schedule bounded fixes and retests during 1–11 Dec. | A and B · QA and release package by 12 Dec, submit by 13 Dec 23:59 | Remaining feature tests, independent UAT/retests, immutable release, report/video and final receipt. |

## Part D. Updated requirements and test traceability

### D2-D01 Current SRS and feature inventory

fastTrack supports students and supervisors. Students view their own team, submit work and revisions, and read feedback tied to a submitted version. Supervisors organize assigned teams, set milestones, review submissions and monitor progress. Authentication and team ownership govern every private operation. Grading, file hosting and external course-system integrations are outside the baseline.

**Baseline change CR-L7-01.** The accepted Sprint 1 public source uses the original 4,000-point feedback limit. Tested Sprint 2 staging allows 1–6,000 code points after trim. The assigned-supervisor, exact-version and replay rules still apply. Public confirmation of the new limit follows authorized deployment. [Approved contract and STS](../../../Project_code/docs/contracts/lab-7-feedback-limit.md)

| Feature | Responsibility, dependency and owner | Observed status |
| --- | --- | --- |
| F-01 Identity and team context | FR-01–02. Sessions and scope over seed and account schema. A. | Sprint 1 accepted. Candidate auth and compiled journey passed. |
| F-02 Milestone creation and scoped listing | FR-02–03. Supervisor creation, due dates and authorized reads. Depends on F-01. B. | Sprint 1 accepted. Candidate milestone and compiled suites passed. |
| F-03 First submission | FR-04. One v1, deadline, duplicate/concurrency rejection and saved detail. Depends on F-01/02. A. | Sprint 1 accepted. 54 submission cases and the compiled journey passed on candidate. |
| F-04 Feedback | FR-05. Exact-submission association, append and retry. Depends on F-01/03. B. | Sprint 1 accepted. CR-L7-01 passed on staging. Live change verification pending. |
| F-05A Team planning | FR-06. Creation, rename, candidate lookup and membership. Depends on F-01 and submission history. A. | Staging accepted at `a130a9f`. STS-01–09 and selected UI/DB evidence recorded. |
| F-05B Milestone planning | FR-07. Edit/cancel eligible milestones. Depends on F-02/03 and shared locks. B. | Staging accepted at `09cdf9f`. STS-10–14 and browser/DB evidence recorded. |
| F-06 Revisions | FR-08. Append immutable versions and retain old feedback. Depends on F-03/04. B. | Staging accepted at `18e7a25`. STS-15–22 and integration evidence recorded. |
| F-07 Team Progress | FR-09. Scoped counts and status for one team. Depends on F-05/06. A. | Staging accepted at `3a22d5e`. STS-23–27 and UI/API/DB agreement recorded. |
| F-08A/B Summary | FR-10. Cross-team totals and filters (A), filtered items and drill-down (B). Depend on accepted S2 and F-07. | Planned. Proposed AC and STS in Part C. |

### D2-D02 System-Level SDS

| Responsibility | Design |
| --- | --- |
| Presentation and runtime | React/TypeScript with Vite renders the client. Express/TypeScript serves the compiled client and JSON routes under `/api` on one origin. The UI displays distinct loading, empty, error and success states, Bangkok deadlines, neutral surfaces and status cues. |
| Authentication and state | One role and a password hash per user. The server persists hashed session tokens, expiry and revocation in PostgreSQL, uses an HTTP-only cookie, and supplies CSRF in the designated auth responses. Mutation guards verify request source, role, CSRF and database scope. Private responses use `no-store` and the UI masks private state when identities change. |
| Data model | Prisma/PostgreSQL implement users, sessions, teams, team members, milestones, submissions, feedback and the authentication rate-limit ledger. A team has one assigned supervisor, student membership is unique, and a milestone retains its deadline and optional cancellation instant. `(milestoneId, version)` identifies one stored version. Feedback uses the exact `submissionId` and the unique `(supervisorId, clientRequestId)` key. |
| Transactions and state | Team then Milestone locks serialize cross-feature writes. Read database acceptance time and recheck scope after locking. Preserve the checked/stored instant, millisecond deadline equality and one v1 row per milestone. Revisions append on an expected-version check. Team rename preserves the ID. Cancellation is terminal and keeps the milestone row. |
| Read models and API | Scoped DTOs expose allowlisted fields. Responses use `data`, domain `meta.serverTime` and safe error envelopes with request IDs. Progress uses a single repeatable-read snapshot and an `asOf` aligned with the server timestamp. The planned F-08 projection uses the same scope and timing semantics for team totals and filtered results. |
| Migrations and operations | Forward migrations and add-only seed preserve credentials, teams and records. Lab 7 widens the feedback body and check bound. Tests use disposable databases and production uses Cloud SQL. GitHub Actions verifies source, build and isolated regression, builds serving and migration/job images, and delivers through protected main, WIF and Cloud Run. Health reports version and readiness adds database connectivity. |

[Project design](../../../Project_doc/project_detail.md) · [Original SDS](../d1_owner_b/C_SYSTEM_SDS.md) · [Prisma schema](../../../Project_code/server/prisma/schema.prisma) · [Sprint 2 contracts](../../../Project_code/docs/contracts/sprint-2-feature-interfaces.md) · [Setup](../../../Project_code/README.md) · [Deployment](../../../docs/labs/lab-05/deployment.md)

### D2-D03 Baseline requirements and execution matrix

**Version key.** **P** = `1185f3f` and exact CI 44697610558, fully identified in Part A. **S1 public** = `8e637e5` and its Lab 5/Lab 6 evidence. **F08 draft** = planned IDs in Part C. P run outcomes apply to the recorded staging candidate. Final D2 release and deployed reruns remain open.

| FR | Current requirement → feature / sprint | AC and planned verification | Actual file / result and gap |
| --- | --- | --- | --- |
| FR-01 | Authenticate identity, resolve current user and sign out → F-01 / S1 | AC-01.1–01.4, S1-AC-EXT-01/05 · T-01–04/23/27 | P [session tests](../../../Project_code/server/src/testing/sessions.auth.ts) and J03 passed. Implemented. |
| FR-02 | Read only authorized teams, members and milestones → F-01/02 and scope services / S1–S3 | AC-01.5/02.1/03.5/04.2, S2-AC-07, F08-AC-04/07 · T-05/07/14/18/25, STS-28, F08-STS-04/07 | P [sessions](../../../Project_code/server/src/testing/sessions.auth.ts) and [G3 checks](../../../Project_code/server/src/testing/integrated-s2.auth.ts) passed for S1/S2. F-08 scope planned. |
| FR-03 | Create and read a validated milestone and deadline → F-02 / S1 | AC-02.1–02.3 · T-06–08 | P [milestones](../../../Project_code/server/src/testing/milestones-review.b01.ts) and J03 passed. Implemented. |
| FR-04 | Submit valid first work at or before the deadline and read it back → F-03 / S1 | AC-03.1–03.6, S1-AC-EXT-04 · T-09–16/26 | P [F-03 suite](../../../Project_code/server/src/testing/submissions.a02.ts) 54 passed and J03 passed. Implemented. |
| FR-05 | Append scoped feedback and read it on its exact submission → F-04 / S1 plus Lab 7 | AC-04.1–04.4, S1-AC-EXT-02/03, L7-AC-01–05 · T-17–20/24/25 and L7-STS-01–05 | P [feedback](../../../Project_code/server/src/testing/feedback-review.b02.ts) and J03 passed. Staging 6,000 limit implemented. Live L7-STS-05 pending. |
| FR-06 | Create/rename owned teams and maintain members before history → F-05A / S2 | S2-AC-01/02 · STS-01–09, T-28 | P [team planning](../../../Project_code/server/src/testing/team-planning.auth.ts) and D2-S2-01 passed. Implemented. |
| FR-07 | Edit or cancel eligible owned milestones → F-05B / S2 | S2-AC-03 · STS-10–14, T-28 | P [milestone planning](../../../Project_code/server/src/testing/milestones-f05b.b01.ts) and B's [browser/DB record](../../../Project_code/docs/evidence/R2-J03-B-release-handoff.md) passed. Implemented. |
| FR-08 | Append revisions with immutable history and exact feedback → F-06 / S2 | S2-AC-04/05 · STS-15–22, T-29 | P [revisions](../../../Project_code/server/src/testing/revisions-f06.b02.ts) and STS-32 passed. Implemented. |
| FR-09 | Read scoped one-team status, counts and percentages → F-07 / S2 | S2-AC-06 · STS-23–27, T-30 | P [progress](../../../Project_code/server/src/testing/progress.auth.ts) passed and D2-S2-02 measured 3/4. Implemented. |
| FR-10 | Supervisor views scoped multi-team summary, filters and drill-down → F-08 / S3 | F08-AC-01–08 · F08-STS-01–08, T-30 | Planned. Part C records contract draft. Implementation, test and acceptance evidence pending. |

| BR | Current rule → feature / sprint | AC and planned verification | Actual file / result and gap |
| --- | --- | --- | --- |
| BR-01 | One role, at most one team per student, one supervisor per team → F-01/F-05A / S1–S2 | AC-01.5, S2-AC-01/02 · T-05, STS-01/07–09 | P [foundation](../../../Project_code/server/src/testing/foundation.g1.ts) and [membership race](../../../Project_code/server/src/testing/team-planning.auth.ts) passed. Implemented. |
| BR-02 | Use database scope for every protected read/write → F-01–08 / S1–S3 | AC-01.5/02.2/03.5/04.2, S2-AC-07, F08-AC-04/07 · T-05/07/14/18/25 and STS-28 | P [cross-feature scope](../../../Project_code/server/src/testing/integrated-s2.auth.ts) and role suites passed. F-08 remains planned. |
| BR-03 | Supervisors create milestones and feedback. Team students submit work → F-02–04 / S1 | AC-02.2/03.5/04.2 · T-07/14/18 | P milestone, submission, feedback and J03 cases passed. Implemented. |
| BR-04 | Work is accepted through deadline equality using the post-lock DB instant. Store UTC instants and display Bangkok timestamps → F-03/F-05B/F-06 / S1–S2 | AC-03.2, S1-AC-EXT-04, S2-AC-03/04 · T-10–12/26, STS-13/18 | P [submission timing](../../../Project_code/server/src/testing/submissions.a02.ts), [milestone planning](../../../Project_code/server/src/testing/milestones-f05b.b01.ts) and [revision timing](../../../Project_code/server/src/testing/revisions-f06.b02.ts) passed. Implemented. |
| BR-05 | Allow only one v1 and preserve the record on duplicate → F-03/F-06 / S1–S2 | AC-03.3/03.6, S2-AC-04 · T-13/16/26, STS-15/17 | P F-03/F-06 and J03 passed. One row survived duplicate request and restart. Implemented. |
| BR-06 | Append atomic revisions and preserve earlier submission/feedback association → F-06/F-04 / S2 | S2-AC-04/05 · T-29, STS-16/17/20/21/32 | P [revisions](../../../Project_code/server/src/testing/revisions-f06.b02.ts) and STS-32 passed. Implemented. |
| BR-07 | Append private feedback per submission and replay the same intent idempotently → F-04 / S1–S2 | AC-04.1–04.4, S1-AC-EXT-02, S2-AC-05, L7-AC-04 · T-17–20/24, STS-20, L7-STS-04 | P [feedback suite](../../../Project_code/server/src/testing/feedback-review.b02.ts) and J03 passed. Implemented. |
| BR-08 | Trim and count Unicode text. Title 1–120, description 1–4,000, HTTP(S) URL up to 2,048 with hostname and no embedded credentials. Feedback 1–4,000 public S1 and 1–6,000 staging Lab 7 → F-02–06 / S1–S2 | AC-02.3/03.4/04.3, S2-AC-01/03/04, L7-AC-01–03 · T-08/15/19, STS-04/10/19, L7-STS-01–03/05 | P validation and migration passed. 6,001 yields zero inserts. Live Lab 7 retest pending. [Change contract](../../../Project_code/docs/contracts/lab-7-feedback-limit.md) |
| BR-09 | Lock membership and milestone mutations after relevant history. Preserve records and assigned supervisor → F-05A/B / S2 | S2-AC-02/03 · T-28, STS-07–09/11/12/14 | P [team planning](../../../Project_code/server/src/testing/team-planning.auth.ts) and [milestone planning](../../../Project_code/server/src/testing/milestones-f05b.b01.ts) passed. D2-S2-01 records 409 and preserved membership. Implemented. |
| BR-10 | Count active milestones once, handle zero/cancelled rows and use weighted cross-team counts → F-07/F-08 / S2–S3 | S2-AC-06, F08-AC-01–03 · T-30, STS-23–27, F08-STS-01–03 | P [calculation](../../../Project_code/server/src/modules/progress/calculation.test.ts) and [progress API](../../../Project_code/server/src/testing/progress.auth.ts) passed for F-07. F-08 integration remains planned. |

| NFR | Responsibility and planned verification | Actual evidence / result | Gap |
| --- | --- | --- | --- |
| NFR-01 | Password hashing, expiry/revocation, safe auth response/logging and CSRF · F-01/runtime all sprints · T-01–04/23, STS-28 | P [auth/session](../../../Project_code/server/src/testing/sessions.auth.ts) and [runtime](../../../Project_code/server/src/testing/runtime.a01.ts) passed. Implemented. | Verify logout/session on assessed deployment. |
| NFR-02 | Scoped protected APIs and safe denials · all sprints · T-05/07/14/18/25/27, STS-28, F08-STS-04/07 | P STS-32 and negative access checks passed. S1 public CoursePMS scope verified. | F-08 and final deployed negatives. |
| NFR-03 | Persist committed records across restart/redeploy and schema upgrade · S1/2 and delivery · T-16/20/29/31, STS-29/31, L7-STS-03 | P J03 retained records after repeat seed and process restart. P 7/7 upgrades. S1 public Lab 5 restart/redeploy preserved records. | D2 persistence after deployment. |
| NFR-04 | Reproduce install, safe seed/build/run/migrate/test · all sprints · T-22/31, STS-29–31 | P CI installed, generated schema client, passed typecheck, build, isolated regression and image builds. Implemented. [Setup](../../../Project_code/README.md) | Independent reproduction of exact assessed SHA. |
| NFR-05 | Accessible forms, recovery, scope masking and responsive UI · all sprints · T-21/27, STS-22/31, F08-STS-08 | [UI PR #131](https://github.com/zerotwobook/fastTrack/pull/131) records 195 layout checks at 13 widths on `133f986`. P has the same Git tree. | F-08 tables/account switching and final native zoom. |
| NFR-06 | Required CI blocks failures and released source matches deployment · Lab 5 onward · C-01/02/06, T-31, final smoke | [Lab 5 required gate and released source](../../../docs/labs/lab-05/evidence-index.md) verified on S1 public. P CI passed. | Authorized main source, digest/revision match, smoke and persistence. |

### Acceptance status by checkpoint

| Acceptance group | Implementation at snapshot | Executed verification |
| --- | --- | --- |
| AC-01.1–01.5, AC-02.1–02.3 | Sprint 1 accepted. | Named baseline checks covered identity, milestones and scope. Retained auth, milestone and compiled journey passed on P. |
| AC-03.1–03.6, AC-04.1–04.4 | Sprint 1 accepted. CR-L7-01 revises the feedback-content maximum on staging. | Named baseline checks covered submit and feedback. Retained suites and compiled journey passed on P. |
| S1-AC-EXT-01–05 | Sprint 1 protections and recovery implemented. | Original verification matrix records each executed acceptance check. P reran auth, submission and feedback suites. The later UI audit covers selected newer browser paths. |
| S2-AC-01 / S2-AC-02 | Team creation/rename and history-safe membership implemented. | STS-01–09 passed in scoped PostgreSQL/API evidence. D2-S2-01 verifies the interactive scenario. |
| S2-AC-03 | Milestone edit/cancel and serialization implemented. | STS-10–14 passed. B recorded persisted updates and rejection after history. |
| S2-AC-04 / S2-AC-05 | Atomic versions, immutable history and recovery implemented. | STS-15–22 passed at reviewed staging scope. STS-32 also passed on P. |
| S2-AC-06 | Scoped team progress implemented. | STS-23–27 passed. D2-S2-02 records one matched readback across browser/API/DB. |
| S2-AC-07 / S2-AC-08 | Shared cross-feature protection and reviewed interfaces integrated. | P auth, runtime, migrations and G3 integration passed. Final D2 candidate rerun pending. |
| L7-AC-01–04 | Limit, transport and migration implemented on staging. | STS-01–04 passed in archived GREEN and candidate CI. |
| L7-AC-05 | Release verification defined. | NOT RUN on the public service for the approved change. |
| F08-AC-01–08 | Planned. | NOT RUN. See the proposed STS for each AC in Part C. |

[Named Sprint 1 test coverage and execution scope](../../../Project_code/docs/evidence/R1-J03-coverage.md) · [Sprint 2 AC and STS](../../../Project_code/docs/contracts/sprint-2-feature-interfaces.md) · [G3 verification](../../../Project_code/docs/evidence/R2-J02-A-integration.md)

### D2-D04 Selected Sprint 2 program evidence

**D2-S2-01 · F-05A Team Planning · S2-AC-01/02.** B ran compiled Chromium and disposable PostgreSQL 14.23 UTC at `fef3593ce44f722b579aaba307b5b2e4cfab9747`. Supervisor A created synthetic Team Delta, added an eligible student, removed and re-added the member, and the student saved v1. The expected team-history lock stops further membership edits and allows renaming within the same team.

| Observation | Actual |
| --- | --- |
| Chromium | “Membership is locked because this team has submission history.” There were zero visible Add/Remove buttons. The rename showed “Team name saved.” |
| API | Assigned supervisor member POST and DELETE returned 409 `TEAM_HISTORY_LOCKED`. Foreign-supervisor GET, PATCH, member POST and DELETE returned [404, 404, 404, 404]. |
| PostgreSQL | Team Delta Renamed persisted with the original membership count of one. |

*Caption D2-S2-01. A real history lock prevents membership changes and preserves the owned team and saved work. Source fef3593.* [B's browser/API/DB record](https://github.com/zerotwobook/fastTrack/issues/21#issuecomment-7028845827) · [Team planning PR](https://github.com/zerotwobook/fastTrack/pull/117)

**D2-S2-02 · F-07 Team Progress · S2-AC-06.** In B's independent run at `fef3593`, an assigned supervisor checked a synthetic team of five milestone rows, one cancelled and three active submitted. In A's separate run at `0ac247b781369f2694ac96eb76176fe52813cd59`, a team student submitted v2 and reopened v1. Expected progress counted each submitted active milestone once, with the status reflecting the latest version.

| Observation | Actual |
| --- | --- |
| PostgreSQL, B | Five milestones, one cancelled, four active and three active submitted. |
| Progress API, B | HTTP 200, `total=4`, `submitted=3`, `progressPercent=75`, five rows including `CANCELLED`. `asOf` aligned with `meta.serverTime`. |
| Chromium, B | “3 of 4 active milestones submitted,” “75.0%,” and all five links including the cancelled milestone. |
| Revision and feedback, A | v1 with one feedback showed `FEEDBACK_AVAILABLE`. v2 with zero feedback showed `SUBMITTED`. The percentage stayed at 75%, original v1 feedback remained visible, and the browser logged zero page errors. |

*Caption D2-S2-02. The same team progress totals appear in database, API and browser evidence. The v1→v2 transition changes the status while preserving the count and the original feedback.* [B's observations](https://github.com/zerotwobook/fastTrack/issues/21#issuecomment-7028845827) · [A's recorded browser output](../../../Project_code/docs/evidence/R2-J02-A-browser.json)

### D2-D05 Selected tests and reviewed history

**Domain test by A.** STS-23/25 seeds four active milestones and one cancelled row, with revisions and feedback. The student has a real Team A session. The test calculates from the scoped milestone source, compares to the progress payload, and checks the same count after a revision. This excerpt shows the first read. [Progress test](../../../Project_code/server/src/testing/progress.auth.ts)

~~~ts
const cookie = await login(fixtures.users.stuA1.email);
const response = await getProgress(teamA.id, cookie).expect(200);
const source = await api.get(`/api/teams/${teamA.id}/milestones`).set('Cookie', cookie).expect(200);
const { data, meta } = response.body;
expect(meta).toEqual({ serverTime: data.asOf });
expect(new Date(data.asOf).toISOString()).toBe(data.asOf);
const expectation = calculateProgress(source.body.data, new Date(data.asOf));
expect(data).toEqual({ teamId: teamA.id, asOf: meta.serverTime, ...expectation });
expect(data).toMatchObject({ total: 4, submitted: 3, progressPercent: 75 });
~~~

**Access test from B's F-06 suite.** STS-19/28 begins with a real Team A v1. The recorded test compares a foreign-team write with a missing-resource write and checks that rejected calls leave the original row count at one. [Revision test](../../../Project_code/server/src/testing/revisions-f06.b02.ts)

~~~ts
const foreign = await postRevision(fixtures.milestones.milestoneBTeam.id, revBody(1), stuA1);
const absent = await postRevision(randomUUID(), revBody(1), stuA1);
expect(foreign.status).toBe(404);
expect(absent.status).toBe(404);
expect(foreign.body).toEqual(absent.body);
~~~

Both named cases passed on P. The workflow ran `npm run test:runtime:isolated` from `Project_code` on disposable PostgreSQL 16.8, alongside typecheck, production build and both Docker target builds. Its artifact retained the following Vitest counts. [CI and case-level results](https://github.com/zerotwobook/fastTrack/actions/runs/44697610558)

| Suite | Passed | Failed | Skipped |
| --- | ---: | ---: | ---: |
| Unit/API | 198 | 0 | 0 |
| Foundation | 38 | 0 | 0 |
| Auth, team planning, progress and G3 integration | 46 | 0 | 0 |
| B01 milestones | 48 | 0 | 0 |
| A02 submissions | 54 | 0 | 0 |
| B02 feedback and revisions | 61 | 0 | 0 |
| J03 compiled Sprint 1 journey | 1 | 0 | 0 |
| A01 runtime | 12 | 0 | 0 |
| **Total** | **458** | **0** | **0** |

All seven migration upgrade scenarios also passed. The selected UI and UAT observations retain their separate tested versions and fixtures.

**Test-first continuity change.** A committed CR-L7-01 and its STS at `b46b7de`, then tested `e3758fb` while the 4,000-point rule still ran. The `npm run test:b02:isolated` output showed 51 passes and eight expected failures. Six valid-input cases received 400, one escaped JSON case hit the original parser limit and one insert exceeded the old PostgreSQL column length. B reviewed the contract and implemented the new limit, parser and forward migration at `2368d71`. The same boundary tests passed on GREEN, and P passed 61/61 feedback and revision cases. [RED result](../../../Project_code/docs/evidence/R2-A05-lab7-red-results.json) · [GREEN verification](../../../Project_code/docs/evidence/R2-B05-lab7-green.md) · [Reviewed change](https://github.com/zerotwobook/fastTrack/pull/128)

| Chain | Author, review and staging integration | Release linkage |
| --- | --- | --- |
| A · [#19](https://github.com/zerotwobook/fastTrack/issues/19) → [#119](https://github.com/zerotwobook/fastTrack/pull/119) · F-07 / S2-AC-06 · `feature/s2-a-progress` | A authored `5fe16cd`. B approved 19 Nov at 17:55:05 UTC after checking snapshot consistency, scope, 3/4 counting, revision status, and keyboard behavior. Staging merge `3a22d5e` at 17:57:27 UTC. | Included in P and Draft #129. Accepted main and deployed release evidence pending. |
| B · [#20](https://github.com/zerotwobook/fastTrack/issues/20) → [#120](https://github.com/zerotwobook/fastTrack/pull/120) · F-06 / S2-AC-04/05 · `feat/s2-b-f06-revisions` | B authored the feature. A reviewed draft loss, stale conflict recovery and terminal error precedence, then retested corrected head `e7e07c3`. A approved 19 Nov at 18:26:51 UTC. Staging merge `18e7a25` at 18:27:03 UTC. [A's retest](https://github.com/zerotwobook/fastTrack/pull/120#issuecomment-7017803159) | Included in P and Draft #129. Verify version history on the final deployed candidate. |

**Assembly notes.** A's working draft covers Parts A/C/D. B reviews the proposed F-08B details and supplies Parts B/E under [#32](https://github.com/zerotwobook/fastTrack/issues/32). AI assisted with evidence comparison, Markdown organization and the proposed traceability draft. Existing human and assisted execution records keep their original attribution. Add the executed F-08 case, final candidate verification, captioned evidence and page references at package assembly.
