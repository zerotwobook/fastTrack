import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import type { Prisma, PrismaClient } from '../db/generated/client/index.js';
import { createBaseFixtures, createTestPrisma } from './fixtures.js';
import { requireTestDatabase } from '../db/test-database.js';

let prisma: PrismaClient;
let fixtures: Awaited<ReturnType<typeof createBaseFixtures>>;

beforeAll(async () => {
  // Fail before connection if this is not a separate, explicitly reserved test DB.
  requireTestDatabase(process.env);
  prisma = createTestPrisma();
  fixtures = await createBaseFixtures(prisma, new Date('2030-11-06T12:00:00.000Z'));
});
afterAll(async () => { await prisma?.$disconnect(); });

async function rollback(work: (tx: Prisma.TransactionClient) => Promise<void>) {
  const rollbackOnly = new Error('G1 audit rollback');
  try {
    await prisma.$transaction(async tx => { await work(tx); throw rollbackOnly; });
  } catch (error) {
    if (error !== rollbackOnly) throw error;
  }
}

describe('G1 canonical foundation contracts on real PostgreSQL', () => {
  it('permits one supervisor to own multiple teams', async () => {
    await rollback(async tx => {
      await tx.team.create({ data: { name: 'Second assigned team', supervisorId: fixtures.users.supA.id } });
      expect(await tx.team.count({ where: { supervisorId: fixtures.users.supA.id } })).toBe(2);
    });
  });

  it('provides nullable revocation and cancellation fields required before dependent auth/domain work', async () => {
    const columns = await prisma.$queryRaw<Array<{ table_name: string; column_name: string; is_nullable: string }>>`
      SELECT table_name, column_name, is_nullable FROM information_schema.columns
      WHERE table_schema = 'public' AND
        ((table_name = 'sessions' AND column_name = 'revoked_at') OR
         (table_name = 'milestones' AND column_name = 'cancelled_at'))`;
    expect(columns).toEqual(expect.arrayContaining([
      expect.objectContaining({ table_name: 'sessions', column_name: 'revoked_at', is_nullable: 'YES' }),
      expect.objectContaining({ table_name: 'milestones', column_name: 'cancelled_at', is_nullable: 'YES' }),
    ]));
  });
});
