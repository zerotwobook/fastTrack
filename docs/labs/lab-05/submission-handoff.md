# Lab 5 submission handoff

Task R2-J01 / [Issue #16](https://github.com/zerotwobook/fastTrack/issues/16). A (`zerotwobook`) prepares this follow-up; B (`Atip-Infa`) reviews the integrated report source in [PR #104](https://github.com/zerotwobook/fastTrack/pull/104). This is an evidence and submission checklist, not a claim that the course submission is complete.

**Consolidated review hold:** the user requested completion of the remaining work before one final peer review. PR #104 stays Draft / Started with no reviewer request while the genuine captures and their resolution are outstanding. Local author checks are preparation, not peer acceptance. Continue this same branch/PR after capture access is restored.

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

## 3. Required evidence still missing

### C-04: genuine screenshots with the public URL visible

Handout section 8 specifies screenshots with the URL visible. Existing page-viewport images have no browser address bar. Their written captions and API records are useful evidence but do not supply the missing browser-window capture.

When native browser capture is available, A or B should:

1. Open the canonical public origin in the intended browser and verify `/api/health` and `/api/ready` still identify the selected release. Use the existing private role accounts through the approved private access route; do not paste credentials into chat or public artifacts.
2. Read the existing milestone and original submission as the assigned Supervisor A and Student A1. The saved submission route is `/submissions/baa3eb8d-e37f-44c2-93fc-dc9f8e5463fd`; the expected version is 1 with the original feedback. Capture the actual browser window with the full origin/route and relevant role/content visible.
3. Read that same submission route as foreign Supervisor B. Capture the actual public URL and generic `Submission unavailable` state, without Team A data. Preserve the earlier recorded authenticated `404 NOT_FOUND`; a new screenshot alone does not establish a new API status.
4. Record the capture time, role, current source, route, actual action/result and image hash. Caption these as later readbacks. They must not be described as the historical creation, restart or redeploy event. If the final reviewer needs new creation-flow screenshots, agree a separate bounded synthetic-write run before creating new records; preserve the original C-04 ledger.
5. Sign out each temporary session and verify the cleanup result. Check the images for credentials or unrelated tabs before committing them.

Do not draw an address bar, add an overlay that implies browser provenance, or alter the application solely to place a URL in evidence.

### C-02: historical blocked merge control

[PR #95](https://github.com/zerotwobook/fastTrack/pull/95) is closed without merging. Its failed run, effective required-check policy and contemporaneous assisted witness remain linked in [C02-gate-witness.md](evidence/C02-gate-witness.md). No genuine historical image was found in the tracked package or the accessible evidence locations checked in this session. One earlier temporary C-02 directory was inaccessible; this is not a claim that every private archive was searched.

First ask B whether a genuine retained blocked-state image exists. If it does, retain its actual provenance and add a numbered caption. The current closed page must not be presented as the earlier blocked merge state.

If no image exists, the user can ask the TA whether the retained API/run/witness proof is acceptable. No TA acceptance or message has been recorded. Alternatively, prepare a new minimal proof under [delivery-plan section 9.5](../../../workflow/04_LAB5_DELIVERY_PLAN.md#95-controlled-c-02-exception-failing-proof-pr): a fresh branch from current main, one harmless assertion in the required test, early Draft, explicit authorization for that exact head/base before lifting Draft, capture the actual failed required-check blocker, then close without merging and retain history. This document neither authorizes nor reports that new experiment.

### Capture availability in this session

The Computer Use inventory returned `native pipe unavailable` and `browser access host unavailable`. After the user installed Computer Use, a fresh Windows helper attempt also returned `CreateProcessWithLogonW failed: 2`. The user reported that the desktop app had not yet been restarted. A restarted, connected desktop session must be tested before claiming capture access is restored. No synthetic or reconstructed evidence was created.

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

- [ ] Add genuine C-04 URL-visible captures and resolve the C-02 visual-evidence gap through a retained image, documented TA decision or separately authorized controlled proof.
- [ ] B reviews the exact final documentation head in PR #104; accept and merge through normal protected staging workflow. No self-approval or fabricated B decision.
- [ ] Record final documentation head/merge SHA and actual source acceptance in Issue #16. Issue #15's completed CI/release criteria have been reconciled; its closure does not finish the report or course submission.
- [ ] Both members inspect Answer Parts 0-4, direct links, numbered captions, readable images and secret redaction. Keep the selected application commit and report-source identity separate.
- [ ] The user assembles/exports the final PDF and uploads it on LEB2. The repository requests Markdown authoring; no PDF has been generated, rebuilt or exported by this work.
- [ ] Record the actual uploaded filename, final source identity, submission time and real receipt. No LEB2 receipt is currently available, so submission remains PENDING.
- [ ] Keep the repository public and the service available until the instructor announces grading has ended. Preserve CI, proof branches and contract history for later labs.

Issue #16 remains open until its actual criteria and submission are completed. No main merge, new failing proof, deployment, IAM/settings change, seed, migration, restart or teardown is part of this documentation follow-up.

Author checks on this follow-up passed across six Markdown files: 116 local file/image targets, nine heading anchors, 21 structurally consistent tables, no missing targets, balanced fences, English content and a sensitive-value pattern scan. Both recorded B role projections and three original screenshot hashes still match the baseline. Application/workflow/configuration source is unchanged from the accepted application snapshot. These checks do not fill the missing images or complete the final peer review; final-head CI is recorded in PR #104.
