export type SummaryStatus = 'CANCELLED' | 'FEEDBACK_AVAILABLE' | 'SUBMITTED' | 'OVERDUE' | 'PENDING';

export interface SummaryFilters {
  teamId: string | null;
  status: SummaryStatus | null;
  page: number;
  pageSize: number;
}

export interface SummaryItem {
  milestoneId: string;
  teamId: string;
  teamName: string;
  title: string;
  dueAt: string;
  status: SummaryStatus;
  latestVersion: number | null;
}

export interface SummaryTotals {
  total: number;
  submitted: number;
  pending: number;
  overdue: number;
  progressPercent: number;
}

export interface SummaryTeam extends SummaryTotals {
  teamId: string;
  teamName: string;
}

export interface SummaryData {
  asOf: string;
  filters: SummaryFilters;
  totals: SummaryTotals;
  matchedCount: number;
  teams: readonly SummaryTeam[];
  items: readonly SummaryItem[];
}

export interface SummaryResponse {
  data: SummaryData;
  meta: { serverTime: string };
}

export type ParsedSummaryQuery =
  | { ok: true; filters: SummaryFilters }
  | { ok: false; errors: Readonly<Record<string, string>> };

export const SUMMARY_DEFAULT_PAGE: 1;
export const SUMMARY_DEFAULT_PAGE_SIZE: 20;
export const SUMMARY_MAX_PAGE_SIZE: 50;
export const SUMMARY_STATUS_ORDER: readonly SummaryStatus[];
export function parseSummarySearch(search: string): ParsedSummaryQuery;
