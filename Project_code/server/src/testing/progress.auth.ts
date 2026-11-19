import { randomUUID } from 'node:crypto';
import { setTimeout as delay } from 'node:timers/promises';
import request from 'supertest';
import { afterAll, beforeEach, describe, expect, it } from 'vitest';
import { createApp } from '../app.js';
import { loadConfig } from '../config.js';
import type { Prisma } from '../db/generated/client/index.js';
import { createApplicationRouters } from '../modules/index.js';
import { calculateProgress } from '../modules/progress/calculation.js';
import { cleanTestDatabase, createBaseFixtures, createTestPrisma, TEST_PASSWORD } from './fixtures.js';

const prisma = createTestPrisma();
const origin = 'http://127.0.0.1:5173';
const config = loadConfig({ NODE_ENV: 'test', DATABASE_URL: process.env['TEST_DATABASE_URL'], APP_ORIGIN: origin });
const api = request(createApp(config, { logger: () => undefined, routers: createApplicationRouters({ prisma, config }) }));
let fixtures: Awaited<ReturnType<typeof createBaseFixtures>>;

async function login(email: string) {
  const response = await api.post('/api/auth/login').set('Origin', origin).set('X-fastTrack-Request', '1')
    .send({ email, password: TEST_PASSWORD }).expect(200);
  return String(response.headers['set-cookie']?.[0]).split(';')[0]!;
}

function getProgress(teamId: string, cookie: string, query = '') {
  return api.get(`/api/teams/${teamId}/progress${query}`).set('Cookie', cookie);
}

function saveSubmission(milestoneId: string, version: number, db: Prisma.TransactionClient = prisma) {
  return db.submission.create({ data: {
    milestoneId, version, submittedById: fixtures.users.stuA1.id, submittedAt: new Date(),
    title: `Saved version ${version}`, description: 'Synthetic saved work for the progress tests.', url: 'https://example.edu/work',
  } });
}

function saveFeedback(submissionId: string, db: Prisma.TransactionClient = prisma) {
  return db.feedback.create({ data: {
    submissionId, supervisorId: fixtures.users.supA.id, content: 'Synthetic review for this version.', clientRequestId: randomUUID(),
  } });
}

async function waitForMilestoneSelect() {
  for (let attempt = 0; attempt < 120; attempt++) {
    const [result] = await prisma.$queryRaw<{ waiting: boolean }[]>`
      SELECT EXISTS (
        SELECT 1 FROM pg_stat_activity
        WHERE datname = current_database() AND wait_event_type = 'Lock'
          AND query LIKE '%SELECT%milestones%'
      ) AS waiting`;
    if (result?.waiting) return;
    await delay(25);
  }
  throw new Error('The progress milestone query did not wait for the PostgreSQL test lock.');
}

beforeEach(async () => { fixtures = await createBaseFixtures(prisma); });
afterAll(async () => { await cleanTestDatabase(prisma); await prisma.$disconnect(); });

describe('F-07 authenticated team progress', () => {
  it('STS-23 and STS-25 count milestones once and project feedback on the exact latest version', async () => {
    const { teams: { teamA }, users: { supA }, milestones } = fixtures;
    const { milestonePast, milestoneExact, milestoneBoundaryPlus1ms, milestoneFuture } = milestones;
    const dueAt = new Date(Date.now() - 60_000);
    await prisma.milestone.update({ where: { id: milestonePast.id }, data: { dueAt } });
    const cancelled = await prisma.milestone.create({ data: {
      teamId: teamA.id, createdById: supA.id, dueAt: milestoneExact.dueAt, cancelledAt: new Date(),
      title: 'Cancelled with history', description: 'Synthetic cancellation showing retained submission history.',
    } });
    const first = await saveSubmission(milestonePast.id, 1);
    await saveFeedback(first.id);
    const latest = await saveSubmission(milestonePast.id, 2);
    const reviewed = await saveSubmission(milestoneExact.id, 1);
    await saveFeedback(reviewed.id);
    const submitted = await saveSubmission(milestoneBoundaryPlus1ms.id, 1);
    const cancelledHistory = await saveSubmission(cancelled.id, 1);
    await saveFeedback(cancelledHistory.id);

    const cookie = await login(fixtures.users.stuA1.email);
    const response = await getProgress(teamA.id, cookie).expect(200);
    const source = await api.get(`/api/teams/${teamA.id}/milestones`).set('Cookie', cookie).expect(200);
    const { data, meta } = response.body;
    expect(meta).toEqual({ serverTime: data.asOf });
    expect(new Date(data.asOf).toISOString()).toBe(data.asOf);
    const expectation = calculateProgress(source.body.data, new Date(data.asOf));
    expect(data).toEqual({ teamId: teamA.id, asOf: meta.serverTime, ...expectation });
    expect(data).toMatchObject({ total: 4, submitted: 3, progressPercent: 75 });
    const tiedIds = [milestoneExact.id, cancelled.id].sort();
    expect(data.milestones.map((item: { id: string }) => item.id))
      .toEqual([milestonePast.id, ...tiedIds, milestoneBoundaryPlus1ms.id, milestoneFuture.id]);
    expect(data.milestones).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: milestonePast.id, status: 'SUBMITTED', latestSubmission: expect.objectContaining({ id: latest.id, version: 2, feedbackCount: 0 }) }),
      expect.objectContaining({ id: milestoneExact.id, status: 'FEEDBACK_AVAILABLE', latestSubmission: expect.objectContaining({ id: reviewed.id, feedbackCount: 1 }) }),
      expect.objectContaining({ id: milestoneBoundaryPlus1ms.id, status: 'SUBMITTED', latestSubmission: expect.objectContaining({ id: submitted.id }) }),
      expect.objectContaining({ id: milestoneFuture.id, status: 'PENDING', latestSubmission: null }),
      expect.objectContaining({ id: cancelled.id, status: 'CANCELLED', latestSubmission: expect.objectContaining({ id: cancelledHistory.id, feedbackCount: 1 }) }),
    ]));
    const revision = await saveSubmission(milestoneExact.id, 2);
    const refresh = await getProgress(teamA.id, cookie).expect(200);
    expect(refresh.body.data).toMatchObject({ total: 4, submitted: 3, progressPercent: 75 });
    expect(refresh.body.data.milestones).toContainEqual(expect.objectContaining({
      id: milestoneExact.id, status: 'SUBMITTED',
      latestSubmission: expect.objectContaining({ id: revision.id, version: 2, feedbackCount: 0 }),
    }));
  });

  it('STS-24 returns zero for an empty or fully cancelled team and retains cancelled rows', async () => {
    const teamId = fixtures.teams.teamB.id;
    const cookie = await login(fixtures.users.supB.email);
    const item = fixtures.milestones.milestoneBTeam;
    await prisma.milestone.update({ where: { id: item.id }, data: { cancelledAt: new Date() } });
    const cancelled = await getProgress(teamId, cookie).expect(200);
    expect(cancelled.body.data).toMatchObject({
      teamId, total: 0, submitted: 0, progressPercent: 0, milestones: [{ id: item.id, status: 'CANCELLED' }],
    });
    await prisma.milestone.delete({ where: { id: item.id } });
    const empty = await getProgress(teamId, cookie).expect(200);
    expect(empty.body.data).toEqual({
      teamId, asOf: empty.body.meta.serverTime, total: 0, submitted: 0, progressPercent: 0, milestones: [],
    });
  });

  it('STS-26 keeps one PostgreSQL snapshot when new work and feedback commit during the read', async () => {
    const teamId = fixtures.teams.teamA.id;
    const item = fixtures.milestones.milestonePast;
    await prisma.milestone.update({ where: { id: item.id }, data: { dueAt: new Date(Date.now() - 60_000) } });
    const cookie = await login(fixtures.users.stuA1.email);
    let markLocked!: () => void;
    let proceed!: (write: boolean) => void;
    const locked = new Promise<void>(resolve => { markLocked = resolve; });
    const permittedToWrite = new Promise<boolean>(resolve => { proceed = resolve; });
    const writer = prisma.$transaction(async tx => {
      await tx.$executeRaw`LOCK TABLE milestones IN ACCESS EXCLUSIVE MODE`;
      markLocked();
      if (!await permittedToWrite) return;
      const saved = await saveSubmission(item.id, 1, tx);
      await saveFeedback(saved.id, tx);
      return saved;
    }, { timeout: 10_000 });

    await Promise.race([locked, writer]);
    const reading = getProgress(teamId, cookie).then(response => response);
    try {
      await waitForMilestoneSelect();
      proceed(true);
    } finally {
      proceed(false);
      await Promise.allSettled([writer, reading]);
    }
    const saved = await writer;
    const before = await reading;
    expect(saved).toBeDefined();
    expect(before.status).toBe(200);
    expect(before.body.data).toMatchObject({ asOf: before.body.meta.serverTime, total: 4, submitted: 0, progressPercent: 0 });
    expect(before.body.data.milestones).toContainEqual(expect.objectContaining({
      id: item.id, status: 'OVERDUE', latestSubmission: null,
    }));
    const after = await getProgress(teamId, cookie).expect(200);
    expect(after.body.data).toMatchObject({ asOf: after.body.meta.serverTime, total: 4, submitted: 1, progressPercent: 25 });
    expect(after.body.data.milestones).toContainEqual(expect.objectContaining({
      id: item.id, status: 'FEEDBACK_AVAILABLE',
      latestSubmission: expect.objectContaining({ id: saved?.id, version: 1, feedbackCount: 1 }),
    }));
  }, 12_000);

  it('STS-27 and STS-28 enforce real session scope, generic lookup errors and private response caching', async () => {
    const { teams: { teamA, teamB }, users: { stuA1, supA } } = fixtures;
    await api.get(`/api/teams/${teamA.id}/progress`).expect(401);
    for (const email of [stuA1.email, supA.email]) {
      const cookie = await login(email);
      const own = await getProgress(teamA.id.toUpperCase(), cookie).expect(200);
      expect(own.headers['cache-control']).toBe('no-store');
      expect(own.body.data).toMatchObject({ teamId: teamA.id, total: 4 });
      expect(own.body.data.milestones).toHaveLength(4);
      const foreign = await getProgress(teamB.id, cookie).expect(404);
      const missing = await getProgress(randomUUID(), cookie).expect(404);
      expect(foreign.body).toEqual(missing.body);
      expect(foreign.headers['cache-control']).toBe('no-store');
      for (const [id, query] of [['invalid', ''], [teamA.id, '?status=PENDING']] as const) {
        const invalid = await getProgress(id, cookie, query).expect(400);
        expect(invalid.body.error.code).toBe('INVALID_INPUT');
      }
    }
  });
});
