# Corrected CoursePMS retest: actual status

Date: 17 November 2026, Asia/Bangkok. Operator: Codex AI for fastTrack R2-A04. This is bounded verification with actual outcomes, not personal A/B attendance or human acceptance. The user confirmed reuse of the existing test-account set and supplied its private file location. One A sign-in using that designated file was rejected with INVALID_CREDENTIALS. The user selected CoursePMS confirmation/update of the private file; valid access remains pending.

## Release entry

Source aeb804ea5bc667399b00cf54df10046a6ded46e0 is freshly observed through health; readiness is connected. Release PR #76 is merged; deploy 44074859743 succeeded. Dated workflow CLI verifies digest sha256:e5cb29a0cf687cdda01110434528d627cd09057d94e9ab028510e5ad090a89e0 and course-pms-00009-mk2 at 100% traffic. No fresh owner-console screenshot is claimed. Original archive hashes: 24/24 match. Full archive stays private.

The reported old-source blocker is resolved. This does not establish authenticated fixture eligibility, preserved historical records or successful account switching.

## Actual independent checks

[Anonymous observations](../evidence/coursepms-corrected-20261117/public-observations.json) retain exact times/status/content type/sanitized bodies. Seven checks PASS at 18:53:47-48 Asia/Bangkok: health, readiness, unauthenticated bare and unsupported proposal namespaces, other unknown API, root HTML and frontend navigation HTML. These seven observations are separate from partner CI, eight original cases and the RT case statuses below.

A freshly loaded isolated browser used the public Team Alpha Quick Fill and Sign In controls once. Actual result: INVALID_CREDENTIALS; no workspace loaded. The subsequent Logout wait timed out because sign-in failed. The precondition is BLOCKED; it is not an account-switch product FAIL. No password guessing followed. After the user supplied the private credential file, one A sign-in with that file was also rejected at 19:03:10 Asia/Bangkok. Both attempts are recorded as precondition failures; no authenticated workspace or token was obtained. Credential fields were cleared and the isolated browser closed. No reusable token, raw login response or credential screenshot enters deliverables.

## RT-01-09 record

| Case | Actual execution / evidence | Status and limit |
| --- | --- | --- |
| RT-01 A -> logout -> B, no refresh | Fresh browser loaded corrected frontend; demo A sign-in and the later designated-file A sign-in were both rejected. No A or B workspace loaded; switch not attempted. | BLOCKED: CoursePMS must confirm/update designated-file credentials; current A/B eligibility still needed |
| RT-02 reverse/own-proposal | Not executed; credential prerequisite absent. | BLOCKED |
| RT-03 no-team/instructor | Not executed; eligible fixtures/access unverified. | BLOCKED |
| RT-04 reload/relogin saved state | Not executed; canonical authorized values unavailable. | BLOCKED |
| RT-05 logout replay | Not executed; no authenticated temporary token existed. | BLOCKED |
| RT-06 foreign GET/student review | Not executed; auth absent. Review-write target also requires an explicit safe agreement. | BLOCKED; no unsafe write attempted |
| RT-07 delayed response/unsaved editing | Reviewed supplied historical RED/GREEN excerpts, current release trace and CI. No local test rerun or live race/mutation performed. | EVIDENCE REVIEW ONLY; not a deployed-case PASS |
| RT-08 own/foreign/instructor directories | Not executed; authenticated role fixtures unavailable. | BLOCKED |
| RT-09 protected JSON routing/frontend fallback | Anonymous portion observed JSON 401 for proposal namespace, JSON 404 for unknown API and HTML outside API. Authenticated namespace 404 unexecuted. | PARTIAL; overall BLOCKED until authenticated subcheck |

No case-level RT PASS total is asserted. Seven anonymous checks passed; the original defect and authenticated privacy paths remain unverified independently. Partner's 41 backend / 16 frontend / 3 E2E CI counts are supporting correction evidence, not added to independent observation totals.

## Preservation and next action

No business write endpoint, create team, membership change, proposal save/submit/review, seed/reset/delete, cloud mutation or partner message was performed. Team 5 and Proposal 3 were not accessed or changed; current state retention cannot be independently asserted without authorized reads.

CoursePMS must confirm/update valid credentials in the designated private file, as selected by the user after the rejected A login. Do not send passwords in public messages or reports. Reopen a fresh corrected browser and execute only the safe affected cases after verifying source/roles/preconditions. Never reload between the original A/B sessions during RT-01. Obtain actual human tester contribution records and exact-version decisions separately. Both decisions remain PENDING; no case result or signature is fabricated.

The ZIP's proposed 20 November 19:00-19:45 slot is not confirmed by this intake. The supplied release records acknowledge that predeployment notification was missed; release PR checklist wording does not establish an earlier message. Actual external channel/time/response remain unverified. No backdated notification or external acknowledgement is created.
