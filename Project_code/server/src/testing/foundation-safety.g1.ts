import { randomUUID } from 'node:crypto';
import { PrismaClient, type Prisma } from '../db/generated/client/index.js';
import { PrismaPg } from '@prisma/adapter-pg';
import { beforeAll, afterAll, afterEach, describe, expect, it, vi } from 'vitest';
import { createBaseFixtures, createTestPrisma, cleanTestDatabase } from './fixtures.js';

let prisma: PrismaClient;
let fixtures: Awaited<ReturnType<typeof createBaseFixtures>>;
beforeAll(async () => {
  prisma = createTestPrisma();
  fixtures = await createBaseFixtures(prisma, new Date('2030-11-06T12:00:00Z'));
});
afterAll(async () => { await prisma?.$disconnect(); });
afterEach(() => { vi.unstubAllEnvs(); });
async function rollback(work: (tx: Prisma.TransactionClient) => Promise<void>) {
  const marker = new Error('Boundary audit rollback');
  try { await prisma.$transaction(async tx => { await work(tx); throw marker; }); }
  catch (error) { if (error !== marker) throw error; }
}
const fields = [
  { name: 'team.name', max: 120 }, { name: 'milestone.title', max: 120 },
  { name: 'milestone.description', max: 4000 }, { name: 'submission.title', max: 120 },
  { name: 'submission.description', max: 4000 }, { name: 'submission.url', max: 2048 },
  { name: 'feedback.content', max: 4000 },
] as const;
type Field = (typeof fields)[number]['name'];
function submissionData() {
  return { milestoneId: fixtures.milestones.milestoneExact.id, submittedById: fixtures.users.stuA1.id,
    title: 'Valid title', description: 'Valid description', version: 1, url: 'https://example.edu/work',
    submittedAt: new Date('2030-11-06T12:00:00Z') };
}
async function persist(tx: Prisma.TransactionClient, field: Field, value: string): Promise<string> {
  if (field === 'team.name') return (await tx.team.create({ data: { name: value, supervisorId: fixtures.users.supA.id } })).name;
  if (field.startsWith('milestone.')) {
    const key = field === 'milestone.title' ? 'title' : 'description';
    const row = await tx.milestone.create({ data: { title: 'Valid title', description: 'Valid description',
      teamId: fixtures.teams.teamA.id, createdById: fixtures.users.supA.id, dueAt: new Date('2030-11-07T12:00:00Z'), [key]: value } });
    return row[key];
  }
  if (field.startsWith('submission.')) {
    const key = field === 'submission.title' ? 'title' : field === 'submission.description' ? 'description' : 'url';
    const row = await tx.submission.create({ data: { ...submissionData(), [key]: value } });
    return row[key];
  }
  const submission = await tx.submission.create({ data: submissionData() });
  return (await tx.feedback.create({ data: { submissionId: submission.id, supervisorId: fixtures.users.supA.id,
    clientRequestId: randomUUID(), content: value } })).content;
}
function valueAt(field: Field, size: number) {
  const prefix = field === 'submission.url' ? 'https://example.edu/' : '';
  return prefix + 'x'.repeat(size - prefix.length);
}
function canaryData() {
  return { email: `canary-${randomUUID()}@g1.local`, name: 'Protected canary', role: 'student' as const,
    studentId: randomUUID(), passwordHash: 'synthetic-test-hash' };
}

describe.sequential('G1 canonical boundaries and fixture-client isolation', () => {
  it.each(fields)('accepts the exact code-point maximum for $name', async ({ name, max }) => {
    const value = valueAt(name, max);
    await rollback(async tx => { expect(await persist(tx, name, value)).toBe(value); });
  });
  it.each(fields)('rejects one code point over the maximum for $name', async ({ name, max }) => {
    await rollback(async tx => { await expect(persist(tx, name, valueAt(name, max + 1))).rejects.toThrow(); });
  });
  it.each(fields)('rejects empty and whitespace-only required $name', async ({ name }) => {
    for (const value of ['', ' \t\r\n', '\u00a0\ufeff']) {
      await rollback(async tx => { await expect(persist(tx, name, value)).rejects.toThrow(); });
    }
  });
  it('counts a valid 120-code-point title independently of UTF-16 code units', async () => {
    await rollback(async tx => { const value = '\u{1f680}'.repeat(120); expect(await persist(tx, 'milestone.title', value)).toBe(value); });
  });
  it('rejects an arbitrary protected dev client before deleting its canary', async () => {
    // DATABASE_URL belongs only to this runner's newly created isolated dev DB.
    const client = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }) });
    try {
      const marker = await client.user.create({ data: canaryData() });
      let rejected = false;
      try { await cleanTestDatabase(client); } catch { rejected = true; }
      expect(await client.user.count({ where: { id: marker.id } })).toBe(1);
      expect(rejected).toBe(true);
    } finally { await client.$disconnect(); }
  });
  it('allows cleanup through a factory-bound test client', async () => {
    expect(await prisma.user.count()).toBeGreaterThan(0);
    await cleanTestDatabase(prisma);
    expect(await prisma.user.count()).toBe(0);
  });
  it('rejects a factory client if the configured test target has changed since creation', async () => {
    const marker = await prisma.user.create({ data: canaryData() });
    const alternate = new URL(process.env.TEST_DATABASE_URL!); alternate.pathname = '/fasttrack_g1_other_test';
    vi.stubEnv('TEST_DATABASE_URL', alternate.href);
    let rejected = false;
    try { await cleanTestDatabase(prisma); } catch { rejected = true; }
    expect(await prisma.user.count({ where: { id: marker.id } })).toBe(1);
    expect(rejected).toBe(true);
  });
  it('rejects an unbranded client even if its URL is the configured test URL', async () => {
    const client = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.TEST_DATABASE_URL! }) });
    try {
      const marker = await client.user.create({ data: canaryData() });
      let rejected = false;
      try { await cleanTestDatabase(client); } catch { rejected = true; }
      expect(await client.user.count({ where: { id: marker.id } })).toBe(1);
      expect(rejected).toBe(true);
    } finally { await client.$disconnect(); }
  });
});
