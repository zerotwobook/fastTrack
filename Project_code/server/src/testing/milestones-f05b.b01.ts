import { randomUUID } from 'node:crypto';
import { afterAll, beforeEach, describe, expect, it } from 'vitest';
import request from 'supertest';
import { Prisma } from '../db/generated/client/index.js';
import { createApp } from '../app.js';
import { loadConfig } from '../config.js';
import { createApplicationRouters } from '../modules/index.js';
import { MilestoneService } from '../modules/milestones/service.js';
import { createBaseFixtures, createTestPrisma, cleanTestDatabase, TEST_PASSWORD } from './fixtures.js';

const prisma = createTestPrisma();
const origin = 'http://127.0.0.1:5173';
const config = loadConfig({ NODE_ENV: 'test', DATABASE_URL: process.env['TEST_DATABASE_URL'], APP_ORIGIN: origin });
const app = () => createApp(config, { logger: () => undefined, routers: createApplicationRouters({ prisma, config }) });

let fixtures: Awaited<ReturnType<typeof createBaseFixtures>>;
let supA: { cookie: string; csrf: string };
let supB: { cookie: string; csrf: string };
let stuA1: { cookie: string; csrf: string };

const futureIso = (offsetMs = 86_400_000) => new Date(Date.now() + offsetMs).toISOString();
const validEdit = () => ({
  title: 'Revised milestone',
  description: 'Updated deliverables and schedule before submission.',
  dueAt: futureIso(2 * 86_400_000),
});

async function login(email: string) {
  const response = await request(app())
    .post('/api/auth/login')
    .set('Origin', origin)
    .set('X-fastTrack-Request', '1')
    .send({ email, password: TEST_PASSWORD })
    .expect(200);
  return { cookie: String(response.headers['set-cookie']?.[0]).split(';')[0]!, csrf: String(response.body.data.csrfToken) };
}

const patchMilestone = (id: string, body: unknown, actor = supA) => request(app())
  .patch(`/api/milestones/${id}`)
  .set('Cookie', actor.cookie)
  .set('Origin', origin)
  .set('X-CSRF-Token', actor.csrf)
  .set('Content-Type', 'application/json')
  .send(JSON.stringify(body));

const cancelMilestone = (id: string, body: unknown = {}, actor = supA) => request(app())
  .post(`/api/milestones/${id}/cancel`)
  .set('Cookie', actor.cookie)
  .set('Origin', origin)
  .set('X-CSRF-Token', actor.csrf)
  .set('Content-Type', 'application/json')
  .send(JSON.stringify(body));

async function waitForDbLock() {
  for (let count = 0; count < 100; count++) {
    const rows = await prisma.$queryRaw<{ count: number }[]>`SELECT count(*)::int AS count FROM pg_stat_activity WHERE datname=current_database() AND wait_event_type='Lock'`;
    if (rows[0]!.count) return true;
    await new Promise(resolve => setTimeout(resolve, 20));
  }
  return false;
}

beforeEach(async () => {
  fixtures = await createBaseFixtures(prisma);
  [supA, supB, stuA1] = await Promise.all([
    login('sup-a@test.local'),
    login('sup-b@test.local'),
    login('stu-a1@test.local'),
  ]);
});

afterAll(async () => {
  await cleanTestDatabase(prisma);
  await prisma.$disconnect();
});

describe('F-05B Milestone edit and cancel (STS-10..STS-14, STS-28, STS-30)', () => {
  it('STS-10 edits an active unsubmitted milestone (including overdue) and retains identity/team/createdAt', async () => {
    const pastTarget = fixtures.milestones.milestonePast;
    const beforeRow = await prisma.milestone.findUniqueOrThrow({ where: { id: pastTarget.id } });
    const nextDue = new Date(Date.now() + 3 * 86_400_000).toISOString();

    const res = await patchMilestone(pastTarget.id, {
      title: '  \u{1f680}'.trim() + ' '.repeat(0) + '\u{1f680}'.repeat(119),
      description: 'd'.repeat(4000),
      dueAt: nextDue,
    }).expect(200);

    expect(res.headers['cache-control']).toBe('no-store');
    expect(res.body.data).toEqual({
      id: pastTarget.id,
      teamId: beforeRow.teamId,
      title: '\u{1f680}'.repeat(120),
      description: 'd'.repeat(4000),
      dueAt: nextDue,
      cancelledAt: null,
      createdAt: beforeRow.createdAt.toISOString(),
      latestSubmission: null,
    });

    const afterRow = await prisma.milestone.findUniqueOrThrow({ where: { id: pastTarget.id } });
    expect(afterRow.teamId).toBe(beforeRow.teamId);
    expect(afterRow.createdById).toBe(beforeRow.createdById);
    expect(afterRow.createdAt.getTime()).toBe(beforeRow.createdAt.getTime());

    const detail = await request(app()).get(`/api/milestones/${pastTarget.id}`).set('Cookie', supA.cookie).expect(200);
    expect(detail.body.data).toEqual(res.body.data);
  });

  it('STS-10 rejects incomplete, extra-key, over-bound, or invalid-Unicode PATCH payloads without writing', async () => {
    const id = fixtures.milestones.milestoneFuture.id;
    const before = await prisma.milestone.findUniqueOrThrow({ where: { id } });
    const badPayloads: unknown[] = [
      null,
      [],
      {},
      { title: 'Only title' },
      { title: 'Missing dueAt', description: 'Valid desc' },
      { ...validEdit(), teamId: fixtures.teams.teamB.id },
      { ...validEdit(), cancelledAt: futureIso() },
      { ...validEdit(), title: 'x'.repeat(121) },
      { ...validEdit(), description: 'd'.repeat(4001) },
      { ...validEdit(), title: 'Bad\ud800title' },
      { ...validEdit(), description: 'Bad\u0000desc' },
      { ...validEdit(), dueAt: '2030-02-30T12:00:00Z' },
    ];

    for (const payload of badPayloads) {
      const res = await patchMilestone(id, payload).expect(400);
      expect(res.body.error.code).toBe('INVALID_INPUT');
    }

    const after = await prisma.milestone.findUniqueOrThrow({ where: { id } });
    expect(after).toEqual(before);
  });

  it('STS-13 enforces exact DB-clock 1 ms future dueAt boundary and rechecks clock after lock wait', async () => {
    const id = fixtures.milestones.milestoneFuture.id;
    const fixedClock = new Date('2030-05-01T12:00:00.500Z');
    const service = new MilestoneService(prisma, async () => fixedClock);
    const actor = { userId: fixtures.users.supA.id, role: 'supervisor' as const };

    await expect(service.updateMilestone(id, { ...validEdit(), dueAt: '2030-05-01T12:00:00.499Z' }, actor))
      .rejects.toMatchObject({ status: 400, code: 'INVALID_INPUT', fields: { dueAt: expect.any(String) } });
    await expect(service.updateMilestone(id, { ...validEdit(), dueAt: '2030-05-01T12:00:00.500Z' }, actor))
      .rejects.toMatchObject({ status: 400, code: 'INVALID_INPUT', fields: { dueAt: expect.any(String) } });

    const saved = await service.updateMilestone(id, { ...validEdit(), dueAt: '2030-05-01T12:00:00.501Z' }, actor);
    expect(saved.dueAt).toBe('2030-05-01T12:00:00.501Z');

    // Real DB clock crossed during team lock wait:
    let release!: () => void;
    let acquired!: () => void;
    const gate = new Promise<void>(resolve => { release = resolve; });
    const held = new Promise<void>(resolve => { acquired = resolve; });
    const teamId = fixtures.teams.teamA.id;
    const lock = prisma.$transaction(async tx => {
      await tx.$queryRaw`SELECT id FROM teams WHERE id=${teamId}::uuid FOR UPDATE`;
      acquired();
      await gate;
    }, { timeout: 10_000 });
    await held;
    const nowRows = await prisma.$queryRaw<{ now: Date }[]>`SELECT clock_timestamp() AS now`;
    const borderlineDue = new Date(nowRows[0]!.now.getTime() + 450).toISOString();
    const pendingPatch = patchMilestone(id, { ...validEdit(), dueAt: borderlineDue }).then(r => r);
    try {
      expect(await waitForDbLock()).toBe(true);
      await new Promise(resolve => setTimeout(resolve, 600));
    } finally {
      release();
      await lock;
    }
    const lockRes = await pendingPatch;
    expect(lockRes.status).toBe(400);
    expect(lockRes.body.error.code).toBe('INVALID_INPUT');
    expect(lockRes.body.error.fields).toHaveProperty('dueAt');
  });

  it('STS-11 rejects edit and cancel once any submission exists while allowing new milestones in the same team', async () => {
    const id = fixtures.milestones.milestoneFuture.id;
    const before = await prisma.milestone.findUniqueOrThrow({ where: { id } });
    await prisma.submission.create({
      data: {
        milestoneId: id,
        submittedById: fixtures.users.stuA1.id,
        version: 1,
        title: 'Submitted v1',
        description: 'Locked submission history',
        url: 'https://example.edu/sub/1',
        submittedAt: new Date(),
      },
    });

    const editRes = await patchMilestone(id, validEdit()).expect(409);
    expect(editRes.body.error.code).toBe('MILESTONE_HISTORY_LOCKED');

    const cancelRes = await cancelMilestone(id, {}).expect(409);
    expect(cancelRes.body.error.code).toBe('MILESTONE_HISTORY_LOCKED');

    const after = await prisma.milestone.findUniqueOrThrow({ where: { id } });
    expect(after.title).toBe(before.title);
    expect(after.description).toBe(before.description);
    expect(after.dueAt.getTime()).toBe(before.dueAt.getTime());
    expect(after.cancelledAt).toBeNull();

    // Creating a new milestone in the same team remains permitted:
    const newMilestone = await request(app())
      .post(`/api/teams/${fixtures.teams.teamA.id}/milestones`)
      .set('Cookie', supA.cookie)
      .set('Origin', origin)
      .set('X-CSRF-Token', supA.csrf)
      .set('Content-Type', 'application/json')
      .send(JSON.stringify(validEdit()))
      .expect(201);
    expect(newMilestone.body.data.teamId).toBe(fixtures.teams.teamA.id);
  });

  it('STS-12 cancels active and overdue unsubmitted milestones, preserves rows, and enforces cancelled precedence', async () => {
    const overdue = fixtures.milestones.milestonePast;
    const badBody = await cancelMilestone(overdue.id, { reason: 'should fail' }).expect(400);
    expect(badBody.body.error.code).toBe('INVALID_INPUT');

    const cancelled = await cancelMilestone(overdue.id, {}).expect(200);
    expect(cancelled.body.data.id).toBe(overdue.id);
    expect(cancelled.body.data.cancelledAt).toBeTruthy();

    // Terminal state: repeat cancel, edit, and student submission all return 409 MILESTONE_CANCELLED:
    const again = await cancelMilestone(overdue.id, {}).expect(409);
    expect(again.body.error.code).toBe('MILESTONE_CANCELLED');

    const editCancelled = await patchMilestone(overdue.id, validEdit()).expect(409);
    expect(editCancelled.body.error.code).toBe('MILESTONE_CANCELLED');

    const active = fixtures.milestones.milestoneFuture;
    await cancelMilestone(active.id, {}).expect(200);
    const submitCancelled = await request(app())
      .post(`/api/milestones/${active.id}/submissions`)
      .set('Cookie', stuA1.cookie)
      .set('Origin', origin)
      .set('X-CSRF-Token', stuA1.csrf)
      .set('Content-Type', 'application/json')
      .send(JSON.stringify({ title: 'Late attempt', description: 'Cannot save', url: 'https://example.edu/x' }))
      .expect(409);
    expect(submitCancelled.body.error.code).toBe('MILESTONE_CANCELLED');
    expect(await prisma.submission.count({ where: { milestoneId: active.id } })).toBe(0);

    // Precedence check: cancelledAt takes priority over MILESTONE_HISTORY_LOCKED:
    await prisma.submission.create({
      data: {
        milestoneId: active.id,
        submittedById: fixtures.users.stuA1.id,
        version: 1,
        title: 'Legacy fixture',
        description: 'Historical precedence test',
        url: 'https://example.edu/legacy',
        submittedAt: new Date(),
      },
    });
    const precedenceRes = await patchMilestone(active.id, validEdit()).expect(409);
    expect(precedenceRes.body.error.code).toBe('MILESTONE_CANCELLED');
  });

  it('STS-28 enforces auth, role, CSRF/origin, media type, UUID validation, and equal 404 for foreign/absent milestones', async () => {
    const foreignId = fixtures.milestones.milestoneBTeam.id;
    const absentId = randomUUID();
    const ownId = fixtures.milestones.milestoneFuture.id;

    // 401 unauthenticated
    await request(app()).patch(`/api/milestones/${ownId}`).set('Content-Type', 'application/json').send(JSON.stringify(validEdit())).expect(401);
    await request(app()).post(`/api/milestones/${ownId}/cancel`).set('Content-Type', 'application/json').send('{}').expect(401);

    // 403 student role
    await patchMilestone(ownId, validEdit(), stuA1).expect(403);
    await cancelMilestone(ownId, {}, stuA1).expect(403);

    // 403 CSRF & foreign origin
    await request(app()).patch(`/api/milestones/${ownId}`).set('Cookie', supA.cookie).set('Origin', origin).set('Content-Type', 'application/json').send(JSON.stringify(validEdit())).expect(403);
    await request(app()).post(`/api/milestones/${ownId}/cancel`).set('Cookie', supA.cookie).set('Origin', 'https://foreign.example').set('X-CSRF-Token', supA.csrf).set('Content-Type', 'application/json').send('{}').expect(403);

    // 415 non-JSON
    await request(app()).patch(`/api/milestones/${ownId}`).set('Cookie', supA.cookie).set('Origin', origin).set('X-CSRF-Token', supA.csrf).set('Content-Type', 'text/plain').send('plain').expect(415);

    // 400 malformed UUID
    await patchMilestone('not-a-uuid', validEdit()).expect(400);
    await cancelMilestone('not-a-uuid', {}).expect(400);

    // Equal 404 for foreign vs absent milestone
    const foreignPatch = await patchMilestone(foreignId, validEdit(), supA);
    const absentPatch = await patchMilestone(absentId, validEdit(), supA);
    expect(foreignPatch.status).toBe(404);
    expect(absentPatch.status).toBe(404);
    expect(foreignPatch.body).toEqual(absentPatch.body);

    const foreignCancel = await cancelMilestone(foreignId, {}, supA);
    const absentCancel = await cancelMilestone(absentId, {}, supA);
    expect(foreignCancel.status).toBe(404);
    expect(absentCancel.status).toBe(404);
    expect(foreignCancel.body).toEqual(absentCancel.body);
  });

  it('STS-14 serializes concurrent cancel vs first-submit cleanly with no conflicting state', async () => {
    const id = fixtures.milestones.milestoneFuture.id;
    let release!: () => void;
    let acquired!: () => void;
    const gate = new Promise<void>(resolve => { release = resolve; });
    const held = new Promise<void>(resolve => { acquired = resolve; });
    const blocker = prisma.$transaction(async tx => {
      await tx.$queryRaw`SELECT id FROM teams WHERE id=${fixtures.teams.teamA.id}::uuid FOR UPDATE`;
      acquired();
      await gate;
    }, { timeout: 10_000 });
    await held;

    const cancelPending = cancelMilestone(id, {}).then(r => r);
    const submitPending = request(app())
      .post(`/api/milestones/${id}/submissions`)
      .set('Cookie', stuA1.cookie)
      .set('Origin', origin)
      .set('X-CSRF-Token', stuA1.csrf)
      .set('Content-Type', 'application/json')
      .send(JSON.stringify({ title: 'Race work', description: 'Concurrent submission', url: 'https://example.edu/race' }))
      .then(r => r);

    try {
      expect(await waitForDbLock()).toBe(true);
    } finally {
      release();
      await blocker;
    }

    const [cancelRes, submitRes] = await Promise.all([cancelPending, submitPending]);
    const row = await prisma.milestone.findUniqueOrThrow({ where: { id } });
    const subCount = await prisma.submission.count({ where: { milestoneId: id } });

    if (cancelRes.status === 200) {
      expect(submitRes.status).toBe(409);
      expect(submitRes.body.error.code).toBe('MILESTONE_CANCELLED');
      expect(row.cancelledAt).not.toBeNull();
      expect(subCount).toBe(0);
    } else {
      expect(submitRes.status).toBe(201);
      expect(cancelRes.status).toBe(409);
      expect(cancelRes.body.error.code).toBe('MILESTONE_HISTORY_LOCKED');
      expect(row.cancelledAt).toBeNull();
      expect(subCount).toBe(1);
    }
  });

  it('STS-14 serializes concurrent edit vs first-submit so submit evaluates the committed dueAt', async () => {
    const id = fixtures.milestones.milestoneFuture.id;
    let release!: () => void;
    let acquired!: () => void;
    const gate = new Promise<void>(resolve => { release = resolve; });
    const held = new Promise<void>(resolve => { acquired = resolve; });
    const blocker = prisma.$transaction(async tx => {
      await tx.$queryRaw`SELECT id FROM teams WHERE id=${fixtures.teams.teamA.id}::uuid FOR UPDATE`;
      acquired();
      await gate;
    }, { timeout: 10_000 });
    await held;

    const newDue = futureIso(5 * 86_400_000);
    const editPending = patchMilestone(id, { title: 'Edited before submit', description: 'Updated desc', dueAt: newDue }).then(r => r);
    const submitPending = request(app())
      .post(`/api/milestones/${id}/submissions`)
      .set('Cookie', stuA1.cookie)
      .set('Origin', origin)
      .set('X-CSRF-Token', stuA1.csrf)
      .set('Content-Type', 'application/json')
      .send(JSON.stringify({ title: 'Submit work', description: 'Concurrent submission', url: 'https://example.edu/race2' }))
      .then(r => r);

    try {
      expect(await waitForDbLock()).toBe(true);
    } finally {
      release();
      await blocker;
    }

    const [editRes, submitRes] = await Promise.all([editPending, submitPending]);
    const row = await prisma.milestone.findUniqueOrThrow({ where: { id } });
    const subCount = await prisma.submission.count({ where: { milestoneId: id } });

    if (editRes.status === 200) {
      expect(submitRes.status).toBe(201);
      expect(row.title).toBe('Edited before submit');
      expect(row.dueAt.toISOString()).toBe(newDue);
      expect(subCount).toBe(1);
    } else {
      expect(submitRes.status).toBe(201);
      expect(editRes.status).toBe(409);
      expect(editRes.body.error.code).toBe('MILESTONE_HISTORY_LOCKED');
      expect(row.title).not.toBe('Edited before submit');
      expect(subCount).toBe(1);
    }

    // Also verify edit-extending-overdue-milestone vs submit: submit rechecks updated dueAt or fails 409 DEADLINE_PASSED cleanly
    const pastId = fixtures.milestones.milestonePast.id;
    await prisma.milestone.update({ where: { id: pastId }, data: { dueAt: new Date(Date.now() - 60_000) } });
    const extendedDue = futureIso(4 * 86_400_000);
    const [pastEditRes, pastSubmitRes] = await Promise.all([
      patchMilestone(pastId, { title: 'Extended past milestone', description: 'Extended window', dueAt: extendedDue }),
      request(app())
        .post(`/api/milestones/${pastId}/submissions`)
        .set('Cookie', stuA1.cookie)
        .set('Origin', origin)
        .set('X-CSRF-Token', stuA1.csrf)
        .set('Content-Type', 'application/json')
        .send(JSON.stringify({ title: 'Submit extended', description: 'Window race', url: 'https://example.edu/ext' })),
    ]);
    expect(pastEditRes.status).toBe(200);
    const extended = await prisma.milestone.findUniqueOrThrow({ where: { id: pastId } });
    expect(extended.dueAt.toISOString()).toBe(extendedDue);
    if (pastSubmitRes.status === 201) {
      expect(await prisma.submission.count({ where: { milestoneId: pastId } })).toBe(1);
    } else {
      expect(pastSubmitRes.status).toBe(409);
      expect(pastSubmitRes.body.error.code).toBe('DEADLINE_PASSED');
      expect(await prisma.submission.count({ where: { milestoneId: pastId } })).toBe(0);
    }
  });

  it('STS-30 retries confirmed rolled-back contention up to 3 attempts and returns sanitized 503 after exhaustion', async () => {
    const id = fixtures.milestones.milestoneFuture.id;
    const before = await prisma.milestone.findUniqueOrThrow({ where: { id } });
    let calls = 0;
    const retryService = new MilestoneService(prisma, async () => {
      if (++calls < 3) throw new Prisma.PrismaClientKnownRequestError('Synthetic rollback', { code: 'P2034', clientVersion: '7.10.1' });
      return new Date('2026-01-01T00:00:00.000Z');
    });

    const updated = await retryService.updateMilestone(id, validEdit(), { userId: fixtures.users.supA.id, role: 'supervisor' });
    expect(calls).toBe(3);
    expect(updated.title).toBe(validEdit().title);

    let failedCalls = 0;
    const failService = new MilestoneService(prisma, async () => {
      failedCalls++;
      throw new Prisma.PrismaClientKnownRequestError('Private SQL details', { code: 'P2034', clientVersion: '7.10.1' });
    });
    const prevRow = await prisma.milestone.findUniqueOrThrow({ where: { id } });
    await expect(failService.cancelMilestone(id, {}, { userId: fixtures.users.supA.id, role: 'supervisor' }))
      .rejects.toMatchObject({ status: 503, code: 'TEMPORARILY_UNAVAILABLE' });
    expect(failedCalls).toBe(3);
    expect((await prisma.milestone.findUniqueOrThrow({ where: { id } })).cancelledAt).toBeNull();
    expect(prevRow.id).toBe(before.id);
  });
});
