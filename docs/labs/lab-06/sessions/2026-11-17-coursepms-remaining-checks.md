# CoursePMS remaining targeted checks: actual completion

R2-A04 / Issue #22 / PR #114. Operator: Codex AI for fastTrack. This is actual AI-operated testing and evidence review, not either student's attendance or acceptance. Source throughout: `aeb804ea5bc667399b00cf54df10046a6ded46e0`; deployed URL https://course-pms-859617270560.asia-southeast1.run.app. No new release occurred.

This addendum supersedes the *current* blocked mapping in the earlier [19:11-19:15 session](2026-11-17-coursepms-retest-results.md), which remains an unchanged dated record. [Fourteen additional sanitized records](../evidence/coursepms-remaining-20261117/additional-authenticated-observations.json) retain times and bounded comparisons; they are not fourteen case assertions. The prior seven anonymous and eight authenticated records retain separate denominators.

## Additional no-team destination on the deployed release

The user supplied an additional private account. Actual login at 21:30:13 Asia/Bangkok confirmed Student with zero teams; public records call it R and omit its email/password. Fresh A baseline at 21:30:06 matched all four canonical draft fields. A -> logout -> R -> logout -> A occurred in the same document without refresh; the in-memory A baseline survived. At 21:30:43, R had no proposal editor, correct no-team guidance, an empty create-team field, four roster rows with PRIVATE, and all four API proposal values null. None of A's four private field strings appeared in R's visible body. No team was created and no membership was changed.

At 21:31:23, returning to A restored all four original fields and the exact saved proposal. Instructor readback at 21:31:42 retained authorized proposals and Team 5 / three members / Proposal 3 / APPROVED revision 2; directory JSON was identical across read-only filtering/selection. Final logout at 21:31:46 rejected the temporary-token replay with 401 TOKEN_REVOKED. Browser closed; temporary new-account input removed. Three private screenshots show A-before, R-no-team and A-restored; a fourth shows preserved instructor state. The no-team screenshot was visually inspected. These images are private, not part of this public increment.

## Safely bounded deployed Student-review denial

The earlier plan left this blocked without a safe target. The continuing user request authorized finishing partner checks. Exact-source inspection and two independent mocked tests established that the Student-role guard returns before proposal lookup, transaction or update. The selected non-record target was `/api/proposals/0/review`; an Instructor-authorized directory read at 21:33:09 showed no proposal with ID 0. Payload: `{"decision":"NOT_A_DECISION","reviewFeedback":""}`. It cannot be a valid review even if role checking unexpectedly regresses. No request targeted historical Proposal 3. This is the actual AI-selected safe procedure under user authorization; no external CoursePMS agreement or notification is claimed.

Student A's single request at 21:33:22 returned HTTP **403 / BR06_INSTRUCTOR_ROLE_REQUIRED**, with only error/code and no proposal. Instructor readback at 21:33:48 was byte-for-byte identical to the complete authorized directory baseline, including Team 5 / Proposal 3 APPROVED revision 2. This proves the recorded role-denial path, not successful instructor review or a full database audit. There was one rejected review-endpoint POST; zero successful business writes, saves, submissions, memberships, resets, seeds or deletes. Final logout at 21:33:52 revoked the temporary token; browser storage/baselines cleared and isolated browser closed. No token or raw login response was exported.

## Independent isolated automated replay for RT-07

[Machine-readable local summary](../evidence/coursepms-remaining-20261117/local-replay-summary.json). Official source was downloaded pinned to the deployed commit; archive SHA256 a90c2cf7985b93dd73734334c5296cd9e9c27f734e20a2344c81bbbc0e1cb9d6. All 30 extracted original files byte-match the archive. Dependency installs used disabled scripts and isolated config/cache. Production environment/credentials were not inherited; no real database, migration, seed or live business endpoint was used by these local tests. Original application/tests remain unchanged; a separate private two-test mocked guard file was added.

| Execution | Actual result | Scope and limit |
| --- | --- | --- |
| Client, Node v20.20.2, 21:24:11-21:24:27 | 4 files / 16 PASS / 0 FAIL / 0 skipped | Supplied exact-source UI/session/privacy tests; races, stale dashboard/mutation/login callbacks, pending-state isolation, same-session unsaved typing and remount hydration |
| Server, Node v26.13.0, 21:22:14-21:22:17 | 3 files / 19 PASS / 0 FAIL / 0 skipped | Nine supplied domain, eight supplied mocked routing/privacy and two new independent mocked role-guard tests; not the full partner 41-test backend suite |
| Earlier client runner, Node v26.13.0 | Two attempts, each 9 PASS / 7 FAIL | Global localStorage undefined before seven tests. Original logs retained. Unchanged suite passes using checksum-verified official Node 20 matching CI's major; not seven confirmed product bugs |

Node 20 ZIP SHA256 dc3700fdd57a63eedb8fd7e3c7baaa32e6a740a1b904167ff4204bc68ed8bf77, verified against the official manifest recorded in the summary. These are independent local test executions, distinct from the partner's CI. No production build/Docker/E2E rerun or live race injection is claimed. RT-07 specifically calls for exact-head evidence inspection with optional isolated local replay; both are now performed, without racing historical live writes.

## Current RT case mapping

| Case | Current bounded result | Evidence |
| --- | --- | --- |
| RT-01 | PASS: original same-document A -> B clears four fields/private text | Earlier AUTH-01-03 |
| RT-02 | PASS: reverse/own-proposal restores original saved data; R -> A also unchanged | Earlier AUTH-04-05; ADD-04-05 |
| RT-03 | PASS: no-team Student and Instructor destinations expose no stale student editor/private draft | ADD-01-03; earlier AUTH-06-07 |
| RT-04 | PASS: saved-draft relogin/reload persistence without saving | Earlier AUTH-05 |
| RT-05 | PASS: recorded logout replays rejected and browser sessions cleaned | Earlier AUTH-02/08; ADD-02/08; GUARD-04 |
| RT-06 | PASS: foreign private GET denied; bounded Student review denied with unchanged authorized state | Earlier AUTH-03; GUARD-01-03 |
| RT-07 | PASS, EVIDENCE REVIEW + ISOLATED AUTOMATED REPLAY | 16 client and 19 server local PASS, separate counts; no live race claim |
| RT-08 | PASS: assigned/own, foreign, unassigned and Instructor directory paths | Earlier AUTH-01/03/07; ADD-03/07 |
| RT-09 | PASS: recorded anonymous/authenticated JSON routing and frontend HTML | Earlier PUB-03-07/AUTH-03 |

**Eight deployed targeted case PASS and one evidence-review/local-replay PASS.** All nine requested targeted cases now have their specified evidence mode; do not call these nine live browser passes or exhaustive product acceptance. No confirmed product failure in these bounded observations. Historical first-run PARTIAL and runner-failure logs remain unchanged and superseded only for current status.

## Handoff and remaining assessment gates

The safe technical prerequisites previously blocking the outgoing targeted retest are resolved. Send the private combined completion package using the [updated draft](../handoffs/2026-11-17-remaining-lab6-inputs.md). No external message has been sent. Actual students must review the evidence/procedure, record their real personal actions and make the exact-version CoursePMS decision. CoursePMS must return its actual fastTrack decision and member evidence. Both human decisions remain PENDING.

Complete fastTrack's own-product defect workflow if a legitimate finding arises; if complete UAT finds none, the applicable TA-approved isolated exercise remains a separate dependency. The opposite product's defect chain does not replace it. Final report export/page ranges/course receipt remain the user's work. No PDF, course submission, TA approval, main release or human signature is claimed.
