# Lab 7 B-side GREEN evidence and peer handoff

[Issue #24](https://github.com/zerotwobook/fastTrack/issues/24) · [Issue #25](https://github.com/zerotwobook/fastTrack/issues/25) · [PR #128](https://github.com/zerotwobook/fastTrack/pull/128)

## Reviewed contract and baseline

- **Reviewed contract & RED baseline**: Reviewed A's [Lab 7 feedback length contract](../contracts/lab-7-feedback-limit.md) (`b46b7de`), pre-change RED test commit `e3758fb541e48716545868c6f435907b83a67aec`, and RED handoff commit `7d8f990e5caa7423e0ef2d66698cff7a17abb5ca` ([A RED evidence](R2-A05-lab7-red.md)).
- **GREEN implementation commit**: [`2368d71813541bacc0bc9b9ecba58b3ae9ea7c86`](https://github.com/zerotwobook/fastTrack/commit/2368d71813541bacc0bc9b9ecba58b3ae9ea7c86) on branch `maintenance/lab7-feedback-limit`.
- **Passing CI on GREEN commit**: [`CI & Docker Build` run `44675948834`](https://github.com/zerotwobook/fastTrack/actions/runs/44675948834) (`test-and-docker`, `success` in `2m40s`, `postgres:16.8`, artifact `ci-runtime-report`).

## Implemented changes (`2368d71`)

- **Shared validation**: Updated `FEEDBACK_LIMITS.CONTENT_MAX_CHARS` from `4000` to `6000` in [feedback.mjs](../../shared/feedback.mjs) while preserving Unicode whitespace trimming, code-point counting (`Array.from`), null/unpaired-surrogate rejection, and `1`-code-point minimum.
- **UI hint and live counter**: Updated [FeedbackPanel.tsx](../../client/src/features/feedback/FeedbackPanel.tsx) to import `FEEDBACK_LIMITS` and display `"Use 1 to 6,000 characters. Feedback stays with this version."` plus `{count} / 6,000 characters` with client-side rejection above `6,000`.
- **Route-scoped transport allowance**: Added a bounded `express.json({ limit: '96kb', strict: true })` parser (`parseFeedbackJsonBody`) scoped strictly to `POST /api/submissions/:id/feedback` in [feedback router.ts](../../server/src/modules/feedback/router.ts) after `requireSession -> requireSupervisor -> requireMutation -> requireJsonBody`, preserving the shared `64kb` limit in [errors.ts](../../server/src/http/errors.ts) for all other routes.
- **Schema and forward migration**: Updated `Feedback.content` to `@db.VarChar(6000)` in [schema.prisma](../../server/prisma/schema.prisma) and added forward migration [20261120042000_lab7_feedback_content_6000](../../server/prisma/migrations/20261120042000_lab7_feedback_content_6000/migration.sql) widening `feedback.content` and `feedback_content_bounds` to `BETWEEN 1 AND 6000` with the identical Unicode whitespace trim set.
- **Updated regression controls**: Updated `4001` overflow assertions to `6001` (retaining `4000` compatibility controls) in [feedback input.test.ts](../../client/src/features/feedback/input.test.ts), [feedback.b02.ts](../../server/src/modules/feedback/feedback.b02.ts), [feedback-review.b02.ts](../../server/src/testing/feedback-review.b02.ts), and [foundation-safety.g1.ts](../../server/src/testing/foundation-safety.g1.ts), and added `L7-STS-03/04` coverage for the `96kb` feedback cap vs `64kb` shared route cap, foreign supervisor (`404`), student (`403`), `clientRequestId` replay (`200`/`409 REQUEST_KEY_REUSED`), and `6,000`-point feedback staying attached to `v1` alongside `v2`.

## GREEN test and migration results

| Check | Environment | Command / source | Actual observed result |
| --- | --- | --- | --- |
| CI isolated regression (`npm run test:runtime:isolated`) | GitHub Actions Linux, Docker `postgres:16.8` | [Run `44675948834`](https://github.com/zerotwobook/fastTrack/actions/runs/44675948834) (`ci-runtime-report`) | **`458` passed, `0` failed** (`198` unit/API, `38` G1, `46` auth, `48` B01, `54` A02, `61` B02, `1` J03, `12` runtime); **`7/7` legacy upgrade scenarios passed**; typecheck, build, and Docker runner/jobs builds passed. |
| Local PostgreSQL regression & `test:b02` equivalence | Windows, disposable `PostgreSQL 14.23` (`UTC`) | Local harness running `vitest.b02.config.ts` plus all G1..A01 suites (`Docker` daemon stopped locally) | Identical counts: **`458` passed, `0` failed** (`61/61` in `test:b02`, `38/38` G1, `46/46` auth, `48/48` B01, `54/54` A02, `1/1` J03, `12/12` runtime, `198/198` unit/API). *(Local Docker execution replaced by CI run `44675948834`.)* |
| Disposable pre-change migration upgrade | Disposable `PostgreSQL 14.23` (`upgrade` DB) | Pre-Lab-7 migrations seeded with multi-version `v1`/`v2` + `4,000`-char & legacy `v1` feedback -> `prisma migrate deploy` | Exit `0`: existing `2` feedback rows and their `v1` `submission_id` links preserved byte-for-byte; `feedback.content` `character_maximum_length = 6000`; `feedback_content_bounds` updated (`1..6000`); post-migration `6,000` astral emoji insert succeeded; `6,001` insert rejected by SQL constraint. |
| Chromium browser boundary & version check | Compiled Express/Vite + Chromium Playwright (`PostgreSQL 14.23` `UTC`) | Interactive UI verification on `/submissions/:v1Id` with `v2` present | Hint & live counter displayed `/ 6,000 characters`; `6,000` trimmed mixed emoji/whitespace and `5,999` emoji saved cleanly and read back on `v1` (`v2` feedback stayed `0`); `6,001` displayed `"Feedback content cannot exceed 6000 characters."` with zero new DB row; student readback confirmed `v1` feedback retained and `v2` clean (`0` page errors). |

## B's metrics inputs for the Lab 7 report

Complementing A's `L7-M01`–`L7-M03` metrics in [R2-A05-lab7-red.md](R2-A05-lab7-red.md) (snapshot `20 November 2026, 11:43 Asia/Bangkok` / `04:43 UTC`):

| Evidence ID | Measure and scope | Value and source |
| --- | --- | --- |
| `L7-M04` | UAT defects opened / resolved in independent Sprint 1 CoursePMS UAT (`UAT-01`–`UAT-08` on `main@8e637e5`, 18–19 Nov 2026) and separate Section 3.5 simulated deadline exercise. | **Product UAT: `0` opened, `0` unresolved** (`8/8 PASS`; 1 automation script count bug invalidated cleanly). **Controlled Section 3.5 exercise: `1` opened, `1` resolved** ([PR #115](https://github.com/zerotwobook/fastTrack/pull/115), `16/16` partner retests). [CoursePMS session](../../../docs/labs/lab-06/sessions/2026-11-18-coursepms-fasttrack-returned-results.md) · [Lab 6 closeout](../../../docs/labs/lab-06/sessions/2026-11-19-lab6-closeout.md). |
| `L7-M05` | `CI & Docker Build` workflow run outcomes across Sprint 2 / Lab 7 window (`2026-11-19T00:00:00Z`–`2026-11-20T04:43:00Z`, `38` completed runs) and all recorded runs (`149` completed runs, `2026-11-10T08:17:53Z`–`2026-11-20T04:40:11Z`). | **Sprint 2 / Lab 7 window: `34/38` passed (`89.5%`), `2` failed** (deliberate RED runs `44672187909` at `e3758fb` and `44672653191` at `7d8f990`), **`2` cancelled** (`44671938323`, `44552042274`). **All-time repo CI: `133/149` passed (`89.3%`), `9` failed, `7` cancelled.** **Lab 7 branch (`4` runs): `1` cancelled, `2` intentional RED, `1` GREEN (`44675948834`).** |

## Handoff to A

1. PR #128 is ready for A's review of the production diff, forward migration, updated boundary tests, and CI run [`44675948834`](https://github.com/zerotwobook/fastTrack/actions/runs/44675948834) on `2368d71813541bacc0bc9b9ecba58b3ae9ea7c86`.
2. Coordinate whether `maintenance/lab7-feedback-limit` merges into `staging/sprint-2` after vs. alongside the Sprint 2 G6 `main` release candidate ([Issue #26](https://github.com/zerotwobook/fastTrack/issues/26)), and complete post-deploy verification (`L7-STS-05`) once deployed to Cloud Run under the [main release gate](../../../workflow/MAIN_RELEASE_GATE.md).
