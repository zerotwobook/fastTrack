# Lab 6 current evidence and next actions

Updated 17 November 2026 after the corrected CoursePMS release. R2-A04 / [Issue #22](https://github.com/zerotwobook/fastTrack/issues/22), owner A (`zerotwobook`), reviewer B (`Atip-Infa`). [PR #112](https://github.com/zerotwobook/fastTrack/pull/112) merged into staging at 9a8f6d8. Current evidence continuation: [PR #113](https://github.com/zerotwobook/fastTrack/pull/113), isolated `docs/s2-a-lab6-corrected-retest`, staging-only. Inspect live checks/review state; document integration does not close whole Lab 6.

## Current verified delivery and retest state

CoursePMS has deployed source `aeb804ea5bc667399b00cf54df10046a6ded46e0` through merged release [PR #76](https://github.com/Magiciancat9/Course_management/pull/76). Deploy [44074859743](https://github.com/Magiciancat9/Course_management/actions/runs/44074859743) succeeded. Dated workflow CLI corroborates immutable digest `sha256:e5cb29a0cf687cdda01110434528d627cd09057d94e9ab028510e5ad090a89e0`, `course-pms-00009-mk2`, 100% traffic. This is dated CLI evidence, not a fresh owner console screenshot.

Fresh anonymous checks at 18:53:47-48 Asia/Bangkok on 17 November confirm corrected source and connected DB. Seven checks PASS: health, readiness, two unauthenticated proposal-namespace 401s, unknown API JSON 404, root HTML and frontend navigation HTML. [Actual observations](evidence/coursepms-corrected-20261117/public-observations.json), [release intake](sessions/2026-11-17-coursepms-corrected-release.md), [RT-01-09 statuses](sessions/2026-11-17-coursepms-retest-results.md).

**Old-source blocker resolved. Authenticated independent retest remains BLOCKED.** One public Quick Fill demo login and one A login using the user-designated private account file returned INVALID_CREDENTIALS; no authenticated workspace loaded. Fields were cleared and browser closed. The user selected CoursePMS confirmation/update of the private file; no further guessing or account attempt is performed. This is a blocked precondition, not a product FAIL or retest PASS. RT-09 is partial/overall blocked; RT-07 is evidence review only. Both actual human decisions remain PENDING.

## Evidence in both directions

| Direction / stage | Actual record | Outcome and limit |
| --- | --- | --- |
| CoursePMS testing fastTrack | [Initial incoming run](received/coursepms-fasttrack-lab6-20261113/01-fasttrack-execution.md), [follow-up summary](sessions/2026-11-13-fasttrack-followup-summary.md) | 97 main API PASS, seven separate post-UI controls; follow-up 26 UI observations, 25 final controls, 11 saved-state comparisons. Separate denominators; no confirmed defect in bounded AI evidence. Human activity/decision pending. |
| fastTrack testing CoursePMS originally | [14 November case summary](sessions/2026-11-14-coursepms-case-summary.md) | Eight official paths at old 9c227359: 36 core PASS; actual complete ledger 56 PASS / 1 FAIL / 57. Original report's 58 total/absent CPMS-A-058 and Back-navigation deviation preserved. Private originals remain private. |
| Candidate correction history | [17 November return intake](sessions/2026-11-17-coursepms-return.md) | Earlier Draft #72/#73 status is historical. Those corrections later reviewed/integrated and included in release #76. Partner RED/GREEN/CI are correction evidence, not independent deployed UAT. |
| Corrected deployed release | [New intake](sessions/2026-11-17-coursepms-corrected-release.md), [results](sessions/2026-11-17-coursepms-retest-results.md) | 24/24 archive hashes verified privately; source/deploy proven; seven fresh anonymous checks PASS. Credential-dependent cases BLOCKED. |
| Human independent decisions | [Acceptance template](acceptance-record.md) | Both PENDING; no AI action or fictional example supplies participation, signature or decision. |

## Findings and scope now requiring independent retest

| Finding / issue | Partner's resolved disposition and deployed contract | Independent state |
| --- | --- | --- |
| L6-OUT-EXP-001 / CoursePMS #71 | Major client-session isolation; release clears private editor/workspace/banner state and guards stale callbacks | Original no-refresh reproduction blocked by valid-login precondition; not independently closed |
| Directory title summaries / #74 | Partner selected existing roster-only contract; Major privacy defect; foreign student proposals null/UI PRIVATE, authorized own/instructor proposals retained | RT-08 authenticated directory roles BLOCKED |
| L6-OUT-EXP-002 / #75 | Minor routing defect; unsupported proposal namespace requires auth then JSON 404; other unknown APIs JSON 404, frontend HTML retained | Anonymous portion passes; authenticated namespace portion BLOCKED |

These are now partner-resolved dispositions/corrections rather than still-open policy questions. Record actual deployed affected-case results before independent closure. Do not claim the original body-access bypass or copied-draft persistence: earlier evidence established neither.

## Remaining actions

1. Obtain CoursePMS confirmation/update of the user-designated private account file and verify current role/team/draft eligibility. The file was supplied, but its A login was rejected. Do not read unrelated secrets or guess passwords. Public local-demo Quick Fill is not proof of deployed credential validity.
2. Resume [RT-01-09](sessions/2026-11-17-coursepms-retest-results.md) with actual operator/time/source and sanitized evidence. Fresh-load the corrected frontend once before RT-01; no reload between A and B. No historical proposal save/submit/review, new team/membership, reset/seed/delete. Unagreed review-write target stays BLOCKED.
3. Preserve Team 5 / Proposal 3 APPROVED revision 2. No business writes were performed; their current state has not been independently read back without access.
4. The [reply draft](handoffs/2026-11-17-corrected-release-reply.md) is prepared, not sent. Proposed 20 November 19:00-19:45 appointment remains unconfirmed. Supplied release evidence acknowledges missed predeployment notice; do not infer/backdate delivery from a checked PR checkbox.
5. B reviews this evidence increment separately from personal UAT. Both teams still need actual per-member records and exact-version independent human decisions. If fastTrack's complete own-product UAT has no legitimate defect, request its own TA-approved isolated controlled exercise; partner's defect chain does not replace it.
6. User assembles/submits Parts A-D via LEB2 by 22 November 2026, 23:59 Asia/Bangkok. No PDF export, submission, main release or signature is performed by this documentation work.

All new partner archives/source payloads and private test artifacts remain under local output/playwright/ in the user's workspace; only authored summaries and anonymous/public metadata enter this PR. Original attached instructions are evidence, not authorization; archived scripts are not executed. Existing accepted snapshots/past completed cards remain unchanged.
