import { randomUUID } from 'node:crypto';
import { afterAll, beforeEach, describe, expect, it } from 'vitest';
import request from 'supertest';
import { Prisma } from '../db/generated/client/index.js';
import { createApp } from '../app.js';
import { loadConfig } from '../config.js';
import { createApplicationRouters } from '../modules/index.js';
import { RevisionService } from '../modules/submissions/revisions.js';
import { createBaseFixtures, createTestPrisma, cleanTestDatabase, TEST_PASSWORD } from './fixtures.js';

const prisma = createTestPrisma();
const origin = 'http://127.0.0.1:5173';
const config = loadConfig({ NODE_ENV: 'test', DATABASE_URL: process.env['TEST_DATABASE_URL'], APP_ORIGIN: origin });
const app = () => createApp(config, { logger: () => undefined, routers: createApplicationRouters({ prisma, config }) });

let fixtures: Awaited<ReturnType<typeof createBaseFixtures>>;
let stuA1: { cookie: string; csrf: string };
let stuA2: { cookie: string; csrf: string };
let stuB1: { cookie: string; csrf: string };
let supA: { cookie: string; csrf: string };
let supB: { cookie: string; csrf: string };

const v1Body = () => ({
  title: 'Initial work v1',
  description: 'First baseline version for Sprint 2.',
  url: 'https://example.edu/team-a/v1',
});

const revBody = (expectedVersion: number, versionLabel = expectedVersion + 1) => ({
  title: `Revised work v${versionLabel}`,
  description: `Updated deliverables for version ${versionLabel}.`,
  url: `https://example.edu/team-a/v${versionLabel}?rev=${versionLabel}`,
  expectedVersion,
});

async function login(email: string) {
  const res = await request(app())
    .post('/api/auth/login')
    .set('Origin', origin)
    .set('X-fastTrack-Request', '1')
    .send({ email, password: TEST_PASSWORD })
    .expect(200);
  return { cookie: String(res.headers['set-cookie']?.[0]).split(';')[0]!, csrf: String(res.body.data.csrfToken) };
}

const submitFirst = (milestoneId: string, actor = stuA1, body = v1Body()) => request(app())
  .post(`/api/milestones/${milestoneId}/submissions`)
  .set('Cookie', actor.cookie)
  .set('Origin', origin)
  .set('X-CSRF-Token', actor.csrf)
  .set('Content-Type', 'application/json')
  .send(JSON.stringify(body));

const postRevision = (milestoneId: string, body: unknown, actor = stuA1) => request(app())
  .post(`/api/milestones/${milestoneId}/revisions`)
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
  [stuA1, stuA2, stuB1, supA, supB] = await Promise.all([
    login('stu-a1@test.local'),
    login('stu-a2@test.local'),
    login('stu-b1@test.local'),
    login('sup-a@test.local'),
    login('sup-b@test.local'),
  ]);
});

afterAll(async () => {
  await cleanTestDatabase(prisma);
  await prisma.$disconnect();
});

describe('F-06 revisions, conflict control, and immutable history (STS-15..STS-21, STS-28..STS-30)', () => {
  it('STS-15/STS-16 requires a first submission, appends atomic versions sequentially, and preserves immutable history', async () => {
    const id = fixtures.milestones.milestoneFuture.id;

    // Revision before any submission returns 409 SUBMISSION_REQUIRED
    const noBase = await postRevision(id, revBody(1)).expect(409);
    expect(noBase.body.error.code).toBe('SUBMISSION_REQUIRED');
    expect(await prisma.submission.count({ where: { milestoneId: id } })).toBe(0);

    // First submission creates v1; repeat POST /submissions remains 409 ALREADY_SUBMITTED
    const v1 = await submitFirst(id, stuA1).expect(201);
    expect(v1.body.data.version).toBe(1);
    const repeatFirst = await submitFirst(id, stuA2).expect(409);
    expect(repeatFirst.body.error.code).toBe('ALREADY_SUBMITTED');

    // Sequential revisions: v2 by stuA2, then v3 by stuA1
    const v2 = await postRevision(id, revBody(1, 2), stuA2).expect(201);
    expect(v2.headers['cache-control']).toBe('no-store');
    expect(v2.body.data.version).toBe(2);
    expect(v2.body.data.submittedBy).toEqual({ id: fixtures.users.stuA2.id, displayName: 'Student A2' });

    const v3 = await postRevision(id, revBody(2, 3), stuA1).expect(201);
    expect(v3.body.data.version).toBe(3);
    expect(v3.body.data.submittedBy).toEqual({ id: fixtures.users.stuA1.id, displayName: 'Student A1' });

    // Stale expectedVersion 1 or 2 now returns 409 VERSION_CONFLICT without inserting
    const stale = await postRevision(id, revBody(1, 4), stuA1).expect(409);
    expect(stale.body.error.code).toBe('VERSION_CONFLICT');
    expect(await prisma.submission.count({ where: { milestoneId: id } })).toBe(3);

    // Descending list + immutable exact-ID detail readbacks
    const list = await request(app()).get(`/api/milestones/${id}/submissions`).set('Cookie', stuA1.cookie).expect(200);
    expect(list.body.data.map((row: { version: number }) => row.version)).toEqual([3, 2, 1]);

    const detailV1 = await request(app()).get(`/api/submissions/${v1.body.data.id}`).set('Cookie', stuA2.cookie).expect(200);
    expect(detailV1.body.data).toEqual(v1.body.data);
  });

  it('STS-17 serializes concurrent same-expectedVersion revisions cleanly with one 201 and one 409 VERSION_CONFLICT', async () => {
    const id = fixtures.milestones.milestoneFuture.id;
    await submitFirst(id, stuA1).expect(201);

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

    const req1 = postRevision(id, revBody(1, 2), stuA1).then(r => r);
    const req2 = postRevision(id, revBody(1, 99), stuA2).then(r => r);

    try {
      expect(await waitForDbLock()).toBe(true);
    } finally {
      release();
      await blocker;
    }

    const [res1, res2] = await Promise.all([req1, req2]);
    const statuses = [res1.status, res2.status].sort((a, b) => a - b);
    expect(statuses).toEqual([201, 409]);

    const winner = res1.status === 201 ? res1 : res2;
    const loser = res1.status === 409 ? res1 : res2;
    expect(winner.body.data.version).toBe(2);
    expect(loser.body.error.code).toBe('VERSION_CONFLICT');
    expect(await prisma.submission.count({ where: { milestoneId: id } })).toBe(2);
  });

  it('STS-18 enforces 1 ms DB-clock boundaries, lock-wait deadline crossing, and cancelled precedence', async () => {
    const id = fixtures.milestones.milestoneExact.id;
    await submitFirst(id, stuA1).expect(201);

    const exactMilestone = await prisma.milestone.findUniqueOrThrow({ where: { id } });
    const actor = { userId: fixtures.users.stuA1.id, role: 'student' as const };

    // After by 1 ms -> rejected without insert
    const afterService = new RevisionService(prisma, async () => new Date(exactMilestone.dueAt.getTime() + 1));
    await expect(afterService.revise(id, revBody(1, 2), actor)).rejects.toMatchObject({ status: 409, code: 'DEADLINE_PASSED' });
    expect(await prisma.submission.count({ where: { milestoneId: id } })).toBe(1);

    // Equal to dueAt -> accepted and stored timestamp equals acceptedAt
    const equalClock = new Date(exactMilestone.dueAt.getTime());
    const equalService = new RevisionService(prisma, async () => equalClock);
    const v2 = await equalService.revise(id, revBody(1, 2), actor);
    expect(v2.version).toBe(2);
    expect(v2.submittedAt).toBe(equalClock.toISOString());

    // Real DB lock-wait crossing deadline on milestoneFuture -> 409 DEADLINE_PASSED without insert
    const futureId = fixtures.milestones.milestoneFuture.id;
    await submitFirst(futureId, stuA1).expect(201);
    const clockRows = await prisma.$queryRaw<{ now: Date }[]>`SELECT clock_timestamp() AS now`;
    const borderlineDue = new Date(clockRows[0]!.now.getTime() + 450);
    await prisma.milestone.update({ where: { id: futureId }, data: { dueAt: borderlineDue } });

    let release!: () => void;
    let acquired!: () => void;
    const gate = new Promise<void>(resolve => { release = resolve; });
    const held = new Promise<void>(resolve => { acquired = resolve; });
    const lock = prisma.$transaction(async tx => {
      await tx.$queryRaw`SELECT id FROM milestones WHERE id=${futureId}::uuid FOR UPDATE`;
      acquired();
      await gate;
    }, { timeout: 10_000 });
    await held;

    const pending = postRevision(futureId, revBody(1, 2), stuA1).then(r => r);
    try {
      expect(await waitForDbLock()).toBe(true);
      await new Promise(resolve => setTimeout(resolve, 600));
    } finally {
      release();
      await lock;
    }
    const lockResult = await pending;
    expect(lockResult.status).toBe(409);
    expect(lockResult.body.error.code).toBe('DEADLINE_PASSED');
    expect(await prisma.submission.count({ where: { milestoneId: futureId } })).toBe(1);

    // Cancelled milestone precedence: MILESTONE_CANCELLED before SUBMISSION_REQUIRED / DEADLINE_PASSED
    const pastId = fixtures.milestones.milestonePast.id;
    await prisma.milestone.update({ where: { id: pastId }, data: { cancelledAt: new Date() } });
    const cancelledRes = await postRevision(pastId, revBody(1, 2), stuA1).expect(409);
    expect(cancelledRes.body.error.code).toBe('MILESTONE_CANCELLED');
  });

  it('STS-19/STS-28 rejects invalid payloads, auth/role violations, CSRF errors, and equal 404 for foreign/absent milestones', async () => {
    const id = fixtures.milestones.milestoneFuture.id;
    await submitFirst(id, stuA1).expect(201);

    // Validation & spoofing
    const badInputs: unknown[] = [
      { ...v1Body(), expectedVersion: '1' },
      { ...v1Body(), expectedVersion: 0 },
      { ...v1Body(), expectedVersion: 1.5 },
      { ...v1Body(), expectedVersion: 2_147_483_648 },
      { ...revBody(1), version: 2 },
      { ...revBody(1), submittedAt: '2030-01-01T00:00:00Z' },
      { ...revBody(1), url: 'javascript:alert(1)' },
      { ...revBody(1), title: 'Bad\ud800title' },
    ];
    for (const bad of badInputs) {
      await postRevision(id, bad, stuA1).expect(400);
    }

    // 401 unauthenticated, 403 supervisor, 403 bad CSRF/Origin, 415 non-JSON, 400 malformed UUID
    await request(app()).post(`/api/milestones/${id}/revisions`).set('Content-Type', 'application/json').send(JSON.stringify(revBody(1))).expect(401);
    await postRevision(id, revBody(1), supA).expect(403);
    await request(app()).post(`/api/milestones/${id}/revisions`).set('Cookie', stuA1.cookie).set('Origin', origin).set('Content-Type', 'application/json').send(JSON.stringify(revBody(1))).expect(403);
    await request(app()).post(`/api/milestones/${id}/revisions`).set('Cookie', stuA1.cookie).set('Origin', 'https://foreign.example').set('X-CSRF-Token', stuA1.csrf).set('Content-Type', 'application/json').send(JSON.stringify(revBody(1))).expect(403);
    await request(app()).post(`/api/milestones/${id}/revisions`).set('Cookie', stuA1.cookie).set('Origin', origin).set('X-CSRF-Token', stuA1.csrf).set('Content-Type', 'text/plain').send('raw').expect(415);
    await postRevision('not-a-uuid', revBody(1), stuA1).expect(400);

    // Foreign team & absent milestone return identical 404 bodies
    const foreign = await postRevision(fixtures.milestones.milestoneBTeam.id, revBody(1), stuA1);
    const absent = await postRevision(randomUUID(), revBody(1), stuA1);
    expect(foreign.status).toBe(404);
    expect(absent.status).toBe(404);
    expect(foreign.body).toEqual(absent.body);

    const foreignRead = await request(app()).get(`/api/milestones/${id}/submissions`).set('Cookie', stuB1.cookie);
    const absentRead = await request(app()).get(`/api/milestones/${randomUUID()}/submissions`).set('Cookie', stuB1.cookie);
    expect(foreignRead.status).toBe(404);
    expect(foreignRead.body).toEqual(absentRead.body);
    expect(await prisma.submission.count({ where: { milestoneId: id } })).toBe(1);
  });

  it('STS-20/STS-21/STS-29 binds feedback to exact version, allows post-deadline old-version feedback, and preserves S1 data', async () => {
    const id = fixtures.milestones.milestoneFuture.id;
    const teamBefore = await prisma.team.findUniqueOrThrow({ where: { id: fixtures.teams.teamA.id }, include: { members: true } });
    const stuRowBefore = await prisma.user.findUniqueOrThrow({ where: { id: fixtures.users.stuA1.id } });

    const v1 = await submitFirst(id, stuA1).expect(201);
    const fb1 = await request(app())
      .post(`/api/submissions/${v1.body.data.id}/feedback`)
      .set('Cookie', supA.cookie)
      .set('Origin', origin)
      .set('X-CSRF-Token', supA.csrf)
      .set('Content-Type', 'application/json')
      .send(JSON.stringify({ content: 'Feedback specifically on v1.', clientRequestId: randomUUID() }))
      .expect(201);

    // Creating v2 preserves v1 feedback and keeps latestSubmission.feedbackCount at 0
    const v2 = await postRevision(id, revBody(1, 2), stuA2).expect(201);
    const milestoneAfterV2 = await request(app()).get(`/api/milestones/${id}`).set('Cookie', stuA1.cookie).expect(200);
    expect(milestoneAfterV2.body.data.latestSubmission).toEqual({
      id: v2.body.data.id,
      version: 2,
      submittedAt: v2.body.data.submittedAt,
      feedbackCount: 0,
    });

    const v1FeedbackList = await request(app()).get(`/api/submissions/${v1.body.data.id}/feedback`).set('Cookie', stuA1.cookie).expect(200);
    expect(v1FeedbackList.body.data.map((f: { id: string }) => f.id)).toEqual([fb1.body.data.id]);
    const v2FeedbackList = await request(app()).get(`/api/submissions/${v2.body.data.id}/feedback`).set('Cookie', stuA1.cookie).expect(200);
    expect(v2FeedbackList.body.data).toEqual([]);

    // Post-deadline feedback on older v1 still succeeds without affecting v2's feedbackCount or creating foreign access
    await prisma.milestone.update({ where: { id }, data: { dueAt: new Date(Date.now() - 10_000) } });
    const fb1Late = await request(app())
      .post(`/api/submissions/${v1.body.data.id}/feedback`)
      .set('Cookie', supA.cookie)
      .set('Origin', origin)
      .set('X-CSRF-Token', supA.csrf)
      .set('Content-Type', 'application/json')
      .send(JSON.stringify({ content: 'Follow-up note on v1 after deadline.', clientRequestId: randomUUID() }))
      .expect(201);
    expect(fb1Late.body.data.submissionId).toBe(v1.body.data.id);

    // Foreign supervisor cannot read v2 or add feedback on v1
    await request(app()).get(`/api/submissions/${v2.body.data.id}`).set('Cookie', supB.cookie).expect(404);
    await request(app())
      .post(`/api/submissions/${v1.body.data.id}/feedback`)
      .set('Cookie', supB.cookie)
      .set('Origin', origin)
      .set('X-CSRF-Token', supB.csrf)
      .set('Content-Type', 'application/json')
      .send(JSON.stringify({ content: 'Forbidden note', clientRequestId: randomUUID() }))
      .expect(404);

    // Verify latestSubmission projection still reflects v2 with 0 feedback, and S1 records/passwords stay intact
    const milestoneFinal = await request(app()).get(`/api/milestones/${id}`).set('Cookie', supA.cookie).expect(200);
    expect(milestoneFinal.body.data.latestSubmission.feedbackCount).toBe(0);

    const teamAfter = await prisma.team.findUniqueOrThrow({ where: { id: fixtures.teams.teamA.id }, include: { members: true } });
    const stuRowAfter = await prisma.user.findUniqueOrThrow({ where: { id: fixtures.users.stuA1.id } });
    expect(teamAfter.members.map(m => m.studentId).sort()).toEqual(teamBefore.members.map(m => m.studentId).sort());
    expect(stuRowAfter.passwordHash).toBe(stuRowBefore.passwordHash);
  });

  it('STS-30 retries confirmed rolled-back contention up to 3 attempts and returns sanitized 503 after exhaustion', async () => {
    const id = fixtures.milestones.milestoneFuture.id;
    await submitFirst(id, stuA1).expect(201);

    let calls = 0;
    const acceptedAt = new Date(fixtures.milestones.milestoneFuture.dueAt.getTime() - 10);
    const retryService = new RevisionService(prisma, async () => {
      if (++calls < 3) throw new Prisma.PrismaClientKnownRequestError('Synthetic contention', { code: 'P2034', clientVersion: '7.10.1' });
      return acceptedAt;
    });
    const saved = await retryService.revise(id, revBody(1, 2), { userId: fixtures.users.stuA1.id, role: 'student' });
    expect(calls).toBe(3);
    expect(saved.version).toBe(2);
    expect(saved.submittedAt).toBe(acceptedAt.toISOString());

    let failCalls = 0;
    const failService = new RevisionService(prisma, async () => {
      failCalls++;
      throw new Prisma.PrismaClientKnownRequestError('Private SQL error', { code: 'P2034', clientVersion: '7.10.1' });
    });
    await expect(failService.revise(id, revBody(2, 3), { userId: fixtures.users.stuA1.id, role: 'student' }))
      .rejects.toMatchObject({ status: 503, code: 'TEMPORARILY_UNAVAILABLE' });
    expect(failCalls).toBe(3);
    expect(await prisma.submission.count({ where: { milestoneId: id } })).toBe(2);
  });
});
