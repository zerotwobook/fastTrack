export type SummaryStatus = 'CANCELLED' | 'FEEDBACK_AVAILABLE' | 'SUBMITTED' | 'OVERDUE' | 'PENDING';

export type SummaryFilters = {
  teamId: string | null;
  status: SummaryStatus | null;
  page: number;
  pageSize: number;
};

export type SummaryItem = {
  milestoneId: string;
  teamId: string;
  teamName: string;
  title: string;
  dueAt: string;
  status: SummaryStatus;
  latestVersion: number | null;
};

export const SUMMARY_DEFAULT_PAGE = 1;
export const SUMMARY_DEFAULT_PAGE_SIZE = 20;
export const SUMMARY_MAX_PAGE_SIZE = 50;

export const SUMMARY_STATUS_ORDER: readonly SummaryStatus[] = [
  'PENDING',
  'OVERDUE',
  'SUBMITTED',
  'FEEDBACK_AVAILABLE',
  'CANCELLED',
];

const UUID_PATTERN = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i;
const SUMMARY_ALLOWED_KEYS = new Set(['teamId', 'status', 'page', 'pageSize']);
const SUMMARY_STATUS_SET: ReadonlySet<string> = new Set(SUMMARY_STATUS_ORDER);

function parsePositiveDecimalInt(raw: string): number | null {
  if (!/^[0-9]+$/.test(raw)) return null;
  const parsed = Number(raw);
  if (!Number.isSafeInteger(parsed) || parsed < 1) return null;
  return parsed;
}

export type ParsedSummaryQuery =
  | { ok: true; filters: SummaryFilters }
  | { ok: false; errors: Readonly<Record<string, string>> };

/** Parse and validate `/summary` query strings under F-08 contract rules. */
export function parseSummarySearch(search: string): ParsedSummaryQuery {
  const query = search.startsWith('?') ? search.slice(1) : search;
  if (!query) {
    return {
      ok: true,
      filters: { teamId: null, status: null, page: SUMMARY_DEFAULT_PAGE, pageSize: SUMMARY_DEFAULT_PAGE_SIZE },
    };
  }

  const params = new URLSearchParams(query);
  const errors: Record<string, string> = {};
  const seen = new Set<string>();

  let teamId: string | null = null;
  let status: SummaryStatus | null = null;
  let page = SUMMARY_DEFAULT_PAGE;
  let pageSize = SUMMARY_DEFAULT_PAGE_SIZE;

  for (const [key, rawValue] of params.entries()) {
    if (!SUMMARY_ALLOWED_KEYS.has(key)) {
      errors['form'] = `Unsupported filter parameter "${key}".`;
      continue;
    }
    if (seen.has(key)) {
      errors[key] = `Specify "${key}" only once.`;
      continue;
    }
    seen.add(key);

    if (!rawValue) {
      errors[key] = `Provide a non-empty value for "${key}".`;
      continue;
    }

    if (key === 'teamId') {
      if (!UUID_PATTERN.test(rawValue)) {
        errors['teamId'] = 'Select a valid team identifier.';
      } else {
        teamId = rawValue.toLowerCase();
      }
    } else if (key === 'status') {
      if (!SUMMARY_STATUS_SET.has(rawValue)) {
        errors['status'] = 'Choose a valid milestone status.';
      } else {
        status = rawValue as SummaryStatus;
      }
    } else if (key === 'page') {
      const parsed = parsePositiveDecimalInt(rawValue);
      if (parsed === null) {
        errors['page'] = 'Use a positive whole page number.';
      } else {
        page = parsed;
      }
    } else if (key === 'pageSize') {
      const parsed = parsePositiveDecimalInt(rawValue);
      if (parsed === null || parsed > SUMMARY_MAX_PAGE_SIZE) {
        errors['pageSize'] = `Use a page size from 1 to ${SUMMARY_MAX_PAGE_SIZE}.`;
      } else {
        pageSize = parsed;
      }
    }
  }

  if (!errors['page'] && !errors['pageSize']) {
    const offset = (page - 1) * pageSize;
    if (!Number.isSafeInteger(offset)) {
      errors['page'] = 'Requested page offset is too large.';
    }
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  return { ok: true, filters: { teamId, status, page, pageSize } };
}

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
  if (!value || !value.startsWith('/') || value.startsWith('//') || /[\u0000-\u0020\\]/.test(value)) {
    return null;
  }
  try {
    const parsedUrl = new URL(value, 'https://fasttrack.invalid');
    if (parsedUrl.origin !== 'https://fasttrack.invalid' || parsedUrl.pathname !== '/summary' || parsedUrl.hash !== '') {
      return null;
    }
    const parsedQuery = parseSummarySearch(parsedUrl.search);
    if (!parsedQuery.ok) {
      return null;
    }
    return buildSummaryUrl(parsedQuery.filters);
  } catch {
    return null;
  }
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

