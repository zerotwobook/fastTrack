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

## Peer verification and hosted D2 release

Atip-Infa independently repeated the isolated regression and F-08 UI, API and PostgreSQL checks against 84c4a31. The team accepted the local G2 result. The same application source reached main through reviewed PR #143 at merge commit 7872a739147f7553e16e05a4d40b5d0de0c21f27. Staging CI and main CI each recorded 483 passed, zero failed, zero skipped and 7/7 upgrade scenarios. [Integration Issue #30](https://github.com/zerotwobook/fastTrack/issues/30) · [Release PR #143](https://github.com/zerotwobook/fastTrack/pull/143) · [Main CI](https://github.com/zerotwobook/fastTrack/actions/runs/44885899889)

The protected deployment run 44888588070 succeeded after independent demo environment approval by Atip-Infa. Cloud Run migration execution fasttrack-migrate-4lvx5 succeeded. Revision fasttrack-app-00005-rkz serves 100% of traffic. Both public health and readiness returned HTTP 200 and the exact main SHA. Readiness reported the database connected.

| Artifact | SHA-256 digest |
| --- | --- |
| Pushed web OCI index | 7b868cd51b62db518dde4e22601930a9be7b8483bffb9409efd70742faf2c458 |
| Served linux/amd64 web image within the OCI index | 440b3a4ac8fc41c76e14e5b72defcf264f597c19a272dde2f481a9f5ee82269a |
| Migration jobs image | b49829f88464cc18f7aa6d2cb9be840e67cf9dd1b867eee18d3bf7e58ec4c718 |

[Deployment logs](https://github.com/zerotwobook/fastTrack/actions/runs/44888588070/job/136800312369) · [Hosted demo](https://fasttrack-app-kpx7au3w2a-as.a.run.app)

### Hosted readback and permissions

B's Chromium run verified Summary at 6/14 (42.9%), retained the team, overdue status, page 2 and page size through milestone detail return, and found the page-one recovery link on an out-of-range page. The student Summary request returned 403. The second supervisor saw only their assigned team and received generic 404 for the foreign Summary filter and milestone. A independently matched Summary totals against the scoped, database-backed milestone list and confirmed disjoint team lists and equivalent foreign and absent errors.

The assigned supervisor and team student read the original Sprint 1 team, milestone, submission and version-specific feedback. Their payloads matched the preserved C04 baseline during A's independent readback. B independently captured the readback and verified the canonical baseline fingerprint. Hosted checks used the application's scoped UI and HTTPS API. The isolated regression above includes direct PostgreSQL verification and a multi-team weighted aggregate. The pager wording remains a follow-up. The D2 tag is tracked in #33.

[Hosted readback JSON](R3-B02-d2-post-deploy-readback.json) · [C04 baseline JSON](R2-J01-C04-baseline.json) · [Reviewed Part E](https://github.com/zerotwobook/fastTrack/pull/142)
