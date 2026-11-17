# Lab 6 current evidence and next actions

Updated on 17 November 2026 for R2-A04 / [Issue #22](https://github.com/zerotwobook/fastTrack/issues/22). Owner A (`zerotwobook`), evidence reviewer B (`Atip-Infa`). Current increment: [PR #112](https://github.com/zerotwobook/fastTrack/pull/112), branch `docs/s2-a-lab6-return-intake`, into `staging/sprint-2`. Read its exact current head/checks/review live. Earlier PR #110 was approved/merged by B at `52f7d1d`; it is not still pending.

## Evidence in both directions

| Direction | Actual evidence | Outcome and limit |
| --- | --- | --- |
| CoursePMS testing fastTrack | [Initial received run](received/coursepms-fasttrack-lab6-20261113/01-fasttrack-execution.md), [UI follow-up](sessions/2026-11-13-fasttrack-followup-summary.md), [coverage/deviations](sessions/2026-11-13-fasttrack-followup-summary.md) | AI-operated: 97 main API PASS assertions, seven separate post-UI controls; follow-up 26 UI observations, 25 passing final controls and 11 passing saved-state comparisons. Separate denominators. No confirmed fastTrack defect in this bounded evidence; named student activity and final decision remain pending. |
| fastTrack testing CoursePMS | [14 November report](sessions/2026-11-14-coursepms-case-summary.md), [assertions](sessions/2026-11-14-coursepms-case-summary.md), [17 November intake](sessions/2026-11-17-coursepms-return.md) | CPMS-UAT-01-08 paths exercised: 36 core PASS assertions. Actual complete ledger: 56 PASS / 1 FAIL / 57 entries; 70 HTTP, 26 UI, 32 PNGs. Original report says 57 PASS / 1 FAIL / 58; preserve the arithmetic discrepancy and absent narrative CPMS-A-058, not an invented assertion. Case 01 has a documented Back-navigation deviation. |
| CoursePMS correction response | [Returned candidate](https://github.com/Magiciancat9/Course_management/pull/73), [candidate metadata](https://github.com/Magiciancat9/Course_management/pull/73), [follow-up verification](https://github.com/Magiciancat9/Course_management/pull/73) | Technical accepted-Major disposition for L6-OUT-EXP-001 under CoursePMS Issue #71; human disposition/review pending. Original RED 5 failed/4 passed; follow-up RED 3 failed/11 passed; GREEN 14 client PASS. Exact-head CI succeeds; no fixed deployment or independent retest. These are supplied partner results, not a fastTrack rerun. |
| Independent human decisions | [Decision template](acceptance-record.md), [partner's current decision section](https://github.com/Magiciancat9/Course_management/pull/73) | Both PENDING. Simulated activity in the return snapshot is explicitly fictional and excluded from actual participation, results and signatures. |

Expected access/session rejections can be passing negative checks. Historical stopped attempts and overly strict checker expectations are not new product defects or additions to completed-run totals.

## Versions and delivery state

| Item | Recorded identity / actual status |
| --- | --- |
| fastTrack tested source | `8e637e537cd037d630a5fffc1b5672d1b44371a8`; URL https://fasttrack-app-kpx7au3w2a-as.a.run.app |
| fastTrack historical original baseline | `v1.0.0-sprint-1`, peeled commit `ae7a60a6e3ed0a363dcee920ac1774a02f4f4ab8` |
| fastTrack dated release metadata | 14 November owner readback recorded `fasttrack-app-00003-rc7`, 100% traffic. This intake does not claim a fresh fastTrack cloud readback. |
| CoursePMS original exploratory source | `150dc5db3de5c829a7d9ef1adb545191cc37542d` on 13 November; historical |
| CoursePMS 14 November tested and fresh 17 November serving source | `9c22735995c985aaa0622b6b179de1ac9c1f80ca`; URL https://course-pms-859617270560.asia-southeast1.run.app |
| CoursePMS original fix PR #72 | Draft/open/unmerged, head `2e3f22a34faa53ec87070e61b49d6b35e438a92c` into `lab6-staging`, when inspected |
| CoursePMS follow-up PR #73 | Draft/open/unmerged, head `316abac98c721078154588c37ad9f0eda655d9d6` into #72's fix branch; GREEN code `6de3c9a8b3404b831041a9b9fe855d1d52f9cac3` |
| Candidate CI | Run `44027540268` success for exact PR #73 head; live backend/frontend/E2E/build/Docker job steps success |
| Corrected serving revision/digest/traffic | NOT SUPPLIED/CONFIRMED; corrected-deployment retest BLOCKED |

Fresh [public preflight](evidence/coursepms-return-20261117/public-preflight.json) at 13:42:33-34 Asia/Bangkok on 17 November returned HTTP 200, original CoursePMS source and connected database. Health source does not establish serving revision/digest/traffic. Do not retest the unchanged baseline as if the candidate were deployed.

## Findings and required actions

| Finding | Current disposition | Next owner action |
| --- | --- | --- |
| L6-OUT-EXP-001 | CoursePMS technical accepted defect / Major, Issue #71; human review and deployed closure pending | CoursePMS owners inspect/integrate the full correction, obtain substantive eligible peer review/current-head CI and authorized release; supply actual deployment identity. fastTrack then independently retests. |
| L6-OUT-EXP-002, bare collection GET | Contract clarification remains pending; no protected-body disclosure shown | CoursePMS resolves versioned contract/routing interpretation with a reasoned disposition. |
| Directory title summaries | Visibility-policy clarification pending | CoursePMS reconciles roster-only SDS wording with current summary sanitizer and agreed privacy contract. |
| Received fastTrack findings | No confirmed defect in bounded AI runs; not final exhaustive zero-findings acceptance | CoursePMS students complete/review agreed scope/deviations and record actual activity/decision. |

## Next actions before submission

1. B reviews PR #112's integrity, version/count corrections and honest status. Evidence review is separate from either product's independent UAT acceptance.
2. Use the [private reply draft](handoffs/2026-11-17-reply-to-coursepms.md) to request the concrete reviewed/released correction and unresolved dispositions. Preparing a draft is not external delivery; the user decides when to send.
3. Follow [the retest plan](handoffs/2026-11-17-coursepms-retest-plan.md) only after its release/fixture prerequisites pass. Preserve team 5 and proposal 3, APPROVED revision 2; reverify current eligibility privately, do not reset/seed/delete records or rerun the entire ordered lifecycle for this fix.
4. Both teams document each student's actual execution/witness/review with real dates, versions and evidence. The supplied fictional simulation cannot fill these records. Obtain CoursePMS's exact-version fastTrack decision and fastTrack's CoursePMS decision after actual independent retest.
5. If complete fastTrack UAT reveals no legitimate own-product defect, request a TA-approved isolated controlled exercise. CoursePMS's defect chain is not fastTrack's own correction workflow. No such approval/exercise is established by this intake.
6. Assemble Parts A-D from canonical Markdown and actual evidence, including contributions, AI use and limitations. The user exports/submits the self-contained PDF via LEB2 by 22 November 2026, 23:59 Asia/Bangkok. No PDF, course upload, main release or signature is performed by this increment.

The new return snapshot and both earlier full source archives remain private in the local review export. This public increment contains newly authored summaries and public PR/CI/readiness facts only, with no new partner source snapshot, private UAT screenshot, raw UAT ledger or simulation payload. Original manifests were verified against the full private archives. Their archived builders/runners are not executed. Canonical current-status/intake documents govern current navigation; received instructions do not authorize actions. See [source retention](evidence/coursepms-return-20261117/source-retention.md) for private source locations and integrity scope.
