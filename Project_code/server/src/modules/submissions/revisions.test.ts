import { describe, expect, it, vi } from 'vitest';
import type { PrismaClient } from '../../db/generated/client/index.js';
import { MAX_SUBMISSION_VERSION } from '../../../../shared/submissions.mjs';
import { RevisionService } from './revisions.js';

const milestoneId = '11111111-1111-4111-8111-111111111111';
const teamId = '22222222-2222-4222-8222-222222222222';
const stuAuth = { userId: '33333333-3333-4333-8333-333333333333', role: 'student' as const };
const supAuth = { userId: '44444444-4444-4444-8444-444444444444', role: 'supervisor' as const };
const payload = { title: 'Revision v2', description: 'Updated work.', url: 'https://example.edu/v2', expectedVersion: 1 };

describe('RevisionService F-06 guard rails and version ceiling', () => {
  it('rejects test clock overrides outside NODE_ENV=test', () => {
    const previous = process.env['NODE_ENV'];
    process.env['NODE_ENV'] = 'production';
    try {
      expect(() => new RevisionService({} as PrismaClient, async () => new Date())).toThrow(TypeError);
    } finally {
      process.env['NODE_ENV'] = previous;
    }
  });

  it('rejects non-student role, invalid UUID, and invalid revision input before transaction', async () => {
    const transaction = vi.fn();
    const service = new RevisionService({ $transaction: transaction } as unknown as PrismaClient);

    await expect(service.revise(milestoneId, payload, supAuth)).rejects.toMatchObject({ status: 403, code: 'FORBIDDEN' });
    await expect(service.revise('bad-uuid', payload, stuAuth)).rejects.toMatchObject({ status: 400, code: 'INVALID_INPUT' });
    await expect(service.revise(milestoneId, { ...payload, expectedVersion: '1' }, stuAuth)).rejects.toMatchObject({ status: 400, code: 'INVALID_INPUT' });
    await expect(service.revise(milestoneId, { ...payload, expectedVersion: MAX_SUBMISSION_VERSION + 1 }, stuAuth)).rejects.toMatchObject({ status: 400, code: 'INVALID_INPUT' });
    expect(transaction).not.toHaveBeenCalled();
  });

  it('checks expectedVersion conflict before 409 VERSION_LIMIT_REACHED at 2147483647 without inserting', async () => {
    const createSpy = vi.fn();
    const tx = {
      $queryRaw: vi.fn().mockResolvedValue([{ id: teamId }]),
      team: { findFirst: vi.fn().mockResolvedValue({ id: teamId }) },
      teamMember: { findUnique: vi.fn().mockResolvedValue({ teamId, studentId: stuAuth.userId }) },
      milestone: {
        findFirst: vi.fn()
          .mockResolvedValueOnce({ teamId })
          .mockResolvedValueOnce({ id: milestoneId, teamId, dueAt: new Date('2030-05-01T00:00:00.000Z'), cancelledAt: null })
          .mockResolvedValueOnce({ teamId })
          .mockResolvedValueOnce({ id: milestoneId, teamId, dueAt: new Date('2030-05-01T00:00:00.000Z'), cancelledAt: null }),
      },
      submission: {
        findFirst: vi.fn().mockResolvedValue({ id: 'sub-max', version: MAX_SUBMISSION_VERSION }),
        create: createSpy,
      },
    };
    const prisma = {
      $transaction: vi.fn(async (op: (client: typeof tx) => Promise<unknown>) => op(tx)),
    } as unknown as PrismaClient;

    const service = new RevisionService(prisma, async () => new Date('2030-01-01T00:00:00.000Z'));

    await expect(service.revise(milestoneId, { ...payload, expectedVersion: MAX_SUBMISSION_VERSION - 1 }, stuAuth))
      .rejects.toMatchObject({ status: 409, code: 'VERSION_CONFLICT' });

    await expect(service.revise(milestoneId, { ...payload, expectedVersion: MAX_SUBMISSION_VERSION }, stuAuth))
      .rejects.toMatchObject({ status: 409, code: 'VERSION_LIMIT_REACHED' });

    expect(createSpy).not.toHaveBeenCalled();
  });
});
