
# Independent Final UAT worksheet

Prepared by A for the joint [R3-J03 checkpoint](https://github.com/zerotwobook/fastTrack/issues/36). Use this worksheet once A and B accept the prerequisite regressions, agree on the candidate and provide synthetic test accounts to an independent tester. The cases reuse the relevant [Lab 6 UAT scenarios](../../../docs/labs/lab-06/uat-cases.md) and add the Sprint 2, Sprint 3 and Lab 7 journeys. The older Lab 6 results retain their original version.

## Run details

| Field | To record before the run |
| --- | --- |
| Independent tester name or handle and organization/team | Pending assignment |
| Date, time zone, browser and viewport | Pending run |
| Candidate source | Proposed by A: staging/sprint-3 at 046310d288859ee42745a043369498d5d646d6c9. [Staging CI passed](https://github.com/zerotwobook/fastTrack/actions/runs/45039631042). B confirmation is pending. |
| Test URL and running version | Pending environment setup. Record the URL, the version returned by GET /api/health and the health and readiness responses. Record the serving revision if the environment exposes one. |
| Case data marker and account roles | Use an isolated synthetic run prefix. Record role aliases and scope. Share account credentials through the team's approved private handoff. |
| Fixture setup and readback | A prepares the domain data plan below. B supplies the isolated runtime and synthetic accounts. Record the fixture prefix and the actual setup and readback before handoff. |
| Developer responsible for defect intake and retest | A for domain/data, B for authorization/UI/operations |

Use Student A and the assigned Supervisor A for the main journey. Supervisor B should belong to a disjoint team. Record the target team's authorized control read before checking a cross-team denial. Use unique milestones for the on-time, expired and planning cases. Confirm the visible release identity at the beginning and record it again for any retest on a changed candidate.

## Fixture preparation

Use a fresh synthetic data set in the agreed test environment. Confirm GET /api/health reports the candidate SHA and GET /api/ready returns HTTP 200 before creating data. Record an alias-to-team mapping and the milestone IDs. Share credentials privately. Where the standard demo seed is available, it supplies the two disjoint supervisor scopes and their assigned students. The planning case needs one additional unassigned Student account.

| Cases | Fixture to prepare | Readback before handoff |
| --- | --- | --- |
| 01, 02, 05, 08 | Assign Student A to the main journey team under Supervisor A. Prepare a separate team under Supervisor B with its own milestone for the scope control. Keep the main journey deadline after the planned submission and revision steps. | Supervisor A and Student A can see the main team. Supervisor B can see the separate team. Leave the main journey work and feedback for the independent tester to create. |
| 03 | Prepare a distinct milestone with zero submissions and a deadline shortly after the scheduled start of the late case. Give the tester time to open the form before the deadline. | Record the displayed deadline with its time zone and confirm the submission count is zero. |
| 04 | Prepare a separate planning team and a milestone with zero submissions. Reserve a Student account with no current membership. | The eligible student appears as a candidate for the planning team. The team and milestone are editable at setup. |
| 06 | Use a dedicated synthetic Summary supervisor whose entire scope has exactly two teams. Put one submitted active milestone in the first team and nine future pending active milestones in the second. Use a student assigned to the first team for the submitted fixture. | The per-team baselines are 1/1 and 0/9. Seeded milestones for other cases are outside this supervisor's scope. |
| 07 | Prepare a separate synthetic submission version and leave its feedback empty. Prepare sample lengths 5,999, 6,000 and 6,001 including one emoji plus n minus one ASCII letters. Add leading and trailing spaces. | Confirm each trimmed length counts Unicode code points, for example with Array.from(sample.trim()).length. Record the version ID and its initial feedback count. |

## Scenarios

| Case and requirement | Preconditions and steps | Expected result and evidence | Actual result |
| --- | --- | --- | --- |
| UAT-FINAL-01 Scoped milestone creation and readback. FR-01/02/03, F-01/02. Extends Lab 6 UAT-01. | Supervisor A creates a future milestone for Team A with the run marker. Student A signs in and opens the saved milestone. Reload once. | The title, description and displayed deadline agree for both authorized users. Capture the milestone ID and both readbacks. | Pending |
| UAT-FINAL-02 Work, revision and exact-version feedback. FR-04/05/08, BR-06/07. Extends UAT-02/03/08. | Student A submits work before the deadline and returns to the milestone. Confirm there is one saved v1 and the next work action is a revision. Supervisor A posts a distinct note on v1. Student A submits a revision with different content, then reopens v1 from Version history after a reload. | There are two ordered saved versions. The original link and note stay on v1 and the note is absent from v2. Record the two IDs and feedback counts. | Pending |
| UAT-FINAL-03 Late first submission and no-write readback. BR-04/05 and T-26. Extends UAT-04. | Use a separate unsubmitted milestone. Open the Student A form before its deadline and validate the time when the attempt occurs. After due time, attempt from the open form or observe the published overdue state if the app has already refreshed. Reload the authorized milestone view. | The server rejects the stale form if it is submitted. A refreshed page prevents submission and explains the deadline. The milestone still has no saved submission. Record the deadline, observed result and readback. | Pending |
| UAT-FINAL-04 Planning and history lock. FR-06/07, BR-09, STS-09/11/14. | Supervisor A renames a fresh planning team, adds a separately seeded eligible student and edits an unsubmitted milestone. Compare with Team A and the submitted milestone from UAT-FINAL-02. Inspect the available membership and milestone actions for the submitted team. | The new name, eligible membership and milestone edit persist in the fresh fixture. The submitted team retains its members and milestone history, and the corresponding mutations are unavailable or denied. Record the allowed controls and preserved values. | Pending |
| UAT-FINAL-05 Account change and team scope. BR-02, NFR-01/02, F08-STS-04/07. Extends UAT-05/07. | Supervisor A opens Team A's saved milestone or Summary on the test browser. Sign out and sign in as disjoint Supervisor B in the same browser. Open the same protected link, then inspect B's own view. | B sees only B's data. The foreign record remains inaccessible and A's private data does not appear during the account change. Record the authorized control and denial with synthetic IDs. | Pending |
| UAT-FINAL-06 Progress and weighted Summary. FR-09/10, BR-10, F08-STS-01–06. | Use the dedicated Summary supervisor to compare both teams in Progress and Summary. Apply the Pending filter, open a reported milestone and return. For the nine pending rows, open the Summary route with status=PENDING, page=10 and pageSize=1. Follow a recovery link to a valid page. | Completion stays at 1/10 (10%) across the scoped teams. The detail return retains its filters. The out-of-range view shows no rows for page 10, reports nine total pages and offers valid recovery. Recovery retains Pending and pageSize=1. Record the totals, page message and recovered URL. | Pending |
| UAT-FINAL-07 Approved feedback limit and association. BR-08, L7-STS-05. | On a separate synthetic submission version, Supervisor A uses samples measured at 5,999, 6,000 and 6,001 trimmed code points, including emoji and surrounding whitespace. Check the saved feedback as Student A. | The first two save and are readable on that exact version. The over-limit input is rejected with the saved count and earlier text preserved. Record the sample lengths and before/after counts. | Pending |
| UAT-FINAL-08 Post-restart or redeploy persistence. NFR-03 and T-31. Extends UAT-08. | A and B coordinate an approved test restart or a release deployment observation. Before and after the event, Student A and Supervisor A read the same records from UAT-FINAL-02. | The same committed submission IDs, version labels, work links and feedback association remain readable. Record both serving identities and the event reference. | Pending |

## Result and defect record

See the [A-side Cloud UAT result and supporting evidence](cloud-uat-results.md) and the [B-side Local UAT return](https://github.com/zerotwobook/fastTrack/issues/36#issuecomment-7127873421) for the recorded sessions on `046310d`. The table below is the blank record for future execution or retests.

Use one row per executed case. Record **PASS**, **FAIL**, **SKIPPED** or **INCOMPLETE** with the actual observation and its source. A retest records its own tested commit, tester and timestamp.

| Case | Tester and run time | Tested SHA or tag | Actual behavior and status | Evidence or defect link | Retest owner and result |
| --- | --- | --- | --- | --- | --- |
| Pending execution | | | | | |

Link any defect to the case, observed impact, severity, assignment, fix version and independent retest. The [A-side traceability draft](requirements-traceability.md) connects these planned cases to the functional and business requirements.
