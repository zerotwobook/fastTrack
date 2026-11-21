# R3-A01 supervisor summary verification

[Issue #28](https://github.com/zerotwobook/fastTrack/issues/28) and [PR #135](https://github.com/zerotwobook/fastTrack/pull/135) cover F-08A. A (`zerotwobook`) owns the change and B (`Atip-Infa`) reviews it. The implementation starts from `staging/sprint-3` at `06f5e8d`, which includes the F-08B drill-down.

## Author checks

| Execution | Tested source | Result |
| --- | --- | --- |
| `npm run typecheck` and `npm run build` | `9cb4997` | Both passed. |
| `npm test` | `9cb4997` | 214 passed in 17 files. |
| `npm run test:b01` with a fresh disposable PostgreSQL 16 database | `04ffd9b` | 57 passed in 5 files, including four new API/database cases and the five existing F-08B cases. The later source change only adjusts layout and table hints. |
| Chromium with the compiled client and server, disposable PostgreSQL, and real fixture sessions | `9cb4997` | Six verification groups passed. |

[Machine-readable results](R3-A01-summary-results.json) include the executed cases, viewport readings, and a synthetic API sample.

## API and database

The authenticated request `GET /api/summary?status=PENDING&page=2&pageSize=8` returned weighted completion of 1/10 (10.0%), team rates of 100.0% and 0.0%, nine matching pending milestones, and one item on page 2. The envelope time equaled the data snapshot time. Without a status filter, the cancelled milestone appeared in the list and remained excluded from completion.

The API tests check no-team and cancelled-only results, revisions, feedback on previous versions, overdue status, invalid and repeated fields, and equal generic responses for a missing or foreign team. One test writes a submission through a separate database connection between completion and item reads. The in-flight response stays consistent, and the next response includes the new submission. The test reads back PostgreSQL's read-only and repeatable-read transaction settings.

## Browser evidence

| Scenario | Capture |
| --- | --- |
| Weighted overview and the filtered second result page | [1280px](assets/s3-summary/weighted-overview-1280.png), [390px](assets/s3-summary/weighted-overview-390.png) |
| Empty page still shows matching count and keeps the original filters in the recovery links | [Empty requested page](assets/s3-summary/empty-requested-page-1280.png) |
| A status selection with zero matches keeps completion visible | [Zero matches](assets/s3-summary/zero-matches-1280.png) |
| A supervisor with no assigned teams sees a dedicated state | [No teams](assets/s3-summary/no-teams-1280.png) |
| Invalid input, pending request, and recoverable service error | [Invalid filter](assets/s3-summary/invalid-filter-1280.png), [Loading](assets/s3-summary/loading-1280.png), [Retryable error](assets/s3-summary/retryable-error-1280.png) |

Chromium exercised Back, Forward, reload, filter reset, page-size change, and the milestone return link. It held an actual response from the first supervisor until a second supervisor signed in, then confirmed that only the second supervisor's team rendered. The second supervisor received a generic unavailable page when opening the first supervisor's milestone. The student saw the restricted screen and received API status 403. The loading and retry captures use an intentionally delayed response and an injected HTTP 503.

Viewport widths of 320, 390, 640, 768, and 1280 CSS pixels had no page-level horizontal overflow. At phone widths the tables scroll independently, and keyboard focus remains visible. The 640px viewport represents the reflow width of a 1280px viewport at 200% zoom.

## Reproduce and review

1. From `Project_code/`, run `npm ci`, `npm run db:generate --workspace @fasttrack/server`, `npm run typecheck`, and `npm test`. Use the existing `npm run test:b01:isolated` runner to repeat the database cases with a disposable database.
2. In a disposable review environment, sign in as a supervisor with two teams and open **Summary**. Check the 1/1 plus 0/9 fixture in `server/src/testing/summary-overview.b01.ts` for the exact worked example setup. The review browser used equivalent data.
3. Select a team or status, change pages, open a milestone, and return. Check the result count and completion separately. Sign out and switch to a disjoint supervisor or a student to verify scope.

Peer acceptance and the deployed integration candidate are tracked through PR #135 and [Issue #30](https://github.com/zerotwobook/fastTrack/issues/30).
