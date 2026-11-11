# R2-J00 external coordination and Lab 7 request preparation

Owner A (`zerotwobook`); peer B (`Atip-Infa`). Related [Issue #13](https://github.com/zerotwobook/fastTrack/issues/13); implementation/UAT follow-ups remain [#22](https://github.com/zerotwobook/fastTrack/issues/22), [#24](https://github.com/zerotwobook/fastTrack/issues/24) and [#25](https://github.com/zerotwobook/fastTrack/issues/25). Target staging only. This is a preparation packet, not external communication, a test result, a selected maintenance change or TA approval.

## 1. Current accepted scope and remaining facts

- Baseline for this preparation: staging `2b3f68ced9ebcdd73efe9d482bd5be3aeb312418`, including B's actual approval/merge of PR #90's F-05-F-07 interface proposal.
- Accepted S1 tag `v1.0.0-sprint-1`: `ae7a60a6e3ed0a363dcee920ac1774a02f4f4ab8`; observed main `b7174a7eb5acd0eca7fa0b0ef0bec078954e2d82`.
- Current Cloud evidence and the dated cost/permission model live in Issue #13. The account holder reports B has certified that preparation. This is attributed user-reported certification; no native B comment/time is invented for the later Cloud review.
- The successful inventory supplied at 2026-11-11T08:17:16Z found no SQL instances/secrets in the project and no registry/service/job in asia-southeast1. A public UAT service URL and deployed candidate do not yet exist in that inventory.
- The user reported daytime availability 09:00-16:00 Asia/Bangkok. Partner team, contact, agreed date/time and real independent agreement are PENDING.
- Lab 7 was previously deferred. This document prepares one concrete candidate for user/TA consideration; it does not assert the user selected it or that the instructor accepted it.

Sources: [Sprint 2 workflow](../02_SPRINT2_LABS5-7.md) sections 11-13, [project detail](../../Project_doc/project_detail.md) sections 5/9/11, [accepted interfaces](../../Project_code/docs/contracts/sprint-2-feature-interfaces.md), [S1 feedback contract](../../Project_code/docs/contracts/sprint-1-feedback.md) and the historical [closure map](R2-J00_S2_INTERFACE_REVIEW.md). Dated handoffs remain snapshots; use Issue #13 for later acceptance/read-back.

## 2. Independent UAT coordination record

| Field | Actual state / required input |
|---|---|
| Independent partner team and members | PENDING: must be outside the fastTrack developer pair. |
| Contact / confirmation source | PENDING: user records the real agreement privately; publish only necessary non-sensitive evidence. |
| Preferred working window | User-reported 09:00-16:00 Asia/Bangkok; not a confirmed appointment. |
| Agreed date/time | PENDING, within the actual Lab 6 schedule. |
| Reciprocal testing | A and B both participate in testing the partner's app; agreement pending. |
| FastTrack target version / URL | PENDING first accepted deployment under #16; name the actual main SHA/image/revision when established. |
| Accounts and fixtures | Private low-privilege Student/Supervisor fixture access; no passwords/tokens in this packet. |
| Evidence/result status | NOT RUN. No tester, appointment, defect or PASS is manufactured. |

### Draft invitation for the user to send when ready

> Hello, we are arranging independent cross-team UAT for fastTrack. Could your team test our accepted deployed S1 milestone -> submission -> feedback workflow, deadline/rule rejection, role/team access, and persistence? We can coordinate during 09:00-16:00 Asia/Bangkok, subject to agreeing a specific date/time. We will provide the fixed tested version, HTTPS URL, safe role accounts and case sheet after deployment. Both of us will also test your application. Please confirm your team/contact and a suitable appointment.

A supplies the versioned case/access packet. B checks that an independent tester can reproduce it. The user handles external contact unless separately authorizing a specific message; no message is sent by this task.

## 3. Source-backed Lab 7 candidate for review

Proposed title: Extend the maximum feedback content length from 4,000 to 6,000 Unicode code points.

This is a change to implemented F-04 / BR-08, not a missing F-05-F-07 feature or an invented defect. Hypothesis: longer supervisor explanations may be useful; this is a proposed rationale for instructor consideration, not a claim from actual UAT findings. The selected topic and actual TA decision remain PENDING.

Baseline source checks: [shared feedback validator](../../Project_code/shared/feedback.mjs) defines CONTENT_MAX_CHARS 4000 and counts code points after trimming; [Prisma schema](../../Project_code/server/prisma/schema.prisma) uses Feedback.content VarChar(4000); the latest canonical bounds [migration](../../Project_code/server/prisma/migrations/20261106212301_g1_canonical_bounds_alignment/migration.sql) enforces the corresponding trimmed-content check. Existing [feedback input tests](../../Project_code/client/src/features/feedback/input.test.ts) accept 4000 and reject 4001, including escaped supplementary Unicode. The accepted S1 tag retains that validator limit.

Before any maintenance implementation, obtain the actual instructor/TA decision, revise/version the contract and AC, and follow the real #24 -> #25 RED/GREEN handoff. This preparation does not modify application code, schema, migrations, tests or release behavior.
## 4. Versioned S1 UAT case sheet for the later accepted deployment

All cases below are planned / NOT RUN. Use only the real accepted deployed S1 candidate, never assume F-05-F-07 is implemented because its contract was accepted. Replace fixture aliases with actual test IDs in the private case sheet after provisioning. The user supplies low-privilege accounts privately; credentials and CSRF/session values do not enter the report.

Common preconditions: fixed main SHA/image/revision/HTTPS URL, healthy/readied service, supervisor A assigned to team A, its student A, a separate supervisor B/team B fixture, and permission to create synthetic assessment records. Record tester, date/time, role, actual candidate and expected/actual result for each case. An unavailable public service means NOT RUN, not FAIL or a simulated PASS.

| Case / group | Steps on agreed synthetic fixtures | Expected observable result | Result |
|---|---|---|---|
| UAT-01 / Normal | Supervisor A signs in, opens team A, creates a milestone with a future Bangkok deadline, then reloads detail. | Saved title/description/deadline and team identity persist; deadline shows the intended seconds/time zone. | NOT RUN |
| UAT-02 / Normal | Student A signs in, opens that milestone, submits a valid title/description/work URL, then reloads saved detail; supervisor A adds feedback to that exact submission and student reloads it. | Saved version 1 has real actor/time/ID; the same version shows the appended private feedback. | NOT RUN |
| UAT-03 / Rule | After UAT-02, try another first submission for the same milestone using the supplied normal request procedure. | 409 ALREADY_SUBMITTED; exactly one version-1 record, existing content unchanged. UI explains the actual saved team submission. | NOT RUN |
| UAT-04 / Rule | Prepare a separate unsubmitted milestone with an agreed short future deadline, wait beyond the displayed instant without changing clocks, then attempt first submission. | 409 DEADLINE_PASSED and no saved submission. Boundary/lock precision remains covered by actual automated tests, not inferred from a manual click. | NOT RUN |
| UAT-05 / Access | Student A tries the supplied supervisor-only creation/feedback mutation procedure on synthetic data; supervisor B opens team A/submission A detail directly. | Student write 403/no write; foreign detail generic 404 with no team/content disclosure. Hidden/disabled UI alone is insufficient evidence of server denial. | NOT RUN |
| UAT-06 / Access | Log out, switch from supervisor A to B (or student A to a different-team student), use browser back/refresh and old private detail URLs. | Private state clears; current account cannot read the old team's records; expired/absent sessions require login. | NOT RUN |
| UAT-07 / State and persistence | Record UAT-02 milestone/submission/feedback IDs/content, reload and log out/in; compare the recorded IDs and exact-version feedback. | Same saved records remain, no duplicate feedback; successful reload alone is not a restart/redeploy proof. | NOT RUN |
| UAT-08 / State and persistence | Observe A/B's separately authorized restart and later redeploy evidence against the same original records, as scheduled under #16; independently read them afterward. | Same IDs/content/associations and expected session-TTL behavior, tied to actual before/after source/revision evidence. If those operations have not occurred, leave this case NOT RUN. | NOT RUN |

Each finding includes case ID, tested version, steps, expected/actual result and sanitized screenshot/log reference. A triages accepted/duplicate/not-defect/enhancement; module owners fix real accepted defects through reviewed PRs, and the independent partner retests the same failure. No defect or retest is invented to meet a count. Both A/B test the partner application and retain their actual individual results. The Lab 6 deadline is 22 November 2026 at 23:59 Asia/Bangkok; confirm the actual appointment rather than inventing a date from the available daytime window.

## 5. Draft instructor/TA approval request

Status: PREPARED / NOT SENT / NOT APPROVED. Topic selection is PENDING user/instructor decision. Intended maintenance work is #24 then #25, after the actual approval and applicable deployed-baseline dependency. This draft satisfies preparation only; it does not claim the Lab 7 implementation gate is passed.

> Subject: Request to approve a feedback-length maintenance change for fastTrack (Lab 7)
>
> We propose changing the implemented F-04 feedback content limit from 4,000 to 6,000 Unicode code points after trimming. The current accepted Sprint 1 release is v1.0.0-sprint-1 (ae7a60a); current main b7174a7 retains the 4,000 limit. This is a proposed change to FR-05 / BR-08, rather than a report that the existing behavior is defective.
>
> Under the proposed policy, 1-6,000 valid code points are accepted; blank, invalid-Unicode and over-6,000 content is rejected. Assigned-supervisor writes, private team reads, append-only exact-submission feedback and request-key retry behavior stay required.
>
> Before implementation, A will document the approved scope and revised contract/AC, then retain a real failing new-behavior test on an unmerged branch. B will review the assertions, implement the agreed validator/UI/schema changes with a new additive migration, and obtain A's review/regression checks. We will retain the RED/GREEN history, verify fresh/upgrade behavior and demonstrate the approved deployed result under the release process.
>
> Please confirm whether this proposed topic and scope satisfy Lab 7, or specify the change you require. We will record the actual decision, date and approved wording before implementation.

The user supplies/sends the final request when the topic is selected. Record the actual reply separately; a prepared message, peer review, a green CI run or this document cannot replace instructor/TA approval. If another topic is selected, revise this candidate's impact/AC/test plan before treating it as the maintenance baseline.

## 6. Proposed maintenance impact and test design

| Surface / owner | Proposed impact after actual approval |
|---|---|
| Requirements/contracts / A with B review | Revise only feedback's FR-05 / BR-08 bound and the F-04 contract/AC/STS. Other 4,000-character description rules retain their own scope. |
| Shared validation / B, coordinated with A | Change feedback maximum through the canonical shared constant and aligned declarations/messages. Preserve trimmed Unicode code-point counting, invalid-text checks and strict input keys. |
| UI / B | Inspect the current FeedbackPanel, shared validation and English helper/error/count text; accept/recover a long draft without changing the established visual design or account/unknown-outcome protections. |
| API and persistence / B | Align service validation, Prisma Feedback.content width and the database trimmed-length constraint in a new migration. Preserve existing IDs, exact submission FKs, old rows and supervisor/clientRequestId uniqueness. Never edit an already-applied migration. |
| Security/privacy / A reviews B | Same role/scope/source/CSRF/no-store behavior, generic foreign 404 and same-key retry 200/REQUEST_KEY_REUSED 409. Long comments remain plain text and out of request logs. |
| Delivery / A+B | Verify migration-before-rollout and schema compatibility. A widen-only migration does not authorize truncating records on rollback; test the real compatible recovery path and keep long-record limitations explicit. |
| Evidence/metrics / A+B | Record actual approved baseline/source/commands/results, later release chain, five dated metrics and interpretation <=100 words under the workflow. No numbers are prefilled as results. |

| Proposed AC / scenario | Before change / planned assertion after approval | Current status |
|---|---|---|
| L7-AC-01 / Boundary | Existing 1 and 4,000 code-point feedback remains accepted; new 4,001 and 6,000 accepted; 6,001 rejected with a content field error and no row. | NOT RUN |
| L7-AC-02 / Unicode and trim | Equivalent ASCII and escaped supplementary-code-point cases, surrounding whitespace, blank, null/unpaired-surrogate and extra-key rejection. Count code points consistently in browser/API/DB. | NOT RUN |
| L7-AC-03 / Persistence | Fresh migration plus upgrade of a disposable copy containing old feedback. Save/reload a new 6,000-code-point row with original old IDs/FKs/content retained. | NOT RUN |
| L7-AC-04 / Access and retry | Student/cross-team/no-session/CSRF denials; same request key and same long payload returns one saved row; changed target/content with the same key returns REQUEST_KEY_REUSED. | NOT RUN |
| L7-AC-05 / UI and recovery | Long content renders as plain text, mobile/keyboard/errors remain usable, uncertain POST recovery inspects exact saved intent and preserves a draft. | NOT RUN |
| L7-AC-06 / Regression and release | Existing S1/runtime/affected S2 tests, real approved deployed behavior, exact source/image/revision and independent verification where required. | NOT RUN |

Planned RED: only after actual approval, add a meaningful new-behavior case asserting acceptance/save of 4,001 or 6,000 code points; run it on the unchanged approved 4,000-limit implementation and retain the actual failure/commit/output. B reviews the assertion, then implements GREEN with API/DB/UI coverage and regression. Existing tests that intentionally encode 4,000 must be versioned under the approved new rule, not deleted to conceal unrelated failures. Keep RED off protected staging/main; do not execute the maintenance experiment during this preparation.

## 7. Review, verification and full-#13 closure boundary

B reviews the current packet's independent tester prerequisites, the four case groups, actual-versus-pending coordination fields, source-backed existing behavior, proposed scope and TA-request clarity. The topic is a proposal until selected; no agreement or instructor decision is signed on B's behalf.

At the final preparation handoff, run document/link/English/whitespace checks and verify source references for the current 4,000 limit, schema/CHECK and retained boundary tests. No new application tests are required for this Markdown-only change; normal repository CI remains tied to its actual final head.

For full #13 closure, retain actual accepted baseline/contracts/ownership/Cloud-review evidence; record a real independent partner agreement and prepared selected Lab 7 request; obtain the actual joint G0/remaining-blocker decision and intended integration acceptance. Then reconcile the Issue from that evidence. A pending partner reply or topic decision stays visible; do not convert this packet or its merge into an invented arrangement/TA approval. Actual UAT, maintenance implementation, Cloud provisioning and main release remain their own later tasks and gates.
### Actual preparation checks

PASS: English-only authored Markdown, nine resolving local links, balanced fences, whitespace, eight UAT case definitions/four groups and six proposed maintenance AC definitions. Current/tagged 4,000-limit validation, Prisma width, existing SQL CHECK and retained 4,001 boundary cases were inspected. The diff contains this Markdown file only, with no private email/credential values. These are document/source checks; no UAT, maintenance RED/GREEN, TA decision or application behavior change occurred. The PR carries exact final head/base and its actual CI result separately from these planned cases.
