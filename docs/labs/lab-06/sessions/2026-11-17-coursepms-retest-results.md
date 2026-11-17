# Corrected CoursePMS targeted retest: actual results

R2-A04 / Issue #22. Operator: Codex AI for fastTrack, 17 November 2026, Asia/Bangkok. The user updated the designated private credential file and requested retry. A/B/Instructor sign-in now succeeds. Earlier rejected demo/file preflights are historical attempts, superseded by this successful access; they are not product regressions or part of the current observation totals. This report is not either student's personal execution or a human acceptance signature.

## Identified release and execution

Source `aeb804ea5bc667399b00cf54df10046a6ded46e0`; URL https://course-pms-859617270560.asia-southeast1.run.app. Release PR #76 merged and deploy 44074859743 succeeded. Dated public workflow CLI verifies digest `sha256:e5cb29a0cf687cdda01110434528d627cd09057d94e9ab028510e5ad090a89e0`, serving revision `course-pms-00009-mk2`, 100% traffic at 18:35:30. This is not a fresh owner-console screenshot.

Fresh anonymous checks at 18:53:47-48: seven PASS observations, retained in [public observations](../evidence/coursepms-corrected-20261117/public-observations.json). Successful authenticated run starts with A sign-in at 19:11:25 and ends with final logout/health at 19:15:50. Source matches at authenticated baseline and end. [Eight sanitized authenticated observation records](../evidence/coursepms-corrected-20261117/authenticated-observations.json) retain their own times; they are observation records, not eight case PASS claims or a denominator to combine with original UAT/partner CI.

The fresh corrected frontend was loaded before A login. A -> logout -> B -> logout -> A occurred in the same browser document without reload. An in-memory baseline survived the transitions, and all four field values were compared without exporting the private text. Reload occurred only afterwards for RT-04. Four private screenshots support A-before, B-empty, A-restored and the instructor approved view; they remain in the local private evidence folder and sendable private ZIP, not this public PR.

## RT-01-09 results

| Case | Actual execution and expected/actual comparison | Status / limit |
| --- | --- | --- |
| RT-01 original no-refresh switch | A is Student/Team 1 with a four-field DRAFT matching canonical data. Logout and B login in the same document. B is Student/Team 3 with no proposal; all four fields empty and no old private field text found. AUTH-01/02/03; private A/B screenshots. | PASS for the original supplied A -> B reproduction |
| RT-02 reverse/own-proposal | B logout -> A login without reload. All four A fields match original; canonical saved proposal exactly unchanged. AUTH-04/05; private restored screenshot. A is the available own-proposal destination. | PASS for these observed destinations; no separate additional own-proposal account claimed |
| RT-03 no-team/instructor destinations | A logout -> Instructor login without reload; no student proposal editor, proper instructor workspace. Legitimate instructor-authorized proposal detail is not classified as stale leakage. AUTH-06/07. | PARTIAL: instructor PASS; no-team Student BLOCKED because the supplied three accounts are assigned A/B and Instructor |
| RT-04 reload/relogin persistence | Reverse A relogin restores saved fields; subsequent explicit reload keeps all four values and canonical state. AUTH-05. No save performed. | PASS for saved-draft persistence; unsaved editing persistence not claimed |
| RT-05 logout replay | A logout and final Instructor logout each followed by isolated replay of only that temporary token against current-user endpoint: HTTP 401 TOKEN_REVOKED. Tokens never exported; final browser token removed. AUTH-02/08. | PASS for observed temporary-session revocation; no expiry/restart claim |
| RT-06 foreign GET/student review denial | B GET of A private proposal returns 403 BR06_FORBIDDEN_TEAM_ACCESS with only error/code, no proposal. AUTH-03. | PARTIAL: foreign GET PASS; review-write denial BLOCKED because no safe write target agreed; no review/POST attempted |
| RT-07 races/unsaved editing | Reviewed partner's supplied RED/GREEN, release trace and exact-head CI evidence. No live race/write or local automated rerun performed. | EVIDENCE REVIEW ONLY; not a deployed-case PASS |
| RT-08 student/instructor directories | A/B API responses have all three foreign proposals null; own A proposal retained. Student UI shows PRIVATE. Instructor retains three authorized proposals, four team rosters and correct NONE/APPROVED behavior. Approved filter yields one team and proper review-disabled state. AUTH-01/03/07. | PARTIAL: observed own/foreign/instructor paths PASS; unassigned-student path BLOCKED because no eligible account supplied |
| RT-09 API/frontend routing | Anonymous proposal namespace JSON 401; valid B session bare namespace JSON 404 API_ROUTE_NOT_FOUND. Other unknown API JSON 404; frontend/root HTML retained. PUB-03-07 and AUTH-03. | PASS for the recorded requested routing paths |

Case mapping: **5 PASS, 3 PARTIAL, 1 EVIDENCE REVIEW ONLY**. PARTIAL includes required blocked subchecks and is not a complete case PASS. No confirmed product FAIL in these bounded observations. This is not exhaustive Sprint 1 acceptance, all session race coverage or personal student execution. Seven anonymous observations and eight authenticated records retain separate denominators; partner CI counts are not added.

## Preservation, cleanup and remaining work

A's canonical saved proposal exactly matches its initial authorized baseline. Instructor readback confirms Team 5, three members, Proposal 3, APPROVED revision 2. The complete instructor directory response is identical before/after read-only filtering/selection. This is bounded canonical readback, not a full DB audit or proof of unobserved history. No business record creation, membership edit, proposal save/submit/review, reset/seed/delete, release or cloud change was performed. Login/logout session changes are expected test actions.

All temporary role sessions were signed out; final token replay is rejected, local browser token removed, in-memory private baseline deleted and isolated browser closed. The temporary credential-input file was removed. Supplied private email/password values are excluded from authored public text/JSON. Private screenshots show synthetic test identities/proposal data and must be shared only with the two teams.

The original L6-OUT-EXP-001 no-refresh reproduction now passes on the corrected deployment. Foreign GET denial, directory paths and API routing pass within the limits above. Do not sign off unexecuted no-team/unassigned/review-write subchecks or RT-07 as deployed execution. The real human UAT team must reconcile those remaining requirements and record its exact-version decision. Both independent human decisions remain PENDING; no acceptance, signature or attendance is selected by this report.

The previously proposed 20 November slot remains unconfirmed; this actual AI run occurred at the times above. User receipt in this conversation and a prepared reply do not establish external delivery channel/time or earlier notification. No external message was sent by the assistant.

## Later completion addendum

The 21:30-21:33 deployed follow-up and independent isolated replay resolve the formerly blocked subchecks. See [actual later results](2026-11-17-coursepms-remaining-checks.md): eight deployed targeted case PASS and one evidence-review/local-replay PASS. The dated observations/mapping above are retained as history, not the current completion state. Both human decisions remain pending.

## Later user confirmation of product decisions

The user subsequently accepts CoursePMS using this completed evidence, reports CoursePMS acceptance of fastTrack, and confirms shared A/B checking. See [the current confirmation record](2026-11-17-user-acceptance-confirmation.md) for direct versus user-reported provenance and the current responsibility split. Earlier PENDING statements above describe the time of execution; they are superseded for current decision status. Test facts and original operator attribution are unchanged. TA disposition and final assessment submission remain open.
