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

## Worked request and response

The example uses two assigned teams. Team A has one submitted milestone and one cancelled milestone. Team B has nine unsubmitted milestones with future deadlines. An omitted status would produce 11 matching items, including the cancelled milestone. The request below filters to nine pending items and asks for the second page of size eight.

~~~http
GET /api/summary?status=PENDING&page=2&pageSize=8
~~~

~~~json
{
  "data": {
    "asOf": "2026-11-20T06:00:00.000Z",
    "filters": { "teamId": null, "status": "PENDING", "page": 2, "pageSize": 8 },
    "totals": { "total": 10, "submitted": 1, "pending": 9, "overdue": 0, "progressPercent": 10 },
    "matchedCount": 9,
    "teams": [
      { "teamId": "00000000-0000-4000-8000-000000000001", "teamName": "Team A", "total": 1, "submitted": 1, "pending": 0, "overdue": 0, "progressPercent": 100 },
      { "teamId": "00000000-0000-4000-8000-000000000002", "teamName": "Team B", "total": 9, "submitted": 0, "pending": 9, "overdue": 0, "progressPercent": 0 }
    ],
    "items": [
      { "milestoneId": "00000000-0000-4000-8000-000000000029", "teamId": "00000000-0000-4000-8000-000000000002", "teamName": "Team B", "title": "Pending milestone 9", "dueAt": "2026-11-21T06:00:00.000Z", "status": "PENDING", "latestVersion": null }
    ]
  },
  "meta": { "serverTime": "2026-11-20T06:00:00.000Z" }
}
~~~

## Browser navigation and recovery

- Use the URL as the source of truth for `teamId`, `status`, `page` and `pageSize`. Changing a team, status or page size returns to page 1. Selecting a page alters only `page`. Canonical links may omit default values. Reload, browser Back/Forward and the milestone's return link restore the selected filters and page.
- Build a milestone link from its scoped ID. Carry the summary location through one `returnTo` value on the detail URL. After URL decoding, accept only the local `/summary` path with an optional query containing the four allowlisted and validated parameters. Reject absolute or network-path destinations, fragments, repeated or unsupported keys, and values that fail validation. Use a canonical relative URL built from the parsed fields. For invalid navigation input, use the existing breadcrumb and a safe `/summary` fallback for supervisors. The server always rechecks the requested milestone's scope.
- Label the full-scope numbers **Team completion** and the item count **Matching milestones**. Show the as-of time in the existing Bangkok display style. Format percentages to one decimal place. When the result set changes between pages, fetch current totals and items together. Display an empty-page state with a route back to the first valid page and preserve active filters.
- Distinguish loading, no assigned teams, zero matches, empty requested page, invalid filters and retryable errors. On sign-out or account/role change discard the previous actor's rows and pending results before rendering the new scope.
- Use English copy, labelled controls, readable status text, semantic table headers and clear keyboard focus. Reuse the established monochrome design and semantic status colors. Keep horizontal scrolling inside wide tables at narrow widths and 200% zoom.

## Shared implementation interfaces

The interface names below are proposed exports for the implementation. They describe the handoff across the two branches.

~~~ts
type SummarySnapshot = Readonly<{
  tx: Prisma.TransactionClient;
  teamIds: readonly string[];
  asOf: Date;
  filters: Readonly<SummaryFilters>;
}>;

type SummaryPage = Readonly<{
  matchedCount: number;
  items: readonly SummaryItem[];
}>;

readSummaryItems(snapshot: SummarySnapshot): Promise<SummaryPage>;
~~~

`SummaryItem` is the allowlisted item shape in the response above. The A-owned coordinator resolves the session-derived supervisor's teams and normalizes the filters before invoking B's export. It passes a scoped, read-only transaction client and one `asOf`. B computes the pre-page count and list from the same matching candidate set, uses the shared status rules, and returns its results without starting a second transaction or accepting raw browser scope. A assembles the envelope and owns reuse of the F-07 status and completion semantics. Preserve the existing F-07 API contract.

| Area | Owner and integration seam |
| --- | --- |
| API coordinator and route registration, shared response types, status helper and URL parameters | A owns changes and integration. B reviews the required fields and imports. |
| Matching count and paged items | B owns `server/src/modules/reports/summary-items.*` and provides `readSummaryItems` for A's `summary-service.*`. |
| Summary page and totals UI | A owns the page shell, team/status filters and the shared URL helper. A passes response items, count and pagination state to B's list. |
| Result list, page controls and detail return | B owns `client/src/features/summary/Drilldown*` and the integration with the existing milestone detail navigation. B uses A's shared URL helpers. |
| Schema and dependencies | The baseline reads existing tables and adds no migration or dependency. If implementation evidence shows a schema or index change is needed, B coordinates the proposal and migration with A review. A integrates shared router or manifest changes. |

## Acceptance criteria and planned tests

All F-08 results are planned. The team records actual command, commit and outcome after implementation.

| Criterion and traceability | Planned test and expected result | Owner |
| --- | --- | --- |
| F08-AC-01. Supervisor sees weighted completion within assigned teams. FR-10, BR-02, BR-10. | F08-STS-01, API/DB. Two assigned teams with 1/1 and 0/9 return totals 1/10 and 10.0%. A foreign team's milestones add nothing. Team rows agree with scoped stored data. | A |
| F08-AC-02. Completion and states follow F-07. BR-10. | F08-STS-02, unit and API/DB. Check zero teams, cancelled-only teams, exact deadline and +1 ms, revision history and old versus latest feedback. Keep cancelled items visible in an unfiltered query. Count each active submitted milestone once. | A |
| F08-AC-03. Filtering changes matches and preserves selected-team totals in one snapshot. FR-10, BR-10. | F08-STS-03, API/DB. Use the worked fixture with no filter, a status filter and a team filter. Coordinate a concurrent submission between the coordinator and items steps. One response stays internally consistent, and a later request reflects the new snapshot and as-of time. | A and B |
| F08-AC-04. Enforce actor scope and reject invalid filters. BR-02, NFR-02. | F08-STS-04, authenticated and anonymous API. Assert 401 for no session, 403 for Student, 400 for invalid parameters, and equal generic 404 responses for foreign and missing teams. Verify a foreign detail link is denied by the existing milestone API. | A and B |
| F08-AC-05. Pages are deterministic within a fixed fixture. FR-10. | F08-STS-05, API/DB. Use tied due times, default and max page sizes, first/last/beyond-last pages, and invalid forms such as zero and pageSize 51. Confirm sorted IDs occur once across fixed-fixture pages. Changing page size leaves `matchedCount` and totals unchanged. | B |
| F08-AC-06. Filters and page survive detail and browser navigation. FR-10, NFR-05. | F08-STS-06, browser and API. Filter, page, open a milestone, use the return link, Back/Forward and reload. Change filters from page 2 and confirm reset to 1. Verify invalid return destinations fall back safely. Refresh after a new submission and check the updated snapshot. | B with A |
| F08-AC-07. Account changes protect the previous scope. BR-02, NFR-02. | F08-STS-07, real-session browser. Switch from one supervisor to another with disjoint teams, including while a summary request is pending. Verify the new account sees only its teams and a foreign direct link stays denied. Check Student navigation and direct API access. | B |
| F08-AC-08. Summary and result pages stay usable at supported widths and zoom. NFR-05. | F08-STS-08, browser. Verify empty, error and retry states, labelled filters, keyboard focus, phone/tablet layout and 200% zoom. Compare the overview totals and item count with the authenticated response. | A and B |

## Definition of done and gate

- For #27, verify the accepted Sprint 2 tag and staging base, review this exact contract with A and B, and record the joint G0/G1 decision against the accepted contract commit.
- After G0/G1, implement #28 and #29 from the shared staging baseline with separate owners and reviewed PRs. Run the relevant API, database and browser tests using scoped fixtures and the shared rules.
- For #30, execute the integrated supervisor workflow, cross-team denials, Sprint 1/2 continuity and exact-version feedback checks. Record the tested and deployed candidate identity, results and open findings. Include an implemented and executed Sprint 3 workflow in D2.
