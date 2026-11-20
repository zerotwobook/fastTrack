export const SUMMARY_DEFAULT_PAGE = 1;
export const SUMMARY_DEFAULT_PAGE_SIZE = 20;
export const SUMMARY_MAX_PAGE_SIZE = 50;

export const SUMMARY_STATUS_ORDER = Object.freeze([
  'PENDING',
  'OVERDUE',
  'SUBMITTED',
  'FEEDBACK_AVAILABLE',
  'CANCELLED',
]);

const UUID_PATTERN = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i;
const ALLOWED_KEYS = new Set(['teamId', 'status', 'page', 'pageSize']);

function parsePositiveInteger(value) {
  if (!/^[0-9]+$/.test(value)) return null;
  const number = Number(value);
  return Number.isSafeInteger(number) && number > 0 ? number : null;
}

/** Apply the same F-08 query contract in the browser and on the API. */
export function parseSummarySearch(search) {
  const params = new URLSearchParams(search);
  const errors = {};
  const seen = new Set();
  const filters = { teamId: null, status: null, page: SUMMARY_DEFAULT_PAGE, pageSize: SUMMARY_DEFAULT_PAGE_SIZE };

  for (const [key, value] of params) {
    if (!ALLOWED_KEYS.has(key)) {
      errors.form = 'Use only the supported summary filters.';
      continue;
    }
    if (seen.has(key)) {
      errors[key] = 'Specify this filter only once.';
      continue;
    }
    seen.add(key);

    if (key === 'teamId') {
      if (UUID_PATTERN.test(value)) filters.teamId = value.toLowerCase();
      else errors.teamId = 'Select a valid team identifier.';
    } else if (key === 'status') {
      if (SUMMARY_STATUS_ORDER.includes(value)) filters.status = value;
      else errors.status = 'Choose a valid milestone status.';
    } else if (key === 'page') {
      const page = parsePositiveInteger(value);
      if (page === null) errors.page = 'Use a positive whole page number.';
      else filters.page = page;
    } else {
      const pageSize = parsePositiveInteger(value);
      if (pageSize === null || pageSize > SUMMARY_MAX_PAGE_SIZE) {
        errors.pageSize = 'Use a page size from 1 to 50.';
      } else {
        filters.pageSize = pageSize;
      }
    }
  }

  if (!errors.page && !errors.pageSize && !Number.isSafeInteger((filters.page - 1) * filters.pageSize)) {
    errors.page = 'Requested page offset is too large.';
  }

  return Object.keys(errors).length > 0 ? { ok: false, errors } : { ok: true, filters };
}
