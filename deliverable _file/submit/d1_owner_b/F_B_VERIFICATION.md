# Part F - Owner B Evidence and Team Process

Original package: B (Atip Infa-udom / 67070503446). Authorized corrections: A / Codex, #64 / PR #65. B reviews the repaired package before acceptance. Accepted application/document baseline: `fe65b1962e2c62bf5a11a96e3fb536da9e3e98bc`; retained final tested executable source: `e1ada71112cdfc0f9ddd985a3e49e82c8638c4a1`.

## F.B1 Implemented scope and execution provenance

B originally implemented schema/seed/shared UI, F-02 milestones and F-04 feedback. A corrected reviewed integration/security/retry findings, preserving B commits; B reviewed the A-authored repairs. This source package records both contributions and reuses the accepted verification artifacts; it does not make every test or repair a B-authored result.

The retained full J03 clean-clone run was executed by A/Codex on Windows x64, Node 26.13.0/npm 11.20.0 and PostgreSQL 16.8 pinned by image digest. The report is [R1-J03-results.json](../../../Project_code/docs/evidence/R1-J03-results.json); the [narrative](../../../Project_code/docs/evidence/R1-J03-system-verification.md) records executable source, commands, browser phases and limitations. Its pending-gate text is a pre-review snapshot: actual subsequent G3/G4 acceptance is B's [PR #62 approval](https://github.com/zerotwobook/fastTrack/pull/62#pullrequestreview-5809937419), not an invented edit to that historical run.

| Group | Passed | Failed | Actual scope |
|---|---:|---:|---|
| Ordinary | 120 | 0 | Seven files, no external DB required. |
| G1 | 38 | 0 | Real DB/seed/constraint/safe-target checks. |
| F-01 | 28 | 0 | Real sessions/source/CSRF/scoped teams. |
| F-02 | 33 | 0 | 26 real-session regressions; seven retained explicit-actor service cases. |
| F-03 | 48 | 0 | Deadline, duplicate, scope, transaction/lock and compiled restart checks. |
| F-04 | 42 | 0 | 29 real-session/transaction cases; 13 retained explicit-actor service cases. |
| Compiled cross-feature journey | 1 | 0 | Real HTTP flow, seed fingerprint of seven tables, actual process restart/session and no-write denials. |
| **Total cases** | **310** | **0** | Cases, not a coverage percentage. |
| Migration scenarios, separate | 7 | 0 | Valid upgrade and safe expected rejection of invalid legacy data. |

B's independent reviews are distinct evidence. On #61 B recorded typecheck, 120 ordinary cases, 42 B02 cases and build. On #62 B recorded typecheck, ordinary/B02 and the compiled J03 journey/build, then explicitly accepted G3 and G4 at the reviewed head. Do not relabel these as a B rerun of every one of the 310 cases. Current documentation/setup reproduction is recorded at the end of this file only after actual completion.

## F.B2 Exact acceptance-to-test mapping

The following are selected **exact raw reporter names**, not rewritten test titles. Planned T-IDs remain distinct from the actual names. [verification_map.json](verification_map.json) contains all nine B-owned rows, 136 references / 68 unique cases, full names, source filenames/commits/hashes and report JSON pointers. Root-relative paths are explicitly identified there. The authoritative full run/map remains under `Project_code/docs/evidence/`.

| AC | Planned check | Exact recorded identity / evidence key | Result |
|---|---|---|---|
| AC-02.1 | T-06 | `b01Tests/1`: `B01 independent real-session regression T-06 creates then reads identical persisted list/detail projections`<br/>`b01Tests/24`: `B01 independent real-session regression T-06 production composition exposes the real session-protected milestone routes` | PASSED in attributed J03 run |
| AC-02.2 | T-07 | `b01Tests/21`: `B01 independent real-session regression T-07 checks session/role/CSRF before invalid JSON and rejects forged identity`<br/>`b01Tests/22`: `B01 independent real-session regression T-07 conceals foreign versus missing milestone identity with equal 404 bodies` | PASSED in attributed J03 run |
| AC-02.3 | T-08 | `b01Tests/4`: `B01 independent real-session regression T-08 rejects malformed/forged payload case 0 without writes`<br/>`b01Tests/25`: `B01 independent real-session regression T-08 rechecks database future time after waiting for the team lock` | PASSED in attributed J03 run |
| AC-04.1 | T-17/T-20 | `b02Tests/0`: `F-04 real sessions, immutable versions and idempotent retries T-17/T-20 persists server identity/time and returns only the DTO after application recreation`<br/>`b02Tests/4`: `F-04 real sessions, immutable versions and idempotent retries keeps feedback on its exact version, allows after the deadline, and rejects key reuse on another authorized version` | PASSED in attributed J03 run |
| AC-04.2 | T-18/T-19/T-20 | `b02Tests/6`: `F-04 real sessions, immutable versions and idempotent retries denies student without a write or cross-team key oracle`<br/>`b02Tests/7`: `F-04 real sessions, immutable versions and idempotent retries denies foreign-student without a write or cross-team key oracle`<br/>`b02Tests/8`: `F-04 real sessions, immutable versions and idempotent retries denies foreign-supervisor without a write or cross-team key oracle`<br/>`b02Tests/9`: `F-04 real sessions, immutable versions and idempotent retries denies missing without a write or cross-team key oracle` | PASSED in attributed J03 run |
| AC-04.3 | T-17/T-19 | `b02Tests/11`: `F-04 real sessions, immutable versions and idempotent retries rejects invalid content 0 with a field error and no write`<br/>`b02Tests/17`: `F-04 real sessions, immutable versions and idempotent retries supports 4000 astral code points and normalizes UUID casing on retry`<br/>`b02Tests/18`: `F-04 real sessions, immutable versions and idempotent retries rejects spoofed field supervisorId with no write` | PASSED in attributed J03 run |
| AC-04.4 | T-20/T-31 local | `b02Tests/5`: `F-04 real sessions, immutable versions and idempotent retries orders feedback by createdAt and id without changing the content`<br/>`/database/j03Tests/cases/0`: `Sprint 1 integrated compiled HTTP and durable data T-21/T-22/T-25/T-31 creates, submits, appends and scopes feedback; repeat seed and actual process restart preserve all records` | PASSED in attributed J03 run |
| S1-AC-EXT-02 | T-24 | `b02Tests/1`: `F-04 real sessions, immutable versions and idempotent retries T-24 replays a trimmed identical intent with one row and conflicts on changed content`<br/>`b02Tests/2`: `F-04 real sessions, immutable versions and idempotent retries T-24 concurrent identical HTTP requests return one 201 and the remaining 200 with one persisted row`<br/>`b02Tests/3`: `F-04 real sessions, immutable versions and idempotent retries T-24 concurrent different intents on one key return 201/409 and preserve the winner` | PASSED in attributed J03 run |
| S1-AC-EXT-03 | T-25 | `b01Tests/23`: `B01 independent real-session regression T-25 projects only latest-version feedback and preserves stable dueAt/id ordering` | PASSED in attributed J03 run |

Source groups include `server/src/testing/milestones-review.b01.ts`, retained `modules/milestones/milestones.b01.ts`, `testing/feedback-review.b02.ts`, retained `modules/feedback/feedback.b02.ts`, and the separately recorded compiled J03 case. Browser and manual evidence are labeled as such; they are not additional automated test cases.

## F.B3 Actual access excerpt and meaningful RED/GREEN

The complete source block below is byte-identical after LF normalization to lines 88-96 of `Project_code/server/src/testing/feedback-review.b02.ts` at immutable source `514f34cbdb95f2141d2c7f3159a1c36a0bd236a6`. It uses actual login/session callers, denies unauthorized writes and checks the row count; foreign/missing reads share 404. Students fail the role guard with 403 even if foreign.

```typescript
  it.each(['student','foreign-student','foreign-supervisor','missing'])('denies %s without a write or cross-team key oracle', async kind => {
    const body = input(); await post(body).expect(201);
    const who = await login(kind === 'student' ? 'stu-a1@test.local' : kind === 'foreign-student' ? 'stu-b1@test.local' : kind === 'foreign-supervisor' ? 'sup-b@test.local' : 'sup-a@test.local');
    const target = kind === 'missing' ? randomUUID() : id;
    const expected = kind === 'student' || kind === 'foreign-student' ? 403 : 404;
    await post(body,target,who).expect(expected);
    if (kind !== 'student') await get(target,who).expect(404);
    expect(await prisma.feedback.count()).toBe(1);
  });
```

Tracked [access excerpt](../../../Project_code/docs/evidence/excerpts/s1-feedback-access.txt), SHA-256 `56d1c3b696e81d89d67b81bb9a4cf7cd6703710506ea5f10f029b277864baca8`. The [source/excerpt manifest](../../../Project_code/docs/evidence/R1-J03-excerpts.json) pins source and excerpt hashes. Together with A's deadline excerpt this supplies two selected domain/access blocks for final assembly; links do not replace embedding them in the final PDF.

A/Codex authored the corrective RED/GREEN cycle for B's original feedback increment:

1. RED `22149cd`: [R1-B02-A-red.json](../../../Project_code/docs/evidence/R1-B02-A-red.json) records **117 ordinary passed / 3 failed** and **31 B02 passed / 5 failed, 36 B02 cases**. Failures expose actual unknown-draft/Unicode and concurrent-intent behavior. The original forced-overlap probe separately observed 201/503 for identical retries. The first harness TypeScript error is disclosed separately and is not product RED evidence.
2. GREEN implementation `44cac63bfb5b073c5cc2ebc02c6ad7a2b70f22b5` plus focus correction `7b755ce1e0f20271a66bdec0102827d0f4ca0d8f`: scoped transaction/actual-constraint classification and bounded rollback retry, strict Unicode, immutable recovery and mounted exact-version FeedbackPanel. Later strengthened transaction tests are not retroactively counted as the initial RED suite.
3. Accepted #61 head `f516b1704af67b367f1e6ec09657134645b8eeed`, B review/merge `514f34cbdb95f2141d2c7f3159a1c36a0bd236a6`: 120 ordinary and 42 B02 cases passed, with inherited regression. [Repair narrative](../../../Project_code/docs/evidence/R1-B02-A-review.md) and its results retain the complete chronology.

## F.B4 Figures and accessibility evidence

Both PNGs are unchanged copies of original real-app screenshots. Their [manifest](asset_manifest.json) records actual dimensions, source paths/hashes and tested source. These are reference images plus separate measured/behavioral records, not synthesized screenshots or complete WCAG certification.

### Figure B1 - Supervisor, exact version, 320px viewport

![Figure B1: supervisor feedback](assets/B02_supervisor_feedback_mobile.png)

F-04 / AC-04.1-04.3, Supervisor A. Source `e1ada71112cdfc0f9ddd985a3e49e82c8638c4a1`. Real API-created work; feedback was saved through the actual UI. PNG **320x1334**. Visible timestamps include 7 Nov 2026, 10:25:46 and 10:25:47 (Asia/Bangkok); they are not the previous package's 01:17:26 caption. The shared Textarea uses control border #8A8A8A on white, measured separately at about 3.45:1. Text ink/white is 21:1; selected keyboard/focus/layout checks are recorded in the J03 report. The cleared form in this capture demonstrates the post-save state, not an uncertain frozen draft.

### Figure B2 - Student after actual compiled process restart

![Figure B2: student after restart](assets/B02_student_after_restart.png)

F-04 / AC-04.4, Student A1. Same final source; PNG **1440x900**. The recorded process PID changed 25988 -> 5360 while the same DB was retained. API comparison verified original submission/feedback DTOs and session; the UI renders saved version 1 without supervisor write controls. The screenshot alone is not the restart proof: the associated record includes PID change and DTO readback.

Native Chrome 200% is **user A's manual PASS**, recorded 2026-11-07T03:13:16Z for feedback readability, field/save access and navigation. Automation did not confirm that zoom setting (its reference viewport was still DPR 1). This report predates the color-only correction; final current-source contrast/layout measurements are separate. Do not label either normal-size figure as native-200% evidence. B's actual #62 review accepted G4 with this stated provenance. Selected widths 320/390/768/1280/1440, focus/recovery and timezone checks do not establish universal 48px targets or exhaustive accessibility compliance.

## F.B5 Substantive peer-review chain and contribution record

The access/retry chain is [Issue #8](https://github.com/zerotwobook/fastTrack/issues/8) -> original B [PR #58](https://github.com/zerotwobook/fastTrack/pull/58) -> A changes-requested review -> authorized correction [Issue #60](https://github.com/zerotwobook/fastTrack/issues/60) / [PR #61](https://github.com/zerotwobook/fastTrack/pull/61) -> B approval/merge. B's original head `687c5687a683737d17b0bc0af51316f80bffe67a` remains in the correction ancestry; #58 was closed unmerged/superseded, not falsely accepted. Findings included an unmounted panel, actual retry collision, ordinary-suite DB coupling and uncertain-draft mutation.

B approved final #61 head on 2026-11-07T02:36:37Z and merged `514f34c` at 02:40:23Z. The accepted merge tree matches the approved head. This chain plus A's #7 -> #57 deadline chain supplies two substantive reviewed chains; preserve the original review findings, fixes and versions in the final report. No unsupported earlier board transition chronology is reconstructed here.

| Member / assistance | Actual contribution and attribution |
|---|---|
| A - Supapanya Yathip, 67070503443, zerotwobook | Scaffold, auth/teams, submissions/deadline, original A/B/D report sections, G1 verification/repairs; reviewed and repaired B01 (#55/#56) and B02 (#60/#61) preserving B history; J03 tests/contrast/verification (#62); current B-package repair (#64/#65). B reviews A-authored corrections. |
| B - Atip Infa-udom, 67070503446, Atip-Infa | Original schema/migrations/seed/shared UI, milestone #52 and feedback #58 increments, original C/E/F package #63; actual peer reviews/merges of A increments. #56 was A's repair of B's #52, not solely B-authored. B owns final document assembly with A review; final assembly is pending. |
| A / Codex assistance | Actual A sessions used Codex to implement/review/test/repair code and prepare evidence/docs, including this correction. Reported automated checks are agent-run; do not turn them into invented human commands. Native-200% came from user A; B approvals/gate decisions are linked separately. |
| B / reported assistance | The original B package reports Antigravity assistance for typing, validation/tests and Markdown. This is B's self-report, not an independently verified tool log or a claim that B authored A's corrective tests/CSS. B confirms its own final disclosure during peer review. |

## F.B6 Reproducible pinned setup

Prerequisites: Git, Node 26.13.0/npm 11.20.0 and a running Docker engine that can fetch the runner's pinned PostgreSQL 16.8 image. The isolated route needs no existing personal DB or server/.env. It creates guarded disposable dev/test databases, supplies migration/seed configuration internally, builds and verifies the compiled app, and cleans only its own container on graceful stop. Use a private synthetic review password; do not commit/log it.

The default main is currently the planning baseline, so **select the runnable accepted S1 commit explicitly**. In a fresh PowerShell directory:

```powershell
git clone https://github.com/zerotwobook/fastTrack.git fastTrack-s1-review
Set-Location fastTrack-s1-review
git switch --detach fe65b1962e2c62bf5a11a96e3fb536da9e3e98bc
Set-Location Project_code
node --version
npm --version
docker info
npm ci
$env:AUTH_REVIEW_PASSWORD = Read-Host 'Choose a private synthetic review password'
npm run review:j03
```

Keep that terminal running. Open the **actual loopback URL printed by the runner**, not the fixed Vite development URL. Log in using the synthetic password and supervisor.a@fasttrack.local or student.a1@fasttrack.local. The compiled client/API share the assigned origin. `/api/auth/me` restores the session; it is not `/api/auth/session`. Repeat supervisor-create/student-submit/supervisor-feedback/student-read and the denied paths from the handoff as applicable. Existing screenshots describe their own earlier evidence phase, not this new session.

From a second terminal at the same clone's Project_code:

```powershell
npm run review:auth:stop
```

The full JSON report is finalized during teardown if G1_REPORT_PATH was supplied in the command environment. For a noninteractive check, `npm run test:j03:isolated` runs the same full isolated verification chain and exits after cleanup; it does not leave the browser review app running.

For a developer-owned persistent local setup, use [Project_code/README.md](../../../Project_code/README.md): provision separate dev/test databases, copy server/.env.example, privately replace placeholders, and use exactly http://127.0.0.1:5173 for both APP_ORIGIN and the browser. Runtime/seed load server/.env; Prisma CLI does not implicitly load that file, so export process DATABASE_URL before `npm run db:migrate --workspace @fasttrack/server`. Supply DEMO_SEED_PASSWORD before `npm run db:seed --workspace @fasttrack/server`, generate the Prisma client before standalone typecheck, then `npm run dev`. No credentials or reset command are provided for another person's database.

### Actual reproduction during #64 correction

A/Codex reproduced the pinned route during #64 from a new HTTPS clone at `fe65b19`, Node 26.13.0/npm 11.20.0, Docker engine 29.9.2 and pinned PostgreSQL 16.8. `npm ci` and `npm run review:j03` passed: 120 ordinary + 38 G1 + 28 auth + 33 B01 + 48 A02 + 42 B02 + one J03 = **310 passed / 0 failed**, plus seven migration scenarios. Generation/typecheck/build and fresh/repeat migrations completed in that pipeline. A separate Python cookie-jar HTTP probe confirmed compiled client GET 200, seeded supervisor login 200 and `/api/auth/me` 200 with the same user. `npm run review:auth:stop` exited successfully; the runner finalized its report and removed its own container. [Case-level setup results](setup_reproduction.json) retain the actual run times, outcomes and cleanup. This new smoke probe is HTTP, not a new interactive browser/zoom check. Reused screenshots/native-200% evidence above remain separately attributed.

## F.B7 Human gates and remaining D1 work

| Gate | Actual state / authority |
|---|---|
| G0 | ACCEPTED through the joint baseline #44 / 30fc5ef. |
| G1 | ACCEPTED after B review of A's foundation verification/repair #50 / ff5975c. |
| G2 | ACCEPTED in the recorded user-delegated A/AI acceptance after B's #56 merge; [G2 record](../../../Project_code/docs/evidence/R1-G2-acceptance.md) preserves the delegation and actual checks. Do not invent a new B UI run. |
| G3 | ACCEPTED explicitly by B's actual #62 review of 6a11378; accepted staging merge fe65b19. |
| G4 | ACCEPTED explicitly by that same review, including the user-attributed native-200% limit. |
| G5 | **PENDING**: corrected package peer review, final A-F PDF/rendered-page review, exact release candidate/tag, both owners' real decisions and #12 pre-main review/user notification remain. |

This package can be accepted as source content after its actual peer review; no source-package merge alone completes the final report or submission. B assembles both owners' accepted content and A reviews it within existing R1-J04 / #12. There is no R1-B04 task introduced by this document. Final PDF preparation/review occurs before final G5 acceptance; accepted main identity and the PDF must be reconciled to the actual release. Notify the user with the final candidate and actual checks before main merge. Do not upload to the course system or invent a receipt without an actual authorized submission.
