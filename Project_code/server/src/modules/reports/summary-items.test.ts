import { describe, expect, it, vi } from 'vitest';
import type { Prisma } from '../../db/generated/client/index.js';
import { AppError } from '../../http/errors.js';
import { assertValidSummaryPagination, readSummaryItems } from './summary-items.js';

const TEAM_A = '11111111-1111-4111-8111-111111111111';
const TEAM_B = '22222222-2222-4222-8222-222222222222';
const AS_OF = new Date('2026-11-20T06:00:00.000Z');

describe('F-08B summary-items validation and scoping', () => {
  it('validates pagination bounds, status enum, and integer offsets', () => {
    expect(assertValidSummaryPagination({ teamId: null, status: null, page: 1, pageSize: 20 })).toEqual({
      page: 1,
      pageSize: 20,
      offset: 0,
    });
    expect(assertValidSummaryPagination({ teamId: null, status: 'PENDING', page: 2, pageSize: 50 })).toEqual({
      page: 2,
      pageSize: 50,
      offset: 50,
    });

    for (const invalid of [
      { teamId: null, status: null, page: 0, pageSize: 20 },
      { teamId: null, status: null, page: -1, pageSize: 20 },
      { teamId: null, status: null, page: 1.5, pageSize: 20 },
      { teamId: null, status: null, page: 1, pageSize: 0 },
      { teamId: null, status: null, page: 1, pageSize: 51 },
      { teamId: null, status: null, page: Number.MAX_SAFE_INTEGER, pageSize: 2 },
    ]) {
      expect(() => assertValidSummaryPagination(invalid)).toThrowError(AppError);
    }
  });

  it('returns empty results without querying when supervisor has zero teams or selects an out-of-scope team', async () => {
    const queryRaw = vi.fn();
    const tx = { $queryRaw: queryRaw } as unknown as Prisma.TransactionClient;

    await expect(
      readSummaryItems({
        tx,
        teamIds: [],
        asOf: AS_OF,
        filters: { teamId: null, status: null, page: 1, pageSize: 20 },
      }),
    ).resolves.toEqual({ matchedCount: 0, items: [] });

    await expect(
      readSummaryItems({
        tx,
        teamIds: [TEAM_A],
        asOf: AS_OF,
        filters: { teamId: TEAM_B, status: null, page: 1, pageSize: 20 },
      }),
    ).resolves.toEqual({ matchedCount: 0, items: [] });

    expect(queryRaw).not.toHaveBeenCalled();
  });

  it('rejects malformed UUIDs or invalid asOf timestamps before touching SQL', async () => {
    const queryRaw = vi.fn();
    const tx = { $queryRaw: queryRaw } as unknown as Prisma.TransactionClient;

    await expect(
      readSummaryItems({
        tx,
        teamIds: ['invalid-uuid'],
        asOf: AS_OF,
        filters: { teamId: null, status: null, page: 1, pageSize: 20 },
      }),
    ).rejects.toThrowError(AppError);

    await expect(
      readSummaryItems({
        tx,
        teamIds: [TEAM_A],
        asOf: new Date('invalid'),
        filters: { teamId: null, status: null, page: 1, pageSize: 20 },
      }),
    ).rejects.toThrowError(AppError);

    expect(queryRaw).not.toHaveBeenCalled();
  });
});
