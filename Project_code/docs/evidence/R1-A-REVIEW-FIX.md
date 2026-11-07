# Sprint 1 independent-review corrections

Task R1-A-REVIEW-FIX, [Issue #70](https://github.com/zerotwobook/fastTrack/issues/70), [PR #71](https://github.com/zerotwobook/fastTrack/pull/71). A implements under the user's explicit authorization, including the originally B-owned modules; B reviews. Target: `staging/sprint-1`. Peer acceptance and merge are pending.

## Findings and implemented corrections

The independent audit of accepted source `94e588d` passed its existing 310 automated cases but reproduced additional failures in the real compiled UI/API. Passing historical tests did not disprove these findings.

| Finding | Correction | Verification |
|---|---|---|
| P1: visibility revalidation unmounted private forms and lost drafts/feedback intent | Separate private identity generation from session-check cancellation. Mask the mounted workspace during verification, close its modal, and preserve its revision only for identical user ID, role and CSRF. Queue private operations/results until verification completes. Expiry/logout/changed sessions invalidate old state. An outage keeps preserved state hidden until retry. | Fourteen new session cases plus compiled milestone/submission draft, actual cookie-account-switch, outage/retry, revoked-session and frozen-feedback-intent checks. |
| P2: an older initial feedback GET replaced a newer successful POST in the UI | Merge append-only rows by ID in createdAt/ID order for initial/recovery reads and confirmed saves. A superseded initial-read failure cannot hide a confirmed save. Retain the original frozen body/UUID and exact-version recovery. | Hold a genuine real-server GET response across a real successful POST; both pre-existing and new rows remain, once each. Delay an injected GET failure after save; the saved row remains and reload reads all persisted rows. |
| P2: milestone NUL/unpaired surrogates reached PostgreSQL and returned 503 | Shared title/description validation rejects unsupported Unicode before persistence, with 400 INVALID_INPUT and matching field errors. Keep valid astral code points and all existing bounds/deadline checks. | Six new shared-validator cases and six actual-session DB/no-write cases; separate compiled-server checks return 400 for all six and keep milestone count 4 -> 4. |
| P2: student overview lacked the specified groups and direct action | Follow project detail 8.6 B: actionable work first, separate overdue/submitted/cancelled groups, dueAt/ID ordering within each, and direct Submit work only for eligible work. Use serverTime, including deadline equality; retain the supervisor track. | Four grouping cases; real API/UI membership/order/action comparison; five viewport widths; keyboard Enter opens the correct submission form. |

The small design follow-ups use 14px feedback field helpers, a full-width mobile feedback action and a compact desktop milestone action. Inter/Noto Sans Thai now load from local assets with pinned official provenance and included licenses. The actual browser loaded both local font binaries without Google Fonts requests. The legacy planning E.1 credential-cap claim is explicitly aligned with the accepted auth contract; no new credential cap or applied-migration change was introduced.

## RED and GREEN provenance

- Contract first: `091d3eb`; it records behavior, shared ownership and verification before implementation.
- Behavioral RED retained at `fa982a9`: `npm test -- --run client/src/features/milestones/input.test.ts` exits 1 with **six failed / twelve passed**. Each failure is an assertion that invalid Unicode was accepted, not a missing import/method failure.
- Core correction: `d4e3960`. Focused session/validation/grouping checks pass 59 cases; ordinary checks pass 144 cases and typecheck passes.
- Reusable frozen-intent browser regression: `fa9f32b0951d98bd0ba21643212b131b9864aa3a`. The fresh full chain and compiled browser checks ran from this source.
- Visual follow-up: `de55c38b83a865c9f0fffb8534219f339be8ffeb` adds exactly one CSS declaration to keep a desktop action compact. Client typecheck/production build and student overview/layout/keyboard/draft checks were rerun after this change. Server and TypeScript/JavaScript logic are identical to the full-suite source. The final handoff adds documentation/results only.

The first correction run reached 340 passing cases, seven upgrade scenarios and initial browser checks, but Docker Desktop/the review process stopped between user continuations before observed teardown. It is not claimed as a successful cleanup. A second fresh clone/install/isolated run completed normally and is the durable result below. The account-switch helper initially timed out because a PowerShell-written Unicode selector became `?`; the corrected escaped selector passed. That helper error is not recorded as a product regression.

## Fresh full verification

Windows x64; Node 26.13.0/npm 11.20.0; Docker 29.9.2; pinned PostgreSQL 16.8. The new clone installed 316 packages with `npm ci`. `npm run review:j03` passed generation, fresh/repeat migrations, typecheck, production build and these actual leaf cases:

| Group | Passed | Failed |
|---|---:|---:|
| Ordinary, eight files | 144 | 0 |
| G1 foundation | 38 | 0 |
| Authentication/session DB | 28 | 0 |
| Milestone DB | 39 | 0 |
| First submission DB | 48 | 0 |
| Feedback DB | 42 | 0 |
| Compiled cross-feature/seed/restart | 1 | 0 |
| **Automated total** | **340** | **0** |

All seven migration upgrade/rejection scenarios pass separately. Four rejection scenarios intentionally receive migration failure and pass only when the expected cause and preserved data/schema/history are verified. These are not seven additional Vitest leaf cases.

The final runner interval is `2026-11-07T12:58:51.436Z` to `2026-11-07T13:07:50.462Z`, including interactive browser review; this is not a benchmark. Graceful stop exits 0 and reports `removed newly created audit container`. Only the owned `s1fix` browser and new review container were stopped. No persistent user database was used.

Full case names, stages and upgrade details: [runner JSON](R1-A-REVIEW-FIX-results.json). Actual browser outcomes/methods: [browser JSON](R1-A-REVIEW-FIX-browser.json). Reusable CLI procedures/functions: [e2e guide](../../e2e/README.md).

## Browser coverage and limits

- Actual compiled UI/API: delayed feedback success/failure ordering; one persisted feedback row after a committed response is lost and reconciliation initially fails; frozen original body/UUID survives same-session verification; explicit check recovers without another POST.
- Drafts: all milestone fields and all student submission fields survive same-session verification. Private forms are hidden while checking, outage/retry preserves the draft, open navigation closes, actual server revocation removes the draft, and a real browser-cookie login as B destroys A's draft/identity and receives foreign-team denial.
- Student groups/actions match the real API at 320/390/768/1200/1440px with no horizontal overflow. A keyboard-focused direct submit action opens the correct form. Mobile feedback action/field widths match; helper text is 14px.
- Visually inspected [student mobile](assets/s1-review-fix/s1fix-student-final-320.png), [student desktop](assets/s1-review-fix/s1fix-student-final-1440.png) and [feedback desktop](assets/s1-review-fix/s1fix-feedback-1440.png). Student screenshots use the CSS follow-up; the feedback screenshot is from the first correction run, whose feedback code/styles are identical.
- Visibility checks control `document.visibilityState` and dispatch `visibilitychange`; they are **not native tab-switch testing**. Native browser 200% zoom was **not rerun** for this patch. Prior manual zoom evidence remains historical. These checks are not a general security/accessibility certification or CI deployment claim.

## Acceptance boundary

All reported product corrections are implemented and the recorded checks pass. B must review the actual current PR head and reproduce the relevant flows before accepting integration. Issue/PR acceptance remains PENDING until real review/merge.

Main PR #67 stays Draft, without auto-merge or a peer-merge request. Its current old source still carries the independent findings; this task does not mark that release passed. After accepted staging integration, recheck the concrete release source and report/evidence alignment, then present it to the user for personal review and explicit authorization. G5, final main/tag/report and course submission remain separate. The pending rules PR #69 is independent of this correction.
