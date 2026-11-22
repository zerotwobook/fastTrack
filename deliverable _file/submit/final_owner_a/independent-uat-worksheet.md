
# Independent Final UAT worksheet

Prepared by A for the joint [R3-J03 checkpoint](https://github.com/zerotwobook/fastTrack/issues/36). Use this worksheet once A and B accept the prerequisite regressions, agree on the candidate and provide synthetic test accounts to an independent tester. The cases reuse the relevant [Lab 6 UAT scenarios](../../../docs/labs/lab-06/uat-cases.md) and add the Sprint 2, Sprint 3 and Lab 7 journeys. The older Lab 6 results retain their original version.

## Run details

| Field | To record before the run |
| --- | --- |
| Independent tester name or handle and organization/team | Pending assignment |
| Date, time zone, browser and viewport | Pending run |
| Approved URL, full source SHA, tag and serving revision | Pending candidate selection |
| Case data marker and account roles | Use an isolated synthetic run prefix. Record role aliases and scope. Share account credentials through the team's approved private handoff. |
| Fixture owner and seed/readback method | Pending A/B agreement |
| Developer responsible for defect intake and retest | A for domain/data, B for authorization/UI/operations |

Use Student A and the assigned Supervisor A for the main journey. Supervisor B should belong to a disjoint team. Record the target team's authorized control read before checking a cross-team denial. Use unique milestones for the on-time, expired and planning cases. Confirm the visible release identity at the beginning and record it again for any retest on a changed candidate.

## Scenarios

| Case and requirement | Preconditions and steps | Expected result and evidence | Actual result |
| --- | --- | --- | --- |
| UAT-FINAL-01 Scoped milestone creation and readback. FR-01/02/03, F-01/02. Extends Lab 6 UAT-01. | Supervisor A creates a future milestone for Team A with the run marker. Student A signs in and opens the saved milestone. Reload once. | The title, description and displayed deadline agree for both authorized users. Capture the milestone ID and both readbacks. | Pending |
| UAT-FINAL-02 Work, revision and exact-version feedback. FR-04/05/08, BR-06/07. Extends UAT-02/08. | Student A submits work before the deadline. Supervisor A posts a distinct note on v1. Student A submits a revision with different content, then reopens v1 from Version history after a reload. | There are two ordered saved versions. The original link and note stay on v1 and the note is absent from v2. Record the two IDs and feedback counts. | Pending |
| UAT-FINAL-03 Late first submission and no-write readback. BR-04/05 and T-26. Extends UAT-03/04. | Use a separate unsubmitted milestone. Open the Student A form before its deadline and validate the time when the attempt occurs. After due time, attempt from the open form or observe the published overdue state if the app has already refreshed. Reload the authorized milestone view. | The server rejects the stale form if it is submitted. A refreshed page prevents submission and explains the deadline. The milestone still has no saved submission. Record the deadline, observed result and readback. | Pending |
| UAT-FINAL-04 Planning and history lock. FR-06/07, BR-09, STS-09/11/14. | Supervisor A uses a fresh, unsubmitted planning fixture to edit a title or deadline. Compare it with the submitted milestone from UAT-FINAL-02 and inspect available planning actions. | The eligible edit persists. Submitted milestone history stays intact and edit/cancel is unavailable or denied. Record both controls and the saved values. | Pending |
| UAT-FINAL-05 Account change and team scope. BR-02, NFR-01/02, F08-STS-04/07. Extends UAT-05/07. | Supervisor A opens Team A's saved milestone or Summary on the test browser. Sign out and sign in as disjoint Supervisor B in the same browser. Open the same protected link, then inspect B's own view. | B sees only B's data. The foreign record remains inaccessible and A's private data does not appear during the account change. Record the authorized control and denial with synthetic IDs. | Pending |
| UAT-FINAL-06 Progress and weighted Summary. FR-09/10, BR-10, F08-STS-01–06. | Use two teams visible to Supervisor A with one completed of one active milestone and zero completed of nine active milestones. Read each team's Progress. Apply a Summary status filter, open a reported milestone and return. | Overall completion is 1/10 or 10%. Filtering the items preserves the aggregate for the selected teams. The return link retains the active filter and, where exercised, page. Record the fixture counts and the visible readback. | Pending |
| UAT-FINAL-07 Approved feedback limit and association. BR-08, L7-STS-05. | On a separate synthetic submission version, Supervisor A uses samples measured at 5,999, 6,000 and 6,001 trimmed code points, including emoji and surrounding whitespace. Check the saved feedback as Student A. | The first two save and are readable on that exact version. The over-limit input is rejected with the saved count and earlier text preserved. Record the sample lengths and before/after counts. | Pending |
| UAT-FINAL-08 Post-restart or redeploy persistence. NFR-03 and T-31. Extends UAT-08. | A and B coordinate an approved test restart or a release deployment observation. Before and after the event, Student A and Supervisor A read the same records from UAT-FINAL-02. | The same committed submission IDs, version labels, work links and feedback association remain readable. Record both serving identities and the event reference. | Pending |

## Result and defect record

Use one row per executed case. Record **PASS**, **FAIL**, **SKIPPED** or **INCOMPLETE** with the actual observation and its source. A retest records its own tested commit, tester and timestamp.

| Case | Tester and run time | Tested SHA or tag | Actual behavior and status | Evidence or defect link | Retest owner and result |
| --- | --- | --- | --- | --- | --- |
| Pending execution | | | | | |

Link any defect to the case, observed impact, severity, assignment, fix version and independent retest. The [A-side traceability draft](requirements-traceability.md) connects these planned cases to the functional and business requirements.
