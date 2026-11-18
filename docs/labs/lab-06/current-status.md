# Lab 6 current evidence and next actions

Updated 18 November 2026 after returned CoursePMS fastTrack results and authenticated Cloud Run readback. R2-A04 / [Issue #22](https://github.com/zerotwobook/fastTrack/issues/22), owner A, reviewer B. Accepted evidence PR #113 merged as 01f61a9. Current increment is [PR #114](https://github.com/zerotwobook/fastTrack/pull/114), staging-only. Whole Lab 6 remains OPEN/PENDING for documentation review, TA disposition and final submission. Product decisions and shared participation have now been confirmed as recorded below.

## Latest incoming fastTrack evidence

The user supplied the CoursePMS return for run L6-CPMS-AI-20261118-144203 on source `8e637e5`. It records eight case PASS, 18 active PASS observations, one invalidated automation record, 28 screenshots and 9 JSON ledgers. The user confirms Tatchakorn Thamnimitr owns UAT-01-04 and Pawarit Wongdang owns UAT-05-08, with AI assistance in execution/evidence collection. The archive attributes browser operation to Codex and records human review pending at creation. [Complete returned results](sessions/2026-11-18-coursepms-fasttrack-returned-results.md).

Authenticated owner-side readback at 18 November 2026, 15:19:49 UTC+07:00 confirms fasttrack-app-00003-rc7 at 100% traffic, all ready conditions True and matching image digest/source. Its actual observation is later than the returned UAT session. [Current Cloud Run evidence](sessions/2026-11-18-fasttrack-cloud-run-readback.md).

The [TA review page](ta-review-status.md) presents these results and confirmed responsibilities for assessment against the earlier requested participation coverage. Actual individual human action/review times and a new explicit final decision for this run have no additional details in the user's confirmation. Original operator/time and earlier reported product decisions retain their provenance.

## Outgoing CoursePMS technical retest is complete within the requested plan

Corrected source aeb804ea5bc667399b00cf54df10046a6ded46e0 is deployed through CoursePMS release #76 / deploy 44074859743. Dated serving identity: course-pms-00009-mk2, 100% traffic; immutable digest sha256:e5cb29a0cf687cdda01110434528d627cd09057d94e9ab028510e5ad090a89e0. This is dated workflow CLI evidence, not a new owner-console screenshot. Fresh source checks match at both additional live sessions' start/end.

The [19:11-19:15 targeted run](sessions/2026-11-17-coursepms-retest-results.md) passed the original no-refresh isolation reproduction and other supplied role/routing paths. The user then supplied a private no-team account. [Actual 21:30-21:33 completion](sessions/2026-11-17-coursepms-remaining-checks.md) passed A -> logout -> unassigned Student -> logout -> A without refresh, roster-only privacy, and safely bounded Student-review denial on ID 0 with invalid input. Instructor directory before/after is identical. Historical Proposal 3 was never a review-request target.

**Current RT-01-09 mapping: eight deployed targeted case PASS; RT-07 PASS by exact-source evidence review plus independent isolated automated replay.** RT-07's specified mode does not require racing historical live writes. Local replay: 16 client PASS and 19 selected/mocked server PASS; counts are separate from live cases and partner CI. Initial Node 26 client runner failures are retained as compatibility diagnostics; unchanged client suite passed on checksum-verified Node 20. No live race injection, full partner backend rerun or exhaustive acceptance is claimed.

Seven earlier anonymous observations, eight earlier authenticated records and fourteen additional sanitized records remain separate sets. No new confirmed product failure was found in the bounded checks. Former no-team/unassigned and safe-denial technical blockers are resolved; CoursePMS is now ACCEPTED by the user; CoursePMS acceptance of fastTrack is reported by the user. [Confirmation provenance](sessions/2026-11-17-user-acceptance-confirmation.md).

## Evidence in both directions

| Direction | Actual evidence | Remaining limit |
| --- | --- | --- |
| CoursePMS testing fastTrack | New 18 November return: eight case PASS, 18 active PASS observations, one invalidated automation record, 28 PNG and 9 JSON; prior 97 API / 26 UI / 25 controls / 11 comparisons remain separate | User confirms named reviewer ownership and AI assistance; original Codex operation and pending review fields preserved. TA participation assessment open |
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

1. A/B provide the [TA review link](ta-review-status.md) with the returned results, user-confirmed responsibilities and authenticated deployment readback. The user sends the external message.
2. TA assesses participation/coverage and identifies any additional evidence. Individual human actions and decisions are recorded only when actually supplied or performed.
3. If the coverage is sufficient and no legitimate defect is found, obtain the TA's specific section 3.5 scenario/version/scope and perform the resulting approved work.
4. B reviews the current PR #114 candidate. Whole Issue #22 remains OPEN/PENDING for TA disposition, real peer integration and final submission.
5. Assemble actual new results into Parts A-D and submit by 22 November 2026, 23:59 Asia/Bangkok. Historical records keep their original dates and provenance.
