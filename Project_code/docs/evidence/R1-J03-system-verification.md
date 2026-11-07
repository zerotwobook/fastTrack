# R1-J03 integrated Sprint 1 verification

Task #9 / PR #62, branch `test/s1-a-g3-g4`. Shared owners A/B. A and AI executed the checks and prepared this record; the user A supplied the native-200 manual result. B independently reviews the current head and records its own G3/G4 decision before acceptance. Verification is PASSED for the checks below; joint G3/G4 acceptance remains PENDING.

## Accepted base and change scope

B approved PR #61 head f516b1704af67b367f1e6ec09657134645b8eeed at 2026-11-07 02:36:37 UTC and merged it into staging/sprint-1 at 02:40:23 UTC as 514f34cbdb95f2141d2c7f3159a1c36a0bd236a6. The approved and merged trees match. #8 and #60 are closed Done/PASSED/ACCEPTED; original #58 remains closed unmerged and archived with its failed review.

This task started from accepted staging 514f34c. Plan commit 6e11c85 opened the early Draft PR during Started. Initial verification code is cc0e206; the final tested candidate is e1ada71112cdfc0f9ddd985a3e49e82c8638c4a1 after the control-border correction described below. It adds one cross-feature compiled-HTTP test and its isolated runner/configuration, and retains ordinary case-level JSON in the report. Domain modules, shared validation and schema/seed trees remain byte-identical to the accepted application. The only application change is the shared control-border color token required by the established design. Runtime dependencies and lockfile are unchanged. No main release or final PDF is produced here.

## Fresh-clone automated results

A created a separate HTTPS clone at cc0e206, installed 316 packages, generated Prisma, typechecked, ran ordinary tests and built client/server. After fast-forwarding that same clean clone to e1ada71, the entire protected PostgreSQL review:j03 pipeline was rerun and completed fresh dev/test migrations, repeat deploy, generation, typecheck, ordinary/build/domain tests and seven migration scenarios. Node 26.13.0 / npm 11.20.0 on Windows; PostgreSQL 16.8 is pinned by digest in the finalized report.

| Group | Passed | Failed | Actual scope |
| --- | ---: | ---: | --- |
| Ordinary | 120 | 0 | Seven files, no database fixture import required |
| G1 | 38 | 0 | Real PostgreSQL foundation/seed/safety checks |
| F-01 | 28 | 0 | Real sessions, source/CSRF and scoped teams |
| F-02 | 33 | 0 | Seven retained explicit-actor service cases and 26 independent real-session regressions |
| F-03 | 48 | 0 | Deadline/validation/scope/races/locks and compiled restart |
| F-04 | 42 | 0 | Thirteen retained explicit-actor service cases and 29 independent real-session/transaction regressions |
| Integrated system | 1 | 0 | Real compiled HTTP: complete journey, projections, seed preservation, process restart and denials |
| **Total** | **310** | **0** | Counts are cases; not a coverage percentage |
| Migration scenarios | 7 | 0 | Separate from the 310 test cases |

The integrated case logs in actual fixture users, creates a milestone through HTTP, submits version 1 as the student, appends supervisor feedback, checks same-intent replay and changed-intent conflict, reads as a teammate and verifies matching list/detail latestSubmission plus feedbackCount = 2. It repeats the add-only seed with a different synthetic password and fingerprints all seven domain/auth tables, then stops/starts the compiled process, verifies exact saved DTOs/current sessions and unchanged fingerprints, denies foreign/student writes and duplicate submission, and verifies logout-cookie replay denial. Private authentication fields are compared by a digest so failing assertions do not print tokens/hashes.

The finalized [JSON report](R1-J03-results.json) includes current exact case names and actual successful teardown. Both owned browser sessions and the extra compiled restart host were closed; the runner removed its own disposable database container. Docker Desktop was initially stopped and was started before a full successful retry. That infrastructure startup failure is not a product RED result. The first browser probe tried reading a POST body after navigation; the already saved milestone was recovered through a scoped GET without a duplicate create. The later actual readback and complete journey passed; the probe error is disclosed rather than counted as a product failure.

## Pre-handoff contrast finding and correction

Final inspection found shared Input/Textarea resting boundaries declared as divider #E5E5E5 on paper #FFFFFF, about 1.26:1. Project detail 8.3 explicitly reserves divider for separators and requires the control/ink token for input boundaries; 8.11 requires at least 3:1. The Project cards remained Started with Verification FAILED while this pre-handoff finding was addressed; no review/Fixing history was fabricated.

Commit e1ada71 changes exactly that one declaration to the existing control token #8A8A8A. After rebuilding and rerunning all 310 cases/seven migration scenarios, the real compiled app's login email/password Inputs and exact-version feedback Textarea were measured from getComputedStyle. Resting/hover borders are rgb(138,138,138) on white, **3.45:1**; text is black on white, **21:1**. Focus measurements also exceed the boundary threshold, including during the darkening transition. All five viewport widths still fit. The final supervisor form and final student-after-restart images below are from this corrected source. No low-value implementation-mirroring CSS unit test or artificial TDD RED was added; direct rendered measurements verify the reversible token fix.

## Actual browser checks and the native-200 limit

Current compiled code and the built client were exercised against the disposable PostgreSQL development database, over loopback. Supervisor A created the milestone through the UI; Student A1 submitted and saw the empty feedback state without a write form; Supervisor A saved exact-version feedback and read it from the API; Student A1 read it before and after a real compiled process restart. PID 10888 changed to 17352 on the same origin/DB. The original submission and feedback DTOs were identical and the same student session restored after reload.

The initial cc0e206 browser journey and PID 10888 -> 17352 restart are retained as historical verification. Final e1ada71 was also checked with real API-provisioned work, a real supervisor UI feedback save and student UI readback after another actual restart (PID 25988 -> 5360). Those exact final DTOs/session were preserved. A separate headless context tested the account switch without disturbing the headed user-check window. A real successful feedback GET was delayed, A signed out and B signed in, and the old 200 response was delivered only afterward. Old feedback did not render; B received generic API 404 and no feedback form. External returnTo stayed on the local origin/root. Controlled loading delay/error showed a loading state and a recoverable error without a false empty state; retry loaded actual data. These network delays/errors are disclosed QA interception, not natural outage claims.

Widths 320/390/768/1280/1440 had no horizontal overflow. Keyboard Tab/Shift+Tab reached Save feedback and returned to a visibly focused textarea (2px outline). An empty save focused the invalid field. Timestamps remained Asia/Bangkok while the browser timezone was America/New_York. English monochrome content and the two selected current screenshots were visually inspected.

**Native Chrome 200% is a user-reported manual PASS.** A confirmed that feedback remained readable, Your feedback/Save feedback were usable and navigation could be opened. Recorded at 2026-11-07 03:13:16 UTC (10:13:16 Asia/Bangkok). Both native-control runtimes failed initialization with Windows CreateProcessWithLogonW error 1058, and a Playwright Control+Equal probe did not change zoom. The subsequently observed automated window still had DPR 1, inner width 929 and outer width 945. This may be a separate window from the user's check. No automated native-200 measurement or screenshot is claimed; This manual result predates the one-line boundary-color correction; geometry and application logic are unchanged, while final computed contrast/layout measurements are separate evidence. B must assess this explicit provenance at the current head when deciding G4. Responsive-width or CSS/device scaling is not relabeled as native zoom.

The [asset manifest](R1-J03-assets.json) preserves original bytes/hashes/dimensions and captions:

- [Supervisor feedback at 320px](assets/j03-system/j03-final-supervisor-320.png)
- [Student after actual process restart](assets/j03-system/j03-final-student-after-restart.png)

## Coverage, excerpts and actual history

[The coverage table](R1-J03-coverage.md) and [machine-readable map](R1-J03-verification-map.json) cover all **18 feature ACs and five S1 extensions**, plus shared T-21/T-22/T-31-local and UI checks. There are 138 exact named case references into the actual finalized current report. Full-name hashes, source-file hashes and JSON pointers are validated. Current browser cases supplement the API evidence; a passing API case is not silently counted as a browser check. The older accepted A03 map remains a historical snapshot; its combined-restart gap is supplied by this new current evidence, not retroactively rewritten.

Two complete source-identical excerpts are ready for B's Part F assembly:

- [Deadline no-write rejection](excerpts/s1-deadline-rejection.txt), from submissions.a02.ts T-11.
- [Real-session feedback access/no-write denials](excerpts/s1-feedback-access.txt), from feedback-review.b02.ts for student/foreign/missing callers.

[Excerpt source metadata](R1-J03-excerpts.json) records the immutable source commit, line boundaries and file/block hashes. [History metadata](R1-J03-history.json) verifies the two complete peer-reviewed chains: #7 -> PR #57 -> B approval/3365a36 merge, and B #8 / original #58 changes-requested review -> A correction #60 / PR #61 -> B approval/514f34c merge. B's original commits are preserved in the latter chain; the original rejected head is not accepted unchanged.

Meaningful domain TDD is retained at 165f891: five passed/two failed, specifically the one-millisecond-late deadline and late first-submission rejection. Rule implementation 1bf8d63 then passed; its actual reviewed integration is PR #57. A syntax/configuration failure is not used as TDD RED, and this verification-only task does not invent a new RED/GREEN cycle.

## Reproduction and B handoff

From Project_code in a separate B clone of the current PR #62 head:

```powershell
npm ci
npm run db:generate --workspace @fasttrack/server
npm run typecheck
npm test
npm run build
npm run test:j03:isolated
```

The last command creates a protected disposable PostgreSQL DB, runs the complete inherited chain plus the compiled system case and removes its own container. Do not target an existing development/assessment DB with destructive fixtures. For an interactive compiled app, set a synthetic AUTH_REVIEW_PASSWORD and run `npm run review:j03`; stop with `npm run review:auth:stop` in the same clone. The finalized report is written when this review environment shuts down.

B review focus:

1. Inspect current-head changes, full current report, source/case/hash mapping and the two actual peer/TDD chains. Test tooling changes must not change accepted application behavior or ship a test identity/clock bypass.
2. Reproduce the protected full regression and try the real supervisor -> student submission/deadline -> feedback -> student-read flow, including role/cross-team/replay rejection. Record what B actually ran and the result at the current head.
3. Assess responsive/keyboard/recovery evidence and the explicit user-only native-200 result, which predates the color-only correction. Repeat any manual check needed for B's independent G4 decision; do not claim B performed A/AI/user checks.
4. Record separate actual G3 and G4 ACCEPTED/CHANGES REQUIRED decisions with B name/time/head and findings. Approve/merge into staging/sprint-1 only when appropriate. A must not self-approve or merge this A-authored task.

A/AI supplied the new automation, current browser checks, coverage, excerpts/history and source assets and the specified contrast-token correction; user A supplied the native-200 report; B's earlier feature reviews and merge are independently verified, while B's current shared-gate decision is still pending. B retains #11 C/E/F/PDF assembly. B can reuse this accepted-source material in the final report after gate acceptance; G5/main release/tag/final PDF/submission are separate and remain pending.
