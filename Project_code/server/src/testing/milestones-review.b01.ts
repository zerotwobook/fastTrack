import { randomUUID } from 'node:crypto';
import { beforeEach, afterAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import { createApp } from '../app.js';
import { loadConfig } from '../config.js';
import { createApplicationRouters } from '../modules/index.js';
import { createSessionProtection } from '../modules/auth/index.js';
import { createMilestoneRouter } from '../modules/milestones/router.js';
import { createBaseFixtures, createTestPrisma, cleanTestDatabase, TEST_PASSWORD } from './fixtures.js';

const prisma = createTestPrisma();
const origin = 'http://127.0.0.1:5173';
const config = loadConfig({ NODE_ENV: 'test', DATABASE_URL: process.env.TEST_DATABASE_URL, APP_ORIGIN: origin });
const protection = createSessionProtection({ prisma, config });
const milestoneRouter = createMilestoneRouter({ prisma, getAuthContext: protection.getAuthContext,
  requireSession: protection.requireSession, requireSupervisor: protection.requireRole('supervisor'), requireMutation: protection.requireMutation });
const app = createApp(config, { logger: () => undefined, routers: { ...createApplicationRouters({ prisma, config }), milestones: milestoneRouter } });
let fixtures: Awaited<ReturnType<typeof createBaseFixtures>>;
let cookie: string;
let csrf: string;
const good = () => ({ title: 'Engineering baseline', description: 'Complete the agreed deliverables.', dueAt: new Date(Date.now() + 86400_000).toISOString() });
const post = (body: unknown, teamId = fixtures.teams.teamA.id) => request(app).post(`/api/teams/${teamId}/milestones`)
  .set('Cookie', cookie).set('Origin', origin).set('X-CSRF-Token', csrf).set('Content-Type', 'application/json').send(JSON.stringify(body));
async function login(email = 'sup-a@test.local') {
  const response = await request(app).post('/api/auth/login').set('Origin', origin).set('X-fastTrack-Request', '1').send({ email, password: TEST_PASSWORD }).expect(200);
  return { cookie: String(response.headers['set-cookie']?.[0]).split(';')[0]!, csrf: String(response.body.data.csrfToken) };
}
beforeEach(async () => { fixtures = await createBaseFixtures(prisma); ({ cookie, csrf } = await login()); });
afterAll(async () => { await cleanTestDatabase(prisma); await prisma.$disconnect(); });

describe('B01 independent real-session regression', () => {
  it('requires every protection dependency at runtime', () => {
    expect(() => createMilestoneRouter({ prisma, getAuthContext: protection.getAuthContext } as never)).toThrow();
  });
  it('T-06 creates then reads identical persisted list/detail projections', async () => {
    const response = await post(good()).expect(201); const id = response.body.data.id;
    const stored = await prisma.milestone.findUniqueOrThrow({ where: { id } });
    expect(stored.createdById).toBe(fixtures.users.supA.id);
    const detail = await request(app).get(`/api/milestones/${id}`).set('Cookie', cookie).expect(200);
    const list = await request(app).get(`/api/teams/${fixtures.teams.teamA.id}/milestones`).set('Cookie', cookie).expect(200);
    expect(list.body.data.find((m: { id: string }) => m.id === id)).toEqual(detail.body.data);
    expect(detail.body.data).toEqual(response.body.data);
    expect(detail.headers['cache-control']).toBe('no-store');
  });
  it.each([
    { title: 't'.repeat(120), description: 'd'.repeat(4000) },
    { title: '\u{1f680}'.repeat(120), description: 'd' },
  ])('T-08 accepts exact canonical code-point maxima %j', async bounds => {
    const result = await post({ ...good(), ...bounds }).expect(201);
    expect(result.body.data.title).toBe(bounds.title); expect(result.body.data.description).toBe(bounds.description);
  });
  const invalid = [null, [], {}, { title: 123 }, { description: false }, { description: '' }, { description: '\u00a0\ufeff' },
    { title: 'x'.repeat(121) }, { description: 'd'.repeat(4001) }, { dueAt: 123 }, { createdById: 'forged' }, { teamId: 'forged' }];
  it.each(['title', 'description'].flatMap(field => ['\u0000', '\ud800', '\udfff'].map(invalid => [field, invalid] as const)))('rejects unsupported Unicode in %s as 400 before persistence (%j)', async (field, invalid) => {
    const before = await prisma.milestone.count();
    const response = await post({ ...good(), [field]: `Work${invalid}text` }).expect(400);
    expect(response.body.error.code).toBe('INVALID_INPUT'); expect(response.body.error.fields).toHaveProperty(field);
    expect(await prisma.milestone.count()).toBe(before);
  });
  it.each(invalid.map((value, index) => [index, value] as const))('T-08 rejects malformed/forged payload case %i without writes', async (_index, value) => {
    const before = await prisma.milestone.count();
    const body = value !== null && !Array.isArray(value) && typeof value === 'object' && Object.keys(value).length ? { ...good(), ...value } : value;
    await post(body).expect(400); expect(await prisma.milestone.count()).toBe(before);
  });
  it('T-08 requires description and validates input shape before foreign scope', async () => {
    const { description: _description, ...missing } = good();
    await post(missing).expect(400);
    await post({ ...good(), title: 123 }, fixtures.teams.teamB.id).expect(400);
  });
  it.each(['2030-02-30T12:00:00+07:00', '2030-01-01T12:00:00.1234Z', '2030-01-01T12:00:00', '2030-01-01T25:00:00Z'])('T-08 rejects invalid calendar/precision/zone %s without writes', async dueAt => {
    const before = await prisma.milestone.count(); await post({ ...good(), dueAt }).expect(400); expect(await prisma.milestone.count()).toBe(before);
  });
  it('T-07 checks session/role/CSRF before invalid JSON and rejects forged identity', async () => {
    const path = `/api/teams/${fixtures.teams.teamA.id}/milestones`;
    await request(app).post(path).set('X-User-Id', fixtures.users.supA.id).set('Content-Type', 'application/json').send('{bad').expect(401);
    const student = await login('stu-a1@test.local');
    await request(app).post(path).set('Cookie', student.cookie).set('Content-Type', 'application/json').send('{bad').expect(403);
    const before = await prisma.milestone.count();
    await request(app).post(path).set('Cookie', cookie).set('Origin', origin).send(good()).expect(403);
    await request(app).post(path).set('Cookie', cookie).set('Origin', 'https://foreign.example').set('X-CSRF-Token', csrf).send(good()).expect(403);
    expect(await prisma.milestone.count()).toBe(before);
  });
  it('T-07 conceals foreign versus missing milestone identity with equal 404 bodies', async () => {
    const foreign = await request(app).get(`/api/milestones/${fixtures.milestones.milestoneBTeam.id}`).set('Cookie', cookie);
    const absent = await request(app).get(`/api/milestones/${randomUUID()}`).set('Cookie', cookie);
    expect(foreign.status).toBe(404); expect(absent.status).toBe(404); expect(foreign.body).toEqual(absent.body);
  });
  it('T-25 projects only latest-version feedback and preserves stable dueAt/id ordering', async () => {
    const milestone = fixtures.milestones.milestoneFuture;
    const first = await prisma.submission.create({ data: { milestoneId: milestone.id, submittedById: fixtures.users.stuA1.id, version: 1, title: 'First', description: 'First synthetic version', url: 'https://example.edu/first', submittedAt: new Date() } });
    const latest = await prisma.submission.create({ data: { milestoneId: milestone.id, submittedById: fixtures.users.stuA1.id, version: 2, title: 'Latest', description: 'Latest projection fixture', url: 'https://example.edu/latest', submittedAt: new Date() } });
    for (const submissionId of [first.id, first.id, latest.id]) await prisma.feedback.create({ data: { submissionId, supervisorId: fixtures.users.supA.id, content: 'Synthetic feedback', clientRequestId: randomUUID() } });
    const detail = await request(app).get(`/api/milestones/${milestone.id}`).set('Cookie', cookie).expect(200);
    expect(detail.body.data.latestSubmission).toEqual({ id: latest.id, version: 2, submittedAt: latest.submittedAt.toISOString(), feedbackCount: 1 });
    expect(Object.keys(detail.body.data).sort()).toEqual(['cancelledAt','createdAt','description','dueAt','id','latestSubmission','teamId','title']);
    const list = await request(app).get(`/api/teams/${fixtures.teams.teamA.id}/milestones`).set('Cookie', cookie).expect(200);
    const keys = list.body.data.map((m: { dueAt: string; id: string }) => `${m.dueAt}/${m.id}`);
    expect(keys).toEqual([...keys].sort());
  });
  it('T-06 production composition exposes the real session-protected milestone routes', async () => {
    const composed = createApp(config, { logger: () => undefined, routers: createApplicationRouters({ prisma, config }) });
    await request(composed).get(`/api/teams/${fixtures.teams.teamA.id}/milestones`).set('Cookie', cookie).expect(200);
  });
  it('T-08 rechecks database future time after waiting for the team lock', async () => {
    let release!: () => void; let held!: () => void;
    const gate = new Promise<void>(resolve => { release = resolve; }); const acquired = new Promise<void>(resolve => { held = resolve; });
    const teamId = fixtures.teams.teamA.id;
    const lock = prisma.$transaction(async tx => { await tx.$queryRaw`SELECT id FROM teams WHERE id=${teamId}::uuid FOR UPDATE`; held(); await gate; }, { timeout: 10_000 });
    await acquired;
    const rows = await prisma.$queryRaw<{ now: Date }[]>`SELECT clock_timestamp() AS now`;
    const dueAt = new Date(rows[0]!.now.getTime() + 500).toISOString();
    const before = await prisma.milestone.count(); const pending = post({ ...good(), dueAt }).then(result => result);
    try {
      let waiting = false;
      for (let count = 0; count < 100; count++) {
        const rows = await prisma.$queryRaw<{ count: number }[]>`SELECT count(*)::int AS count FROM pg_stat_activity WHERE datname=current_database() AND wait_event_type='Lock'`;
        if (rows[0]!.count) { waiting = true; break; } await new Promise(resolve => setTimeout(resolve, 20));
      }
      expect(waiting).toBe(true); await new Promise(resolve => setTimeout(resolve, 600));
    } finally { release(); await lock; }
    const result = await pending; expect(result.status).toBe(400); expect(await prisma.milestone.count()).toBe(before);
  });
});
