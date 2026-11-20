import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { DrilldownList } from './DrilldownList';
import type { SummaryFilters, SummaryItem } from './navigation';

const TEAM_ID = '11111111-1111-4111-8111-111111111111';
const MILESTONE_ID = '22222222-2222-4222-8222-222222222222';
const AS_OF = '2026-11-20T06:00:00.000Z';

const baseFilters: SummaryFilters = {
  teamId: TEAM_ID,
  status: 'PENDING',
  page: 2,
  pageSize: 8,
};

const sampleItems: SummaryItem[] = [
  {
    milestoneId: MILESTONE_ID,
    teamId: TEAM_ID,
    teamName: 'Team Alpha',
    title: 'Design contract review',
    dueAt: '2026-11-22T06:00:00.000Z',
    status: 'PENDING',
    latestVersion: null,
  },
];

describe('F-08B DrilldownList states, semantics, and recovery navigation', () => {
  it('renders semantic table rows, matching count, asOf, encoded returnTo links, and pagination links', () => {
    const html = renderToStaticMarkup(
      createElement(DrilldownList, {
        asOf: AS_OF,
        filters: baseFilters,
        matchedCount: 9,
        items: sampleItems,
      }),
    );

    const expectedReturn = encodeURIComponent(`/summary?teamId=${TEAM_ID}&status=PENDING&page=2&pageSize=8`);
    expect(html).toContain('Matching milestones');
    expect(html).toContain('Showing 9–9 of 9 matching milestones');
    expect(html).toContain(`href="/milestones/${MILESTONE_ID}?returnTo=${expectedReturn}"`);
    expect(html).toContain('Design contract review');
    expect(html).toContain('Team Alpha');
    expect(html).toContain('Page 2 of 2');
    expect(html).toContain('aria-current="page"');
    expect(html).toContain(`href="/summary?teamId=${TEAM_ID}&amp;status=PENDING&amp;pageSize=8"`);
    expect(html).toContain('<option value="8" selected="">8</option>');
  });

  it('renders empty requested page recovery links while preserving active team and status filters', () => {
    const html = renderToStaticMarkup(
      createElement(DrilldownList, {
        asOf: AS_OF,
        filters: { ...baseFilters, page: 4 },
        matchedCount: 9,
        items: [],
      }),
    );

    expect(html).toContain('No milestones on page 4');
    expect(html).toContain('9 matching milestones across 2 pages. Active filters are preserved.');
    expect(html).toContain(`href="/summary?teamId=${TEAM_ID}&amp;status=PENDING&amp;page=2&amp;pageSize=8"`);
    expect(html).toContain('Go to page 2');
    expect(html).toContain('Go to page 1');
  });

  it('distinguishes loading, invalid filters, error retry, no teams, and zero matches', () => {
    const loadingHtml = renderToStaticMarkup(
      createElement(DrilldownList, { asOf: null, filters: baseFilters, matchedCount: 0, items: [], loading: true }),
    );
    expect(loadingHtml).toContain('Loading matching milestones…');

    const invalidHtml = renderToStaticMarkup(
      createElement(DrilldownList, {
        asOf: null,
        filters: baseFilters,
        matchedCount: 0,
        items: [],
        invalidFilters: { pageSize: 'Use a page size from 1 to 50.' },
      }),
    );
    expect(invalidHtml).toContain('Use a page size from 1 to 50.');
    expect(invalidHtml).toContain('Reset summary filters');

    const errorHtml = renderToStaticMarkup(
      createElement(DrilldownList, {
        asOf: null,
        filters: baseFilters,
        matchedCount: 0,
        items: [],
        error: 'Unable to load summary.',
        onRetry: () => {},
      }),
    );
    expect(errorHtml).toContain('Unable to load summary.');
    expect(errorHtml).toContain('Try again');

    const noTeamsHtml = renderToStaticMarkup(
      createElement(DrilldownList, {
        asOf: AS_OF,
        filters: { teamId: null, status: null, page: 1, pageSize: 20 },
        matchedCount: 0,
        items: [],
        hasTeams: false,
      }),
    );
    expect(noTeamsHtml).toContain('No supervised teams yet');

    const zeroMatchHtml = renderToStaticMarkup(
      createElement(DrilldownList, {
        asOf: AS_OF,
        filters: baseFilters,
        matchedCount: 0,
        items: [],
      }),
    );
    expect(zeroMatchHtml).toContain('No matching milestones');
    expect(zeroMatchHtml).toContain('Clear filters');
  });
});
