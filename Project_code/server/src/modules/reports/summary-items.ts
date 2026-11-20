import { Prisma } from '../../db/generated/client/index.js';
import { AppError } from '../../http/errors.js';
import { requireUuid } from '../teams/model.js';

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

export type SummarySnapshot = Readonly<{
  tx: Prisma.TransactionClient;
  teamIds: readonly string[];
  asOf: Date;
  filters: Readonly<SummaryFilters>;
}>;

export type SummaryPage = Readonly<{
  matchedCount: number;
  items: readonly SummaryItem[];
}>;

export const SUMMARY_DEFAULT_PAGE = 1;
export const SUMMARY_DEFAULT_PAGE_SIZE = 20;
export const SUMMARY_MAX_PAGE_SIZE = 50;

const SUMMARY_STATUSES: ReadonlySet<SummaryStatus> = new Set([
  'CANCELLED',
  'FEEDBACK_AVAILABLE',
  'SUBMITTED',
  'OVERDUE',
  'PENDING',
]);

const POSTGRES_MAX_INT4 = 2_147_483_647;

function invalidSummaryInput(fields: Readonly<Record<string, string>>): never {
  throw new AppError(400, 'INVALID_INPUT', 'Check the summary filter parameters.', fields);
}

/** Validate paging bounds strictly, matching the F-08 contract even if called outside HTTP routing. */
export function assertValidSummaryPagination(filters: Readonly<SummaryFilters>): { page: number; pageSize: number; offset: number } {
  const fields: Record<string, string> = {};
  if (filters.status !== null && !SUMMARY_STATUSES.has(filters.status)) {
    fields['status'] = 'Choose a valid milestone status.';
  }
  if (!Number.isSafeInteger(filters.page) || filters.page < 1) {
    fields['page'] = 'Use a positive whole page number.';
  }
  if (!Number.isSafeInteger(filters.pageSize) || filters.pageSize < 1 || filters.pageSize > SUMMARY_MAX_PAGE_SIZE) {
    fields['pageSize'] = `Use a page size from 1 to ${SUMMARY_MAX_PAGE_SIZE}.`;
  }
  const offset = (filters.page - 1) * filters.pageSize;
  if (!fields['page'] && !fields['pageSize'] && (!Number.isSafeInteger(offset) || offset < 0)) {
    fields['page'] = 'Requested page offset is too large.';
  }
  if (Object.keys(fields).length > 0) {
    invalidSummaryInput(fields);
  }
  return { page: filters.page, pageSize: filters.pageSize, offset };
}

function normalizeScopedTeamIds(teamIds: readonly string[], requestedTeamId: string | null): string[] {
  const normalized = new Set<string>();
  for (const id of teamIds) {
    requireUuid(id);
    normalized.add(id.toLowerCase());
  }
  if (requestedTeamId !== null) {
    requireUuid(requestedTeamId);
    const wanted = requestedTeamId.toLowerCase();
    return normalized.has(wanted) ? [wanted] : [];
  }
  return [...normalized];
}

function statusCondition(status: SummaryStatus | null, asOf: Date): Prisma.Sql {
  if (status === null) return Prisma.sql`TRUE`;
  switch (status) {
    case 'CANCELLED':
      return Prisma.sql`m.cancelled_at IS NOT NULL`;
    case 'FEEDBACK_AVAILABLE':
      return Prisma.sql`m.cancelled_at IS NULL AND latest.version IS NOT NULL AND latest.has_feedback = TRUE`;
    case 'SUBMITTED':
      return Prisma.sql`m.cancelled_at IS NULL AND latest.version IS NOT NULL AND latest.has_feedback = FALSE`;
    case 'OVERDUE':
      return Prisma.sql`m.cancelled_at IS NULL AND latest.version IS NULL AND ${asOf}::timestamptz > m.due_at`;
    case 'PENDING':
      return Prisma.sql`m.cancelled_at IS NULL AND latest.version IS NULL AND ${asOf}::timestamptz <= m.due_at`;
  }
}

interface RawSummaryRow {
  milestoneId: string;
  teamId: string;
  teamName: string;
  title: string;
  dueAt: Date;
  status: SummaryStatus;
  latestVersion: number | null;
}

/**
 * Read the pre-pagination count and single ordered page of matching summary items inside
 * the caller's read-only repeatable-read transaction and snapshot `asOf`.
 */
export async function readSummaryItems(snapshot: SummarySnapshot): Promise<SummaryPage> {
  if (!(snapshot.asOf instanceof Date) || Number.isNaN(snapshot.asOf.getTime())) {
    throw new AppError(400, 'INVALID_INPUT', 'A valid snapshot timestamp is required.');
  }
  const { pageSize, offset } = assertValidSummaryPagination(snapshot.filters);
  const scopedTeamIds = normalizeScopedTeamIds(snapshot.teamIds, snapshot.filters.teamId);
  if (scopedTeamIds.length === 0) {
    return { matchedCount: 0, items: [] };
  }

  const teamIdLiterals = Prisma.join(scopedTeamIds.map(id => Prisma.sql`${id}::uuid`));
  const predicate = statusCondition(snapshot.filters.status, snapshot.asOf);

  const countRows = await snapshot.tx.$queryRaw<{ count: number }[]>`
    SELECT COUNT(*)::int AS count
    FROM milestones AS m
    LEFT JOIN LATERAL (
      SELECT
        s.version,
        EXISTS (SELECT 1 FROM feedback AS f WHERE f.submission_id = s.id) AS has_feedback
      FROM submissions AS s
      WHERE s.milestone_id = m.id
      ORDER BY s.version DESC
      LIMIT 1
    ) AS latest ON TRUE
    WHERE m.team_id IN (${teamIdLiterals})
      AND ${predicate}
  `;

  const matchedCount = countRows[0]?.count ?? 0;
  // Valid pages past the end return an empty page with unchanged matchedCount without Postgres int32 OFFSET overflow.
  if (matchedCount === 0 || offset >= matchedCount || offset > POSTGRES_MAX_INT4) {
    return { matchedCount, items: [] };
  }

  const rows = await snapshot.tx.$queryRaw<RawSummaryRow[]>`
    SELECT
      m.id::text AS "milestoneId",
      m.team_id::text AS "teamId",
      t.name AS "teamName",
      m.title AS "title",
      m.due_at AS "dueAt",
      CASE
        WHEN m.cancelled_at IS NOT NULL THEN 'CANCELLED'
        WHEN latest.version IS NOT NULL AND latest.has_feedback = TRUE THEN 'FEEDBACK_AVAILABLE'
        WHEN latest.version IS NOT NULL THEN 'SUBMITTED'
        WHEN ${snapshot.asOf}::timestamptz > m.due_at THEN 'OVERDUE'
        ELSE 'PENDING'
      END AS "status",
      latest.version AS "latestVersion"
    FROM milestones AS m
    JOIN teams AS t ON t.id = m.team_id
    LEFT JOIN LATERAL (
      SELECT
        s.version,
        EXISTS (SELECT 1 FROM feedback AS f WHERE f.submission_id = s.id) AS has_feedback
      FROM submissions AS s
      WHERE s.milestone_id = m.id
      ORDER BY s.version DESC
      LIMIT 1
    ) AS latest ON TRUE
    WHERE m.team_id IN (${teamIdLiterals})
      AND ${predicate}
    ORDER BY m.due_at ASC, m.id ASC
    LIMIT ${pageSize}
    OFFSET ${offset}
  `;

  return {
    matchedCount,
    items: rows.map(row => ({
      milestoneId: row.milestoneId,
      teamId: row.teamId,
      teamName: row.teamName,
      title: row.title,
      dueAt: row.dueAt instanceof Date ? row.dueAt.toISOString() : new Date(row.dueAt).toISOString(),
      status: row.status,
      latestVersion: row.latestVersion === null ? null : Number(row.latestVersion),
    })),
  };
}

