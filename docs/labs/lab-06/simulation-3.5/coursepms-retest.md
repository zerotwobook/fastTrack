# CoursePMS independent retest for simulated exercise section 3.5

## Responsibilities and access

CoursePMS performs the independent browser tests and records its actual tester names, execution times, expected/actual results and evidence. Partner 1 can prepare the case records and verify the saved-state control. Partner 2 can execute the late-submission reproduction and repeat attempt. This is a prospective allocation for the partners to confirm from actual participation.

fastTrack A supplies the isolated URL, source identity, synthetic Student/Supervisor access privately and the read-only database snapshots. fastTrack B reviews PR #115's tests, RED/GREEN history, CI and deployment evidence using a separate checkout and submits an actual GitHub review. B's code review and CoursePMS's independent UAT each require their own record.

The deployed URL and exact source are populated in the execution report after verification. Passwords are delivered privately. Use only the dedicated Lab 6 service and synthetic fixtures. Record `/api/health` source and `/api/ready` before testing. Preserve browser DevTools Network requests with cookies and CSRF tokens redacted.

## CPMS-S35-01 before-deadline positive control

1. Sign in as the synthetic Supervisor. Create a new milestone in Team Alpha titled `L6-S35-CPMS-BEFORE-<unique run ID>`, with a deadline comfortably in the future.
2. Record the milestone UUID and displayed Asia/Bangkok deadline. In a separate browser profile, sign in as Student A1 and open that milestone.
3. Submit a unique title, description and an `https://example.edu/` work link before the deadline.
4. Expect HTTP 201, version 1, the actual saved content and a submitted time at or before the deadline. Reload the saved submission and verify the same ID/content. Capture the success and reload evidence.
5. Keep this saved milestone as the unchanged control for the late test.

## CPMS-S35-02 late request reaches the server

1. As Supervisor, create a second new milestone `L6-S35-CPMS-LATE-<same run ID>` with a deadline two or three minutes ahead. Record its UUID and exact deadline including seconds.
2. As Student A1, open its submission form before the deadline. Fill a unique work title and URL. Keep that form open while the deadline passes.
3. Wait until at least five seconds after the displayed deadline. Click Submit work in the already-open form and inspect the request in DevTools.
4. Expect POST `/api/milestones/<id>/submissions` to return HTTP 409 with error code `DEADLINE_PASSED`. Record the actual response and the preserved draft/error message.
5. A freshly opened overdue page can disable its submit action. Keep the form open from step 2 so this case exercises a real server request after the deadline.

## CPMS-S35-03 zero-write and retry checks

1. Capture an authenticated GET `/api/milestones/<late-id>/submissions`. Expect an empty data array. Reload the milestone as Supervisor and verify that no saved submission appears.
2. Repeat the late request from the open form. Expect the same HTTP 409 `DEADLINE_PASSED`, and repeat the list read. It must remain empty.
3. Have fastTrack A run the read-only `Project_code/scripts/lab6-snapshot.mjs` evidence reader in the dedicated jobs environment for both recorded milestone UUIDs. Observe and retain the real output. The reader is bound to `fasttrack_lab6` on `fasttrack-lab6-db` and requires explicit UUIDs.
4. Expect zero submissions for the late milestone and the same single version 1/ID/content for the before-deadline control. Compare the snapshots from before and after the late attempts. Database evidence complements the browser/API observations.

## Record returned by CoursePMS

| Field | Actual value to supply |
| --- | --- |
| Scenario | Simulated exercise section 3.5, late student submission |
| Tester names and roles | PENDING actual CoursePMS record |
| Execution time and timezone | PENDING |
| URL, source SHA and Cloud Run revision | PENDING confirmed deployed identity |
| Before / late milestone UUIDs and deadlines | PENDING actual fixtures |
| CPMS-S35-01 expected / actual / PASS or FAIL | PENDING execution |
| CPMS-S35-02 expected / actual / PASS or FAIL | PENDING execution |
| CPMS-S35-03 expected / actual / PASS or FAIL | PENDING execution |
| Screenshot / redacted Network evidence / database snapshot links | PENDING |
| Remaining findings | PENDING |
| Independent acceptance decision and actual decision time | PENDING |

Send the completed Markdown record and original evidence to fastTrack through the team's agreed channel. fastTrack will append it to the evidence report and export the final PDF after reviewing the returned results. The current preparatory record makes no independent PASS claim.
