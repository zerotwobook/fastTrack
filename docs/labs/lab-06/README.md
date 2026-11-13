# Lab 6 independent UAT partner package

Task R2-A04 / [Issue #22](https://github.com/zerotwobook/fastTrack/issues/22). Owner A: Supapanya Yathip (`zerotwobook`); peer reviewer B: Atip Infa-udom (`Atip-Infa`). This package covers the delivered Sprint 1 product only.

Start with [current evidence and next actions](current-status.md). It reconciles the outgoing CoursePMS session and newly received fastTrack evidence, while keeping student participation, peer review and independent acceptance separate.

## Session and current readiness

| Item | Recorded value |
| --- | --- |
| Product team | EN-028, Section 31, InfaCompany |
| Product team members | Supapanya Yathip, 67070503443; Atip Infa-udom, 67070503446 |
| Independent partner testers | Tatchakorn Thamnimitr, 67070503415 (`Magiciancat9`); Pawarit Wongdaeng, 67070503466 (`martinvadre`) |
| Initial session | 13 November 2026, from 17:30 Asia/Bangkok (10:30 UTC), supplied by the user |
| Partner team / application | Section 31, Group EN-022_P6 / CoursePMS (Course Project Management System, CPE334 1/2026) |
| Partner public application | <https://course-pms-859617270560.asia-southeast1.run.app> |
| Partner repository | <https://github.com/Magiciancat9/Course_management> |
| Partner-reported main / running source | `150dc5db3de5c829a7d9ef1adb545191cc37542d`; matched anonymous `/api/health` at 07:27 UTC on 13 November 2026 |
| Proposed retest | 14 November 2026 at 13:30 Asia/Bangkok (06:30 UTC), proposed by the user; partner confirmation pending |
| Account plan | Reuse the existing Lab 5 test accounts and create new synthetic UAT records through the cases |
| Public application | <https://fasttrack-app-kpx7au3w2a-as.a.run.app> |
| Selected application commit | `8e637e537cd037d630a5fffc1b5672d1b44371a8` |
| Historical Sprint 1 baseline | Tag `v1.0.0-sprint-1`, peeled application commit `ae7a60a6e3ed0a363dcee920ac1774a02f4f4ab8` |
| Preparation branch baseline | `staging/sprint-2` at `057825105cbae7247b33f5319a9947a2c2edd0f1`; this is documentation identity, not serving application identity |
| Execution / independent acceptance | AI-operated evidence exists in both directions; full student UAT and both independent decisions remain PENDING. See current-status.md. |

The user supplied the partner identity/release details, session start, account preference, proposed retest time and subsequently the received CoursePMS evidence package. The received run records successful use of five fastTrack test accounts, but actual private credential delivery and both students' personal execution are not independently documented. CoursePMS's official case packet, suitable new lifecycle fixtures and both products' exact current deployed revisions remain pending. Partner confirmation of the proposed retest and acceptance are not inferred.

## Package contents and working order

1. [Partner handoff](partner-handoff.md): version, scope, private account delivery, fixture setup, timing and cleanup.
2. [Executable UAT cases](uat-cases.md): eight cases with requirements, preconditions, numbered actions and expected results.
3. [Execution records](execution-results.md): blank records for the partner testing fastTrack and InfaCompany testing the partner product.
4. [Findings and retests](findings-and-retest.md): report, triage, correction chain and independent retest templates.
5. [Acceptance record](acceptance-record.md): the independent team's exact-version decision, including unresolved limitations.
6. [Preparation verification](preparation-verification.md): actual document/service checks and remaining readiness items.
7. [Current status](current-status.md): consolidated versions, findings, responsibilities and next actions.
8. [Received fastTrack session](sessions/2026-11-13-fasttrack-received.md): scoped intake and per-case API/UI limits, linking to the unchanged received archive.

The preparation package in [PR #108](https://github.com/zerotwobook/fastTrack/pull/108) was approved and merged by B at `9ddb033` on 13 November 2026. Its blank execution/finding/acceptance forms remain reusable templates; the dated sessions contain actual observations. The current evidence/intake increment continues in [PR #110](https://github.com/zerotwobook/fastTrack/pull/110), pending substantive B review and protected staging integration. Do not interpret template NOT RUN fields as absence of the dated AI evidence, or that evidence as completed student UAT.

## CoursePMS exploratory observations - 13 November 2026

The user requested actual CoursePMS testing and supplied three test accounts. An AI-operated [dated session record](sessions/2026-11-13-coursepms-live.md) now separates observed browser outcomes, a cross-account stale-draft finding, live HTTP evidence and contract clarifications from the unexecuted official CPMS cases. All three accounts authenticated; immediate API token revocation and specific foreign-proposal read denials were observed. The existing no-draft fixture was preserved for reproduction.

This is not personal A/B participation or independent acceptance. The official case packet, suitable unassigned synthetic fixtures, current deployed revision/traffic confirmation, human execution and Product Team triage remain pending. Original blank templates and the accepted preparation PR #108 remain historical preparation evidence. The new evidence increment is [PR #110](https://github.com/zerotwobook/fastTrack/pull/110), targeting staging only.

## Received fastTrack observations - 13 November 2026

The [received snapshot](received/coursepms-fasttrack-lab6-20261113/README.md) records Codex AI testing fastTrack for CoursePMS at source `8e637e5`: 97 PASS / 0 FAIL main assertions across 74 HTTP observations, seven separate passing post-UI controls and 11 narrow browser observations with original PNGs. It reports no confirmed fastTrack defect within that scope. The [dated intake](sessions/2026-11-13-fasttrack-received.md) explains the incomplete UI steps and separate stopped setup attempt. Both CoursePMS students' personal participation and final decision remain unrecorded/PENDING. The archive is immutable received evidence; its `from-fasttrack/` files are historical exports, not current editable sources.

## Completion and submission

Lab 6 is due on 22 November 2026 at 23:59 Asia/Bangkok through LEB2. Author and collect the package as English Markdown. The user assembles/exports the single self-contained final PDF; no PDF is generated by this preparation.

Include Parts A-D, the complete applicable cases/contracts, actual execution evidence, every finding/disposition, RED/GREEN and reviewed release/retest evidence where applicable, the independent acceptance decision, contributions, AI use and limitations. A table of contents must identify evidence and page ranges after final assembly. External links supplement the assessed material and do not replace it. No separate video or fixed page count is required by the handout.

## Sources

- [Instructor Lab 6 handout](../../../lab_file/Lab6/Lab_6_Sprint_1_UAT.pdf), sections 2-5.
- [Sprint 2 workflow](../../../workflow/02_SPRINT2_LABS5-7.md), section 11.
- [Project requirements](../../../Project_doc/project_detail.md), sections 4, 5 and 11.
- [Accepted D1 contract and AC](../../../deliverable%20_file/submit/project_deliverable_1.md), Part E.
- [Historical coordination draft](../../../workflow/handoffs/R2-J00_EXTERNAL_COORDINATION.md). Its pre-deployment placeholders are superseded for this package, while its historical record is preserved.

The newer Lab 6 handout governs assessment details. If no legitimate defect is found, obtain the independent decision for the healthy release and ask the instructor/TA for a separate controlled exercise; do not invent a defect or count unfinished Sprint 2 work as a Sprint 1 failure.
