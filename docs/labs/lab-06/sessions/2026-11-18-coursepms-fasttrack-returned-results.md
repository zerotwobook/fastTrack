# Returned CoursePMS fastTrack UAT results, 18 November 2026

R2-A04 / Issue #22. Product team fastTrack / InfaCompany / EN-028, Section 31. Independent reviewing team CoursePMS / EN-022_P6. Application source `8e637e537cd037d630a5fffc1b5672d1b44371a8`, Sprint 1 F-01 through F-04.

The user returned the CoursePMS results archive and then confirmed the named reviewers and case responsibilities below, with AI assistance in test execution and evidence collection. The archive reports **eight case PASS**, supported by **18 active PASS observations**, **one retained invalidated automation record**, **28 screenshots** and **nine JSON ledgers**. Its recorded browser operator is Codex acting for CoursePMS. The archive's original human-review field is pending; the later user confirmation supplies responsibility and assistance attribution. The recorded machine times retain their original operator.

## Reviewers and responsibility

| Reviewer | Responsible cases | User-confirmed scope |
| --- | --- | --- |
| Tatchakorn Thamnimitr | UAT-01 through UAT-04 | Milestone/student matching view, submission/feedback, duplicate prevention, deadline rejection |
| Pawarit Wongdang | UAT-05 through UAT-08 | Cross-team access, roles/input validation, sign-out/account switch, saved-state persistence |

The user confirms AI assistance in execution and evidence collection. Individual human click/review times and a new explicit final decision for this particular run have no additional details in that confirmation. Earlier user-reported CoursePMS acceptance of fastTrack remains in the [decision record](../acceptance-record.md). Student IDs and the original identified report are retained in the local source package.

## Session, fixtures and version

| Field | Recorded value |
| --- | --- |
| Run | L6-CPMS-AI-20261118-144203 |
| Tester-clock session | 18 November 2026, 14:37:42.827 through 14:50:33.231 UTC+07:00 |
| Browser | Headed Playwright Chromium 153.0.8010.12, Windows, viewport 1440 by 1050, Asia/Bangkok |
| Profiles | SA, A1, A2, SB, B1 and ANON |
| Start/end health and readiness | HTTP 200, matching source, database connected |
| Clock disclosure | Tester/server clocks differ by approximately 16-17 seconds; server time governs deadline checks |
| New retained fixtures | Three milestones, one version-1 submission and two feedback messages |
| NORMAL | 09b06c51-48f1-456c-a76a-d2b2be9944c1 |
| DEADLINE | 24821747-1cdd-4b08-9c48-2ceba2dd62b4, due 18 November 14:49:00 UTC+07:00 |
| VALIDATION | 80134cae-0346-4bdc-90dd-fb4dbfb2a18f |
| Saved work | e22b5fc2-4e36-480e-8141-930900aa356b |

Sources are the [session start](../evidence/coursepms-fasttrack-returned-20261118/preflight-start.json), [closeout](../evidence/coursepms-fasttrack-returned-20261118/session-closeout.json), [fixture ledger](../evidence/coursepms-fasttrack-returned-20261118/fixture-ledger.json) and [saved work ledger](../evidence/coursepms-fasttrack-returned-20261118/saved-work-ledger.json).

## Actual case results

| Case | Reviewer responsibility | Returned result and supporting observation |
| --- | --- | --- |
| UAT-01 | Tatchakorn | PASS. Create via UI, reload, one list entry and matching Student view |
| UAT-02 | Tatchakorn | PASS. UI-saved version 1 and two appended feedback messages in both role views |
| UAT-03 | Tatchakorn | PASS. Existing-work UI and actual 409 ALREADY_SUBMITTED preserve saved work; A2 shares the same work |
| UAT-04 | Tatchakorn | PASS. Filled before server deadline, UI/supplemental 409 DEADLINE_PASSED, empty saved list |
| UAT-05 | Pawarit | PASS. Cross-team team/milestone/submission/feedback reads return 404; scoped overview and unchanged-state comparison; B1 also denied |
| UAT-06 | Pawarit | PASS. Student writes return 403, whitespace/FTP input errors, unchanged authorized state |
| UAT-07 | Pawarit | PASS. Anonymous/signed-out 401, one failed sign-in, same-profile A1-to-SB switch returns 404 |
| UAT-08 | Pawarit | PASS. Four saved work/feedback snapshots match the baseline across reload and relogin |

The [case summary](../evidence/coursepms-fasttrack-returned-20261118/case-summary.json) matches the active PASS entries in the [original observation ledger](../evidence/coursepms-fasttrack-returned-20261118/observations.json). Case titles in the published summary are translated into English and student IDs omitted from owner labels. Other returned JSON ledgers and all published images retain their source bytes. [Source hashes and transformations](../evidence/coursepms-fasttrack-returned-20261118/provenance.json).

The rejected late attempt is supported by server time 71.629 seconds after dueAt and an empty saved list. The browser before/after form images show the retained draft and rejection. Four persistence snapshots preserve the exact IDs, version, author/time, content and both feedback messages. All six profiles return private-API 401 at closeout. [Deadline ledger](../evidence/coursepms-fasttrack-returned-20261118/deadline-observation.json), [persistence ledger](../evidence/coursepms-fasttrack-returned-20261118/persistence-comparisons.json).

The one INVALIDATED_AUTOMATION_ERROR entry records a count-expression error in the test helper. The corrected active observation passes. The report also discloses selector corrections during automation. No confirmed fastTrack product defect was found in this recorded scope. The source record and its invalidation remain visible.

## Screenshot evidence

Images show synthetic test accounts and run-prefixed data. The following index includes all 28 received PNGs, verified against the original checksum manifest.

### UAT-01

![UAT 01 student normal](../evidence/coursepms-fasttrack-returned-20261118/images/UAT-01-student-normal.png)

![UAT 01 supervisor normal](../evidence/coursepms-fasttrack-returned-20261118/images/UAT-01-supervisor-normal.png)

![UAT 01 team list](../evidence/coursepms-fasttrack-returned-20261118/images/UAT-01-team-list.png)

### UAT-02

![UAT 02 saved work initial](../evidence/coursepms-fasttrack-returned-20261118/images/UAT-02-saved-work-initial.png)

![UAT 02 student two feedback](../evidence/coursepms-fasttrack-returned-20261118/images/UAT-02-student-two-feedback.png)

![UAT 02 supervisor two feedback](../evidence/coursepms-fasttrack-returned-20261118/images/UAT-02-supervisor-two-feedback.png)

### UAT-03

![UAT 03 existing submission](../evidence/coursepms-fasttrack-returned-20261118/images/UAT-03-existing-submission.png)

![UAT 03 second student shared submission](../evidence/coursepms-fasttrack-returned-20261118/images/UAT-03-second-student-shared-submission.png)

### UAT-04

![UAT 04 no late work saved](../evidence/coursepms-fasttrack-returned-20261118/images/UAT-04-no-late-work-saved.png)

![UAT 04 stale form after deadline](../evidence/coursepms-fasttrack-returned-20261118/images/UAT-04-stale-form-after-deadline.png)

![UAT 04 stale form before deadline](../evidence/coursepms-fasttrack-returned-20261118/images/UAT-04-stale-form-before-deadline.png)

### UAT-05

![UAT 05 foreign milestone](../evidence/coursepms-fasttrack-returned-20261118/images/UAT-05-foreign-milestone.png)

![UAT 05 foreign submission](../evidence/coursepms-fasttrack-returned-20261118/images/UAT-05-foreign-submission.png)

![UAT 05 foreign team](../evidence/coursepms-fasttrack-returned-20261118/images/UAT-05-foreign-team.png)

![UAT 05 own team overview](../evidence/coursepms-fasttrack-returned-20261118/images/UAT-05-own-team-overview.png)

![UAT 05 team B student denied](../evidence/coursepms-fasttrack-returned-20261118/images/UAT-05-team-B-student-denied.png)

### UAT-06

![UAT 06 ftp link](../evidence/coursepms-fasttrack-returned-20261118/images/UAT-06-ftp-link.png)

![UAT 06 student create denied](../evidence/coursepms-fasttrack-returned-20261118/images/UAT-06-student-create-denied.png)

![UAT 06 whitespace feedback](../evidence/coursepms-fasttrack-returned-20261118/images/UAT-06-whitespace-feedback.png)

![UAT 06 whitespace milestone](../evidence/coursepms-fasttrack-returned-20261118/images/UAT-06-whitespace-milestone.png)

![UAT 06 whitespace work](../evidence/coursepms-fasttrack-returned-20261118/images/UAT-06-whitespace-work.png)

### UAT-07

![UAT 07 same profile switched to SB](../evidence/coursepms-fasttrack-returned-20261118/images/UAT-07-same-profile-switched-to-SB.png)

### UAT-08

![UAT 08 student reload](../evidence/coursepms-fasttrack-returned-20261118/images/UAT-08-student-reload.png)

![UAT 08 student relogin](../evidence/coursepms-fasttrack-returned-20261118/images/UAT-08-student-relogin.png)

![UAT 08 supervisor reload](../evidence/coursepms-fasttrack-returned-20261118/images/UAT-08-supervisor-reload.png)

### Setup records

![setup deadline](../evidence/coursepms-fasttrack-returned-20261118/images/setup-deadline.png)

![setup normal](../evidence/coursepms-fasttrack-returned-20261118/images/setup-normal.png)

![setup validation](../evidence/coursepms-fasttrack-returned-20261118/images/setup-validation.png)

## Current Cloud Run readback and assessment follow-up

At **18 November 2026, 15:19:49 UTC+07:00**, authenticated owner-side service/revision reads confirm **fasttrack-app-00003-rc7 at 100% traffic**, all service ready conditions True, generation 5 / observed 5, and immutable image digest matching the documented artifact for source `8e637e5`. Fresh public health/readiness match the tested source. This is a later observation than the returned UAT session. [Current deployment readback](2026-11-18-fasttrack-cloud-run-readback.md).

The user-confirmed reviewer responsibilities and AI attribution are ready for the TA to assess alongside the actual outcomes. The recorded TA guidance requests actual named-partner web-UI coverage. The TA determines whether any specific human participation evidence remains to be added and supplies any section 3.5 scenario if the coverage is sufficient and no legitimate defect is found. Individual human action times, a new final decision, TA acceptance and a completed section 3.5 exercise are pending in their respective source records. The original user-reported product acceptance retains its own provenance.
