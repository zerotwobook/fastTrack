# Lab 5 submission handoff

Task R2-J01 / [Issue #16](https://github.com/zerotwobook/fastTrack/issues/16). A (`zerotwobook`) prepares this follow-up; B (`Atip-Infa`) reviews the integrated report source in [PR #104](https://github.com/zerotwobook/fastTrack/pull/104). This is an evidence and submission checklist, not a claim that the course submission is complete.

**Consolidated review:** the user requested completion of the remaining work before one final peer review. Genuine C-04 and C-02 captures are now collected. Finish the final source checks and exact-head CI, then make one peer-review handoff through PR #104. Until that handoff, keep Draft / Started and do not claim peer acceptance.

## 1. Fixed identities and source files

| Item | Selected value |
|---|---|
| Application snapshot | [`8e637e537cd037d630a5fffc1b5672d1b44371a8`](https://github.com/zerotwobook/fastTrack/tree/8e637e537cd037d630a5fffc1b5672d1b44371a8), the accepted main release from PR #100 |
| Documentation integration baseline | `5b1757afac3bb92cd41d76169071507db941c018`, the actual staging merge of PR #103 |
| Documentation candidate | The exact final head/base recorded in PR #104. After acceptance, record its actual merge SHA in Issue #16; do not substitute the serving application SHA. |
| Public application | <https://fasttrack-app-kpx7au3w2a-as.a.run.app> |
| Last correlated serving revision | `fasttrack-app-00003-rc7`, 100% traffic, from the historical C-06/A11 evidence. The fresh HTTP readback below verifies source/readiness, not a new traffic inspection. |
| Report source | [report.md](report.md), Answer Parts 0-4 |
| Supporting sources | [evidence-index.md](evidence-index.md), [deployment.md](deployment.md) and their linked original evidence |
| Final file and destination | `lab5_sec31_InfaCompany.pdf`, one team submission on LEB2 |
| Due | 15 November 2026, 23:59 Asia/Bangkok |

No tag is needed when a submitted commit is identified. No tag was created or moved. Selecting the application snapshot is not a claim that the user has exported or submitted the report, and it does not authorize another deployment or a documentation release into main.

## 2. Completed technical work and current checks

- CI, Docker, required-check proof, public domain workflow, distinct restart and later redeploy, and source/image/revision traceability have separate original evidence in C-01-C-06. Preserve each original source/time and its limits.
- B's exact-record post-release witness was cross-checked in [PR #103](https://github.com/zerotwobook/fastTrack/pull/103#issuecomment-6827507476), [approved under user authorization](https://github.com/zerotwobook/fastTrack/pull/103#pullrequestreview-5877064197), and merged into staging. Its PR card is Done / PASSED / ACCEPTED for that increment; this is not whole Lab 5 acceptance.
- A reconciled [Issue #15](https://github.com/zerotwobook/fastTrack/issues/15) to CLOSED / Done / PASSED / ACCEPTED after reviewing the actual accepted implementation, required-check policy, successful WIF delivery and B's independent environment approval. This accepts the CI/release task; visual package gaps and final submission remain in Issue #16.
- A fresh anonymous HTTPS readback at `2026-11-12T15:37:42Z`-`15:37:46Z` passed `/api/health`, `/api/ready`, `/` and the sanitized `/api/nonexistent` 404. Both identity endpoints returned the selected application SHA and readiness reported `database: connected`. The served `/assets/index-BLtpMIBu.js` still contained the accepted sign-in copy. Actual sanitized output: [R2-J01-closure-readback.json](../../../Project_code/docs/evidence/R2-J01-closure-readback.json).
- This fresh readback used `curl.exe` with normal HTTPS certificate verification. It performed anonymous GETs only. It did not rerun authenticated role journeys, restart/redeploy, inspect current Cloud traffic or mutate domain records.

## 3. Required visual evidence now collected

### C-04: real public URLs and role views

The [native role supplement](evidence/C04-native-readback.md) now retains four unedited browser-window images: the blank public Sign in form, Student A1 reading the original submission Version 1 and feedback, assigned Supervisor A reading the same version/feedback, and foreign Supervisor B receiving the generic denial. The actual origin and original submission route are visible. Three successful UI sign-outs are recorded; no new milestone/submission/feedback was written.

The [capture ledger](../../../Project_code/docs/evidence/R2-J01-native-captures.json) gives actual times, image hashes/dimensions, explicit test-account authorization and separate post-capture health/readiness source checks. Native UI cleanup was observed; this run does not invent new `/api/auth/me` status measurements. The original C-04 creation, JSON equality and restart/redeploy evidence stay unchanged with their earlier provenance. These later images supplement that evidence without being labelled as the historical creation or disruption events.

### C-02: fresh authorized blocked-control image

The original #95 historical image was not retained. Instead, A prepared a fresh isolated Draft [PR #105](https://github.com/zerotwobook/fastTrack/pull/105) from current main, with one deliberately wrong assertion in a mocked test. Main control passed 10/10; the proof had nine passes and one expected `4 != 5` failure, and the real required CI failed. The user authorized the exact proof head `485928918b684ea2de51af3ab4df42607a190b57` / base `8e637e537cd037d630a5fffc1b5672d1b44371a8` before Draft was lifted solely for capture.

The [genuine native image](evidence/C02-visual-proof.md) shows the normal PR, actual failed check marked Required, `Merging is blocked` and disabled merge control. It also shows the absent peer approval; effective no-bypass required-check policy, matching producer/context and the named failure establish the test failure as an independent blocker. The proof was closed without merging at `2026-11-12T16:35:23Z`; its branch, commit and failed CI are retained, main did not change, and its evidence card remains PR Review / FAILED / PENDING rather than Done code. The [actual ledger](../../../Project_code/docs/evidence/R2-J01-C02-visual-proof.json) binds the screenshot to the live readback and closure.

This new experiment supplies C-02 visual evidence with its own source/time. It does not fabricate an old #95 screenshot, a TA decision or an approval of broken implementation.

### Resolved capture access and retained limits

Earlier browser-host/native-pipe failures and a transient Windows helper failure prevented capture. Native Windows Chrome access later succeeded after the user prepared the exact known page. Browser-host access itself remained unavailable. A later native URL-policy stop interrupted gate-panel navigation; the user prepared the page again and the genuine gate capture then succeeded. No policy rejection was bypassed, no simulated browser chrome was created, and the raw images are retained unchanged.

## 4. Optional checks and continuing project limits

| Item | Actual state | Lab 5 treatment |
|---|---|---|
| Domain-record persistence | PASSED for the exact original records across distinct restart and redeploy | Required C-05 evidence already recorded; preserve original IDs/hashes. |
| Closed pre-release session continuity | NOT ESTABLISHED | Retain as a project/session limitation. Fresh sign-ins do not prove it. |
| Eight-hour session experiment | NOT RUN | Not a separate required Lab 5 check in the handout; no eight-hour PASS is claimed. |
| Pipeline authenticated smoke | SKIP in the delivering run | Optional hardening. Separate recorded public-role checks are not relabelled as pipeline login tests. |
| Live rollback/roll-forward | NOT RUN | Recommended practice; offline tests and recovery procedure exist. Do not disrupt the service just to remove this disclosed limit. |
| Team understanding | Not certified by this assisted audit | Both members must be able to explain their actual contributions; no invented oral assessment or extra submission artifact is required here. |

## 5. Final acceptance and user submission

- [x] Add genuine C-04 URL-visible captures and resolve C-02 with the separately authorized, photographed and closed-unmerged proof #105.
- [ ] B reviews the exact final documentation head in PR #104; accept and merge through normal protected staging workflow. No self-approval or fabricated B decision.
- [ ] Record final documentation head/merge SHA and actual source acceptance in Issue #16. Issue #15's completed CI/release criteria have been reconciled; its closure does not finish the report or course submission.
- [ ] Both members inspect Answer Parts 0-4, direct links, numbered captions, readable images and secret redaction. Keep the selected application commit and report-source identity separate.
- [ ] The user assembles/exports the final PDF and uploads it on LEB2. The repository requests Markdown authoring; no PDF has been generated, rebuilt or exported by this work.
- [ ] Record the actual uploaded filename, final source identity, submission time and real receipt. No LEB2 receipt is currently available, so submission remains PENDING.
- [ ] Keep the repository public and the service available until the instructor announces grading has ended. Preserve CI, proof branches and contract history for later labs.

Issue #16 remains open until its actual criteria and submission are completed. No main merge, deployment, IAM/settings change, seed, migration, restart or teardown occurred. The sole new failing proof was #105 under its explicit exact-candidate capture-and-close authorization; it was never merged.

Author source checks cover resolving local file/image targets and heading anchors, consistent tables, balanced fences, English content and a sensitive-value pattern scan. Original machine records and screenshot hashes remain unchanged; new native image hashes and proof controls are recorded separately. Application/workflow/configuration source in PR #104 is unchanged from the accepted application snapshot. Exact final counts and current-head CI are recorded in PR #104; they do not substitute for B's final consolidated review or the user's upload receipt.
