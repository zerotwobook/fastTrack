# fastTrack Lab 7 Revision Guide

CPE334 · InfaCompany (EN-028) · Section 31 · Semester 1/2026

Use this guide alongside the current 18-page Lab 7 report. Page numbers below refer to the current report. Add the suggested excerpts in the relevant sections or in an evidence appendix in the same submission PDF.

## Page 3 · Version record

Replace the combined GREEN and staging row with the following three entries:

- Initial GREEN implementation: 2368d71, CI run 44675948834.
- Peer-reviewed PR head: 5315c9e, PR #128 approval, exact-head CI run 44679245716.
- Staging integration: 7357fd2, PR #128 merged into staging/sprint-2 on 20 November 2026 at 05:18:43 UTC.

Retain the accepted Sprint 1 behavior reference 8e637e5, actual pre-change implementation 63e81d1, release candidate 1185f3f, and main release f3ff8d9 (v1.0.0-sprint-2, Cloud Run fasttrack-app-00004-jr2).

Sources: <https://github.com/zerotwobook/fastTrack/pull/128> · <https://github.com/zerotwobook/fastTrack/actions/runs/44675948834> · <https://github.com/zerotwobook/fastTrack/actions/runs/44679245716>

## Pages 4–5 · Part A: Approval, contract, and pre-implementation review

Page 4, under the approval image, use this caption:

> L7-A01. TA approval for CR-L7-01. The screenshot shows the TA’s approval and a 10:48 AM timestamp. The project owner confirmed the approver as TA Tik and the approval date as 20 November 2026, Asia/Bangkok. The TA requested tests at 5,999, 6,000, and 6,001 Unicode code points, including emoji and whitespace. The screenshot itself provides the time of day.

Page 5, add L7-A02a, Selected specification excerpts. Embed the relevant lines from the Sprint 1 and revised Lab 7 contracts. Use these summaries to introduce the excerpts:

- SRS §5.1 FR-05 and §5.2 BR-08. The Sprint 1 baseline allows the assigned supervisor to add feedback and authorized team members to read it. The accepted length changes from 1–4,000 to 1–6,000 Unicode code points after trimming leading and trailing whitespace. Access rules remain in effect.
- F-04 Feature SDS and integration contract. The feedback form uses the shared 6,000-point limit for its hint, live counter, and validation. The supervisor’s valid new entry returns HTTP 201. An entry of 6,001 points returns HTTP 400 with a content error and creates zero rows. Saved feedback stays attached to its exact submission version.
- System-Level SDS §7.3 and persistence contract. The forward migration widens feedback.content and its named bounds check to 6,000. Existing rows, IDs, timestamps, exact submission links, uniqueness, and indexes are preserved.

Label the existing AC/STS table “Contract and STS revision 2, commit b46b7de.”

Add L7-A02b, Pre-implementation peer review, below the timeline. Embed the dated Issue #25 entry at 2026-11-20T04:17:00Z. It records B’s review of CR-L7-01, RED e3758fb, and handoff 7d8f990. The implementation commit 2368d71 followed at 04:40:02 UTC. Use the original Issue entry as the excerpt.

Sources: <https://github.com/zerotwobook/fastTrack/issues/24> · <https://github.com/zerotwobook/fastTrack/issues/25> · <https://github.com/zerotwobook/fastTrack/blob/f3ff8d9704c6e2a3705805412f538b2b216569ad/Project_code/docs/contracts/sprint-1-feedback.md> · <https://github.com/zerotwobook/fastTrack/blob/f3ff8d9704c6e2a3705805412f538b2b216569ad/Project_code/docs/contracts/lab-7-feedback-limit.md>

## Pages 6–8 · Part B: Actual test output, code diff, and reviews

Under L7-B01/L7-B02, add “Same boundary cases on RED and GREEN.” Test file: Project_code/server/src/testing/feedback-review.b02.ts. The fixture used disposable PostgreSQL, a saved student submission, the assigned supervisor’s session, and student readback.

- RED on 20 November 2026, 04:07:29–04:08:47 UTC. CI 44672187909 tested source e3758fb with the old implementation from 63e81d1. CI ran npm run test:runtime:isolated. The separate local RED command was npm run test:b02:isolated. The feedback suite recorded 51 passed, 8 failed, 0 skipped.
- GREEN on 20 November 2026, 04:40:35–04:41:32 UTC. CI 44675948834 tested implementation 2368d71 using npm run test:runtime:isolated. The feedback suite recorded 61 passed, 0 failed, 0 skipped. The full run recorded 458 passed and 7/7 legacy upgrade scenarios.
- Embed the matching case rows from each ci-runtime-report.json. For “L7-STS-01/02 checks 6000 code points of plain text,” RED reported “Feedback content cannot exceed 4000 characters” and “expected 400 to be 201.” GREEN records the same test name with status passed.
- The 6,001 rejection controls passed in both runs. The 6,000 escaped-emoji and direct-database-write cases changed from failed to passed.

Direct artifact sources: RED <https://github.com/zerotwobook/fastTrack/actions/runs/44672187909/artifacts/14599933325> · GREEN <https://github.com/zerotwobook/fastTrack/actions/runs/44675948834/artifacts/14601389351>

Below the existing Selected diff table, embed the actual removed and added lines from implementation commit 2368d71. Use monospace and label each excerpt with its source file:

- shared/feedback.mjs: CONTENT_MAX_CHARS changes from 4000 to 6000.
- client/src/features/feedback/FeedbackPanel.tsx: The hint and counter read FEEDBACK_LIMITS.CONTENT_MAX_CHARS.
- server/src/modules/feedback/router.ts: The feedback POST uses express.json({ limit: '96kb', strict: true }) after the existing guards. Other routes keep the shared 64 KiB parser limit.
- server/prisma/schema.prisma and migration 20261120042000_lab7_feedback_content_6000: VarChar(4000) changes to VarChar(6000). The named SQL check becomes BETWEEN 1 AND 6000.

Code diff: <https://github.com/zerotwobook/fastTrack/commit/2368d71813541bacc0bc9b9ecba58b3ae9ea7c86>

Under L7-B04, embed the original @Atip-Infa review on PR #128 at 20 November 2026, 05:17:13 UTC. Include the lines identifying final head 5315c9e, the d2b6c16 transport-boundary padding checks, and exact-head CI 44679245716. A reviewed the implementation and strengthened the test at d2b6c16. B recorded the GitHub approval at the final head.

Review: <https://github.com/zerotwobook/fastTrack/pull/128#pullrequestreview-5987874713> · A’s test amendment: <https://github.com/zerotwobook/fastTrack/commit/d2b6c16a9d25d8c44724d323eabbc2b63a4be36c>

Under L7-B05, embed a short excerpt of A’s release approval for PR #129 and the relevant rows from output/documents/lab7/evidence/production-results.json. Use this caption:

> Production verification extract. On 20 November 2026 at 18:16:57 Asia/Bangkok, Cloud Run revision fasttrack-app-00004-jr2 served main commit f3ff8d9. The 5,999- and 6,000-point browser saves returned HTTP 201. At 6,001, the browser blocked the POST and a separate API request returned HTTP 400 INVALID_INPUT. The saved count stayed at two. The student saw two entries on v1 and zero on v2. A foreign supervisor’s read of the preserved C04 feedback returned HTTP 404.

Release approval: <https://github.com/zerotwobook/fastTrack/pull/129#pullrequestreview-5991212056> · Deployment record: <https://github.com/zerotwobook/fastTrack/issues/26>

The six production screenshots on current pages 9–14 already support L7-B05.

## Pages 15–16 · Part C: Embedded sources for two metrics

Add these records next to the existing metric table and ledgers:

> L7-M03 — Baseline test result. CI run 44663918612 executed npm run test:runtime:isolated at pre-change staging commit 63e81d1 on 20 November 2026. The test:b02 artifact records 48 passed, 0 failed, and 0 skipped. This is the pre-change baseline. Embed the short B02 log line or the artifact summary.

> L7-M04 — UAT defect record. CoursePMS reported PASS for UAT-01 through UAT-08 and accepted the Sprint 1 scope on 19 November 2026. The verified deployment source was 8e637e5. Product UAT recorded zero confirmed defects opened, resolved, or outstanding. The separate Section 3.5 simulated deadline defect was resolved through PR #115, with 16 of 16 comparison checks passing on independent retest. Embed the compact eight-case result list and the simulated defect disposition.

Baseline artifact: <https://github.com/zerotwobook/fastTrack/actions/runs/44663918612/artifacts/14597351056> · Lab 6 closeout: <https://github.com/zerotwobook/fastTrack/blob/f3ff8d9704c6e2a3705805412f538b2b216569ad/docs/labs/lab-06/sessions/2026-11-19-lab6-closeout.md>

Keep the existing L7-M01, L7-M02, and L7-M05 ledgers. The current interpretation is 74 words. In the action sentence, use “Before Final Delivery” in place of “Before the Sprint 2 readiness review,” since G6 acceptance is already recorded. Keep B as action owner.

## Pages 17–18 · Part D: Defect status, contribution, and limitations

Update the defects row on page 17 with the following two entries:

- Maintained Sprint 1 feedback scope. No open Critical, Major, or Minor defects reported in the assessed scope. Evidence: CoursePMS UAT 8/8 PASS and production L7-STS-05 PASS.
- Lab 6 Section 3.5 simulated deadline defect. Proposed Major. Resolved and independently retested. Evidence: PR #115 and CoursePMS retest 16/16 PASS.

Severity source: <https://github.com/zerotwobook/fastTrack/blob/f3ff8d9704c6e2a3705805412f538b2b216569ad/docs/labs/lab-06/simulation-3.5/execution-report.md>

On page 18, put the member contributions in a compact table or two adjacent entries, then retain the existing AI-use declaration:

- A — Supapanya Yathip. Recorded TA approval, revised the contract and STS, captured RED, reviewed the implementation, and strengthened the transport-boundary test.
- B — Atip Infa-udom. Reviewed the contract and RED evidence, implemented the change and migration, verified GREEN and legacy upgrades, and recorded the final PR review.

Add “Known limitations” after the AI-use declaration:

The automated deployment smoke skipped its optional login. Separate authenticated Playwright and API checks covered the selected synthetic supervisor and student journeys under L7-STS-05. The readiness decision applies to the maintained Sprint 1 feedback scope and the preserved paths recorded in Part B.

## Final assembly

- Update the contents on page 2 with final page ranges and references for L7-A02a, L7-A02b, RED/GREEN, the code diff, and PR reviews.
- Check the final PDF at readable zoom. A TA should be able to find the source version, command, case name, observed outcome, time, and reviewer inside the report. Keep GitHub links for corroboration.
- Submit one separate Lab 7 PDF to LEB2 by 29 November 2026 at 23:59 Asia/Bangkok. Hand off safe test-account access privately through the course channel. Keep the assessed release and repository available for grading.
