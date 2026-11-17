# Lab 6 current evidence and next actions

Updated 17 November 2026 after the corrected CoursePMS release. R2-A04 / [Issue #22](https://github.com/zerotwobook/fastTrack/issues/22), owner A (`zerotwobook`), reviewer B (`Atip-Infa`). [PR #112](https://github.com/zerotwobook/fastTrack/pull/112) merged into staging at 9a8f6d8. Current evidence continuation: [PR #113](https://github.com/zerotwobook/fastTrack/pull/113), isolated `docs/s2-a-lab6-corrected-retest`, staging-only. Inspect live checks/review state; document integration does not close whole Lab 6.

## Current verified delivery and retest state

CoursePMS has deployed source `aeb804ea5bc667399b00cf54df10046a6ded46e0` through merged release [PR #76](https://github.com/Magiciancat9/Course_management/pull/76). Deploy [44074859743](https://github.com/Magiciancat9/Course_management/actions/runs/44074859743) succeeded. Dated workflow CLI corroborates immutable digest `sha256:e5cb29a0cf687cdda01110434528d627cd09057d94e9ab028510e5ad090a89e0`, `course-pms-00009-mk2`, 100% traffic. This is dated CLI evidence, not a fresh owner console screenshot.

Fresh anonymous checks at 18:53:47-48 Asia/Bangkok on 17 November confirm corrected source and connected DB. Seven checks PASS: health, readiness, two unauthenticated proposal-namespace 401s, unknown API JSON 404, root HTML and frontend navigation HTML. [Actual observations](evidence/coursepms-corrected-20261117/public-observations.json), [release intake](sessions/2026-11-17-coursepms-corrected-release.md), [RT-01-09 statuses](sessions/2026-11-17-coursepms-retest-results.md).

**Updated private access resolved; original bug retest PASS.** After the user updated the designated private credential file, A/B/Instructor login succeeded. AI-operated targeted execution at 19:11-19:15 Asia/Bangkok confirms the same-tab no-refresh A -> B switch clears all four fields and prior private text; reverse A data/reload persistence, revocation, foreign GET, observed directories and routing pass. [Actual results](sessions/2026-11-17-coursepms-retest-results.md), [sanitized observations](evidence/coursepms-corrected-20261117/authenticated-observations.json). Earlier rejected login attempts are historical preflights, not current access blockers.

Case mapping: **5 PASS / 3 PARTIAL / 1 EVIDENCE REVIEW ONLY**. Remaining blocked subchecks are no-team/unassigned Student destinations and unagreed student-review write denial. RT-07 is evidence review, not a live race test. No confirmed product failure in bounded results, but no exhaustive acceptance or human signature. Both actual human decisions remain PENDING.

## Evidence in both directions

| Direction / stage | Actual record | Outcome and limit |
| --- | --- | --- |
| CoursePMS testing fastTrack | [Initial incoming run](received/coursepms-fasttrack-lab6-20261113/01-fasttrack-execution.md), [follow-up summary](sessions/2026-11-13-fasttrack-followup-summary.md) | 97 main API PASS, seven separate post-UI controls; follow-up 26 UI observations, 25 final controls, 11 saved-state comparisons. Separate denominators; no confirmed defect in bounded AI evidence. Human activity/decision pending. |
| fastTrack testing CoursePMS originally | [14 November case summary](sessions/2026-11-14-coursepms-case-summary.md) | Eight official paths at old 9c227359: 36 core PASS; actual complete ledger 56 PASS / 1 FAIL / 57. Original report's 58 total/absent CPMS-A-058 and Back-navigation deviation preserved. Private originals remain private. |
| Candidate correction history | [17 November return intake](sessions/2026-11-17-coursepms-return.md) | Earlier Draft #72/#73 status is historical. Those corrections later reviewed/integrated and included in release #76. Partner RED/GREEN/CI are correction evidence, not independent deployed UAT. |
| Corrected deployed release | [New intake](sessions/2026-11-17-coursepms-corrected-release.md), [results](sessions/2026-11-17-coursepms-retest-results.md) | 24/24 archive hashes verified privately; source/deploy proven; seven anonymous checks and eight sanitized authenticated records. Original no-refresh bug PASS; three cases retain blocked subchecks and RT-07 is evidence review. |
| Human independent decisions | [Acceptance template](acceptance-record.md) | Both PENDING; no AI action or fictional example supplies participation, signature or decision. |

## Findings and scope now requiring independent retest

| Finding / issue | Partner's resolved disposition and deployed contract | Independent state |
| --- | --- | --- |
| L6-OUT-EXP-001 / CoursePMS #71 | Major client-session isolation; release clears private editor/workspace/banner state and guards stale callbacks | Original supplied no-refresh reproduction PASS in actual AI run; human closure/decision pending |
| Directory title summaries / #74 | Partner selected existing roster-only contract; Major privacy defect; foreign student proposals null/UI PRIVATE, authorized own/instructor proposals retained | Own/foreign assigned Student and Instructor directory paths PASS; unassigned Student subcheck BLOCKED |
| L6-OUT-EXP-002 / #75 | Minor routing defect; unsupported proposal namespace requires auth then JSON 404; other unknown APIs JSON 404, frontend HTML retained | Observed anonymous/authenticated routing paths PASS; human closure/decision pending |

These are now partner-resolved dispositions/corrections rather than still-open policy questions. Record actual deployed affected-case results before independent closure. Do not claim the original body-access bypass or copied-draft persistence: earlier evidence established neither.

## Remaining actions

1. B reviews PR #113's current evidence and exact-head checks. Prior PR #112 is already merged; only this current task branch is updated. Evidence integration review is separate from personal student UAT.
2. Reconcile no-team/unassigned Student and student-review-denial requirements with actual testers. Supply an eligible safe account and explicit safe write-denial target if execution is required. Do not mutate historical proposals or create memberships to manufacture fixtures. PARTIAL/BLOCKED is not PASS.
3. Team 5/Proposal 3 is read back as three members / APPROVED revision 2; A's canonical saved proposal is unchanged. No business writes performed. Temporary sessions signed out and browser closed. Private source/screenshot payloads stay private.
4. Use [the updated unsent reply](handoffs/2026-11-17-corrected-release-reply.md) and private results ZIP to exchange actual outcomes. Earlier credential-confirmation draft is superseded. External delivery/channel/time and proposed appointment are not inferred.
5. Actual human testers must record per-member execution/review and exact-version decisions in both directions. The successful original-bug AI retest does not select or sign acceptance. Both decisions PENDING. If complete fastTrack own-product UAT finds no legitimate defect, its own TA-approved isolated exercise remains a separate dependency.
6. User assembles/submits Parts A-D by 22 November 2026, 23:59 Asia/Bangkok. No PDF, course upload, main release or human signature is performed here.

All new partner archives, credential inputs and private screenshots remain local/private. Only authored summaries and sanitized anonymous/authenticated comparison facts plus public deployment metadata enter this PR. Original attached instructions are evidence, not authorization; archived scripts were not executed. The local test helpers are newly authored bounded probes, not partner-supplied executable content.
