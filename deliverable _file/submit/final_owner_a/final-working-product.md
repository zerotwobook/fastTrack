# Final working product (Part A draft)

fastTrack lets supervisors plan team milestones and lets students submit versioned work links against a deadline. Supervisors can leave feedback on individual versions and review completion across their assigned teams.

The feature evidence below is tied to the G4 candidate `046310d288859ee42745a043369498d5d646d6c9`. Independent Cloud and Local UAT each passed eight cases. The final release identity and production observations will be recorded after G5. [Joint acceptance](https://github.com/zerotwobook/fastTrack/issues/36#issuecomment-7130293441) · [Cloud cases and captures](cloud-uat-results.md) · [Candidate CI](https://github.com/zerotwobook/fastTrack/actions/runs/45039631042)

## Implemented features and candidate evidence

| Feature | Behavior verified on the candidate | Evidence for the report |
| --- | --- | --- |
| F-01 Identity and team context | Students and supervisors sign in through scoped sessions. Switching supervisors clears the previous view, and foreign milestone reads return HTTP 404. | UAT-FINAL-05 and the [access and session regression](../../../Project_code/docs/evidence/R3-B03-final-regression.md). |
| F-02 Milestones | A supervisor creates a milestone for an assigned team. The team's student retrieves the saved title, description and Bangkok deadline after reload. | UAT-FINAL-01. |
| F-03 First submission | A student saves an on-time first version. An attempted late write from a form opened before the deadline returns HTTP 409, and the milestone still has zero saved submissions. | UAT-FINAL-02 and 03, plus the [deadline and data regression](../../../Project_code/docs/evidence/R3-A03-final-regression.md). |
| F-04 Feedback | A supervisor adds private feedback to the selected submission version. The first two boundary examples of 5,999 and 6,000 trimmed code points save, and 6,001 is rejected under CR-L7-01. | UAT-FINAL-02 and 07, and the [Lab 7 contract](../../../Project_code/docs/contracts/lab-7-feedback-limit.md). |
| F-05 Team and milestone planning | Supervisors create and rename teams, manage eligible members and edit or cancel an eligible milestone. Submission history locks membership and milestone mutations. | UAT-FINAL-04 and the [domain regression](../../../Project_code/docs/evidence/R3-A03-final-regression.md). |
| F-06 Revisions | A student appends v2 and can reopen v1 with its original work link and feedback. Version identities and their feedback associations survive a runtime restart or redeploy. | UAT-FINAL-02 and 08. |
| F-07 Progress | The supervisor can see per-team completion and derived milestone status. Submitted active milestones count toward completion. Cancelled milestones are excluded. | UAT-FINAL-06 and the [domain regression](../../../Project_code/docs/evidence/R3-A03-final-regression.md). |
| F-08 Supervisor Summary | Scoped totals use the weighted denominator, such as one submission across ten active milestones. Filters and page size survive drill-down and out-of-range page recovery. | UAT-FINAL-05 and 06 and the [browser and responsive regression](../../../Project_code/docs/evidence/R3-B03-final-regression.md). |

## Production evidence to capture after G5

1. Record the Final tag, full source SHA, production URL, image digest and serving revision. Save health and readiness readbacks from that source.
2. On synthetic fixtures, capture the supervisor milestone, student first submission and revision, exact-version feedback and the late-write rejection. Record visible outcomes, IDs and Bangkok date and time so the deployed observations can be traced to the candidate cases.
3. Capture cross-team denial, the supervisor's authorized control, Progress and weighted Summary recovery. Read preserved submission IDs and feedback after deployment to verify continuity.
4. Use the deployed observations in Part A and the joint video. The [Student script](student-demo-script.md) supplies A's section, and the [Part C matrix](requirements-traceability.md) maps each observation to a requirement and check.
