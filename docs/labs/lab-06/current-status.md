# Lab 6 current evidence and next actions

Updated 17 November 2026 after remaining CoursePMS checks. R2-A04 / [Issue #22](https://github.com/zerotwobook/fastTrack/issues/22), owner A, reviewer B. Accepted evidence PR #113 merged as 01f61a9. Current increment is [PR #114](https://github.com/zerotwobook/fastTrack/pull/114), staging-only. Whole Lab 6 remains OPEN/PENDING for documentation review, TA disposition and final submission. Product decisions and shared participation have now been confirmed as recorded below.

## Outgoing CoursePMS technical retest is complete within the requested plan

Corrected source aeb804ea5bc667399b00cf54df10046a6ded46e0 is deployed through CoursePMS release #76 / deploy 44074859743. Dated serving identity: course-pms-00009-mk2, 100% traffic; immutable digest sha256:e5cb29a0cf687cdda01110434528d627cd09057d94e9ab028510e5ad090a89e0. This is dated workflow CLI evidence, not a new owner-console screenshot. Fresh source checks match at both additional live sessions' start/end.

The [19:11-19:15 targeted run](sessions/2026-11-17-coursepms-retest-results.md) passed the original no-refresh isolation reproduction and other supplied role/routing paths. The user then supplied a private no-team account. [Actual 21:30-21:33 completion](sessions/2026-11-17-coursepms-remaining-checks.md) passed A -> logout -> unassigned Student -> logout -> A without refresh, roster-only privacy, and safely bounded Student-review denial on ID 0 with invalid input. Instructor directory before/after is identical. Historical Proposal 3 was never a review-request target.

**Current RT-01-09 mapping: eight deployed targeted case PASS; RT-07 PASS by exact-source evidence review plus independent isolated automated replay.** RT-07's specified mode does not require racing historical live writes. Local replay: 16 client PASS and 19 selected/mocked server PASS; counts are separate from live cases and partner CI. Initial Node 26 client runner failures are retained as compatibility diagnostics; unchanged client suite passed on checksum-verified Node 20. No live race injection, full partner backend rerun or exhaustive acceptance is claimed.

Seven earlier anonymous observations, eight earlier authenticated records and fourteen additional sanitized records remain separate sets. No new confirmed product failure was found in the bounded checks. Former no-team/unassigned and safe-denial technical blockers are resolved; CoursePMS is now ACCEPTED by the user; CoursePMS acceptance of fastTrack is reported by the user. [Confirmation provenance](sessions/2026-11-17-user-acceptance-confirmation.md).

## Evidence in both directions

| Direction | Actual evidence | Remaining limit |
| --- | --- | --- |
| CoursePMS testing fastTrack | 97 main API PASS / separate seven post-UI controls; follow-up 26 UI observations, 25 final controls, 11 saved-state comparisons | Bounded AI evidence, separate counts; no confirmed defect. Existing independent evidence reused; CoursePMS acceptance reported by the user, original external metadata not attached |
| fastTrack testing CoursePMS originally | Eight official paths; 36 core PASS; actual full ledger 56 PASS / 1 FAIL / 57 | Preserve original arithmetic discrepancy and Back-navigation deviation |
| Corrected CoursePMS targeted completion | [Latest case map](sessions/2026-11-17-coursepms-remaining-checks.md), [additional records](evidence/coursepms-remaining-20261117/additional-authenticated-observations.json), [local replay](evidence/coursepms-remaining-20261117/local-replay-summary.json) | Eight deployed PASS plus RT-07 evidence/local PASS; accepted by the user using this bounded evidence |
| Product decisions and participation | [Decision records](acceptance-record.md), [shared responsibility/AI attribution](contributions-and-ai.md) | CoursePMS directly accepted by user; reciprocal fastTrack acceptance reported by user. Shared A/B checking confirmed; historical individual case times/signatures not inferred |

## Findings and preservation

| Finding | Current independent technical outcome |
| --- | --- |
| CoursePMS #71 / L6-OUT-EXP-001 Major client-session isolation | Original same-document A -> B PASS; no-team/reverse/instructor paths and local race/unsaved-input replay complete |
| CoursePMS #74 Major roster privacy | Assigned/own, foreign, unassigned Student and Instructor directory paths PASS |
| CoursePMS #75 Minor protected JSON routing | Recorded anonymous/authenticated JSON and frontend HTML paths PASS |

No API body bypass or copied saved draft was established by the original finding. Team 5 retains three members and Proposal 3 APPROVED revision 2. A's saved proposal and complete Instructor-authorized directory comparison are unchanged. One safe rejected review-endpoint POST, zero successful business writes, no reset/seed/delete/membership edit. Sessions revoked, local token/baselines cleared and isolated browser closed; temporary new-account input removed. Full source, credentials and screenshots remain private.

## Remaining owners and actions

1. Reuse existing fastTrack API/UI evidence and completed CoursePMS targeted results. Both product decisions are recorded with [their actual confirmation provenance](sessions/2026-11-17-user-acceptance-confirmation.md); no duplicate full execution or renewed decision request is a default prerequisite.
2. A owns plan/normal/state evidence and TA coordination; B owns rule/access/privacy/correction/retest evidence and report review. The user confirms joint checking. See [the current allocation](contributions-and-ai.md); it does not assign historical individual case executors/times.
3. The user plans to ask the TA how to handle the own-fastTrack defect requirement with no confirmed legitimate finding. Use [the ready question](handoffs/2026-11-17-remaining-lab6-inputs.md). Await the actual answer; do not assume approval or create an artificial live defect. Any required isolated exercise follows the approved scope.
4. B reviews PR #114. Whole Issue #22 stays OPEN/PENDING until remaining criteria are met; no acceptance of the PR or main release follows automatically from product UAT acceptance.
5. Complete final report after the TA disposition: [Parts A-D outline](report-draft.md), [evidence index](evidence-index.md), private identified Markdown kit, actual final export/page references and LEB2 receipt. Deadline 22 November 2026, 23:59 Asia/Bangkok. No PDF/main release/course upload is performed here.
