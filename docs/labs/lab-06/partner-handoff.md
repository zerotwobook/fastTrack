# Partner handoff: fastTrack Sprint 1

Read this document before the [eight cases](uat-cases.md). Product owners A/B answer access or setup questions; the independent testers execute the cases and record their own observations.

For current evidence and outstanding actions, read [current-status.md](current-status.md). The [received fastTrack intake](sessions/2026-11-13-fasttrack-received.md) records five successful test-account logins, new API-created synthetic fixtures and selected browser observations, all operated by Codex AI for CoursePMS. It does not complete the personal student UAT or independent decision. Existing setup instructions below describe a fresh run; use a new suffix and preserve the received run's records. Retest confirmation and both current deployed revisions remain pending.

## 1. Participants and appointments

| Role | Participants / arrangement |
| --- | --- |
| Product team | EN-028 / Section 31 / InfaCompany |
| A | Supapanya Yathip, 67070503443, GitHub zerotwobook |
| B | Atip Infa-udom, 67070503446, GitHub Atip-Infa |
| Independent UAT tester 1 | Tatchakorn Thamnimitr, 67070503415, GitHub Magiciancat9 |
| Independent UAT tester 2 | Pawarit Wongdaeng, 67070503466, GitHub martinvadre |
| Initial testing | 13 November 2026 from 17:30 Asia/Bangkok (10:30 UTC), user-provided plan |
| Proposed retest | 14 November 2026 at 13:30 Asia/Bangkok (06:30 UTC), proposed by the user; partner confirmation pending |
| Partner team | Section 31, Group EN-022_P6 |
| Partner product | CoursePMS (Course Project Management System, CPE334 1/2026) |
| Partner public URL | https://course-pms-859617270560.asia-southeast1.run.app |
| Partner repository | https://github.com/Magiciancat9/Course_management |
| Partner-reported main / running source | 150dc5db3de5c829a7d9ef1adb545191cc37542d |
| Private coordination / credential channel | PENDING user selection and actual delivery confirmation |

Both teams exchange Product Team and UAT Team roles. Both fastTrack developers must participate in testing the partner product. Record actual tester participation, not a planned allocation as completed work.

For CoursePMS, anonymously open `/api/health` and read `commitSha`; `/api/ready` reports database connectivity under `db`. On 13 November 2026 at approximately 07:27 UTC (14:27 Asia/Bangkok), actual HTTP 200 responses reported the supplied commit, `status: ok` / `service: course-pms-api`, and `status: ready` / `db: connected`. The [partner readback](evidence/partner-public-readback.json) retains the exact observation times and response fields. This confirms anonymous source/readiness at that time, not authenticated business behavior, repository main ancestry, deployed revision/traffic or independent acceptance. Repeat the version check at the session start and obtain the partner's actual Sprint 1 cases/scope, private test access, setup/cleanup and revision before reciprocal execution.

## 2. Fixed release and assessed scope

- Web application: <https://fasttrack-app-kpx7au3w2a-as.a.run.app>.
- Repository: <https://github.com/zerotwobook/fastTrack>.
- Selected accepted application commit: `8e637e537cd037d630a5fffc1b5672d1b44371a8`, main release PR #100.
- Original Sprint 1 baseline: `v1.0.0-sprint-1`, peeled commit `ae7a60a6e3ed0a363dcee920ac1774a02f4f4ab8`.
- Last historically correlated deployed revision: `fasttrack-app-00003-rc7` in Lab 5 evidence. A public health response confirms source identity, not the current revision or traffic allocation; A/B must confirm the current revision in the session record before testing.
- The package branch and staging documentation commits are not serving application versions.

The accepted-for-test scope is F-01 sign-in/out and scoped teams; F-02 milestone creation/read; F-03 one shared version-1 submission before the deadline; F-04 private, append-only feedback on that submission. F-05 team/milestone editing, F-06 revisions, F-07 progress and F-08 summary are outside this Sprint 1 acceptance.

At the session start, open `/api/health` and `/api/ready` on the application origin. Expected: HTTP 200, health `status: ok`, readiness `status: ready`, `database: connected`, and both `version` values equal the selected commit. Record the actual time and responses. If source differs or the service is unavailable, record BLOCKED and agree a newly identified baseline before proceeding. A/B notify the partner before changes affecting the tested release; results never silently transfer to a different version.

## 3. Private account handoff and browser setup

Use the existing Lab 5 test accounts; this preparation creates no account or database resource. The names below are aliases, not passwords. A/B privately supply and confirm each required account's current email/password. The seed source is not proof that a deployed credential currently works.

| Alias | Required role and scope | Use |
| --- | --- | --- |
| SA | Supervisor assigned to Team A | Create new test milestones and feedback; inspect saved state |
| A1 | Student member of Team A | Submit work, view feedback, duplicate/deadline/input cases |
| SB | Supervisor assigned to Team B, not Team A | Cross-team denial and account-switch cases |
| A2 / B1 | Optional second Team A student / Team B student | Additional shared-submission or foreign-student coverage if access is supplied |

Use separate browser profiles for SA, A1 and SB so one sign-in does not replace another role's session. Two ordinary tabs in one profile share a session; two private windows may also share a session. Use a separate signed-out profile for anonymous checks. Do not sign in another account in the A1 profile while a stale-form case is running.

Before delivery, A/B privately test sign-in and assignment, then record only account labels, roles, successful access and delivery confirmation. Do not put passwords, cookies, CSRF tokens, a raw authentication response, HAR files or request headers in this public package. A tester may capture sanitized response status/domain errors without authentication material.

## 4. New synthetic fixtures

The user selected reuse of Lab 5 accounts with **new UAT records**. Test participants create these records through UAT-01/UAT-02 and the specified setup steps; none is claimed to exist already. Do not modify the original Lab 5 evidence milestone/submission/feedback.

| Field | Value / setup rule |
| --- | --- |
| Run ID | `L6-20261113-1730`; append `-R2`, `-R3`, etc. for a later rerun rather than overwriting data |
| Team A ID and route | Historical fixture ID `7c600ee0-a595-4c52-a093-f0ed5e08fded`, `/teams/7c600ee0-a595-4c52-a093-f0ed5e08fded`; confirm current SA/A1 assignment before use |
| Normal milestone | Title `L6-20261113-1730-NORMAL`; description `Synthetic independent UAT normal journey.` |
| Normal deadline | For the planned session use 15 November 2026 at 23:59 Asia/Bangkok, provided it remains in the future; otherwise agree and record a new future deadline before creation |
| Work submission | Title `L6-20261113-1730-WORK`; description `Synthetic Sprint 1 UAT submission.`; Work link `https://example.com/?run=L6-20261113-1730` |
| First feedback | `L6-20261113-1730: Please explain the test evidence.` |
| Second feedback | `L6-20261113-1730: Add the acceptance result.` |
| Deadline milestone | Title `L6-20261113-1730-DEADLINE`; description `Synthetic late-submission rejection.`; deadline at least five whole minutes ahead of the actual setup time |
| Invalid-input milestone | Title `L6-20261113-1730-VALIDATION`; description `Synthetic invalid-input rejection.`; future deadline as for NORMAL |
| Denied role-write title | `L6-20261113-1730-FORBIDDEN`; this must not be created by A1 |

Milestone dates are entered in Asia/Bangkok. An HH:mm value means seconds `00`, not the end of that minute. The acceptance clock is the server/database clock, not the tester's click time. For a late test, wait at least 60 seconds beyond the displayed deadline and confirm a fresh server time beyond it. Do not change system clocks or production configuration.

The example.com link is synthetic; fastTrack validates its HTTP(S) format and does not upload or fetch work. A successful external work-link permission check is outside this synthetic case.

Copy each newly created milestone/submission URL and observed ID into the execution record. No new team, membership edit, role edit, seed, schema migration or redeployment is needed for this setup.

## 5. Session sequence and evidence

1. A/B confirm the source/revision, privately delivered credentials and correct scopes. Agree the evidence-sharing location and run ID.
2. Tester 1/2 open the [case sheet](uat-cases.md) and [execution record](execution-results.md). Capture the actual browser/version and baseline time.
3. Execute UAT-01, then UAT-02. UAT-03 uses the resulting submission; UAT-05/UAT-07/UAT-08 also use it. UAT-04 and UAT-06 have separate milestones to avoid interfering with the normal record. Keep the run's writes sequential when comparing before/after state.
4. Record actual outcomes and readable screenshots as they occur. Evidence IDs follow `L6-IN-<case>-<sequence>` for partner testing fastTrack, or `L6-OUT-<case>-<sequence>` for A/B testing the partner app. A screenshot should show the relevant URL, action/result and enough context, without credential entry or tokens.
5. Exchange findings through the agreed channel. Use [finding/retest records](findings-and-retest.md); keep all received findings, including an explicit zero-findings statement if appropriate.
6. Agree retest time and the exact corrected release if fixes are needed. The UAT Team makes the final [acceptance decision](acceptance-record.md).

Expected results are a specification, not evidence. No prepared case, author document check, CI result or developer demonstration is an independent test result.

## 6. End-of-session and cleanup

Sign out through **Sign out** in each temporary profile and close the profiles. Retain the new prefixed synthetic records and their URLs while evidence/retesting/grading requires them. Sprint 1 has no deletion/reset UI for this history; do not promise one or delete directly from the database. Start a rerun with a new suffix. Any later data purge/account change is a separately agreed owner operation after evidence retention requirements are satisfied.

Do not restart/redeploy the service merely to perform this package. UAT-08 verifies reload/relogin persistence; historical Lab 5 restart/redeploy evidence may be reviewed with its original actors/times. A new disruption test needs a separate schedule and explicit authorization, and must be recorded as a new action.

## 7. Pre-session owner checklist

- [ ] B has reviewed this package and attempted the steps using only the written handoff; record actual scope and result.
- [ ] SA/A1/SB credentials have been privately delivered and their current assignment checked.
- [ ] Current deployed revision and unchanged selected source have been confirmed and recorded.
- [ ] Tester names, access/evidence channel, new run ID and synthetic-data setup are confirmed.
- [x] Partner team, app URL, repository and reported source are supplied; anonymous source/readiness were checked with actual observations retained.
- [ ] Partner's actual cases/accepted Sprint 1 scope, private accounts, setup/cleanup and deployed revision are available for reciprocal A/B testing.
- [ ] Retest appointment and final-decision contact are agreed.

Source details and preparation checks: [README](README.md) and [preparation verification](preparation-verification.md).
