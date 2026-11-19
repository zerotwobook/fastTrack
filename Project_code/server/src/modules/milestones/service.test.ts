import { describe, expect, it, vi } from 'vitest';
import type { PrismaClient } from '../../db/generated/client/index.js';
import { MilestoneService } from './service.js';

const validUuid = '11111111-1111-4111-8111-111111111111';
const supAuth = { userId: '22222222-2222-4222-8222-222222222222', role: 'supervisor' as const };
const stuAuth = { userId: '33333333-3333-4333-8333-333333333333', role: 'student' as const };

describe('MilestoneService F-05B guard rails', () => {
  it('rejects test clock overrides when NODE_ENV is not test', () => {
    const previous = process.env['NODE_ENV'];
    process.env['NODE_ENV'] = 'production';
    try {
      expect(() => new MilestoneService({} as PrismaClient, async () => new Date())).toThrow(TypeError);
    } finally {
      process.env['NODE_ENV'] = previous;
    }
  });

  it('enforces supervisor role, valid UUID, and strict input before touching the database', async () => {
    const transaction = vi.fn();
    const service = new MilestoneService({ $transaction: transaction } as unknown as PrismaClient);

    await expect(service.updateMilestone(validUuid, {}, stuAuth)).rejects.toMatchObject({ status: 403, code: 'FORBIDDEN' });
    await expect(service.cancelMilestone(validUuid, {}, stuAuth)).rejects.toMatchObject({ status: 403, code: 'FORBIDDEN' });

    await expect(service.updateMilestone('not-a-uuid', {}, supAuth)).rejects.toMatchObject({ status: 400, code: 'INVALID_INPUT' });
    await expect(service.cancelMilestone('not-a-uuid', {}, supAuth)).rejects.toMatchObject({ status: 400, code: 'INVALID_INPUT' });

    await expect(service.updateMilestone(validUuid, { title: 'Partial only' }, supAuth)).rejects.toMatchObject({ status: 400, code: 'INVALID_INPUT' });
    await expect(service.cancelMilestone(validUuid, { extra: true }, supAuth)).rejects.toMatchObject({ status: 400, code: 'INVALID_INPUT' });
    expect(transaction).not.toHaveBeenCalled();
  });
});
