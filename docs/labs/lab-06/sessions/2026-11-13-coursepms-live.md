# CoursePMS live exploratory session — 13 November 2026

Task R2-A04 / Issue #22. Owner A (`zerotwobook`); reviewer B (`Atip-Infa`). Status: bounded exploratory checks concluded; full agreed UAT remains BLOCKED. This record contains actual AI-operated browser checks requested by the user; it does not establish either student's personal participation or an independent acceptance decision.

## Release and sources

- Application: https://course-pms-859617270560.asia-southeast1.run.app/
- Intended source: `150dc5db3de5c829a7d9ef1adb545191cc37542d`.
- Historical Sprint 1 tag supplied by the partner: `v1.0.0-sprint1`, commit `5979f5870e8e28277996dc3045cbf4be5f7236ad`.
- Partner-supplied handoff: user-provided `message.txt`; statements in it remain partner reports until independently observed.
- Auth contract v1.1 and team/proposal contract v1.0 were read at the intended source under `docs/sprints/sprint-1/` in Magiciancat9/Course_management.
- Official `CoursePMS_Send_to_UAT_Team.zip` and CPMS-UAT-01 through CPMS-UAT-08 steps have not been supplied. This session uses separate exploratory IDs and cannot count as completion of those official cases.
- Current Cloud Run revision and traffic allocation have not been independently confirmed. The handoff reports `course-pms-00006-sbx` at deployment time only.

## Actual observations so far

| ID | Observation | Result and limit |
| --- | --- | --- |
| EXP-00A | Opened `/api/health` in Chrome. Response timestamp `2026-11-13T11:56:47.178Z` (18:56:47 Asia/Bangkok). | Visible JSON: `status: ok`, `service: course-pms-api`, `commitSha` exactly matches intended source. HTTP status not inspected in browser Network. |
| EXP-00B | Opened `/api/ready` in the same Chrome tab before sign-in. | Visible JSON: `status: ready`, `db: connected`. HTTP status not inspected. |

## Execution boundary

Three test accounts were supplied directly by the user. Passwords and session tokens are excluded from this file and Git. Account-to-official-alias mapping, clean starting memberships and safe repeat-run fixtures remain unconfirmed. Preserve existing partner records; no seed/reset, deletion, deployment or historical-record modification is authorized by this session.

Further actual case results are recorded below. No PASS is claimed for unobserved business behavior. No partner notification has been sent. Final acceptance remains PENDING.

## First student checks (approximately 19:01–19:03 Asia/Bangkok)

These observations are UI outcomes. Network status, token contents and database rows were not inspected.

| ID / AC | Preconditions and actual steps | Expected | Actual | Status / limit |
| --- | --- | --- | --- | --- |
| EXP-01 / AC-01 | Signed in with the supplied Pawarit account. | Student workspace identifies the signed-in account. | Header showed Pawarit Wongdaeng, STUDENT, CPE334 (1/2026), Team Alpha, roster 1/3, proposal DRAFT, revision 0. | PASS for visible identity/workspace only; full API AC-01 not established. |
| EXP-02 / AC-10 | In Team Alpha, selected Team Beta's View Proposal. | Reject foreign private proposal access without replacing the editor with foreign content. | Error `BR06_FORBIDDEN_TEAM_ACCESS`: Forbidden: you do not have permission to view another team's private proposal. Team Alpha's existing DRAFT fields remained displayed. | PASS for this observed UI read-denial path; HTTP 403 and write/role paths not observed. |
| EXP-03 / AC-05 | Entered the already-present Pawarit email in Add Teammate and selected Add Member. | Reject duplicate membership and keep the original roster. | Error `BR01_DUPLICATE_TEAM_MEMBERSHIP`: Target student is already a member of an active team in this course. Team Alpha remained 1/3 with one Pawarit row. | PASS for the visible duplicate-add check; HTTP 409 and duplicate team creation not observed. |
| EXP-04 / AC-03 | Selected Logout. | Return to sign-in and remove the authenticated workspace. | Sign-in screen displayed `Logged out successfully. Session token revoked.` | PASS for visible logout only; revoked-token replay/restart not tested. |

No existing proposal or membership was changed by these checks. A credential-entry automation sequencing error was corrected before successful login; the first click was stopped by native email validation. That attempted form submission is not a product defect or an invalid-password test. Its screenshot/transcript is excluded from deliverable evidence because a credential was temporarily visible in the email control; no such value is reproduced here.

Tool screenshots and accessibility output were observed in the conversation. No standalone screenshot file has been exported; text observations in this record must not be presented as attached image files.

## Second student and observed finding (approximately 19:03–19:06 Asia/Bangkok)

| ID / AC | Actual steps | Actual result | Status / limit |
| --- | --- | --- | --- |
| EXP-05 / AC-01 | After EXP-04, changed the login email to the supplied Suda account and signed in with the supplied password. | Header showed Suda Jaidee / STUDENT. Her current team is `Lab5-Persistence-20261112`, one Suda leader, 1/3; directory status `NO_DRAFT`. The quick-fill label saying Unassigned does not describe her current membership. | PASS for visible account identity; unsuitable unassigned fixture, so new-team/capacity execution is BLOCKED. |
| EXP-06 / AC-03, AC-10, NFR-02 | Compared Suda's proposal editor immediately after switching from Pawarit, without reloading the application. | Despite Suda's `NO_DRAFT` team, title/problem/stack/repository controls still contained Team Alpha's private draft values from the preceding Pawarit session. Add-member input also retained the preceding value. No save/submit was performed. | FAIL: `L6-OUT-EXP-001`, cross-account stale proposal disclosure in the same browser tab. This is client-state exposure; no backend access-control bypass is claimed. |
| EXP-07 / state isolation | Reloaded Chrome while still signed in as Suda and compared the same editor. | Correct Suda identity/team and `NO_DRAFT` remained; all four proposal inputs and add-member input became empty. | PASS for reload observation; it confirms the disclosure in EXP-06 was stale client state, not Suda's persisted proposal. Reload is a workaround, not an accepted fix. |

The original `NO_DRAFT` fixture is preserved for independent reproduction. No synthetic proposal was created in the historical Lab 5 team. The user was asked for an eligible unassigned UAT account while read-only checks continue.

### L6-OUT-EXP-001 — Private draft remains visible after account switch

- Reporter/operator: Codex AI, performing the user's requested browser checks for owner A. Human A/B witnessing and independent confirmation: NOT RECORDED.
- Product/source: CoursePMS at the URL and exact commit above. Actual revision/traffic: NOT CONFIRMED.
- Proposed severity: Major, pending Product Team triage. A second student can see another team's private proposal on a shared browser, and could accidentally save it into their own team. No actual copying/save was performed; no server-side bypass is established.
- Preconditions actually observed: Pawarit belongs to Team Alpha with a DRAFT; Suda belongs to a different team with no proposal (`NO_DRAFT`). One unchanged tab is used.
- Reproduction: (1) Sign in as Pawarit and let his draft load. (2) Select Logout. (3) Sign in as Suda without a page reload. (4) Inspect her proposal editor and `NO_DRAFT` directory row. (5) Reload to compare.
- Expected: after logout/account change, clear all prior-account private form data; Suda's absent draft yields empty controls.
- Actual: Suda sees Team Alpha's title, problem statement, technology stack and repository URL until reload. In this run the old title was `CoursePMS: University Course Project Management Platform`.
- Evidence: actual accessibility observations EXP-05/06/07 and conversation screenshots. No standalone image has been exported. Credential-entry screenshot excluded.
- Read-only source corroboration: at exact tested source, `client/src/App.tsx` initializes proposal fields empty (lines 83–86), populates them only when `myTeam?.proposal` exists (lines 182–191), and logout clears token/user/team data without clearing proposal form fields (lines 279?283). Source inspection supports the observed client-state explanation; it is not a replacement for the browser observation.
- Disposition: UNTRIAGED; not sent to partner. No fix, acceptance, independent retest or acknowledgement is claimed.

## Remaining browser checks and close (approximately 19:07–19:13 Asia/Bangkok)

| ID / AC | Actual steps and observations | Status / limit |
| --- | --- | --- |
| EXP-08 / AC-02 | Submitted Suda's known email with deliberately incorrect synthetic password `IntentionallyWrong-UAT-20261113`. Sign-in remained visible and showed `INVALID_CREDENTIALS`, `Invalid email or password.` | PASS for visible rejection; the API supplement independently records HTTP 401/no token/no password hash. |
| EXP-09 / AC-02 | Submitted synthetic address `l6-uat-20261113-nonexistent@example.invalid` with the same invalid password. The identical generic error was displayed. | PASS for the observed unknown-account response; API supplement records HTTP 401 and equal generic messages. |
| EXP-10 / AC-01, AC-09 | Signed in with the supplied Instructor account. Header identified Dr. Piyanit Ua-areemitr / INSTRUCTOR. Console showed 3 teams, 1 submitted, 0 approved, 0 revision requested. On Team Alpha DRAFT, feedback was disabled and text said decisions are available only while submitted. Selected Team Beta Inspect / Review: SUBMITTED/revision 1, editable feedback, Approve Proposal and Request Revision controls appeared. | PASS for identity/read-only UI state gating. No review, feedback-length boundary, state transition, submission or persistence write was performed. |
| EXP-11 / AC-03 | Selected Instructor Logout after inspection. Sign-in screen and `Logged out successfully. Session token revoked.` appeared, with no Logout button. | PASS for visible logout. Browser left signed out. |

Browser observation totals: **11 checks, 10 PASS within their stated narrow scope, 1 FAIL (EXP-06)**. EXP-00A/B are separate release/readiness observations. A passing narrow observation does not pass the entire referenced AC.

## Live HTTP supplement and reviewed interpretation

Actual requests ran around 19:08–19:10 Asia/Bangkok. The credential-free [raw HTTP ledger](2026-11-13-coursepms-api.json) records exact UTC times, methods, paths, HTTP statuses, expected assertions and sanitized outcomes. Account labels P/S/I mean the supplied Pawarit/Suda/Instructor accounts, not the official I/S1/S2/S3/S4/F fixture mapping.

- Health HTTP 200 matched the intended commit; readiness HTTP 200 reported connected.
- Anonymous access to `/api/auth/me`, `/api/teams` and `/api/teams/1/proposal` returned 401 `UNAUTHORIZED`; malformed JWT access was also 401.
- Empty credentials returned 400 `VALIDATION_ERROR`. Wrong password and unknown account returned 401 `INVALID_CREDENTIALS`, the same generic message, no token and no password hash.
- All three valid logins returned 200, correct roles and sanitized identities; `/api/auth/me` matched each identity and did not contain passwordHash.
- Pawarit foreign Team Beta read, and Suda foreign Team Alpha/Beta reads returned 403 `BR06_FORBIDDEN_TEAM_ACCESS` without a proposal.
- Each API-created session was logged out successfully. Replaying its same token against current user, teams and team proposal returned **401 `TOKEN_REVOKED`** for all nine checks. This meets the immediate revocation outcome. Restart durability, JWT expiry and startup-secret configuration were not tested.
- No business creation/edit/submit/review endpoint was invoked by the HTTP supplement. Credentials/tokens were held in memory; no token, request authentication header or real password is in the ledgers.

The original mechanical ledger has **37 assertions: 25 PASS and 12 FAIL**. These are assertion outcomes, not twelve product defects. [Assessment JSON](2026-11-13-coursepms-api-assessment.json) preserves each original result and adds its reasoned disposition: **34 PASS, 2 summary-policy clarifications, 1 contract/routing mismatch**. Nine original FAIL flags came from an overly strict `UNAUTHORIZED`-only expectation despite correct 401 `TOKEN_REVOKED` rejection. Two flags came from treating the directory's title summary as private body content; no foreign problem statement, stack, repository or feedback was observed. The intended title-sharing policy needs Product Team clarification. Neither set is reported as a confirmed security defect.

The [first HTTP attempt](2026-11-13-coursepms-api-attempt1.json) is retained separately: four observations passed before the checker stopped on JSON parsing of the bare `/api/proposals` response. The checker was corrected to retain content-type/non-JSON metadata, then completed the requests above. Do not add the repeated first-attempt assertions to the 37-observation denominator.

### L6-OUT-EXP-002 — Bare proposal path and contract discrepancy

- Actual request: anonymous `GET /api/proposals`, 13 November 2026 at `2026-11-13T12:09:47.523813+00:00`.
- Literal auth-contract expectation: 401 for protected `/api/proposals`. Actual: HTTP 200, `text/html; charset=UTF-8`, HTML application fallback.
- Evidence: `API-NOAUTH-4` in the raw ledger. Specific implemented protected proposal paths returned expected 401/403.
- Proposed impact: Minor contract/routing discrepancy, pending Product Team clarification. No private proposal body or authorization bypass was observed. The contract may mean the proposal endpoint family rather than define a bare GET collection.
- Disposition: NEEDS CLARIFICATION. Not sent, accepted, fixed or independently retested.

## Fixture ledger, remaining work and acceptance

Actual readback established the following starting state, preserved throughout the checks:

| Account | Actual membership | Proposal |
| --- | --- | --- |
| P / Pawarit | Team Alpha, ID 1; one member | DRAFT, revision 0 |
| S / Suda | Lab5-Persistence-20261112, ID 3; one member | NO_DRAFT |
| I / Instructor | Instructor role; no student team membership | Read access to the review console |

No new business record was created, no existing proposal/membership/review was changed, and no reset/deployment/restart was performed. No passwords were saved in Chrome. Browser and all three API-created sessions were signed out. Existing historical Lab 5 records and root-checkout user PDF changes were preserved.

The following remain BLOCKED or NOT RUN, rather than PASS:

- Official CPMS-UAT-01–08 execution: exact packet and steps absent. No substitute case IDs are counted as those official cases.
- New-team creation, eligible member addition and 3-to-4 capacity denial: supplied students already have teams; no S1–S4 unassigned fixture or safe repeat-run agreement is confirmed.
- New draft/submission/revision/approval journey and boundary/write-lock checks: preserve existing partner records and the observed no-draft reproduction fixture until suitable synthetic fixtures are agreed.
- Cross-team write denial, student review denial, restart durability and 8-hour expiry: not executed in this bounded session.
- Current Cloud Run revision/traffic confirmation: partner deployment-time report only; commit identity was independently verified.
- Human A/B participation, Product Team triage/acknowledgement, partner contact, independent retest and acceptance: not supplied or inferred. User was asked for an eligible unassigned test account; no reply was received during the bounded checks.

**Acceptance: PENDING.** This AI-operated session found one concrete client-state defect and one contract discrepancy; it does not replace the required personal A/B reciprocal UAT or authorize an acceptance signature. B should reproduce EXP-06 against the same source and preserve the original failing observation. The user can send the two finding sections privately to the Product Team. No external message has been sent by the agent.

Sources: [authentication contract v1.1](https://github.com/Magiciancat9/Course_management/blob/150dc5db3de5c829a7d9ef1adb545191cc37542d/docs/sprints/sprint-1/f01-auth-and-roles.md), [team/proposal contract v1.0](https://github.com/Magiciancat9/Course_management/blob/150dc5db3de5c829a7d9ef1adb545191cc37542d/docs/sprints/sprint-1/f02-team-and-proposal-workflow.md), [tested client source](https://github.com/Magiciancat9/Course_management/blob/150dc5db3de5c829a7d9ef1adb545191cc37542d/client/src/App.tsx#L182), [server list sanitization](https://github.com/Magiciancat9/Course_management/blob/150dc5db3de5c829a7d9ef1adb545191cc37542d/server/src/app.ts#L200). Source inspection is read-only corroboration; no partner repository changes occurred.
