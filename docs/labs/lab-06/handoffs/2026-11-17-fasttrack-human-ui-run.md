# fastTrack human web-UI UAT completion handoff

R2-A04 / Issue #22 / PR #114. **Preparation only: no new independent human session or case PASS is recorded here.** The TA's latest feedback requires the partner's actual complete web-UI execution, tester names, actual results and tested version before coordinating a section 3.5 defect exercise if no legitimate defect is found.

The existing 13 November evidence remains useful: 97 main API assertions, seven separate post-UI controls, then 26 UI observations / 25 final controls / 11 saved-state comparisons. It is AI-operated with documented UI gaps. User-reported product acceptance is recorded separately; it does not fill the missing human action records. Original times and operators are preserved.

## 1. People, release and prerequisites

- Product: fastTrack / InfaCompany / EN-028, Section 31. Independent testing group: CoursePMS / EN-022_P6, Section 31.
- Reuse the known partner roster only as candidate testers. Privately confirm who actually performs each case and their actual start/end time. No appointment or historical personal attendance is inferred.
- Application: https://fasttrack-app-kpx7au3w2a-as.a.run.app.
- Selected source: `8e637e537cd037d630a5fffc1b5672d1b44371a8`, Sprint 1 F-01-F-04. Keep the original tag distinct.
- [Fresh anonymous preflight](../evidence/fasttrack-human-ui-preflight-20261117/public-preflight.json), 17 November 23:25:58-23:25:59 Asia/Bangkok: health200/status ok and ready200/database connected, both matching the selected source. These are owner-side machine checks, not partner UI results. Repeat at the real session start/end.
- [Read-only Cloud Run lookup](../evidence/fasttrack-human-ui-preflight-20261117/deployment-readback.json) failed: no usable active gcloud account. An owner with authorized access must read the current serving revision/traffic and record its source/time. Historical `fasttrack-app-00003-rc7` is not silently claimed as current.
- Privately reuse the supplied Lab 5 SA/A1/SB accounts only after successful role/team verification. Do not publish passwords or assume seed/demo data is valid. Team A historical ID is `7c600ee0-a595-4c52-a093-f0ed5e08fded`; verify current assignment.
- Use separate browser profiles for SA, A1 and SB, plus a genuinely signed-out profile. Ordinary tabs in one profile share a session. The same A1 profile is deliberately reused only for the UAT-07 A1-to-SB switch.

## 2. Safe new run fixtures

Choose an actual session run ID `L6-HUMAN-YYYYMMDD-HHMM` using the real start date/time. These fixtures are planned, not already created. Keep all business actions on the new prefixed records and preserve prior Lab 5/UAT data.

| Fixture | Actual human setup |
| --- | --- |
| NORMAL | SA creates through the UI: title RUN_ID-NORMAL, description Synthetic human UAT normal journey, future Bangkok deadline |
| WORK | A1 submits through UI: RUN_ID-WORK, description Synthetic human UAT work, https://example.com/?run=RUN_ID |
| Feedback 1 / 2 | SA appends RUN_ID: Please explain the test evidence. / RUN_ID: Add the acceptance result. |
| DEADLINE | SA creates a distinct RUN_ID-DEADLINE via UI, at least five whole minutes ahead; A1 opens/fills before it is due and waits until at least60 seconds past server-confirmed due time |
| VALIDATION | SA creates distinct RUN_ID-VALIDATION with future deadline and no work |
| Forbidden marker | RUN_ID-FORBIDDEN, which must not be created by the Student denial attempt |

Record actual milestone/submission IDs, URLs, deadlines, saved content/version and feedback counts as they appear. No new team, membership/role change, reset/seed/delete, restart, deployment or clock change is part of this run. If a denied action unexpectedly writes, preserve its ID/evidence and report FAIL; do not delete it to hide the result.

## 3. Execute all eight UI cases and record subresults

Use the [full executable cases](../uat-cases.md) for every numbered step and expected result. The concise checklist below calls out required UI coverage; it does not replace unlisted steps or turn prior AI results into human results. Planned allocation: Partner 1 UAT-01-04, Partner 2 UAT-05-08; confirm actual operators and changes during the session.

| Case | Required human web-UI actions | Evidence / guard subchecks |
| --- | --- | --- |
| UAT-01 | SA signs in, opens Team A, uses Create milestone/date picker to save NORMAL, reloads and checks one row; A1 separately opens the same saved milestone | Saved URL/ID/deadline and matching SA/A1 screenshots; API creation alone does not complete this UI path |
| UAT-02 | A1 uses Submit work, saves WORK and reloads; SA appends two distinct feedback messages through the UI; A1 reloads and reads both on the same saved submission/version | Capture saved author/time/version/content/link, initial/final feedback counts and both role views |
| UAT-03 | A1 opens the direct new-submission form for NORMAL, observes the existing-work notice/disabled save, opens the saved link and compares unchanged work | Separate duplicate request subcheck: actual409 ALREADY_SUBMITTED plus unchanged authorized state; do not infer HTTP from disabled UI |
| UAT-04 | A1 opens/fills the distinct DEADLINE form before expiry, waits past server-confirmed due+60seconds and observes the late attempt/prevention | Record dueAt/serverTime, actual409 DEADLINE_PASSED in the bounded request subcheck and empty saved list; do not use a previously expired fixture as the stale-form step |
| UAT-05 | SB in a separate profile opens exact foreign team/milestone/submission URLs, sees generic unavailable recovery, and checks own overview; SA/A1 rereads unchanged protected state | Record corresponding actual404 NOT_FOUND for private detail/feedback reads and current SB role context |
| UAT-06 | A1 observes forbidden milestone UI; SA checks whitespace milestone title; A1 checks whitespace work title and ftp link on VALIDATION; SA checks blank feedback; A1 has no supervisor feedback form | Separate role/feedback-role subchecks: actual403 FORBIDDEN and unchanged authorized counts/content; UI validation is not an observed HTTP400 unless actually inspected |
| UAT-07 | Signed-out profile opens private URL; try one wrong password; A1 signs in/out; Back+reload requires sign-in; same profile signs in as SB and Back/reloads the old Team A URL | Record anonymous/signed-out401 and current SB404; no private stale content, no raw cookie/token capture or eight-hour-expiry claim |
| UAT-08 | A1 records exact saved work/messages, reloads, signs out/in and navigates back; SA independently opens/reloads the same record | Compare IDs/content/author/time/version and two exact messages/counts before/after; sign out all temporary sessions |

For the bounded duplicate/late/role/feedback-role browser request recipe, use the human-run copy and [the original documented safety checks](../uat-cases.md#bounded-browser-request-recipe-for-uat-03uat-04uat-06). Replace the old prefix in every expected title/payload with this run's prefix and fill only newly created IDs. Never send the unchanged historical example against new records. The human tester chooses/executes the supplemental request; it does not replace positive UI actions. If a required subcheck cannot be performed, record BLOCKED and the reason instead of a complete PASS.

Capture readable images with the relevant URL and state, not password entry, authentication response, cookies/CSRF, headers or HAR. Record HTTP status/domain codes only when actually observed. A human evidence review is labelled review, not personal execution. Keep owner/AI setup separate from the independent tester's actions.

## 4. Return the actual result, then update TA

Copy [the human execution record](../templates/fasttrack-human-ui-execution.md) into a dated private result. Each case needs the real name/student ID, role, actual time/timezone, observed source/revision, actual steps/result, subcheck status, evidence references and finding IDs. Start as NOT RUN; fill PASS/FAIL/BLOCKED only after actual observation. Record any deviations.

After all required paths are actually executed, the independent team confirms its decision for that exact version. A/B can then assemble the new TA-facing result from the actual returned record, with original AI history and current human evidence distinct. The prepared private TA update is not sent until it contains real human results. If no legitimate defect remains after that completion, the TA has offered to coordinate the section3.5 scenario; no specific scenario or implementation is yet authorized by this feedback.
