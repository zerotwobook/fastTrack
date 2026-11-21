# Project Deliverable 2 - fastTrack

**CPE 334 Software Engineering | Semester 1/2026**<br>
**Theme 6 - Course Project Management System**<br>
**Report draft | 21 November 2026 | Due 29 November 2026 at 23:59 Asia/Bangkok**

| Item | Record |
| --- | --- |
| Member A | `zerotwobook`. Add full name and student ID in the course submission copy. |
| Member B | `Atip-Infa`. Add full name and student ID in the course submission copy. |
| Repository | [zerotwobook/fastTrack](https://github.com/zerotwobook/fastTrack) |
| Accepted Sprint 1 | [v1.0.0-sprint-1](https://github.com/zerotwobook/fastTrack/tree/v1.0.0-sprint-1) at `ae7a60a6e3ed0a363dcee920ac1774a02f4f4ab8` |
| Accepted Sprint 2 | [v1.0.0-sprint-2](https://github.com/zerotwobook/fastTrack/tree/v1.0.0-sprint-2) at `f3ff8d9704c6e2a3705805412f538b2b216569ad` |
| Locally tested D2 application source | [Staging 84c4a31](https://github.com/zerotwobook/fastTrack/tree/84c4a31220898957be96c9a54cff0d6e37832821), verified with real sessions and PostgreSQL. |
| Submitted D2 tag/commit and deployed URL/version | Pending exact release authorization, deploy verification and package acceptance. |

| Rubric | Report location | Assessment pages |
| --- | --- | --- |
| A - Sprint 1 continuity and change status (5) | [Part A](#part-a---sprint-1-continuity-and-change-status) | Assign during assembly |
| B - Sprint 2 contracts and working increment (25) | Pending B's contribution under [#32](https://github.com/zerotwobook/fastTrack/issues/32) | Assign during assembly |
| C - Sprint 3 contracts and working progress (15) | [Part C](#part-c---sprint-3-contracts-and-working-progress) | Assign during assembly |
| D - Updated requirements and test traceability (10) | [Part D](#part-d---updated-requirements-and-test-traceability) | Assign during assembly |
| E - Integrated release candidate (15) | B's contribution under [#32](https://github.com/zerotwobook/fastTrack/issues/32) | Assign during assembly |

## Part A - Sprint 1 continuity and change status

### A.1 Accepted baseline and original journey

The accepted Sprint 1 increment established one course context with seeded supervisor and student identities, milestone planning, on-time first submission and feedback attached to the exact submission. The accepted Sprint 2 release preserved that workflow and added planning, revisions and progress. D2's locally tested source contains both baselines plus the Sprint 3 supervisor Summary.

**A-01. Supervisor creates a milestone, a student submits, and the team retrieves feedback after restart.** F-01 through F-04, S1-AC-EXT-02/03 and tests T-21/22/25/31. Roles are an assigned supervisor, a student and teammate, and a supervisor assigned to another team. The compiled server starts with a seeded, disposable PostgreSQL database. The supervisor creates a future milestone, the student retrieves it and submits version 1, and the supervisor appends two messages with distinct request keys. The teammate retrieves the messages and confirms each references the saved submission. The test repeats seed, restarts the compiled app, and retrieves the same work and feedback. It expects durable records, a safe repeat seed, scoped access and one version 1.

**Observed at `84c4a31`.** The compiled HTTP journey passed. Responses preserved the same submission and feedback after restart and the database fingerprint stayed stable. A foreign supervisor received HTTP 404, a student feedback write received 403, and a duplicate first submission received 409 `ALREADY_SUBMITTED`. The guarded production-image socket run separately passed 17 checks, including the compiled business flow, restart, repeated seed and database outage readiness. [Test source](../../Project_code/server/src/testing/integrated-s1.j03.ts) · [Candidate run and results](https://github.com/zerotwobook/fastTrack/blob/70f0d6401ed4c701354242aa23405a84c75df053/Project_code/docs/evidence/R3-J01-f08-integration.md)

### A.2 Deadline and ownership continuity

**A-02.** F-03, BR-04/05, S1-AC-EXT-04 and T-26. Applicable to the assigned student, with an unsubmitted milestone. The boundary tests check exact equality and a request delayed beyond the deadline while waiting for a database lock. Equality may be accepted. A late first submit returns 409 with zero new rows. The candidate's submission/deadline suite passed 54 cases. The independent Lab 6 hosted deadline retest is historical evidence for its own corrected release. [Deadline boundary source](../../Project_code/server/src/testing/submissions.a02.ts) · [Lab 6 regression source](../../Project_code/server/src/testing/deadline-lab6.a02.ts) · [Lab 6 independent deadline retest](../../docs/labs/lab-06/simulation-3.5/coursepms-retest.md)

### A.3 Change and defect register

| ID and source | Requirement and decision | Status, release and retest |
| --- | --- | --- |
| Lab 5 C-01 to C-06, #16 and PRs #85, #84, #99/#100 | F-01 to F-04, NFR-03/04/06. Put the existing app behind the tested CI, Docker and Cloud Run path. Keep migration/seed explicit and PostgreSQL outside the app container. | Historical cloud flow and domain persistence passed on the Lab 5 release chain ending at source `8e637e5`. The deliberate C-02 failure showed the required check blocks merge. The controlled PRs were closed without merging. Long-running session survival remained unverified in Lab 5. Candidate local image/DB/restart verification passed at `84c4a31`. [Lab 5 register](../../docs/labs/lab-05/report.md) |
| Lab 6 UAT-01 to UAT-08, CoursePMS return, 19 November | F-01 to F-04, BR-02/04/05 and NFR-02/03. Independent team returned Accepted with no outstanding defects in the agreed S1 cases. | Eight reported passes on the historical live S1 workflow. Version probes observed `8e637e5`. The compiled journey and A-02 provide the local D2 continuity results. [Human decision and evidence limits](../../docs/labs/lab-06/sessions/2026-11-19-lab6-closeout.md) |
| Lab 6 `3.5, CPMS-S35-01 to 03, PR #115 | F-03, BR-04, T-26. Isolated exercise deliberately removed enforcement, then restored the existing post-lock deadline guard. | Corrected isolated preview `1bbe187`: independent acceptance with 16/16 comparison checks. On-time 201 and identical persisted version 1. Two late attempts returned 409 with zero late rows. Local D2 deadline regression passed. [Exercise and retest record](../../docs/labs/lab-06/simulation-3.5/execution-report.md) |
| CR-L7-01, #24/#25 and PR #128 | F-04, BR-08, L7-AC-01 to 05. TA approved enlarging the trimmed feedback limit from 4,000 to 6,000 Unicode code points. Emoji, trimming, authorization and exact-version association were tested. | Shipped in `v1.0.0-sprint-2`. Deployed L7-STS-05 saved and read back 5,999 and 6,000, denied 6,001 with no write, and preserved the original C-04 record. Local D2 feedback/revision regression passed 61 cases. [Contract](../../Project_code/docs/contracts/lab-7-feedback-limit.md) · [Hosted retest and release](https://github.com/zerotwobook/fastTrack/issues/26) |

### A.4 Selected TDD evidence - CR-L7-01

A wrote the approved contract at `b46b7de` and added the new boundary assertions at `e3758fb` on `maintenance/lab7-feedback-limit`. The assertions exercised 5,999 and 6,000 trimmed code points with plain text, emoji and padded input, plus direct database acceptance and valid escaped JSON reaching domain validation. At RED, the existing 4,000-point rule returned 400 for the newly valid requests and the database rejected the new bound. B implemented the shared validator, client counter, route body handling and forward database migration in `2368d71`. A strengthened the escaped JSON check at `d2b6c16`. The reviewed result merged through [PR #128](https://github.com/zerotwobook/fastTrack/pull/128) as `7357fd2`, then shipped in the Sprint 2 release via [PR #129](https://github.com/zerotwobook/fastTrack/pull/129).

| Stage | Reproduction from `Project_code/` | Actual result |
| --- | --- | --- |
| RED · `e3758fb` | `npm ci` and `npm run test:b02:isolated` | 51 passed, 8 expected rule failures. The matching [CI run](https://github.com/zerotwobook/fastTrack/actions/runs/44672187909) failed. [RED record](../../Project_code/docs/evidence/R2-A05-lab7-red.md) |
| GREEN · `2368d71` | `npm run test:runtime:isolated` on [CI 44675948834](https://github.com/zerotwobook/fastTrack/actions/runs/44675948834) | 61 feedback cases passed in the 458-case run with 0 failures. The widened validation and migration preserved prior feedback. [GREEN record](../../Project_code/docs/evidence/R2-B05-lab7-green.md) |
| Integration and deployment | Required CI [44679245716](https://github.com/zerotwobook/fastTrack/actions/runs/44679245716) on `5315c9e`, then [main CI](https://github.com/zerotwobook/fastTrack/actions/runs/44719877378) and [deployment](https://github.com/zerotwobook/fastTrack/actions/runs/44719877524) on `f3ff8d9` | Main CI recorded 458 passed, 0 failed, 0 skipped and 7/7 legacy migration upgrades. Hosted L7-STS-05 passed on that release. |

### A.5 Continuity screen capture for assembly

![Historical student view showing the persisted original submission and its feedback](../../docs/labs/lab-05/evidence/C04-native-student.png)

*Figure A-1. Historical F-03/F-04 readback (AC-03.6, AC-04.4, C-04), source `8e637e5`. The student signs in to the team that already submitted and opens the saved version. The expected version and supervisor feedback are visible. A-01 supplies the exact D2 local API/restart result. Capture the same student view after D2 deployment and add the public version/readback to Part E. [Capture provenance](../../docs/labs/lab-05/evidence/C04-native-readback.md)*

## Part C - Sprint 3 contracts and working progress

### C.1 Accepted contract and implementation

F-08 is the remaining Sprint 3 baseline feature. The team froze the [F-08 contract](../../Project_code/docs/contracts/sprint-3-f08-summary.md) through [#27](https://github.com/zerotwobook/fastTrack/issues/27) and [PR #133](https://github.com/zerotwobook/fastTrack/pull/133) before implementing the two slices. A owns F-08A overview, filters and weighted totals. B owns F-08B results, pagination and detail return. Their reviewed implementations are in the local D2 source.

- **Workflow and interface.** A supervisor opens `/summary`, selects a team/status, pages through the results, and opens an existing scoped milestone detail. Filters and page live in the URL. Filter or page-size changes reset to page 1. The detail return permits only the local `/summary` path and validated query fields. Sign-out or role/account changes discard previous data and pending responses. Loading, no teams, no matches, empty page, invalid filters and retryable errors each have a UI state.
- **API.** `GET /api/summary` accepts optional `teamId`, `status`, `page` and `pageSize`. Defaults are page 1 and size 20, maximum size 50. Valid statuses are `CANCELLED`, `FEEDBACK_AVAILABLE`, `SUBMITTED`, `OVERDUE` and `PENDING`. Auth precedes query validation: 401 without a session, 403 for a student, 400 for invalid/unknown/repeated filters, and equivalent scoped 404 responses for a missing or foreign team. The no-store response carries `asOf`, normalized filters, completion totals, team rows, `matchedCount`, paged items and `meta.serverTime`. Item fields are milestone/team IDs, team name, title, deadline, status and latest version.
- **Data and rules.** One read-only repeatable-read PostgreSQL snapshot derives team scope from the session and captures database time once. No migration was required for F-08. Completion includes all selected teams' active milestones and counts each milestone with any submission once. The percentage is rounded to one decimal from combined submitted and active counts, with zero when the denominator is zero. A status filter changes the result count and rows. Results sort by `dueAt ASC, id ASC` before paging. A valid out-of-range page returns empty items and retains the filtered count. Status precedence is cancelled, latest-version feedback, submitted, overdue after the deadline, then pending. The unfiltered list includes cancelled rows.
- **Definition of done.** Peer-accept both slices, exercise scoped UI/API/DB together, verify F-07 parity and earlier Sprint 1/2 regression, record the exact candidate source, then match its deployment with the serving revision and rerun critical checks. The hosted steps remain open.

### C.2 Acceptance and software test specifications

Each criterion below is implemented at `84c4a31`. Automated checks ran through `npm run test:runtime:isolated`, with the F-08 API cases in `test:b01`. Browser checks used the compiled candidate, real sessions and disposable PostgreSQL. [Local execution record and machine output](https://github.com/zerotwobook/fastTrack/blob/70f0d6401ed4c701354242aa23405a84c75df053/Project_code/docs/evidence/R3-J01-f08-integration.md)

| AC / planned STS | Expected verification | Executed evidence and result |
| --- | --- | --- |
| F08-AC-01 / F08-STS-01 | API/DB: combine scoped teams at 1/1 and 0/9 to get 1/10 and 10%, with foreign milestones excluded. | PASS locally. `summary-overview.b01.ts` and Chromium/SQL matched 10.0% and team rates of 100.0% and 0.0%. |
| F08-AC-02 / F08-STS-02 | Unit/API/DB: zero, cancelled, deadline equality/+1 ms, revisions and old/latest feedback follow F-07. | PASS locally. `summary-overview.b01.ts`, `summary-drilldown.b01.ts` and `calculation.test.ts` exercise the rules. One submitted milestone with two versions counted once; its v1 feedback stayed on v1. |
| F08-AC-03 / F08-STS-03 | API/DB: compare unfiltered, team/status-filtered and concurrent-write reads. One response uses a consistent snapshot; a new read observes the newly committed data. | PASS locally. Both summary suites checked a committed first submission during the snapshot. The independent browser refresh and SQL also agreed before and after the write. |
| F08-AC-04 / F08-STS-04 | API: 401 anonymous, 403 student, 400 invalid and equivalent 404 foreign/missing, including direct foreign detail. | PASS locally. Both summary suites, with student 403 and foreign detail 404 also reproduced through real sessions. |
| F08-AC-05 / F08-STS-05 | API/DB: tied due times, valid max size, invalid values, page boundaries, stable order and counts. | PASS locally. `summary-drilldown.b01.ts` checks the tie-break and out-of-range pages. The C-01 recovery also passed. Pager wording remains open. |
| F08-AC-06 / F08-STS-06 | Browser and API: filter, page, open detail, use return and Back/Forward/reload, reset page on filter change, reject invalid returns, refresh. | PASS locally. Candidate Chromium, `navigation.test.ts` and real authenticated requests. |
| F08-AC-07 / F08-STS-07 | Browser: switch disjoint supervisors during a pending response. Then try a foreign link and student access. | PASS locally. Candidate Chromium checked no stale rows, generic foreign detail and student omission/403. |
| F08-AC-08 / F08-STS-08 | Browser: empty/error/retry states, labelled controls, focus, narrow layout and zoom-equivalent reflow. | PASS locally at 320, 390, 640, 768 and 1280 CSS px. The 640 px check approximates the reflow width of a 1280 px viewport at 200% zoom. The pager label remains a wording follow-up. |

### C.3 Demonstration - filtered summary reacts to a saved submission

**C-01 · F08-AC-01/03/05/06/07 · staging `84c4a31`.** An assigned supervisor has two teams, ten active milestones, one cancelled milestone and one saved submission. A student belongs to the team with the pending milestone. A second supervisor has disjoint teams.

1. The supervisor opens Summary, selects Pending and page 2 at size 8. Expected: 1/10 completion and one row of nine matches. Actual: UI 10.0%, API `matchedCount: 9` with one row, and PostgreSQL independently reported one submitted and nine pending. The supervisor opens the row, uses Back to summary and repeats with browser Back. The original query is restored both times.
2. The student submits work. After HTTP 201, the supervisor refreshes with the same filter. Expected: the saved submission changes the completion and match count and the second page offers recovery. Actual: PostgreSQL and API agree on 2/10 submitted, eight pending, zero rows on page 2 and a later `asOf`. The UI shows 20.0%, explains the empty page and links to page 1 with the Pending filter and size 8 retained.
3. A student requests Summary directly and a foreign supervisor opens the same milestone address. Expected and actual: backend 403 and generic 404 respectively. Neither response exposes the other team's records.

![Weighted completion and nine matching pending milestones on page two](https://raw.githubusercontent.com/zerotwobook/fastTrack/70f0d6401ed4c701354242aa23405a84c75df053/Project_code/docs/evidence/assets/s3-j01/weighted-overview-1280.png)

*Figure C-1. C-01 steps 1 and 2 precondition. Supervisor, Pending filter, size 8 and page 2. Expected and actual are 10.0% completion, nine matches and one visible row. Source `84c4a31`.*

![Refreshed summary shows twenty percent, eight pending matches and empty second-page recovery](https://raw.githubusercontent.com/zerotwobook/fastTrack/70f0d6401ed4c701354242aa23405a84c75df053/Project_code/docs/evidence/assets/s3-j01/refreshed-empty-page-1280.png)

*Figure C-2. C-01 step 2 after a real student write. Expected and actual are 20.0% completion, eight matches and a working link back to page 1. Source `84c4a31`. The pager also displays “Page 2 of 1.”*

Atip-Infa independently repeated the complete runtime suite and the Summary UI/API/SQL comparison on the exact source and recorded local G2 acceptance in [#30](https://github.com/zerotwobook/fastTrack/issues/30) on 21 November Asia/Bangkok. The report includes 483 passed Vitest cases, zero failed, zero skipped, 7/7 historical migration scenarios, eight browser groups and 17/17 production-image/socket checks. Both runs exposed the pager wording. B recommended deferring it because the empty-page message, returning to page 1 and the totals all work. The staging source check [44777769845](https://github.com/zerotwobook/fastTrack/actions/runs/44777769845) passed. Public verification and the full #30 checkpoint remain open.

### C.4 Domain test excerpt - weighted completion versus result count

The real PostgreSQL API test signs in as a seeded supervisor, gives that supervisor a second team, and creates one submitted milestone and one cancelled milestone in the first team plus nine future pending milestones in the second team. These assertions are from the test body.

~~~ts
const totals = { total: 10, submitted: 1, pending: 9, overdue: 0, progressPercent: 10 };
const all = await getSummary(cookie).expect(200).expect('Cache-Control', 'no-store');
~~~

~~~ts
const filtered = await getSummary(cookie, '?status=PENDING&page=2&pageSize=8').expect(200);
expect(filtered.body.data).toMatchObject({ totals, matchedCount: 9, teams: all.body.data.teams,
  filters: { teamId: null, status: 'PENDING', page: 2, pageSize: 8 } });
expect(filtered.body.data.items).toEqual([expect.objectContaining({ milestoneId: pendingIds[8], status: 'PENDING' })]);
~~~

The criterion passed in the 57-case `test:b01` portion of the actual `npm run test:runtime:isolated` run at `84c4a31`. The unfiltered response in the full test has 11 visible rows with the cancelled entry and the same ten active milestones in completion. [Test source](../../Project_code/server/src/testing/summary-overview.b01.ts)

### C.5 Selected A Issue and PR chain

A implemented #28 on `feature/s3-a-summary-overview`. Atip-Infa [reviewed exact head `9070561`](https://github.com/zerotwobook/fastTrack/pull/135#pullrequestreview-5996002975) on 20 November at 16:31 UTC. The review checked the scoped read-only snapshot, 10% weighted fixture, independent result count, preserved URL and mobile table behavior. [PR #135](https://github.com/zerotwobook/fastTrack/pull/135) merged at 16:32 UTC as `416a830`. The merged source is part of `84c4a31` and was locally exercised with F-08B. The main release and hosted evidence will be recorded in Part E.

### C.6 Remaining work and acceptance

Dates below are internal targets. The 1-11 December examination period is reserved for bounded fixes and retests as availability permits.

| Record / impact | Owner and target | Dependency and acceptance |
| --- | --- | --- |
| #32, D2 Parts B/E and B's evidence | B · Part B first draft by 24 Nov, combined evidence by 28 Nov | Use accepted S2 source and reviewed contracts. Include two persisted S2 demonstrations, a real access-test excerpt and B's review chain. Add Part E deployment evidence after the release below. |
| #30, hosted F-08 and continuity | A/B · by 27 Nov | After exact user release authorization and non-author review, match new main SHA, immutable tag, build, registry digest, GCP serving revision and public health/readiness. Re-run C-01 and A-01 post-deploy, with original submission/feedback IDs, expected denied requests and independent review. |
| #33, D2 and Lab 7 packages | A/B · by 28 Nov | After #30, #31 and #32 acceptance. Cross-check A-E, rubric navigation, submitted tag/URL, setup, contribution/AI disclosures and each separate package. Record course receipts after actual submissions due 29 Nov at 23:59 Asia/Bangkok. |
| #30 finding, F08-AC-05/08 | B with A review · target 30 Nov | Fix the documented `Page 2 of 1` label after D2. Preserve the URL, filters and working page-1 recovery. Retest refresh, pagination/filters, focus and narrow layout on the fix. |
| #34/#35, final domain and delivery retests | A/B · bounded retests during 1-11 Dec, freeze target 12 Dec | Close findings from D2 and UAT; confirm browser/access, durable data, regression and versioned rollout on the final candidate. Update setup and walkthrough. |
| Final report, video and release | A/B · freeze 12 Dec, submit by 13 Dec | Final verified release and substantive peer acceptance. Reconcile report/demo/version and use the actual course submission record. |

## Part D - Updated requirements and test traceability

### D.1 Updated SRS

fastTrack supports a single course-project context. Students read their team's milestones, submit work links, revise before the deadline and read exact-version feedback. Supervisors plan and supervise their assigned teams, append feedback, and inspect per-team progress and multi-team Summary. The course assessor uses the private seeded-account handoff or a local fixture. Grading, file upload, public feedback, self-registration, SSO, notifications and simultaneous multi-course administration are outside this baseline. All runtime roles are Student and Supervisor.

The requirements register in D.4 is the current Functional Requirements (FR), Business Rules (BR) and Non-Functional Requirements (NFR) specification. CR-L7-01 supersedes the original BR-08 feedback limit; the existing description and work-link limits stay at 4,000 and 2,048 respectively. The Lab 6 isolated deadline exercise confirmed enforcement of the unchanged deadline rule.

### D.2 Feature inventory

| Feature / sprint | Observable responsibility | Dependency and implementation status |
| --- | --- | --- |
| F-01 / 1 | Sign-in, current identity, sign-out, role-scoped team context | Seeded users and membership. Implemented and accepted in S1; regression executed on D2 local. |
| F-02 / 1 | Supervisor creates a milestone; authorized roles list/read it | F-01. Implemented and accepted in S1; regression executed on D2 local. |
| F-03 / 1 | Student's first submission, deadline, duplicate prevention and saved readback | F-01/02. Implemented and accepted in S1; regression executed on D2 local. |
| F-04 / 1 | Supervisor appends private feedback to an exact submission version | F-01/03. Implemented and accepted in S1; L7 size revision released in S2 and checked on D2 local. |
| F-05A / 2 | Supervisor creates/renames teams and manages eligible membership | F-01 and history locks. Implemented and accepted in S2; regression executed on D2 local. |
| F-05B / 2 | Supervisor edits or cancels eligible milestones | F-02/03 and history locks. Implemented and accepted in S2; regression executed on D2 local. |
| F-06 / 2 | Student revises with version conflict protection; old versions and feedback remain readable | F-03/04. Implemented and accepted in S2; regression executed on D2 local. |
| F-07 / 2 | Team progress and derived statuses for scoped team members or supervisors | F-05/06. Implemented and accepted in S2; regression executed on D2 local. |
| F-08A / 3 | Supervisor overview, scoped filters, weighted completion and response coordinator | F-07, shared F-08 contract. Implemented, peer-accepted in staging and locally verified. |
| F-08B / 3 | Filtered milestones, deterministic paging and detail return | F-02/07 and F-08 shared snapshot/URL. Implemented, peer-accepted in staging and locally verified. |
| Delivery / cross-cutting | Versioned build, migration, readiness, protected rollout and persistence checks | Historical S2 rollout verified. Exact hosted D2 version and evidence are pending. |

### D.3 Current System-Level SDS

**Runtime boundaries.** React/TypeScript/Vite renders the routes for sign-in, teams, milestones, submissions, revisions, feedback, progress and Summary. Express serves the built application and `/api` from one origin in the production web image. The browser uses the API via HTTP with an allowlisted DTO, and never connects to PostgreSQL. Express handles actor identity, origin and CSRF, scope, validation, transactions and safe error responses. Prisma with its PostgreSQL adapter supplies persistent reads and writes. Shared validation and status/URL logic prevent drift between the client, API and report calculation. Feature modules group identity, team planning, milestones, submissions, feedback, progress and reporting.

**Interface ownership.** Identity uses `/api/auth/login`, `/api/auth/me` and `/api/auth/logout`. Teams expose scoped read endpoints and supervisor-only create, rename, membership and available-student operations. Milestones expose create/list under teams, individual scoped detail, eligible update and cancellation. First submit and revisions use separate milestone routes. Saved versions and feedback are scoped by their own resource IDs. Progress is `GET /api/teams/:id/progress`. F-08 extends the same API with `GET /api/summary` and C.1's filters, fields and snapshot. Success envelopes expose typed fields and server time where applicable. Errors carry a safe error code/message and field details when useful. Protected responses are no-store.

**Data and invariants.** `User` has one role with a hashed password. A `Session` belongs to a user and stores token-derived data and expiry. `AuthRateLimit` tracks rate-limit keys/counters. A `Team` has one supervisor and `TeamMember` links students, with uniqueness preventing one student from joining two teams. A `Milestone` belongs to a team, records its creator and stores `dueAt` and optional terminal `cancelledAt`. A `Submission` belongs to a milestone and is unique by milestone and version. It stores the author, accepted timestamp and work metadata. `Feedback` links to one submission and supervisor and enforces scoped request-key uniqueness and the migrated 6,000-point content bound. PostgreSQL foreign keys, unique constraints and forward migrations preserve the relationships.

**Concurrency and reporting.** Plan changes, membership and submit/revise operations serialize on shared locks, recheck actual ownership/history, and apply time-sensitive rules after locking. First submit creates v1 once. Revision checks `expectedVersion` against the locked latest state. Feedback preserves append/replay semantics and never moves across versions. F-07 and F-08 use scoped, snapshot-consistent reads, with F-08 consolidating totals, team rows and its paged list in one read-only repeatable-read transaction.

**Session and error design.** Production uses HTTPS, an HttpOnly Secure session cookie with SameSite protection, fixed expiry and logout revocation. Authentication uses designated bootstrap and CSRF responses; protected writes require the correct source, token, role and database authorization. Foreign and missing private objects have the same safe response. Response allowlists, no-store, and client cache clearing on identity change protect account transitions. Input is validated after trimming with documented length and time boundaries. Server diagnostics stay out of general user responses.

**Deployment design.** The npm workspace builds the client and API. Docker separates a web runner from a source-matched migration/jobs image. Cloud Run serves the app, with Cloud SQL supplying the PostgreSQL database. GitHub Actions runs required tests, builds immutable SHA-tagged artifacts and uses keyless GCP authentication, migration-before-rollout and smoke. `/api/health` identifies the compiled version without contacting the database. `/api/ready` checks database connectivity and fails closed when unavailable. Seeds are explicit and use synthetic data. A release readback ties source, tag, image digests, serving revision, traffic and post-deploy evidence together. [Architecture and repository setup](../../Project_code/README.md) · [Clean-container regression](../../Project_code/README.md#clean-container-regression) · [Physical data model](../../Project_code/server/prisma/schema.prisma) · [Delivery contract](../../Project_code/docs/contracts/sprint-2-lab-05-delivery-contract.md)

### D.4 Requirements-to-verification matrix

**Version key.** S1 = accepted tag `ae7a60a6`. S2 = accepted tag `f3ff8d9`. D2-local = `84c4a31`. A PASS in the last column refers to executed coverage on D2-local unless another version is explicitly shown. Planned test IDs identify the designed verification. Historical UI, human UAT and release results retain their original version. Coverage labels in each row distinguish implemented behavior, executed evidence and remaining checks.

| Requirement | Feature / sprint and planned verification | Actual evidence and result |
| --- | --- | --- |
| FR-01 · Login, current identity and logout | F-01 / 1 · AC-01.1-01.4, T-01-04; EXT-01/05, T-23/27 | Implemented · PASS: `sessions.auth.ts` and compiled J03 real login/me/logout/replay. |
| FR-02 · Read only team, membership and milestones within scope | F-01/02 / 1 · AC-01.5, AC-02.2, EXT-03; T-05/07/25 | Implemented · PASS: `sessions.auth.ts`, `milestones-review.b01.ts` and J03 list/detail parity. |
| FR-03 · Assigned supervisor creates and retrieves a milestone | F-02 / 1 · AC-02.1-02.3, T-06-08 | Implemented · PASS: `milestones-review.b01.ts` persists scoped content and deadline; A-01 compiled readback. |
| FR-04 · Student submits title, description and URL and retrieves the saved record | F-03 / 1 · AC-03.1-03.6, T-09-16/26 | Implemented · PASS: `submissions.a02.ts` and J03 persist exact v1 and exercise boundary, privacy, duplicate and restart checks. |
| FR-05 · Assigned supervisor appends exact-submission feedback; team reads it | F-04 / 1, L7 / 2 · AC-04.1-04.4, EXT-02, T-17-20/24; L7-AC/STS-01-05 | Implemented · PASS: `feedback-review.b02.ts` and J03; hosted L7-STS-05 at S2. |
| FR-06 · Create/rename teams and manage eligible students | F-05A / 2 · S2-AC-01/02, STS-01-09 | Implemented · PASS: `team-planning.auth.ts` verifies creation, rename, ownership, membership and concurrent assignment. |
| FR-07 · Edit or cancel a milestone before any submission | F-05B / 2 · S2-AC-03, STS-10-14 | Implemented · PASS: `milestones-f05b.b01.ts` checks lock, timing and terminal cancellation. |
| FR-08 · Append revisions and preserve history and feedback | F-06 / 2 · S2-AC-04/05, STS-15-22; T-29 | Implemented · PASS: `revisions-f06.b02.ts` and `integrated-s2.auth.ts` cover conflicting writers, exact versions and feedback retention. |
| FR-09 · Read the scoped progress board, statuses and completion | F-07 / 2 · S2-AC-06, STS-23-27; T-30 | Implemented · PASS: `progress.auth.ts` and `calculation.test.ts` match stored records and expected percentages. |
| FR-10 · Supervisor views, filters and drills into assigned-team Summary | F-08 / 3 · F08-AC/STS-01-08 | Implemented · PASS locally: both summary suites and C-01. Hosted deployment and readback: pending. |
| BR-01 · One role per account, at most one team per student, one supervisor per team | F-01/05A / 1-2 · AC-01.5, T-05; S2-AC-01/02, STS-01/07/08 | Implemented · PASS: `foundation.g1.ts`, `sessions.auth.ts` and `team-planning.auth.ts` retain ownership and assignment uniqueness. |
| BR-02 · Database membership/assignment gates every protected read and write | F-01-08 / 1-3 · T-05/07/14/18/25/27; STS-03/21/27/28; F08-STS-04/07 | Implemented · PASS: scoped real-session suites and C-01 deny foreign/student access. Repeat hosted negative checks. |
| BR-03 · Supervisors create milestones/feedback; student team members submit/revise | F-02/03/04/06 / 1-2 · AC-02.2, AC-03.5, AC-04.2, T-07/14/18; S2-AC-04/07, STS-15/28 | Implemented · PASS: milestone, submission, feedback and revision API suites, with A-01 student feedback write denied. |
| BR-04 · Accept up to and including database time at dueAt, store UTC and display Bangkok time | F-03/05B/06/07 / 1-2 · AC-03.2/03.3, EXT-04, T-10-13/26; STS-13/18/25 | Implemented · PASS: `submissions.a02.ts`, `deadline-lab6.a02.ts` and `revisions-f06.b02.ts` cover equal time, late rejection and lock crossing. Historical S1 UI and Lab 6 check display. |
| BR-05 · First submission creates unique immutable v1; duplicates add nothing | F-03/06 / 1-2 · AC-03.3, T-13/26; STS-15/17 | Implemented · PASS: `submissions.a02.ts`, J03 and revision suite; duplicate 409 and one committed v1. |
| BR-06 · Revisions increment atomically; earlier versions and exact feedback survive | F-04/06 / 1-2 · AC-04.4, T-20/29; S2-AC-04/05, STS-16/17/20/21 | Implemented · PASS: revision and integrated S2 suites plus C-01 version readback. |
| BR-07 · Private, append-only feedback with no grading decision | F-04 / 1 · AC-04.1-04.4, EXT-02, T-17-20/24 | Implemented · PASS: `feedback-review.b02.ts` and J03 check append, replay, changed-intent 409 and scope. |
| BR-08 · Trim and validate title 1-120, description 1-4,000, feedback 1-6,000 code points, HTTP(S) URL ≤2,048 | F-02/03/04/05/06 / 1-2 · AC-02.3, AC-03.4, AC-04.3; T-08/15/19; STS-04/10/19; L7-STS-01-04 | Implemented · PASS: scoped input suites and Lab 7 GREEN. Hosted 5,999/6,000/6,001 verified on S2. |
| BR-09 · Lock milestone plan and team membership once work exists; preserve history and supervisor assignment | F-05A/05B / 2 · S2-AC-02/03, STS-09/11/14, T-28 | Implemented · PASS: team planning and milestone planning API/DB suites check both operation orders and saved rows. |
| BR-10 · Count non-cancelled milestones; one completion per submitted milestone; weight by combined counts | F-07/08 / 2-3 · S2-AC-06, STS-23-27, T-30; F08-STS-01-03 | Implemented · PASS: calculation and progress API suites, C-01 UI/API/SQL 10.0% then 20.0%. |
| NFR-01 · Hash passwords, protect tokens, enforce expiry/revocation and limit CSRF disclosures | F-01 / 1-3 · EXT-01/05, T-01-04/23/27; STS-28 | Implemented · PASS: `sessions.auth.ts`, `runtime.a01.ts` and cookie/socket checks. Hosted configuration/observability to confirm on D2. |
| NFR-02 · Server enforces role and ownership for private lists, records and mutations | F-01-08 / 1-3 · T-05/07/14/18/25/27; STS-28; F08-STS-04/07 | Implemented · PASS: scope suites and C-01. Hosted check pending for D2. |
| NFR-03 · Durable submissions and feedback through restart and release | Persistence / 1-3 · T-16/20/31, STS-29/30 | Implemented · PASS: J03 and 17/17 local socket checks. Historical Lab 5 restart and redeploy PASS plus S2 original C-04 readback. D2 hosted redeploy evidence pending. |
| NFR-04 · Reproduce install, migration, seed, build, run and tests from the tracked setup | Build / 1-3 · T-22/31, STS-29/31 | Implemented · PASS: clean D2-local clone, npm install, fresh/repeat migration, seven upgrades and compiled plus production-image checks. Reviewer handoff and final clean setup readback pending. |
| NFR-05 · Render usable loading, errors, success and empty states without internals | All UI / 1-3 · T-21/27, STS-31, F08-STS-06/08 | Implemented · PASS for selected local Summary states, focus and supported widths. Historical S1/S2 UI evidence remains versioned. Pager wording and actual D2 hosted walkthrough remain open. |
| NFR-06 · Block release on failed required CI; match main, artifacts and serving release with smoke | Delivery / 2-3 · Lab 5 C-01-06, T-31; #30 hosted check | Implemented. Historical blocking proof and S2-hosted source identity PASS. D2 staging CI PASS and local health/readiness PASS; D2 main/digest/revision/traffic/smoke verification pending. |

**Acceptance reference.** The original Sprint 1 map covers all 18 numbered ACs and five extensions at its recorded verification source. The eight Sprint 2 ACs group STS-01-32. F-05A covers S2-AC-01/02 and F-05B covers 03. F-06 covers 04/05, F-07 covers 06, and the integration suites cover 07/08. The S2 G6 decision records the accepted release. D.4 maps representative executed results on the D2-local candidate, and Part B carries the detailed S2 completion and demonstration evidence. C.2 records every F-08 AC separately. [Sprint 1 coverage map](../../Project_code/docs/evidence/R1-J03-coverage.md) · [Sprint 2 planned and executed mappings](../../Project_code/docs/contracts/sprint-2-feature-interfaces.md) · [Accepted Sprint 2 G6](https://github.com/zerotwobook/fastTrack/issues/26)

### D.5 Feature acceptance coverage

Every Sprint 1 and Sprint 2 AC below is implemented in D2-local. The original S1 evidence records every AC at the S1 verification source. The D2-local column records the executed suite or scenario on `84c4a31` that covers each group of explicit AC IDs. Historical UI evidence and checks due on the hosted candidate are identified separately. Sections A and C provide the detailed continuity and F-08 checks.

| Criterion IDs | Planned test IDs | Executed result |
| --- | --- | --- |
| AC-01.1, AC-01.2, AC-01.3, AC-01.4, AC-01.5 | T-01, T-02, T-03, T-04, T-05 respectively | PASS, `test:auth`: real login, bad credentials, expiry, logout/CSRF and role scope. |
| AC-02.1, AC-02.2, AC-02.3 | T-06, T-07, T-08 respectively | PASS, `test:b01`: create/read, authorized/foreign actors and validation. |
| AC-03.1, AC-03.2, AC-03.3 | T-09; T-10/11/12; T-13 | PASS, `test:a02`: persisted version 1, deadline boundary and duplicate race. |
| AC-03.4, AC-03.5, AC-03.6 | T-15; T-14; T-16/31 local | PASS, `test:a02` and J03: content boundaries, denial and durable saved readback. |
| AC-04.1, AC-04.2, AC-04.3, AC-04.4 | T-17/20; T-18/19/20; T-17/19; T-20/31 local | PASS, `test:b02` and J03: append, scope, validation and durable exact-version readback. |
| S1-AC-EXT-01, S1-AC-EXT-02, S1-AC-EXT-03, S1-AC-EXT-04 | T-23, T-24, T-25, T-26 respectively | PASS, `test:auth`, `test:b02`, J03 and `test:a02`: auth bootstrap/CSRF, exact intent replay, scoped DTO and deadline lock wait. |
| S1-AC-EXT-05 | T-27 | PASS for historical S1 browser acceptance and D2-local selected account-switch checks. D2 hosted original-journey browser retest pending. |
| S2-AC-01, S2-AC-02 | STS-01-04, STS-05-09 respectively | PASS, `test:auth`, `team-planning.auth.ts`: team edit, eligible member and lock behaviors. |
| S2-AC-03 | STS-10-14 | PASS, `test:b01`, `milestones-f05b.b01.ts`: edit/cancel, saved history and deadline race. |
| S2-AC-04, S2-AC-05 | STS-15-19, STS-20-22 respectively | PASS, `test:b02`: atomic version and saved history. Historical S2 browser evidence covers draft retention. Hosted replay pending. |
| S2-AC-06 | STS-23-27 | PASS, `test:auth`, `progress.auth.ts` and the calculation suite: persisted status and percentages. |
| S2-AC-07 | STS-28-31 | PASS on documented local auth, migrations, S1 regression and selected UI. Hosted release identity and broader final UI retests pending. |
| S2-AC-08 | STS-32 | PASS on integrated S2 API/DB test and independently accepted staging integration in #21. |
| L7-AC-01 to 04 | L7-STS-01 to 04 | PASS on `test:b02` and the guarded schema upgrade suite. A.4 preserves the expected pre-fix failures. |
| L7-AC-05 | L7-STS-05 | PASS on deployed S2, as recorded in A.3. D2 hosted repeat pending. |
| F08-AC-01 to 08 | F08-STS-01 to 08 | PASS locally. C.2 names the executed verification and current findings for each criterion. |

### Evidence index and contribution record

| Evidence | Where to find it |
| --- | --- |
| Original journey, deadline and ownership | A-01, A-02, Figure A-1 and post-deploy capture to be added in Part E |
| Approved maintenance and RED/GREEN evidence | A.3-A.4, CR-L7-01, commits and machine outputs |
| Sprint 3 operational workflow, test excerpt and peer history | C-01, Figures C-1/C-2, C.4 and PR #135 |
| Requirements, feature inventory and system design | D.1-D.4 |
| Two Sprint 2 demos, B's access-test excerpt and review chain | Pending Part B contribution under #32 |
| D2 deployed identity, S1/S2/S3 readbacks and setup | Pending Part E contribution after release |

A compiled the Sprint 1 continuity, domain evidence, F-08A and traceability. B implemented the F-08B slice, reviewed A's Summary, independently repeated local candidate verification, and owns the Sprint 2/release report sections. Codex assisted A with this draft and source reconciliation and with the recorded browser/API automation. Human review, user release authorization and CoursePMS acceptance retain their recorded attribution. Public D2 execution and final human/package acceptance remain pending.
