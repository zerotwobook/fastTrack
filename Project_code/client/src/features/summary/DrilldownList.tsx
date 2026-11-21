import type { MouseEvent, ReactNode } from 'react';
import { Button, EmptyState, StatusBadge } from '../../design/components';
import type { StatusVariant } from '../../design/components';
import { Icon } from '../../design/Icon';
import { formatBangkok } from '../milestones/MilestoneTrack';
import {
  buildMilestoneDetailHref,
  buildSummaryUrl,
  totalSummaryPages,
} from './navigation';
import type { DetailSummaryNavigation, SummaryFilters, SummaryItem, SummaryStatus } from './navigation';
import styles from './drilldown.module.css';

const STATUS_BADGE_MAP: Record<SummaryStatus, StatusVariant> = {
  PENDING: 'pending',
  OVERDUE: 'overdue',
  SUBMITTED: 'submitted',
  FEEDBACK_AVAILABLE: 'feedback',
  CANCELLED: 'cancelled',
};

const PAGE_SIZE_OPTIONS = [10, 20, 50] as const;

export interface DrilldownListProps {
  asOf: string | null;
  filters: SummaryFilters;
  matchedCount: number;
  items: readonly SummaryItem[];
  loading?: boolean;
  error?: string | null;
  invalidFilters?: Readonly<Record<string, string>> | null;
  hasTeams?: boolean;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  onRetry?: () => void;
  onResetFilters?: () => void;
}

function formatMatchCount(matchedCount: number): string {
  return `${matchedCount} matching ${matchedCount === 1 ? 'milestone' : 'milestones'}`;
}

function computePageNumbers(currentPage: number, totalPages: number): number[] {
  if (totalPages <= 1) return totalPages === 1 ? [1] : [];
  const start = Math.max(1, currentPage - 2);
  const end = Math.min(totalPages, currentPage + 2);
  const pages: number[] = [];
  for (let p = start; p <= end; p++) pages.push(p);
  return pages;
}

/**
 * Filtered drill-down table, bounded pagination controls, empty-page recovery,
 * and filter-preserving milestone detail navigation (F-08B / Issue #29).
 */
export function DrilldownList({
  asOf,
  filters,
  matchedCount,
  items,
  loading = false,
  error = null,
  invalidFilters = null,
  hasTeams = true,
  onPageChange,
  onPageSizeChange,
  onRetry,
  onResetFilters,
}: DrilldownListProps) {
  const currentSummaryUrl = buildSummaryUrl(filters);
  const totalPages = totalSummaryPages(matchedCount, filters.pageSize);
  const pageNumbers = computePageNumbers(filters.page, totalPages);
  const startIndex = items.length > 0 ? (filters.page - 1) * filters.pageSize + 1 : 0;
  const endIndex = items.length > 0 ? startIndex + items.length - 1 : 0;
  const selectablePageSizes = PAGE_SIZE_OPTIONS.includes(filters.pageSize as 10 | 20 | 50)
    ? [...PAGE_SIZE_OPTIONS]
    : [...PAGE_SIZE_OPTIONS, filters.pageSize].sort((a, b) => a - b);

  const handlePageLinkClick = (event: MouseEvent<HTMLAnchorElement>, targetPage: number) => {
    if (!onPageChange) return;
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }
    event.preventDefault();
    onPageChange(targetPage);
  };

  const handleResetClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!onResetFilters) return;
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }
    event.preventDefault();
    onResetFilters();
  };

  if (invalidFilters && Object.keys(invalidFilters).length > 0) {
    const messages = Object.values(invalidFilters);
    return (
      <section className={styles.section} aria-labelledby="drilldown-heading">
        <div className={styles.header}>
          <h2 id="drilldown-heading">Matching milestones</h2>
        </div>
        <div className={styles.notice} role="alert">
          <p>{messages[0] ?? 'The requested summary filters are invalid.'}</p>
          <a className={styles.openLink} href="/summary" onClick={handleResetClick}>
            Reset summary filters
          </a>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.section} aria-labelledby="drilldown-heading" aria-busy={loading || undefined}>
      <div className={styles.header}>
        <div>
          <h2 id="drilldown-heading">Matching milestones</h2>
          {asOf && !loading && !error && (
            <p className={styles.asOf}>
              Snapshot as of <time dateTime={asOf}>{formatBangkok(asOf)}</time>.
            </p>
          )}
        </div>
        {!loading && !error && hasTeams && (
          <p className={styles.countSummary} role="status">
            {items.length > 0
              ? `Showing ${startIndex}\u2013${endIndex} of ${formatMatchCount(matchedCount)}`
              : formatMatchCount(matchedCount)}
          </p>
        )}
      </div>

      {error ? (
        <div className={styles.notice} role="alert">
          <p>{error}</p>
          <div className={styles.recoveryLinks}>
            {onRetry && (
              <Button type="button" variant="secondary" onClick={onRetry}>
                Try again
              </Button>
            )}
            <a className={styles.openLink} href="/summary" onClick={handleResetClick}>
              Reset filters
            </a>
          </div>
        </div>
      ) : loading ? (
        <p role="status">Loading matching milestones…</p>
      ) : !hasTeams ? (
        <EmptyState
          title="No supervised teams yet"
          description="Create a team to track milestone progress and drill down into items."
        />
      ) : matchedCount === 0 ? (
        <EmptyState
          title="No matching milestones"
          description={
            filters.teamId || filters.status
              ? 'No milestones match the selected team or status filter.'
              : 'Your assigned teams have not scheduled any milestones yet.'
          }
          action={
            filters.teamId || filters.status ? (
              <a className={styles.openLink} href="/summary" onClick={handleResetClick}>
                Clear filters
              </a>
            ) : undefined
          }
        />
      ) : items.length === 0 ? (
        <EmptyState
          title={`No milestones on page ${filters.page}`}
          description={`There ${matchedCount === 1 ? 'is' : 'are'} ${formatMatchCount(matchedCount)} across ${totalPages} ${totalPages === 1 ? 'page' : 'pages'}. Active filters are preserved.`}
          action={
            <div className={styles.recoveryLinks}>
              <a
                className={styles.openLink}
                href={buildSummaryUrl({ ...filters, page: totalPages })}
                onClick={event => handlePageLinkClick(event, totalPages)}
              >
                Go to page {totalPages}
              </a>
              {totalPages > 1 && (
                <a
                  className={styles.openLink}
                  href={buildSummaryUrl({ ...filters, page: 1 })}
                  onClick={event => handlePageLinkClick(event, 1)}
                >
                  Go to page 1
                </a>
              )}
            </div>
          }
        />
      ) : (
        <>
          <p className={styles.scrollHint} id="drilldown-scroll-hint">
            Scroll the table horizontally on smaller screens to inspect all columns.
          </p>
          <div
            className={styles.tableContainer}
            role="region"
            aria-labelledby="drilldown-heading"
            aria-describedby="drilldown-scroll-hint"
            tabIndex={0}
          >
            <table className={styles.table}>
              <caption className={styles.srOnly}>
                Matching milestones ordered by deadline and milestone identifier
              </caption>
              <thead>
                <tr>
                  <th scope="col">Milestone</th>
                  <th scope="col">Team</th>
                  <th scope="col">Deadline</th>
                  <th scope="col">Status</th>
                  <th scope="col">Latest submission</th>
                  <th scope="col">Details</th>
                </tr>
              </thead>
              <tbody>
                {items.map(item => {
                  const detailHref = buildMilestoneDetailHref(item.milestoneId, currentSummaryUrl);
                  return (
                    <tr key={item.milestoneId}>
                      <td className={styles.titleCell}>
                        <a className={styles.titleLink} href={detailHref}>
                          {item.title}
                        </a>
                      </td>
                      <td className={styles.teamCell}>{item.teamName}</td>
                      <td className={styles.dateCell}>
                        <time dateTime={item.dueAt}>{formatBangkok(item.dueAt)}</time>
                      </td>
                      <td>
                        <StatusBadge status={STATUS_BADGE_MAP[item.status]} />
                      </td>
                      <td className={styles.versionCell}>
                        {item.latestVersion !== null ? `Version ${item.latestVersion}` : 'None'}
                      </td>
                      <td>
                        <a className={styles.openLink} href={detailHref}>
                          Open milestone
                          <Icon name="arrowRight" size={16} />
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {!error && !loading && hasTeams && (matchedCount > 0 || filters.page > 1) && (
        <div className={styles.controls}>
          <label className={styles.pageSizeField} htmlFor="summary-page-size">
            <span>Items per page</span>
            <select
              id="summary-page-size"
              className={styles.pageSizeSelect}
              value={String(filters.pageSize)}
              onChange={event => {
                const nextSize = Number(event.target.value);
                if (onPageSizeChange) {
                  onPageSizeChange(nextSize);
                } else {
                  location.assign(buildSummaryUrl({ ...filters, page: 1, pageSize: nextSize }));
                }
              }}
            >
              {selectablePageSizes.map(size => (
                <option key={size} value={String(size)}>
                  {size}
                </option>
              ))}
            </select>
          </label>

          {totalPages > 0 && (
            <nav className={styles.pagination} aria-label="Result pages">
              {filters.page > 1 ? (
                <a
                  className={styles.pageLink}
                  href={buildSummaryUrl({ ...filters, page: Math.min(filters.page - 1, totalPages) })}
                  onClick={event => handlePageLinkClick(event, Math.min(filters.page - 1, totalPages))}
                >
                  Previous
                </a>
              ) : (
                <span className={styles.pageLinkDisabled} aria-disabled="true">
                  Previous
                </span>
              )}

              {pageNumbers.map(pageNumber => (
                <a
                  key={pageNumber}
                  className={styles.pageLink}
                  href={buildSummaryUrl({ ...filters, page: pageNumber })}
                  aria-current={pageNumber === filters.page ? 'page' : undefined}
                  aria-label={`Page ${pageNumber}`}
                  onClick={event => handlePageLinkClick(event, pageNumber)}
                >
                  {pageNumber}
                </a>
              ))}

              <span className={styles.pageStatus}>
                Page {filters.page} of {totalPages}
              </span>

              {filters.page < totalPages ? (
                <a
                  className={styles.pageLink}
                  href={buildSummaryUrl({ ...filters, page: filters.page + 1 })}
                  onClick={event => handlePageLinkClick(event, filters.page + 1)}
                >
                  Next
                </a>
              ) : (
                <span className={styles.pageLinkDisabled} aria-disabled="true">
                  Next
                </span>
              )}
            </nav>
          )}
        </div>
      )}
    </section>
  );
}

/** Shared breadcrumb preserving supervisor summary filters when entering detail screens. */
export function SummaryDetailBreadcrumb({
  summaryNav,
  children,
}: {
  summaryNav: DetailSummaryNavigation;
  children: ReactNode;
}) {
  if (summaryNav.summaryHref) {
    return (
      <p className="breadcrumb">
        <a href={summaryNav.summaryHref}>Back to summary</a> / {children}
      </p>
    );
  }
  if (summaryNav.fallbackHref) {
    return (
      <p className="breadcrumb">
        {children} &middot; <a href={summaryNav.fallbackHref}>Back to summary</a>
      </p>
    );
  }
  return <p className="breadcrumb">{children}</p>;
}

/** Shared recovery actions appending a validated or fallback summary return link on errors. */
export function SummaryRecoveryLinks({ summaryNav }: { summaryNav: DetailSummaryNavigation }) {
  return (
    <div className="recovery-actions">
      {summaryNav.fallbackHref && <a href={summaryNav.fallbackHref}>Back to summary</a>}
      <a href="/">Back to overview</a>
    </div>
  );
}
