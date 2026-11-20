import { describe, expect, it } from 'vitest';
import {
  buildMilestoneDetailHref,
  buildSubmissionDetailHref,
  buildSummaryUrl,
  parseSummarySearch,
  resolveDetailSummaryNavigation,
  sanitizeSummaryReturnTo,
  totalSummaryPages,
} from './navigation';

const TEAM_ID = '11111111-1111-4111-8111-111111111111';
const MILESTONE_ID = '22222222-2222-4222-8222-222222222222';
const SUBMISSION_ID = '33333333-3333-4333-8333-333333333333';

describe('F-08B summary URL search and returnTo navigation', () => {
  it('parses default empty query and normalizes valid parameters', () => {
    expect(parseSummarySearch('')).toEqual({
      ok: true,
      filters: { teamId: null, status: null, page: 1, pageSize: 20 },
    });

    expect(parseSummarySearch(`?teamId=${TEAM_ID.toUpperCase()}&status=PENDING&page=2&pageSize=8`)).toEqual({
      ok: true,
      filters: { teamId: TEAM_ID, status: 'PENDING', page: 2, pageSize: 8 },
    });

    expect(parseSummarySearch('?status=CANCELLED&pageSize=50')).toEqual({
      ok: true,
      filters: { teamId: null, status: 'CANCELLED', page: 1, pageSize: 50 },
    });
  });

  it('rejects unknown, repeated, empty, malformed, out-of-range, and overflowing query parameters', () => {
    expect(parseSummarySearch('?extra=1').ok).toBe(false);
    expect(parseSummarySearch('?status=PENDING&status=OVERDUE').ok).toBe(false);
    expect(parseSummarySearch('?page=').ok).toBe(false);
    expect(parseSummarySearch('?teamId=not-a-uuid').ok).toBe(false);
    expect(parseSummarySearch('?status=INVALID').ok).toBe(false);
    expect(parseSummarySearch('?page=0').ok).toBe(false);
    expect(parseSummarySearch('?page=-2').ok).toBe(false);
    expect(parseSummarySearch('?page=1.5').ok).toBe(false);
    expect(parseSummarySearch('?page=1abc').ok).toBe(false);
    expect(parseSummarySearch('?pageSize=0').ok).toBe(false);
    expect(parseSummarySearch('?pageSize=51').ok).toBe(false);
    expect(parseSummarySearch('?page=99999999999999999&pageSize=20').ok).toBe(false);
    expect(parseSummarySearch('?page=4503599627370496&pageSize=2').ok).toBe(true);
    expect(parseSummarySearch('?page=4503599627370497&pageSize=2').ok).toBe(false);
  });

  it('builds canonical summary URLs omitting defaults while preserving active filters and page', () => {
    expect(buildSummaryUrl({ teamId: null, status: null, page: 1, pageSize: 20 })).toBe('/summary');
    expect(buildSummaryUrl({ teamId: TEAM_ID.toUpperCase(), status: 'OVERDUE', page: 3, pageSize: 50 })).toBe(
      `/summary?teamId=${TEAM_ID}&status=OVERDUE&page=3&pageSize=50`,
    );
  });

  it('sanitizes returnTo strictly to local /summary URLs with allowlisted validated parameters', () => {
    const valid = `/summary?teamId=${TEAM_ID}&status=PENDING&page=2&pageSize=8`;
    expect(sanitizeSummaryReturnTo('/summary')).toBe('/summary');
    expect(sanitizeSummaryReturnTo(valid)).toBe(valid);
    expect(sanitizeSummaryReturnTo(`/summary?teamId=${TEAM_ID.toUpperCase()}&page=1&pageSize=20`)).toBe(
      `/summary?teamId=${TEAM_ID}`,
    );

    const invalidCases = [
      null,
      '',
      'summary',
      'https://foreign.example/summary',
      '//foreign.example/summary',
      '/\\foreign.example/summary',
      '/%2f%2fforeign.example',
      '/summary#fragment',
      '/teams/11111111-1111-4111-8111-111111111111',
      '/summary?unknown=1',
      '/summary?page=0',
      '/summary?pageSize=51',
      '/summary?status=PENDING&status=OVERDUE',
      '/summary\nhttps://foreign.example',
    ];
    for (const candidate of invalidCases) {
      expect(sanitizeSummaryReturnTo(candidate)).toBeNull();
    }
  });

  it('resolves supervisor-only detail return navigation with safe fallback for invalid inputs', () => {
    const summaryUrl = `/summary?teamId=${TEAM_ID}&status=SUBMITTED&page=2`;
    expect(resolveDetailSummaryNavigation(summaryUrl, 'supervisor')).toEqual({
      hasReturnParam: true,
      summaryHref: summaryUrl,
      fallbackHref: summaryUrl,
    });
    expect(resolveDetailSummaryNavigation('https://evil.example/summary', 'supervisor')).toEqual({
      hasReturnParam: true,
      summaryHref: null,
      fallbackHref: '/summary',
    });
    expect(resolveDetailSummaryNavigation('/summary?page=0', 'supervisor')).toEqual({
      hasReturnParam: true,
      summaryHref: null,
      fallbackHref: '/summary',
    });
    expect(resolveDetailSummaryNavigation(null, 'supervisor')).toEqual({
      hasReturnParam: false,
      summaryHref: null,
      fallbackHref: null,
    });
    expect(resolveDetailSummaryNavigation(summaryUrl, 'student')).toEqual({
      hasReturnParam: false,
      summaryHref: null,
      fallbackHref: null,
    });
  });

  it('builds detail links with encoded summary returnTo and ignores unsafe return targets', () => {
    const summaryUrl = `/summary?status=FEEDBACK_AVAILABLE&page=2&pageSize=10`;
    expect(buildMilestoneDetailHref(MILESTONE_ID, summaryUrl)).toBe(
      `/milestones/${MILESTONE_ID}?returnTo=${encodeURIComponent(summaryUrl)}`,
    );
    expect(buildMilestoneDetailHref(MILESTONE_ID, '//foreign.example/summary')).toBe(`/milestones/${MILESTONE_ID}`);
    expect(buildSubmissionDetailHref(SUBMISSION_ID, summaryUrl)).toBe(
      `/submissions/${SUBMISSION_ID}?returnTo=${encodeURIComponent(summaryUrl)}`,
    );
  });

  it('calculates total pages cleanly across empty and partial datasets', () => {
    expect(totalSummaryPages(0, 20)).toBe(0);
    expect(totalSummaryPages(1, 20)).toBe(1);
    expect(totalSummaryPages(9, 8)).toBe(2);
    expect(totalSummaryPages(40, 20)).toBe(2);
  });
});
