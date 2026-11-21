import { parseSummarySearch, SUMMARY_DEFAULT_PAGE, SUMMARY_DEFAULT_PAGE_SIZE } from '../../../../shared/summary.mjs';
import type { SummaryFilters } from '../../../../shared/summary.mjs';

export { parseSummarySearch, SUMMARY_DEFAULT_PAGE, SUMMARY_DEFAULT_PAGE_SIZE, SUMMARY_MAX_PAGE_SIZE, SUMMARY_STATUS_ORDER } from '../../../../shared/summary.mjs';
export type { ParsedSummaryQuery, SummaryFilters, SummaryItem, SummaryStatus } from '../../../../shared/summary.mjs';

/** Build a canonical relative `/summary` path omitting default `page` / `pageSize` / null filters. */
export function buildSummaryUrl(filters: Partial<SummaryFilters>): string {
  const params = new URLSearchParams();
  if (filters.teamId) {
    params.set('teamId', filters.teamId.toLowerCase());
  }
  if (filters.status) {
    params.set('status', filters.status);
  }
  if (filters.page !== undefined && filters.page !== SUMMARY_DEFAULT_PAGE) {
    params.set('page', String(filters.page));
  }
  if (filters.pageSize !== undefined && filters.pageSize !== SUMMARY_DEFAULT_PAGE_SIZE) {
    params.set('pageSize', String(filters.pageSize));
  }
  const encoded = params.toString();
  return encoded ? `/summary?${encoded}` : '/summary';
}

/**
 * Accept only a validated local `/summary` path (no foreign origin, protocol-relative URL,
 * backslash, control characters, hash fragment, or unsupported/invalid query parameters).
 */
export function sanitizeSummaryReturnTo(value: string | null): string | null {
  const summaryPath = '/summary';
  if (!value || (value !== summaryPath && !value.startsWith(summaryPath + '?')) || /[\u0000-\u0020\\#]/.test(value)) {
    return null;
  }
  const parsedQuery = parseSummarySearch(value.slice(summaryPath.length));
  return parsedQuery.ok ? buildSummaryUrl(parsedQuery.filters) : null;
}

export function readSummaryReturnTo(search: string): string | null {
  const values = new URLSearchParams(search).getAll('returnTo');
  if (values.length > 1) return ''; // Treat multiple destinations as an invalid return parameter.
  return values[0] ?? null;
}

export function buildMilestoneDetailHref(milestoneId: string, summaryReturnTo?: string | null): string {
  const base = `/milestones/${milestoneId}`;
  const safeReturn = sanitizeSummaryReturnTo(summaryReturnTo ?? null);
  return safeReturn ? `${base}?returnTo=${encodeURIComponent(safeReturn)}` : base;
}

export function buildSubmissionDetailHref(submissionId: string, summaryReturnTo?: string | null): string {
  const base = `/submissions/${submissionId}`;
  const safeReturn = sanitizeSummaryReturnTo(summaryReturnTo ?? null);
  return safeReturn ? `${base}?returnTo=${encodeURIComponent(safeReturn)}` : base;
}

export interface DetailSummaryNavigation {
  readonly hasReturnParam: boolean;
  readonly summaryHref: string | null;
  readonly fallbackHref: string | null;
}

/** Resolve supervisor-only `/summary` return navigation from detail route `?returnTo=...`. */
export function resolveDetailSummaryNavigation(
  rawReturnTo: string | null,
  userRole: 'student' | 'supervisor' | undefined,
): DetailSummaryNavigation {
  if (userRole !== 'supervisor' || rawReturnTo === null) {
    return { hasReturnParam: false, summaryHref: null, fallbackHref: null };
  }
  const safe = sanitizeSummaryReturnTo(rawReturnTo);
  if (safe !== null) {
    return { hasReturnParam: true, summaryHref: safe, fallbackHref: safe };
  }
  return { hasReturnParam: true, summaryHref: null, fallbackHref: '/summary' };
}

export function totalSummaryPages(matchedCount: number, pageSize: number): number {
  if (matchedCount <= 0 || pageSize <= 0) return 0;
  return Math.ceil(matchedCount / pageSize);
}
