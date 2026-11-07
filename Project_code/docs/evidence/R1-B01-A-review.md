# B01 independent review and authorized A correction

Review began 6 November; verification continued 7 November 2026, Asia/Bangkok. Original owner B / Atip-Infa; reviewer and authorized correction author A / zerotwobook. Original [Issue #6](https://github.com/zerotwobook/fastTrack/issues/6) / [PR #52](https://github.com/zerotwobook/fastTrack/pull/52). A's correction is [Issue #55](https://github.com/zerotwobook/fastTrack/issues/55) / [PR #56](https://github.com/zerotwobook/fastTrack/pull/56), branch `fix/s1-a-b01-review`, targeting `staging/sprint-1`.

**Current status: Verification PASSED; B peer integration and delegated G2 ACCEPTED.** See [the actual acceptance update](R1-G2-acceptance.md). The sections below preserve the original pre-acceptance verification/handoff snapshot. A does not approve A-authored corrections. Accepted A01 is merge `0b99a285deb0c6a40aede22e816a578ffa0b62d5`, approved by B at actual head 70dd0ce. The correction branch preserves B's 043af8d history through merge 8ce70e0 and synchronizes the accepted A01 merge. It does not change main.

## Findings and corrections

The [changes-requested review](https://github.com/zerotwobook/fastTrack/pull/52#pullrequestreview-5803618910) is pinned to original B head `043af8dbf825fd4a577f5813d567baf2bf3842e1`. Clean-clone generation/typecheck/build passed, but default npm test collected 51 passing cases and failed the DB suite during fixture import without TEST_DATABASE_URL. B's reported configured-DB results are preserved as historical evidence, not substituted for A's reproduction.

| Finding | Verified correction |
|---|---|
| Description capped at 2,000; UTF-16 title length; missing/invalid types/authority fields not validated | Shared browser-safe utility trims/counts Unicode code points; required title 1-120, description 1-4,000; unknown keys/types rejected with field errors before scope queries |
| Session/role/CSRF guards optional in all environments | All protection dependencies required by types and checked at construction; actual composition passes real DB-backed guards before JSON parsing |
| Calendar normalization, arbitrary fractional precision, host clock before a blocking insert | Strict explicit-zone calendar validation, maximum three fractional digits; scoped team row lock and scope recheck in one transaction; DB clock read after the lock rejects an elapsed deadline without writing |
| Foreign versus missing milestone returned distinguishable 404 bodies | Projection is scoped in the database and uses the same generic NOT_FOUND response |
| Browser form omitted CSRF and interpreted Bangkok input in host timezone | Generation-safe session mutation API supplies CSRF, preserves field errors and invalidates stale responses; explicit Bangkok conversion is shared/tested independently of host timezone |
| Exported UI lacked actual list/detail composition and showed inert later-feature actions | Real authenticated create/list/detail routes and pages, persisted detail read-back, milestone track, loading/empty/error/retry/uncertain-result recovery; no inert Submit/View Submission buttons |
| DB tests mixed into ordinary tests; actor stubs mistaken for integration coverage | Dedicated B01 config/runner; 7 retained service cases use explicit test-only guards, plus 26 new real-session API/DB regressions; ordinary suite remains DB-independent |

Runtime SQL uses the same Prisma transaction client for lock, scope, DB clock and create. Read projections use repeatable-read transactions and batch latest-version/feedback counts. The clock/locking choice follows [PostgreSQL date/time semantics](https://www.postgresql.org/docs/16/functions-datetime.html) and [row locking](https://www.postgresql.org/docs/16/explicit-locking.html), and the blocked-lock regression verifies the actual behavior. The explicit browser offset avoids the host-local interpretation described in [ECMAScript Date parsing](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-date.parse).

## Actual regression history

- `5f8de52`: valid RED against B's candidate with the real A01 session seam. **18 passed / 15 failed B01 cases**; ordinary 67, auth 28, G1 38 and seven upgrade scenarios passed. The failed cases include missing guards, canonical maxima/types/required fields, forged keys, calendar/precision, equal 404s, production composition and lock-delayed creation. See [RED JSON](R1-B01-A-red.json).
- `74d8841`: corrections changed B01 to 32 passed / 1 failed. B's retained foreign-supervisor case omitted the newly required description and therefore tested malformed input instead of valid-input scope. Its payload was completed while preserving the expected 404, rather than weakening that assertion.
- `3b7b2cc8a9eb7265e4faa6e467bce1c609e68e8d`: all **33 B01 cases pass**, consisting of 7 retained actor-stub service cases and 26 independent real-session cases. No test is disabled or skipped. This source is the final clean-clone verification target; later handoff changes are documentation/evidence only.

This is F-02 regression/clock evidence, not the future F-03 deadline TDD or complete Sprint 1 acceptance.

## Clean-clone result and reproduction

A fresh clone without hardlinks at `fasttrack-b01-final-3b7b2cc` installed 316 packages without copied environment/generated client. Windows x64; Node 26.13.0/npm 11.20.0; Prisma 7.10.1; pinned PostgreSQL 16.8. No schema/migration/seed/fixture, shared primitive or dependency lockfile changes. The new `Project_code/shared/milestones.mjs` is tracked, browser-safe and required alongside the built server.

From Project_code with Docker Engine:

```powershell
npm ci
npm run test:b01:isolated
```

The final clean clone used the review variant, exercising that complete check pipeline and then the compiled app:

```powershell
$env:AUTH_REVIEW_PASSWORD = Read-Host 'Choose a synthetic review password'
npm run review:b01
# Open the printed AUTH_REVIEW_URL.
# From a second terminal in this same clone's Project_code:
npm run review:auth:stop
```

| Check | Actual result |
|---|---|
| Clean install, generation, fresh/repeated migrations | PASS |
| Typecheck and production-mode client/server build | PASS |
| Ordinary/client-state/shared-input tests | **83 passed / 5 files** |
| B01 DB cases | **33 passed / 0 failed**, no failed suites |
| Auth real-DB regression | **28 passed / 0 failed** |
| G1 regression | **38 passed / 0 failed** |
| Data-preserving upgrade/rejection scenarios | **7/7 passed** |
| Compiled clean-clone HTTP login/create/detail/logout/replay | PASS: 201 create, identical persisted detail, 204 logout, 401 replay |
| Runner, graceful stop, container/credential/review-state cleanup | PASS, exit 0 |
| Clean-clone Git status | Clean |

See [final structured results](R1-B01-A-results.json) for exact UTC timestamps and case names. Reports contain no connection URLs, live review passwords or session tokens; case names may include explicit synthetic test fixtures. No existing developer database was reset or changed.

## Browser observations

Real Chromium used the compiled app with newly seeded disposable PostgreSQL. The browser timezone was explicitly set to **America/New_York**:

- Supervisor A opened Team A's empty milestone list, then the real dedicated create form. Whitespace-only title produced focused summary/field errors, retained the description/date and created no milestone.
- Entering `2030-11-08 23:59` as Bangkok time persisted **2030-11-08T16:59:00.000Z**. Another `2030-11-09 08:30` persisted **01:30:00.000Z**. Both details displayed the original Bangkok time including seconds 00 after navigation/reload. Authenticated GETs verified the saved values.
- The team track showed both records in dueAt order and linked to real details. Creation succeeded through the mandatory source/CSRF pipeline; direct missing/foreign-source checks are covered in the API suite.
- Student A1 read the track/detail, saw no create or inert submission action, and an actual POST returned **403**, with milestone count unchanged at **2 -> 2**.
- After logout/account switch, Supervisor B at the former Team A milestone URL saw a generic denial, with no Team A title/description/member data. Real GETs for foreign and missing UUIDs both returned **404 with equal bodies**.
- At 320px the track/detail had scrollWidth equal to viewport width. The dedicated form, required field hints/counters and monochrome detail/track were inspected. New code reuses the accepted A01 navigation/focus/session lifecycle.

Local ignored screenshots under `output/playwright/`: b01-create-mobile.png, b01-detail-desktop.png, b01-detail-mobile.png, b01-track-mobile.png. Browser automation attempts to capture a POST response after hard navigation were unreliable; the reported persistence/timezone assertions use the completed UI and authenticated GET results. These harness errors were not counted as passing tests or product RED evidence.

Limits: local Chromium/HTTP only; no public TLS/deployment, full screen-reader/load/cross-browser audit, F-03 submission/F-04 feedback journey or GitHub Actions CI gate is claimed. Latest-version fixtures test read-model association, not implemented revision endpoints.

## Review and closure boundary

B reviews the current A-authored correction in PR #56 and records real acceptance/merge into staging. Until then #6/#55 remain open and G2 stays pending. Original #52's old head is superseded by the correction, not approved or merged as if fixed. Preserve B's source branch/history and archive a closed, superseded card instead of claiming Done. After the accepted merge, verify native PR Done and reconcile Issue completion/Acceptance/G2 separately before A02/B02.
