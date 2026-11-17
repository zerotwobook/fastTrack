# fastTrack recorded API and web-UI results: consolidated evidence

Compiled 18 November 2026, Asia/Bangkok, from the actual earlier records in this workspace. **These are filled historical execution results, not a new test run or a completed named-human execution record.** Original operator and timestamps are preserved.

## Release and execution identity

| Field | Actual recorded identity |
| --- | --- |
| Group / repository | InfaCompany / fastTrack, EN-028, Section 31; https://github.com/zerotwobook/fastTrack |
| Tested source | `8e637e537cd037d630a5fffc1b5672d1b44371a8` |
| Assessed scope | Sprint 1 F-01 sign-in/scoped teams; F-02 milestones; F-03 shared version-1 submission; F-04 private append-only exact-version feedback |
| Initial main run | 13 November 2026, approximately 19:47-19:54 Asia/Bangkok; L6-CPMS-20261113-194706 |
| Browser follow-up run | L6-CPMS-20261113-UI2; observations 13 November 2026, 21:37:47-22:00:11 Asia/Bangkok; final browser cleanup recorded at 22:02:10 |
| Operator in the original machine/browser records | Codex AI, requested by the user acting in the CoursePMS testing context |
| Current human evidence status | Separate user-reported participation/acceptance is recorded; individual case actions/results/times are not supplied by these logs |

## Verified result sets: keep the denominators separate

- Initial main API: **97 assertions PASS / 0 FAIL**, across 74 HTTP observations, including readiness/setup/cleanup and the eight case groups.
- Seven initial post-UI controls are a separate set.
- Browser follow-up: **26 actual UI observations**, each recorded as PASS for its observed subcheck. These are not 26 separate complete UAT cases.
- Final follow-up API controls: **25 PASS / 0 FAIL / 0 ERROR / 0 cleanup errors**.
- Final saved-state assessment: **11 PASS / 0 FAIL**.

[Machine-readable result summary](../evidence/fasttrack-recorded-ui-20261118/recorded-result-summary.json), [26 sanitized UI observations with original UTC and converted Bangkok times](../evidence/fasttrack-recorded-ui-20261118/ui-observations-sanitized.json), [source hashes and private screenshot/snapshot integrity](../evidence/fasttrack-recorded-ui-20261118/source-verification.json). All 26 original PNG/snapshot pairs were verified present; PNGs decode. Original images and raw response bodies remain private and are not republished here.

## UAT-01-08: existing actual outcomes and deviations

| Case | Actual recorded UI/API result | Evidence IDs | Preserved procedural limit |
| --- | --- | --- | --- |
| UAT-01 | Supervisor filled, saved and reloaded NORMAL through the UI; Student A1 read matching fields; team list contained one NORMAL | UI2-01/02/03/07/17 | Sequential role sessions in one browser profile, rather than simultaneous separate profiles |
| UAT-02 | Student submitted WORK through the UI and reloaded it; supervisor appended two distinct feedback messages through the UI; student relogged/navigated back and read both | UI2-10/11/12/13/15/19 | These normal business writes really used UI forms; source matching does not independently prove serving revision/traffic |
| UAT-03 | Duplicate form showed the original saved work and disabled submission; supplemental authenticated API returned 409 ALREADY_SUBMITTED; one original work remained | UI2-20; final API controls | The bounded denial used an isolated API client, not the browser DevTools recipe |
| UAT-04 | New DEADLINE was created through UI; form was filled before expiry and the same form was clicked after due + 60 seconds; late UI rejection retained the draft; supplemental API returned 409 DEADLINE_PASSED and no work was saved | UI2-04/05/06; final API controls | Setup lead was about 4m10s rather than the planned 5 minutes; fresh server time came from an isolated API session |
| UAT-05 | Supervisor B received generic unavailable pages for the exact foreign submission, milestone and team; overview listed only Team B; supplemental private reads returned 404 NOT_FOUND | UI2-23/24/25/26; final API controls | Supervisor B used the same browser after logout/account switch, not a simultaneous separate profile |
| UAT-06 | UI rejected blank work title, FTP link, blank feedback and blank milestone title; Student saw create-role denial; API role/feedback writes returned 403 and saved state remained unchanged | UI2-08/09/14/16/17/21; final/state controls | Invalid work inputs used NORMAL before its valid submission rather than separate VALIDATION; UI validation is not relabelled as an observed HTTP 400 |
| UAT-07 | One wrong-password attempt was rejected; signed-out saved-work page required sign-in; switching to Supervisor B denied the old Team A submission; final logout/Back/reload required sign-in | UI2-18/22/23; recorded final browser cleanup | Final Back/reload followed Supervisor B; no new browser cookie-replay or eight-hour expiry test is claimed |
| UAT-08 | Original saved work/version/author/time and two exact feedback messages survived supervisor reload and Student A1 relogin/navigation; eleven saved-state checks passed | UI2-11/15/19; state assessment | Sequential browser sessions; no restart/redeploy or individual human case execution is established |

The recorded checks did not establish a confirmed legitimate fastTrack product defect. This is a bounded observation, not an exhaustive guarantee. The table retains departures from the original plan so the independent testers and TA can assess the available coverage; it does not assert every original procedure was followed exactly.

## Recorded UI evidence timeline

All times below are on 13 November 2026 in Asia/Bangkok. Each ID resolves to the expected/actual/action/status fields in the linked sanitized JSON ledger. The original operator is Codex AI for every row.

| Evidence ID | Bangkok capture time | Case | Recorded action |
| --- | --- | --- | --- |
| UI2-01-normal-form | 21:37:47 | UAT-01 | SA fills the NORMAL form through UI |
| UI2-02-normal-saved | 21:38:29 | UAT-01 | SA saves NORMAL milestone with Create milestone |
| UI2-03-normal-reloaded | 21:39:03 | UAT-01 | Reload saved NORMAL milestone |
| UI2-04-deadline-saved | 21:43:02 | UAT-04 | SA creates DEADLINE through UI |
| UI2-05-before-deadline-form | 21:44:10 | UAT-04 | A1 opens and fills DEADLINE form before dueAt without submitting |
| UI2-06-stale-form-rejected | 21:48:34 | UAT-04 | A1 clicks Submit work on the original form after dueAt plus 60 seconds |
| UI2-07-student-normal | 21:48:49 | UAT-01 | A1 reads UI-created NORMAL milestone |
| UI2-08-empty-title | 21:49:16 | UAT-06 | A1 attempts whitespace-only title |
| UI2-09-invalid-link | 21:49:45 | UAT-06 | A1 submits FTP work link |
| UI2-10-work-saved | 21:50:19 | UAT-02 | A1 selects Submit work with valid inputs |
| UI2-11-work-reloaded | 21:50:39 | UAT-02 | A1 reloads UI-created work |
| UI2-12-first-feedback | 21:51:44 | UAT-02 | SA submits first feedback through Save feedback |
| UI2-13-two-feedback-messages | 21:52:08 | UAT-02 | SA saves the second distinct feedback |
| UI2-14-blank-feedback-rejected | 21:52:29 | UAT-06 | SA attempts blank feedback after two saved messages |
| UI2-15-supervisor-reloaded-feedback | 21:52:44 | UAT-02 / UAT-08 | SA reloads saved work after adding two UI messages |
| UI2-16-empty-milestone-title | 21:53:59 | UAT-06 | SA attempts whitespace-only milestone title with valid description/date |
| UI2-17-team-list | 21:55:01 | UAT-01 / UAT-02 / UAT-06 | SA returns to Team A after validation |
| UI2-18-invalid-sign-in | 21:56:10 | UAT-07 | One deliberately wrong-password attempt for supplied A1 alias |
| UI2-19-student-feedback-after-navigation | 21:57:23 | UAT-02 / UAT-08 | A1 relogs in then navigates Team A -> NORMAL -> Open saved submission |
| UI2-20-duplicate-form | 21:57:40 | UAT-03 | A1 opens direct first-submission URL after saved UI work |
| UI2-21-student-create-denial | 21:58:07 | UAT-06 | A1 directly opens Create milestone page |
| UI2-22-anonymous-private-page | 21:58:30 | UAT-07 | After logout open exact saved-work URL |
| UI2-23-foreign-submission | 21:59:00 | UAT-05 / UAT-07 | Switch from A1 to SB then open exact Team A saved work |
| UI2-24-foreign-milestone | 21:59:13 | UAT-05 | SB opens exact Team A milestone URL |
| UI2-25-foreign-team | 21:59:40 | UAT-05 | SB opens Team A detail URL |
| UI2-26-foreign-overview | 22:00:11 | UAT-05 | SB returns to overview after foreign reads |

## Human participation provenance and the TA request

The earlier private participation record preserves a direct user statement that the two known CoursePMS members participated on 13 November 2026 at 17:30 Asia/Bangkok. It explicitly does not supply individual case allocation or per-case actual results, and states that the later 19:47 API run and UI follow-up were operated by Codex. That reported 17:30 session is not relabelled as the recorded 21:37-22:00 browser session. Personal names/student IDs remain in the private participation record.

[Current product decisions](../acceptance-record.md) retain direct versus user-reported confirmation provenance. Those decisions and the reported participation are available information, but they do not create missing individual action records.

The TA can review this consolidated existing API/UI evidence now. The remaining requirement for actual independent named-human web-UI completion is tracked in [the TA status page](../ta-review-status.md), [human runbook](../handoffs/2026-11-17-fasttrack-human-ui-run.md) and [actual-result form](../templates/fasttrack-human-ui-execution.md). If genuine earlier human case records are supplied, they can be added with their real people/actions/dates rather than requiring another run merely to fill a template.

The TA has offered to coordinate section 3.5 if the required human work is complete and no legitimate defect is found. No specific simulated scenario is claimed here. No current deployment revision, new human PASS, external message, new test run, main release or submission is inferred from this consolidation.

## Earlier public references

- [Initial API/selected UI execution](../received/coursepms-fasttrack-lab6-20261113/01-fasttrack-execution.md).
- [Initial assertion ledger](../received/coursepms-fasttrack-lab6-20261113/evidence/assertions.json).
- [Previously published follow-up summary](2026-11-13-fasttrack-followup-summary.md).
