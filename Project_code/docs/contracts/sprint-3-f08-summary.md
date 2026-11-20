# Sprint 3 F-08 summary contract

**Status:** Draft for A/B review under [R3-J00 #27](https://github.com/zerotwobook/fastTrack/issues/27).

**Baseline:** [v1.0.0-sprint-2](https://github.com/zerotwobook/fastTrack/tree/v1.0.0-sprint-2) at **f3ff8d9704c6e2a3705805412f538b2b216569ad**. Sprint 2 G6 was accepted in [#26](https://github.com/zerotwobook/fastTrack/issues/26). Main [CI](https://github.com/zerotwobook/fastTrack/actions/runs/44719877378) and the [deployment](https://github.com/zerotwobook/fastTrack/actions/runs/44719877524) passed. L7-STS-05 verified the new feedback limit and preserved exact-version association. Use the accepted [F-07 semantics](sprint-2-feature-interfaces.md#8-progress-projection-and-shared-calculation-f-07) and [project design](../../../Project_doc/project_detail.md#10-progress-และ-reporting-semantics) for FR-10, BR-02, BR-10, NFR-02 and NFR-05.

## Workflow and scope

A supervisor opens `/summary`, sees completion for all assigned teams, selects an optional team and milestone status, and opens a matching milestone. The view shows the completion totals separately from the number of matching milestones. Student navigation omits Summary. The server protects every summary read and the existing milestone detail read with the actor's real session and scope. Summary is a read-only projection of the existing Sprint 2 data model.

A owns F-08A, the coordinator, overview, filters, team rows and weighted totals in [#28](https://github.com/zerotwobook/fastTrack/issues/28). B owns F-08B, filtered rows, pagination and detail/back navigation in [#29](https://github.com/zerotwobook/fastTrack/issues/29). Both review the shared interface here before application implementation. [Integration #30](https://github.com/zerotwobook/fastTrack/issues/30) covers the combined workflow and Sprint 1/2 continuity.

## Summary API

Use a single `GET /api/summary` route for the overview and result pages. A page change, filter change or refresh requests a new response from this route. Follow the existing authenticated domain-read envelope and `Cache-Control: no-store` behavior.

| Query field | Accepted value and default |
| --- | --- |
| `teamId` | An optional canonical UUID, normalized to lowercase. Omit to select all teams assigned to the supervisor. |
| `status` | Optional exact value from `CANCELLED`, `FEEDBACK_AVAILABLE`, `SUBMITTED`, `OVERDUE` or `PENDING`. Omit to include all statuses in the matching items, including `CANCELLED`. |
| `page` | A positive decimal integer, default `1`. |
| `pageSize` | A positive decimal integer from `1` through `50`, default `20`. |

Each supplied parameter must be scalar and occur once. Reject unknown, empty, repeated, malformed and out-of-range values with `400 INVALID_INPUT` using the existing safe error envelope and field errors for invalid fields. Page fields accept only unsigned decimal digits with a positive result. Reject unsafe integer values and a page offset that is outside the safe integer range. A valid page beyond the last result returns an empty `items` array with the unchanged `matchedCount` and an echo of the requested page.

Check for a valid session first (`401`), then the supervisor role (`403`), then query validity (`400`). Resolve the selected team inside the authenticated supervisor scope. A well-formed missing or unassigned team yields the same generic `404 NOT_FOUND`. Each filtered read intersects the actor's actual team scope with the filter. A supervisor with no assigned teams receives `200` with zero counts and empty rows when the team filter is omitted.

~~~ts
type SummaryStatus = 'CANCELLED' | 'FEEDBACK_AVAILABLE' | 'SUBMITTED' | 'OVERDUE' | 'PENDING';

type SummaryFilters = {
  teamId: string | null;
  status: SummaryStatus | null;
  page: number;
  pageSize: number;
};

type SummaryTotals = {
  total: number;
  submitted: number;
  pending: number;
  overdue: number;
  progressPercent: number;
};

type SummaryResponse = {
  data: {
    asOf: string;
    filters: SummaryFilters;
    totals: SummaryTotals;
    matchedCount: number;
    teams: Array<SummaryTotals & { teamId: string; teamName: string }>;
    items: Array<{
      milestoneId: string;
      teamId: string;
      teamName: string;
      title: string;
      dueAt: string;
      status: SummaryStatus;
      latestVersion: number | null;
    }>;
  };
  meta: { serverTime: string };
};
~~~

Use ISO-8601 UTC timestamps, scoped IDs and the listed projection fields. Only expose names of authorized teams. The item route is derived from `milestoneId`. Team rows stay ordered by team name and ID. Item rows use `dueAt ASC, milestone ID ASC` across the entire matched set, before offset and limit. `matchedCount` is the size of that set before paging. Count and rows use the same predicates and snapshot.

## Reporting rules and timing

- Select teams first. Completion totals and team rows cover those teams across all status filters and pages. The status filter affects `matchedCount` and `items`.
- `total` counts non-cancelled milestones. `submitted` counts each of those milestones once if any version exists. A revision or a feedback entry does not increase the submission count. `pending` and `overdue` count the corresponding statuses within the selected active milestones, so `total = submitted + pending + overdue`.
- Compute `progressPercent` as `total === 0 ? 0 : Math.round(submitted * 1000 / total) / 10`. Combine the counts across teams before rounding. Format the resulting number with one decimal place in the UI.
- Use F-07 precedence. A cancelled milestone is `CANCELLED`. An active milestone with latest-version feedback is `FEEDBACK_AVAILABLE`, otherwise a saved submission is `SUBMITTED`. An unsubmitted active milestone is `OVERDUE` when `asOf > dueAt`, otherwise `PENDING`. Equality is pending. Feedback on an older version does not determine the latest status.
- The coordinator owns a single read-only repeatable-read transaction, verifies supervisor scope and obtains the database time once in that transaction. The aggregates, team rows, pre-pagination count and paged items use its transaction and `asOf`. Return the same instant in `meta.serverTime`. A subsequent request starts a new snapshot. Offset pages can shift between requests when records change.

## Review state

Review the paging, projection and integration seam with both owners in #27. This draft describes planned Sprint 3 work. The G0/G1 decision and implementation results will be recorded after the appropriate review and execution.
