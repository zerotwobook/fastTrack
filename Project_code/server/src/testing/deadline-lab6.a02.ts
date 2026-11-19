import { afterAll, beforeEach, describe, expect, it } from 'vitest';
import { appendFileSync } from 'node:fs';
import request from 'supertest';
import { createApp } from '../app.js';
import { loadConfig } from '../config.js';
import { createApplicationRouters } from '../modules/index.js';
import { SubmissionService } from '../modules/submissions/service.js';
import { cleanTestDatabase, createBaseFixtures, createTestPrisma, TEST_PASSWORD } from './fixtures.js';

const prisma = createTestPrisma();
const origin = 'http://127.0.0.1:5173';
const config = loadConfig({ NODE_ENV: 'test', DATABASE_URL: process.env['TEST_DATABASE_URL'], APP_ORIGIN: origin });
const app = () => createApp(config, { logger: () => undefined, routers: createApplicationRouters({ prisma, config }) });
const payload = { title: 'Lab 6 simulated exercise section 3.5', description: 'Synthetic deadline regression evidence.', url: 'https://example.edu/lab6/exercise-3-5' };
let fixtures: Awaited<ReturnType<typeof createBaseFixtures>>;
let student: { cookie: string; csrf: string };

function record(observation: Record<string, unknown>) {
  const path = process.env['LAB6_OBSERVATIONS_PATH'];
  if (path) appendFileSync(path, JSON.stringify({ observedAt: new Date().toISOString(), ...observation }) + '\n');
}

const post = (id: string, value = payload) => request(app()).post(`/api/milestones/${id}/submissions`)
  .set('Origin', origin).set('Cookie', student.cookie).set('X-CSRF-Token', student.csrf).send(value);
const read = (path: string) => request(app()).get(path).set('Cookie', student.cookie);

beforeEach(async () => {
  fixtures = await createBaseFixtures(prisma);
  const login = await request(app()).post('/api/auth/login').set('Origin', origin).set('X-fastTrack-Request', '1')
    .send({ email: 'stu-a1@test.local', password: TEST_PASSWORD }).expect(200);
  student = { cookie: String(login.headers['set-cookie']?.[0]).split(';')[0]!, csrf: String(login.body.data.csrfToken) };
});
afterAll(async () => { await cleanTestDatabase(prisma); await prisma.$disconnect(); });

describe('Lab 6 simulated exercise section 3.5 deadline regression', () => {
  it('L6-S35-01 rejects repeated late HTTP requests and preserves every saved submission row', async () => {
    const control = await post(fixtures.milestones.milestoneFuture.id, { ...payload, title: 'Saved control before deadline' }).expect(201);
    const id = fixtures.milestones.milestoneExact.id;
    await prisma.$executeRaw`UPDATE milestones SET due_at = date_trunc('milliseconds', clock_timestamp()) - interval '1 minute' WHERE id = ${id}::uuid`;
    const before = await prisma.submission.findMany({ orderBy: { id: 'asc' } });
    const first = await post(id);
    const second = await post(id);
    const after = await prisma.submission.findMany({ orderBy: { id: 'asc' } });
    const saved = await read(`/api/milestones/${id}/submissions`).expect(200);
    record({ caseId: 'L6-S35-01', statuses: [first.status, second.status], codes: [first.body.error?.code ?? null, second.body.error?.code ?? null],
      submissionCountBefore: before.length, submissionCountAfter: after.length, lateMilestoneRows: saved.body.data.length,
      allRowsUnchanged: JSON.stringify(before) === JSON.stringify(after), controlId: control.body.data.id });
    expect.soft(first.status).toBe(409);
    expect.soft(first.body.error?.code).toBe('DEADLINE_PASSED');
    expect.soft(second.status).toBe(409);
    expect.soft(second.body.error?.code).toBe('DEADLINE_PASSED');
    expect.soft(after).toEqual(before);
    expect.soft(saved.body.data).toEqual([]);
    expect.soft(after.some(row => row.title === payload.title && row.url === payload.url)).toBe(false);
    expect((await read(`/api/submissions/${control.body.data.id}`).expect(200)).body.data).toEqual(control.body.data);
  });

  it('L6-S35-02 accepts an HTTP submission before the database deadline and persists version one', async () => {
    const id = fixtures.milestones.milestoneExact.id;
    await prisma.$executeRaw`UPDATE milestones SET due_at = date_trunc('milliseconds', clock_timestamp()) + interval '1 minute' WHERE id = ${id}::uuid`;
    const result = await post(id);
    const rows = await prisma.submission.findMany({ where: { milestoneId: id } });
    record({ caseId: 'L6-S35-02', status: result.status, persistedRows: rows.length, version: rows[0]?.version ?? null });
    expect(result.status).toBe(201);
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({ ...payload, version: 1, submittedById: fixtures.users.stuA1.id });
    expect((await read(`/api/submissions/${result.body.data.id}`).expect(200)).body.data).toEqual(result.body.data);
  });

  it.each([-1, 0, 1])('L6-S35-03 preserves the exact acceptedAt boundary at %i ms', async offset => {
    const milestone = fixtures.milestones.milestoneExact;
    const acceptedAt = new Date(milestone.dueAt.getTime() + offset);
    const service = new SubmissionService(prisma, async () => acceptedAt);
    const outcome = await service.submit(milestone.id, payload, { userId: fixtures.users.stuA1.id, role: 'student' })
      .then(saved => ({ saved, status: 201, code: null }), (error: { status: number; code: string }) => ({ saved: null, status: error.status, code: error.code }));
    const rows = await prisma.submission.findMany({ where: { milestoneId: milestone.id } });
    record({ caseId: 'L6-S35-03', offsetMs: offset, status: outcome.status, code: outcome.code, persistedRows: rows.length });
    if (offset > 0) {
      expect.soft(outcome.status).toBe(409);
      expect.soft(outcome.code).toBe('DEADLINE_PASSED');
      expect(rows).toHaveLength(0);
    } else {
      expect(outcome.status).toBe(201);
      expect(rows).toHaveLength(1);
      expect(rows[0]!.submittedAt).toEqual(acceptedAt);
    }
  });
});
