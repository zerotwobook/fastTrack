# R1-A02 first-submission verification

Date: 7 November 2026, Asia/Bangkok. Owner A / zerotwobook; reviewer B / Atip-Infa. [Issue #7](https://github.com/zerotwobook/fastTrack/issues/7), [PR #57](https://github.com/zerotwobook/fastTrack/pull/57), branch `feature/s1-a-submissions`, target `staging/sprint-1` from accepted `78d0cca`.

**Current status: Verification PASSED; peer Acceptance ACCEPTED in staging.** Tested executable source: `1bf8d632a4520cb8b2dd495c51b43d73a5e8a561`. Subsequent handoff changes are documentation/evidence only. [Delegated G2 acceptance](R1-G2-acceptance.md) permits this task; it does not waive B review of the A-authored increment or accept G3/main release.

## Accepted integration update

B approved exact head f6c4988d48e6e92310332f1e110007b93945bf03 at 2026-11-06T18:48:37Z and merged PR #57 into staging as 3365a36e4cd1fcdd7410cca2086447ec4ae5dc33 at 18:50:50Z. B reports running test:a02:isolated and review:a02, all 48 F-03 cases plus existing regressions passing, and accepts the locking/deadline/no-duplicate, teammate recovery and feedback-slot design. A verified MERGED, merger/target, current-head approval and identical approved/merge trees; executable files equal tested 1bf8d63. #7/#57 are Done/PASSED/ACCEPTED and #7 is closed. Earlier pending statements/results below preserve the pre-acceptance snapshot. G3 and the main release are separate.

## Implemented behavior

- Real protected POST/list/detail for first submissions; required session/student/source/CSRF guards before parsing, strict allowlisted DTOs and no authority/clock override in requests.
- Shared client/API trimmed Unicode validation, title 1-120, description 1-4,000 and complete credential-free HTTP(S) URL <=2,048. Null characters/unpaired surrogates are rejected before PostgreSQL. The server never fetches work URLs.
- One transaction/client: scoped milestone -> team lock -> milestone lock -> membership/scope recheck -> cancelled/duplicate rules -> once-read millisecond DB clock -> inclusive deadline -> version-1 insert. Existing unique protection and history remain unchanged.
- Retry at most three attempts for confirmed rolled-back contention; do not retry business rejection, timeout or unknown outcomes. Known milestone/version conflicts return ALREADY_SUBMITTED; unrelated unique errors are not misclassified. Public errors do not expose SQL.
- Real milestone actions, form and GET-backed saved detail, version/author/Bangkok time, safe external link and generation-safe private state. Unknown outcomes read saved work before offering manual retry, retain the draft and attribute a teammate's saved work correctly.
- Scoped-submission helpers and version-specific feedback rendering slot are available to B; no feedback endpoint or inert feedback UI is supplied here. Schema/migrations/seed/fixtures/shared primitives/dependency lockfile and B's source branch are unchanged.

See [the concrete contract](../contracts/sprint-1-submissions.md). Clock/lock behavior follows [PostgreSQL wall-clock semantics](https://www.postgresql.org/docs/16/functions-datetime.html#FUNCTIONS-DATETIME-CURRENT) and [row locks](https://www.postgresql.org/docs/16/explicit-locking.html). Error mapping was checked against installed Prisma 7.10.1 runtime and [its pinned PostgreSQL adapter](https://github.com/prisma/prisma/blob/7.10.1/packages/adapter-pg/src/conversion.ts), including a real unique-conflict regression. Current v8 documentation was not used to change this pinned v7 API.

## Real deadline RED and GREEN

At `165f891`, before deadline enforcement, the real isolated pipeline had **5 A02 cases passed / 2 failed**: exact due+1ms saved instead of rejecting, and a POST after the actual DB deadline returned 201 instead of 409. See the full testedSource in [RED results](R1-A02-red.json). Before/equal boundaries, persistence, concurrency and duplicate precedence already passed. Ordinary 106, B01 33, auth 28, G1 38 and seven upgrade scenarios passed; typecheck/build passed. No tests were disabled and no intentionally failing source was merged into staging.

At `1bf8d63`, the missing inclusive deadline rule and complete UI/regression increment are GREEN. Exact tests inject an internal test-only clock and assert the same accepted/stored timestamp. Separate real API/DB barrier tests observe a waiting lock, wait until the actual DB clock crosses dueAt, then release team or milestone locks and assert 409/no write. A membership-change barrier verifies the scope recheck. Controlled P2034 exceptions verify rollback/retry bounds; they are not represented as an induced real deadlock.

## Fresh-clone verification

A clone without hardlinks, `fasttrack-a02-final-1bf8d63`, installed 316 packages without copied environment/generated client. Windows x64, Node 26.13.0/npm 11.20.0, Prisma 7.10.1 and pinned PostgreSQL 16.8. From Project_code:

```powershell
npm ci
npm run test:a02:isolated
```

| Check | Actual result |
| --- | --- |
| Client generation, fresh/repeated migrations, typecheck, production-mode builds | PASS |
| Ordinary/shared-input/client-state tests | **111 passed / 6 files** |
| F-03 API/DB/service cases | **48 passed / 0 failed** |
| B01 DB regression | **33 passed** (7 retained service + 26 real-session) |
| Auth regression | **28 passed** |
| G1 regression | **38 passed** |
| Data-preserving migration scenarios | **7/7 passed** |
| Actual compiled process stop/start, retained session and exact saved GET | PASS inside F-03 suite |
| Runner, owned-container/temporary-credential cleanup, clean clone Git status | PASS, exit 0 |

The 48 cases include internal clock/service checks and controlled error injection as described above; they are not all end-to-end session tests. [Final structured results](R1-A02-results.json) retain exact timestamps and case names. No existing developer database was reset or modified.

## Actual browser observations

`npm run review:a02` ran the same pipeline and then served the compiled app with newly seeded disposable PostgreSQL. Use a synthetic AUTH_REVIEW_PASSWORD; stop from the same clone with `npm run review:auth:stop`. The browser and runner were closed gracefully; cleanup/exit 0 were verified.

- Supervisor A created a real milestone through the UI. Student A1 opened its Submit work form. Whitespace title/unsafe URL produced linked field errors and focused summary; the description remained and saved count stayed 0. Repeated invalid submission focused the summary again.
- Valid UI submission returned a real saved detail; GET/list/reload matched author Student A1, version 1 and the persisted title/description/link, count 1. The external link uses _blank plus noopener/noreferrer. The milestone action became Open saved submission.
- With browser zone America/New_York, saved UTC 18:17:26 displayed 01:17:26 Asia/Bangkok. The assigned supervisor read it; direct supervisor POST returned 403 with saved count unchanged at 1. Switching to Supervisor B at the old URL rendered generic denial without Team A data; foreign/missing API 404 bodies matched.
- A route interception forwarded POST to the real server, observed 201 and then aborted its response. The UI recovered through real GET, retained the draft and showed the actual saved author; exactly one POST/record existed and further submission was disabled.
- A separate real A2 session wrote first while A1's request was aborted. A1's recovery named Student A2 and preserved A1's unsaved draft; it did not claim A1 success or overwrite the teammate's work.
- An aborted request that never reached the server plus an injected recovery-read 503 kept Submit work disabled. Explicit Check saved submissions then found count 0 and enabled manual retry; that explicit retry produced count 1. No automatic POST retry occurred.
- A real short deadline elapsed while the form stayed open. Polling actual domain meta.serverTime confirmed the crossing; POST returned 409 DEADLINE_PASSED, saved count 0, the draft remained and Submit work became disabled.
- At 320px, saved/detail/deadline layouts had no horizontal overflow. Controls measured 16px text, rgb(138,138,138) borders and 48px minimum height. The focused error summary and linked field errors were inspected. Desktop saved detail and mobile form/deadline screenshots were visually reviewed.

Ignored local screenshots are `output/playwright/a02-*.png`. Full-page capture can show an off-viewport fixed skip link; actual viewport inspection found its top at -56px and no overlap. Early harness attempts used a relative APIRequest URL without baseURL and an overly strict scrollWidth equality check; both were corrected before successful assertions. They are not product failures or RED evidence. Expected auth/denial responses and intentionally aborted requests appear in the browser console.

Limits: local Chromium/HTTP only; no public TLS/deployment, load/full screen-reader/cross-browser audit or GitHub Actions gate is claimed. The controlled network/read-error cases do not simulate a real database outage. F-04/revisions and the full G3 journey remain separate work.

## Peer handoff

B reviews the current A-authored PR #57 head, scoped lock/clock/unique/error logic and actual assertions, reproduces student submit/reload/supervisor read plus denied scope/retry, and records real acceptance before staging merge. G2 delegation is specific to the prior checkpoint. Until the actual peer acceptance/merge, #7 stays open and Acceptance PENDING; verify native PR Done and reconcile Issue closure separately. Do not release main or claim G3 from this increment alone.
