# Independent UAT execution records

Blank working templates. **No case has been executed or passed by this preparation.** Copy this file to a dated session record when the actual testers begin. Preserve original failed/blocked observations when a later retest is added.

## A. Partner team testing fastTrack (incoming evidence)

| Session field | Value / entry to complete |
| --- | --- |
| Product team | InfaCompany / EN-028 / Section 31 |
| Planned independent testers | Tatchakorn Thamnimitr, 67070503415; Pawarit Wongdaeng, 67070503466 |
| Planned start | 13 November 2026, 17:30 Asia/Bangkok |
| Actual start / end | NOT RECORDED |
| Actual participating testers and roles | NOT RECORDED; identify who performed each action |
| Application URL | https://fasttrack-app-kpx7au3w2a-as.a.run.app |
| Selected source | 8e637e537cd037d630a5fffc1b5672d1b44371a8; confirm actual source at the session start |
| Actual health/ready time, HTTP status and versions | NOT RECORDED |
| Actual deployed revision / owner confirmation source | NOT RECORDED; do not infer revision from health version |
| Browser / OS / viewport | NOT RECORDED |
| Run ID | L6-20261113-1730, or agreed rerun suffix |
| Credential delivery / correct role-team verification | NOT RECORDED; labels and delivery confirmation only |
| Actual retest appointment | NOT AGREED |

### Case summary

Statuses: NOT RUN before execution; PASS only when all specified observations pass; FAIL for an observed mismatch; BLOCKED for an unfulfilled prerequisite or unexecuted required subcheck. Keep subresults explicit if a case has both completed and blocked parts.

| Case | Actual tester / role | Actual time and version | Actual result / detail reference | Status | Evidence / finding IDs |
| --- | --- | --- | --- | --- | --- |
| UAT-01 | NOT RECORDED | NOT RECORDED | NOT OBSERVED | NOT RUN | None recorded |
| UAT-02 | NOT RECORDED | NOT RECORDED | NOT OBSERVED | NOT RUN | None recorded |
| UAT-03 | NOT RECORDED | NOT RECORDED | NOT OBSERVED | NOT RUN | None recorded |
| UAT-04 | NOT RECORDED | NOT RECORDED | NOT OBSERVED | NOT RUN | None recorded |
| UAT-05 | NOT RECORDED | NOT RECORDED | NOT OBSERVED | NOT RUN | None recorded |
| UAT-06 | NOT RECORDED | NOT RECORDED | NOT OBSERVED | NOT RUN | None recorded |
| UAT-07 | NOT RECORDED | NOT RECORDED | NOT OBSERVED | NOT RUN | None recorded |
| UAT-08 | NOT RECORDED | NOT RECORDED | NOT OBSERVED | NOT RUN | None recorded |

### Detailed record to copy for every case

- Case ID / requirement / AC:
- Actual tester, team, role and time zone:
- Start / end time:
- Application URL, source commit and deployed revision:
- Preconditions actually verified, run ID and input values:
- Numbered actions actually performed, including any deviation:
- Expected result (reference the case sheet):
- Actual result in the tester's own words, including each required subcheck:
- Before/after saved state, IDs/content/counts for rejected writes:
- Observed sanitized HTTP status/domain code, if inspected (otherwise NOT OBSERVED):
- Status and reason:
- Evidence IDs / readable file references:
- Finding IDs / handoff time, if any:

Do not copy expected text into the actual-result field without an observation. A disabled UI control does not establish an HTTP denial. To observe HTTP status, open Developer Tools > Network before the request, select that domain request and record its status plus sanitized response error; never export headers/cookies/HAR or capture authentication responses.

### New record ledger

| Record | Actual ID / URL | Exact saved fields / count | Observed by / time |
| --- | --- | --- | --- |
| Team A scope | Confirm historical Team A ID from handoff | Current SA/A1 assignment NOT VERIFIED | NOT RECORDED |
| NORMAL milestone | NOT CREATED | Title/description/dueAt NOT RECORDED | NOT RECORDED |
| NORMAL submission | NOT CREATED | Version/author/time/title/description/link NOT RECORDED | NOT RECORDED |
| First / second feedback | NOT CREATED | Exact messages, order and count NOT RECORDED | NOT RECORDED |
| DEADLINE milestone | NOT CREATED | dueAt and late-check serverTime NOT RECORDED | NOT RECORDED |
| VALIDATION milestone | NOT CREATED | Zero submissions not yet observed | NOT RECORDED |
| Unexpected denied-write result, if any | NOT OBSERVED | Preserve ID/evidence if a forbidden write succeeds | NOT RECORDED |

## B. InfaCompany testing the partner product (outgoing evidence)

This is a separate obligation. Both Supapanya Yathip and Atip Infa-udom must participate as independent testers of the other team's supplied Sprint 1 cases. Results do not become fastTrack acceptance evidence.

| Session field | Value / entry to complete |
| --- | --- |
| Partner team number / product / members | Team number/product PENDING; members supplied in incoming session above |
| Partner repository / deployed URL | NOT SUPPLIED |
| Partner Sprint 1 scope / requirement and AC reference | NOT SUPPLIED |
| Partner tested source / revision / release | NOT SUPPLIED |
| Partner case sheet and safe private account delivery | NOT SUPPLIED |
| Actual start / end / timezone | NOT RECORDED |
| Actual testers / roles | NOT RECORDED; record both InfaCompany members' participation |
| Setup / cleanup / limitations | NOT SUPPLIED |

Use the partner's actual case IDs, steps and expected results; do not substitute fastTrack cases. Execute all agreed cases with at least the four required categories, adding rows as necessary.

| Partner case ID / category | Actual tester / role | Time / exact version | Actual inputs and observations | Status | Evidence / outgoing finding |
| --- | --- | --- | --- | --- | --- |
| TO BE SUPPLIED / normal | NOT RECORDED | NOT RECORDED | NOT OBSERVED | NOT RUN | None recorded |
| TO BE SUPPLIED / rule or boundary | NOT RECORDED | NOT RECORDED | NOT OBSERVED | NOT RUN | None recorded |
| TO BE SUPPLIED / role or ownership | NOT RECORDED | NOT RECORDED | NOT OBSERVED | NOT RUN | None recorded |
| TO BE SUPPLIED / state or persistence | NOT RECORDED | NOT RECORDED | NOT OBSERVED | NOT RUN | None recorded |

Copy the detailed-case template for every partner case. If access fails or the independent team is unavailable, retain actual BLOCKED evidence and timely instructor/TA notification; own-team tests do not replace the required independent execution.

## C. Evidence inventory and session close

| Evidence ID | Direction / case / action | Expected versus actual observation | Actual time / tested version | File or document reference | Credential redaction checked by |
| --- | --- | --- | --- | --- | --- |
| TO BE RECORDED | NOT RECORDED | NOT OBSERVED | NOT RECORDED | NOT SUPPLIED | NOT CHECKED |

- Actual number of cases / PASS / FAIL / BLOCKED / NOT RUN: NOT COUNTED.
- Findings exchanged and confirmed received: NOT RECORDED.
- Temporary sessions signed out: NOT RECORDED.
- New synthetic records retained with IDs: NOT RECORDED.
- Agreed fix/retest plan: NOT RECORDED.
- Final independent decision: use [acceptance-record.md](acceptance-record.md), PENDING until actually made.
