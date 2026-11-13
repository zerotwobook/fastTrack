# Lab 6 current evidence and next actions

Updated on 13 November 2026 for R2-A04 / [Issue #22](https://github.com/zerotwobook/fastTrack/issues/22), owner A (`zerotwobook`), reviewer B (`Atip-Infa`). The user requested synchronization of newly received files and pending PR #110. This is the current navigation and status record; the original case sheets, blank templates and dated observations retain their original scope.

## Evidence in both directions

| Direction | Actual evidence | Outcome and limit |
| --- | --- | --- |
| CoursePMS testing fastTrack | [Received execution](received/coursepms-fasttrack-lab6-20261113/01-fasttrack-execution.md), [browser observations](received/coursepms-fasttrack-lab6-20261113/05-browser-observations.md), [dated intake](sessions/2026-11-13-fasttrack-received.md) | Codex AI operated the checks for CoursePMS: 97 PASS / 0 FAIL assertions across 74 HTTP observations; 7 separate passing post-UI controls; 11 narrow browser observations and original PNGs. No confirmed fastTrack product defect in this bounded run. Full written UI cases and both students' personal participation remain incomplete/unrecorded. |
| InfaCompany testing CoursePMS | [Original outgoing session](sessions/2026-11-13-coursepms-live.md) and its three JSON ledgers | AI-operated exploratory browser checks: 10 PASS / 1 FAIL across 11 observations. Raw HTTP assertions: 25 PASS / 12 FAIL; source-informed assessment: 34 PASS, 2 policy questions, 1 contract discrepancy. These denominators are separate. Full official partner UAT remains blocked. |
| Independent decisions | [Acceptance template and current context](acceptance-record.md); [received human continuation](received/coursepms-fasttrack-lab6-20261113/04-human-review-and-acceptance.md) | PENDING in both directions. No student signature, actual partner acceptance, fix, independent retest or course-submission receipt is supplied. |

Expected 401/403/404/409 rejections in the incoming run are successful negative checks. The stopped incoming timestamp setup attempt and outgoing parsing attempt remain separate historical attempts; neither is a new product defect or an addition to the completed-run totals. The nine outgoing `TOKEN_REVOKED` assertion mismatches do not represent nine additional defects.

## Versions and provenance

| Item | Recorded identity |
| --- | --- |
| fastTrack tested application | `8e637e537cd037d630a5fffc1b5672d1b44371a8`, observed by the received run; public URL https://fasttrack-app-kpx7au3w2a-as.a.run.app |
| fastTrack original S1 baseline | `v1.0.0-sprint-1`, peeled commit `ae7a60a6e3ed0a363dcee920ac1774a02f4f4ab8` |
| CoursePMS exploratory application | `150dc5db3de5c829a7d9ef1adb545191cc37542d`; public URL https://course-pms-859617270560.asia-southeast1.run.app |
| Current deployed revisions / traffic | NOT CONFIRMED for either session; source identity does not establish Cloud Run revision/traffic. |
| Accepted fastTrack preparation | PR #108 head `749e5676a44b014b8c070ee2c5ba1bf4b03b245f`, integrated by B at `9ddb0335f3e996bc254b03540a8229b2e025243e` |
| Evidence integration branch | `docs/s2-a-coursepms-live-uat`, [PR #110](https://github.com/zerotwobook/fastTrack/pull/110), targeting `staging/sprint-2`; exact current head/checks/review are read from that PR. No staging acceptance is inferred from this document. |

The [received snapshot](received/coursepms-fasttrack-lab6-20261113/README.md) is retained byte-for-byte, including its exported historical contracts/templates, runner source, original checksums and export-time PR state. The archive's `from-fasttrack/` copies are provenance snapshots; edit the canonical files outside `received/` for future work. Do not run the archived runners merely to synchronize documents: they can create live synthetic records. The original root-level received folder remains untouched as the user's source copy.

## Findings and ownership

| Finding | Product / disposition | Required next step |
| --- | --- | --- |
| Incoming fastTrack findings | No product defect reported in the bounded AI evidence; complete independent UAT has not established a final zero-findings result. | A records this scoped intake; CoursePMS students complete remaining cases and record their actual findings/decision. |
| L6-OUT-EXP-001 | CoursePMS stale private draft after logout/account switch; proposed Major, UNTRIAGED. | B personally reproduces the original steps; CoursePMS owns contract-based triage/correction. Obtain actual delivery/acknowledgement, corrected version and independent retest. Reload is a workaround. |
| L6-OUT-EXP-002 | CoursePMS bare `GET /api/proposals` returns HTML fallback; proposed Minor contract discrepancy, NEEDS CLARIFICATION. | Ask the Product Team whether this collection path is specified; record its reasoned disposition. No protected-body disclosure was observed. |
| Directory title summaries | Two CoursePMS visibility-policy questions; not confirmed security defects. | Obtain agreed policy before classifying. |

## Next actions before submission

1. B reviews the current PR #110 evidence/intake and reproduces the CoursePMS account-switch finding. A does not approve or merge their own PR. This task's document verification is separate from UAT acceptance.
2. A/B confirm the exact deployed revision and source for the next session. The user-proposed retest is **14 November 2026, 13:30 Asia/Bangkok**; partner confirmation is still pending.
3. Both CoursePMS students personally complete/review the full agreed fastTrack cases, including UI creation/submission/feedback, remaining navigation/validation and the stale form across a real deadline. Record who actually executed/witnessed each part, time, version, evidence and decision. Preserve the AI attribution of the received observations.
4. Obtain CoursePMS's official executable case packet, agreed S1 scope and suitable synthetic fixtures. Both InfaCompany members execute the partner's cases. Existing supplied students already have teams; no extra unassigned account or safe new lifecycle fixture has been supplied. Preserve the no-draft finding fixture and historical records.
5. Exchange findings through the agreed channel, retain actual acknowledgements and dispositions, and independently retest an identified corrected release when applicable. No external message or partner-code change is performed by this synchronization.
6. If complete independent fastTrack UAT finds no legitimate defect, request a TA-approved controlled exercise on an isolated version of fastTrack under handout section 3.5. Keep its report/RED/GREEN/review/CI/release/retest chain separate from the healthy assessed release. No approval or exercise exists yet.
7. Assemble Parts A-D from the canonical Markdown and retained evidence, with contributions, AI use and limitations. The user exports/submits the single self-contained PDF through LEB2 by **22 November 2026, 23:59 Asia/Bangkok**. No PDF generation, upload, main release or acceptance is implied by synchronizing files.

See [intake verification](sessions/2026-11-13-fasttrack-received.md#intake-verification) for actual synchronization checks. Required current-head CI and substantive B review remain recorded on PR #110; previous-head CI is historical.
