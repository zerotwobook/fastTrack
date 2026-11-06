import { randomUUID } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { ConfigError } from '../config.js';
import type { Prisma, PrismaClient } from '../db/generated/client/index.js';
import { createBaseFixtures, createTestPrisma } from './fixtures.js';
import { requireTestDatabase } from '../db/test-database.js';

const root = fileURLToPath(new URL('../../../', import.meta.url));
let prisma: PrismaClient;
let fixtures: Awaited<ReturnType<typeof createBaseFixtures>>;

beforeAll(async () => {
  // Fail before connection if this is not a separate, explicitly reserved test DB.
  requireTestDatabase(process.env);
  prisma = createTestPrisma();
  fixtures = await createBaseFixtures(prisma, new Date('2030-11-06T12:00:00.000Z'));
});
afterAll(async () => { await prisma?.$disconnect(); });
afterEach(() => { vi.unstubAllEnvs(); });

function runSeed() {
  requireTestDatabase(process.env);
  const result = spawnSync(process.execPath, [process.env.npm_execpath!, 'run', 'db:seed', '--workspace', '@fasttrack/server'], { cwd: root,
    env: { ...process.env, DATABASE_URL: process.env.TEST_DATABASE_URL!, DEMO_SEED_PASSWORD: randomUUID() },
    encoding: 'utf8', windowsHide: true, timeout: 30_000 });
  expect(result.status, 'Explicit test-only seed must exit successfully.').toBe(0);
}


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

  it('uses native UUID primary keys as specified by the accepted data model', async () => {
    const columns = await prisma.$queryRaw<Array<{ table_name: string; data_type: string }>>`
      SELECT table_name, data_type FROM information_schema.columns
      WHERE table_schema = 'public' AND column_name = 'id'
      AND table_name IN ('users', 'sessions', 'teams', 'milestones', 'submissions', 'feedback')`;
    expect(columns).toHaveLength(6);
    expect(columns.every(column => column.data_type === 'uuid')).toBe(true);
  });

  it('rejects a submission with an unknown author through its foreign key', async () => {
    await rollback(async tx => {
      await expect(tx.submission.create({ data: { milestoneId: fixtures.milestones.milestoneExact.id,
        submittedById: randomUUID(), version: 1, title: 'Orphan author probe', description: 'Valid description',
        url: 'https://example.edu/work', submittedAt: new Date('2030-11-06T12:00:00.000Z') } })).rejects.toMatchObject({ code: 'P2003' });
    });
  });

  it('enforces the version lower bound in the database', async () => {
    await rollback(async tx => {
      await expect(tx.submission.create({ data: { milestoneId: fixtures.milestones.milestoneExact.id,
        submittedById: fixtures.users.stuA1.id, version: 0, title: 'Invalid version', description: 'Valid description',
        url: 'https://example.edu/work', submittedAt: new Date('2030-11-06T12:00:00.000Z') } })).rejects.toThrow();
    });
  });

  it('enforces one team per student and foreign-key history restriction', async () => {
    await rollback(async tx => {
      await expect(tx.teamMember.create({ data: { teamId: fixtures.teams.teamB.id, studentId: fixtures.users.stuA1.id } }))
        .rejects.toMatchObject({ code: 'P2002' });
    });
    await rollback(async tx => {
      await expect(tx.team.delete({ where: { id: fixtures.teams.teamA.id } })).rejects.toMatchObject({ code: 'P2003' });
    });
  });

  it('enforces the accepted title bound in the migration rather than only in future handlers', async () => {
    await rollback(async tx => {
      await expect(tx.milestone.create({ data: { teamId: fixtures.teams.teamA.id, createdById: fixtures.users.supA.id,
        title: 'x'.repeat(121), description: 'Valid description', dueAt: new Date('2030-11-07T12:00:00Z') } })).rejects.toThrow();
    });
  });

  it('provides exact one-millisecond-before, equal and one-millisecond-after deadline fixtures', () => {
    const ref = new Date('2030-11-06T12:00:00.000Z').getTime();
    const offsets = Object.values(fixtures.milestones).map(milestone => milestone.dueAt.getTime() - ref);
    expect(offsets).toEqual(expect.arrayContaining([-1, 0, 1]));
  });

  it('rechecks the test database guard at client creation even after the module was imported', async () => {
    vi.stubEnv('TEST_DATABASE_URL', process.env.DATABASE_URL!);
    let leakedClient: PrismaClient | undefined;
    try {
      expect(() => { leakedClient = createTestPrisma(); }).toThrow(ConfigError);
    } finally {
      // No query is issued against the protected URL even if the factory fails to reject it.
      await leakedClient?.$disconnect();
    }
  });

  it('repeats the seed without duplicating records or replacing stored password hashes/membership', async () => {
    runSeed();
    const users = await prisma.user.findMany({ where: { email: { endsWith: '@fasttrack.local' } }, orderBy: { email: 'asc' },
      select: { id: true, email: true, passwordHash: true } });
    const members = await prisma.teamMember.findMany({ orderBy: { studentId: 'asc' } });
    const teams = await prisma.team.count();
    expect(users).toHaveLength(5);
    runSeed();
    expect(await prisma.user.findMany({ where: { email: { endsWith: '@fasttrack.local' } }, orderBy: { email: 'asc' },
      select: { id: true, email: true, passwordHash: true } })).toEqual(users);
    expect(await prisma.teamMember.findMany({ orderBy: { studentId: 'asc' } })).toEqual(members);
    expect(await prisma.team.count()).toBe(teams);
  });

  it('preserves previously edited names when the add-only seed runs again', async () => {
    runSeed();
    const supervisor = await prisma.user.findUniqueOrThrow({ where: { email: 'supervisor.a@fasttrack.local' } });
    const team = await prisma.team.findFirstOrThrow({ where: { supervisorId: supervisor.id } });
    await prisma.team.update({ where: { id: team.id }, data: { name: 'Preserved custom team' } });
    await prisma.user.update({ where: { id: supervisor.id }, data: { name: 'Preserved display name' } });
    runSeed();
    expect((await prisma.team.findUniqueOrThrow({ where: { id: team.id } })).name).toBe('Preserved custom team');
    expect((await prisma.user.findUniqueOrThrow({ where: { id: supervisor.id } })).name).toBe('Preserved display name');
  });

  it('loads the compiled database module and reads PostgreSQL through the generated client', () => {
    const result = spawnSync(process.execPath, ['--input-type=module', '-e',
      "const {prisma}=await import('./server/dist/db/client.js');try{const rows=await prisma.$queryRawUnsafe('SELECT 1::int AS value');console.log(JSON.stringify(rows));}finally{await prisma.$disconnect();}"],
      { cwd: root, env: { ...process.env, NODE_ENV: 'production', DATABASE_URL: process.env.TEST_DATABASE_URL! },
        encoding: 'utf8', windowsHide: true, timeout: 20_000 });
    const errorCode = /code: '([^']+)'/.exec(result.stderr ?? '')?.[1] ?? 'no module error code';
    expect(result.status, `Compiled database client should run (${errorCode}).`).toBe(0);
    expect(JSON.parse(result.stdout.trim())).toEqual([{ value: 1 }]);
  });
});
