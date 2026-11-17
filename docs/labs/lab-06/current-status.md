# Lab 6 current evidence and next actions

Updated 17 November 2026 after remaining CoursePMS checks. R2-A04 / [Issue #22](https://github.com/zerotwobook/fastTrack/issues/22), owner A, reviewer B. Accepted evidence PR #113 merged as 01f61a9. Current increment is [PR #114](https://github.com/zerotwobook/fastTrack/pull/114), staging-only. Whole Lab 6 remains OPEN/PENDING for documentation review, TA disposition and final submission. Product decisions and shared participation have now been confirmed as recorded below.

## Latest TA requirement: independent human fastTrack UI record

The TA has now asked for the partner to complete the web-UI test cases and record actual people, results and version. [Feedback and scope](sessions/2026-11-17-ta-human-ui-feedback.md). The13November API/selected-UI and later AI UI follow-up are preserved; they do not establish named-human completion. User-declared product acceptance remains recorded separately. Human session results are not yet supplied.

Use [the complete human UI handoff](handoffs/2026-11-17-fasttrack-human-ui-run.md) and [actual-result template](templates/fasttrack-human-ui-execution.md). Health/readiness freshly match8e637e5; current revision/traffic still needs an owner readback because the read-only CLI had no usable active account. The same roster is planned, not retrospectively marked present. No new human case PASS, booked slot or external message is claimed.

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

1. Actual CoursePMS testers complete the human web-UI cases and return real names/roles/time/version/actual outcomes/evidence using the linked record. Product owners prepare private access/current revision and safe fixtures. Existing AI evidence may support, but does not fill personal execution rows.
2. A/B keep the user-confirmed outgoing CoursePMS decision and shared responsibility record. Planned allocations/historical AI timestamps do not establish a human fastTrack session.
3. After the required human UI record is complete, send the new result to the TA. If no legitimate defect is found, await the specific section3.5 scenario/scope the TA will coordinate. No exercise is supplied/approved by the present message.
4. B reviews the current PR114 documentation candidate; an earlier-head account approval does not approve subsequent heads. WholeIssue22 remainsOPEN/PENDING for human UI evidence, TA disposition, real peer integration and final submission.
5. Assemble actual new results into PartsA-D and submit by22November2026,23:59Asia/Bangkok. Historical reports/declared decisions retain their dates and provenance; no PDF/main release/course upload is performed here.
