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

> Hello, we are arranging independent cross-team UAT for fastTrack. Could your team test our accepted deployed S1 milestone -> submission -> feedback workflow, deadline/rule rejection, role/team access, and persistence? We can coordinate during 09:00-16:00 Asia/Bangkok, subject to agreeing a specific date/time. We will provide the fixed tested version, HTTPS URL, safe role accounts and case sheet after deployment. Both of us will also test your application. Please confirm your team/contact and a suitable appointment. This message is a preparation draft; the actual agreement is not yet recorded.

A supplies the versioned case/access packet. B checks that an independent tester can reproduce it. The user handles external contact unless separately authorizing a specific message; no message is sent by this task.

## 3. Source-backed Lab 7 candidate for review

Proposed title: Extend the maximum feedback content length from 4,000 to 6,000 Unicode code points.

This is a change to implemented F-04 / BR-08, not a missing F-05-F-07 feature or an invented defect. Hypothesis: longer supervisor explanations may be useful; this is a proposed rationale for instructor consideration, not a claim from actual UAT findings. The selected topic and actual TA decision remain PENDING.

Baseline source checks: [shared feedback validator](../../Project_code/shared/feedback.mjs) defines CONTENT_MAX_CHARS 4000 and counts code points after trimming; [Prisma schema](../../Project_code/server/prisma/schema.prisma) uses Feedback.content VarChar(4000); the latest canonical bounds [migration](../../Project_code/server/prisma/migrations/20261106212301_g1_canonical_bounds_alignment/migration.sql) enforces the corresponding trimmed-content check. Existing [feedback input tests](../../Project_code/client/src/features/feedback/input.test.ts) accept 4000 and reject 4001, including escaped supplementary Unicode. The accepted S1 tag retains that validator limit.

Before any maintenance implementation, obtain the actual instructor/TA decision, revise/version the contract and AC, and follow the real #24 -> #25 RED/GREEN handoff. This preparation does not modify application code, schema, migrations, tests or release behavior.
