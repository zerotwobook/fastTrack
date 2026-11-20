# R3-J01 F-08 integration verification

The tested source is [staging candidate 84c4a31](https://github.com/zerotwobook/fastTrack/tree/84c4a31220898957be96c9a54cff0d6e37832821). It includes F-08B from [PR #134](https://github.com/zerotwobook/fastTrack/pull/134), F-08A from [PR #135](https://github.com/zerotwobook/fastTrack/pull/135), and the English project detail from [PR #137](https://github.com/zerotwobook/fastTrack/pull/137).

[Issues #28](https://github.com/zerotwobook/fastTrack/issues/28) and [#29](https://github.com/zerotwobook/fastTrack/issues/29) read Done / PASSED / ACCEPTED before verification. [Atip-Infa accepted the exact F-08A head](https://github.com/zerotwobook/fastTrack/pull/135#pullrequestreview-5996002975) and merged it to staging. G2 and the D2 candidate are tracked in [Issue #30](https://github.com/zerotwobook/fastTrack/issues/30).

## Automated baseline

Ran `npm run test:runtime:isolated` from `Project_code/` with the guarded PostgreSQL 16.8 fixture. Prisma generation, fresh and repeat migration, typecheck, and production build passed. Vitest recorded 483 passing cases, zero failures and zero skipped cases. All seven migration upgrade scenarios passed.

| Suite | Passed |
| --- | ---: |
| Unit and API contract | 214 |
| Foundation database, seed, and compiled client | 38 |
| Authentication and scoped sessions | 46 |
| Milestones, planning, and F-08 API/DB | 57 |
| Submission, team rules, and deadline regression | 54 |
| Feedback, exact-version access, and revision regression | 61 |
| Compiled original Sprint 1 journey and restart | 1 |
| Lab 5 runtime and database safeguards | 12 |

[Machine-readable regression results](R3-J01-regression-results.json)

## Real browser, API, and database

Ran Chromium against the compiled app and a separately migrated disposable PostgreSQL 16 database. The browser checked the exact source SHA through `GET /api/health`. All eight browser scenarios recorded in the result passed.

| Coverage | Observed result |
| --- | --- |
| Weighted completion and status filtering | For two supervised teams at 1/1 and 0/9, Summary rendered 10.0% and nine Pending matches. At page size 8, page 2 contained one milestone. The API returned the same totals and matching count, with matching `data.asOf` and `meta.serverTime`. |
| Pagination and return navigation | Team/status and page-size changes reset the page. Next, Back, Forward, reload, and a milestone return link restored the expected URL. Empty, no-match, invalid, and retryable states provided recovery. |
| Latest version and feedback | A milestone with versions 1 and 2 counted as submitted once. Its version 1 feedback appeared only on version 1, and the latest version remained Submitted. Navigation from older to latest preserved the Summary filter. |
| Refresh after a real submission | A signed-in fixture student submitted work through the real API and got HTTP 201. A supervisor refresh advanced `asOf`, moved completion from 1/10 (10.0%) to 2/10 (20.0%), and reduced Pending matches from 9 to 8. The second page became empty and the page-1 recovery link preserved the filter and page size. |
| Scope during account changes | An in-flight response from Supervisor A stayed hidden after switching to Supervisor B. Supervisor B saw only the assigned team and received the generic unavailable screen for Supervisor A's milestone. A student saw the restricted page and received HTTP 403 from the Summary API. |
| Responsive and keyboard behavior | Verified keyboard focus and no page-level overflow at 320, 390, 640, 768, and 1280 CSS pixels. At widths of 320 and 390, both tables scrolled internally. A 640px viewport exercises the reflow width of a 1280px viewport at 200% zoom. |

An independent PostgreSQL query counted two teams, ten active milestones, and one cancelled milestone both before and after the browser action. It measured one submitted and nine pending before the action, then two submitted and eight pending after it. It also confirmed one feedback row on version 1 and zero on version 2.

- [Weighted overview on page 2](assets/s3-j01/weighted-overview-1280.png) shows the Supervisor A fixture before the student submission on staging source 84c4a31. The expected and observed completion is 1/10, with one item on the second page.
- [Refresh after the submission](assets/s3-j01/refreshed-empty-page-1280.png) shows the same filter and page request after the write. The expected and observed completion is 2/10, with no item on page 2 and a link to page 1.
- [Machine-readable browser and independent database results](R3-J01-browser-results.json)

The out-of-range page keeps the requested page number in the pager label and can display “Page 2 of 1”. The empty state explains the changed result set and its page-1 link works. This wording is a follow-up for the drill-down UI.

## Production image and persistence checks

The clean-clone socket stage built the production runner and jobs targets from 84c4a31 and passed all 17 checks. It verified the local image source labels, real migration and repeat migration, secure cookies, the compiled Sprint 1 business flow, stable record IDs and a valid session after container restart and repeat seed, and independent health and readiness behavior during database failure. The [local container results](R3-J01-socket-results.json) record the exact image IDs and cleanup.

## Candidate and peer follow-up

Use 84c4a31 as the locally tested application source when preparing the D2 release candidate. The team still needs the joint G2 readback on this source. B compares the overview totals with the database and A reviews the drill-down results. The hosted candidate URL, registry image digest, serving revision and traffic, and post-deploy business and persistence checks remain pending. [Issue #30](https://github.com/zerotwobook/fastTrack/issues/30)
