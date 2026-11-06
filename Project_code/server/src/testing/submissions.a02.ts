import { afterAll, beforeEach, describe, expect, it } from 'vitest';
import request from 'supertest';
import { createApp } from '../app.js';
import { loadConfig } from '../config.js';
import { createApplicationRouters } from '../modules/index.js';
import { SubmissionService } from '../modules/submissions/service.js';
import { createBaseFixtures, createTestPrisma, cleanTestDatabase, TEST_PASSWORD } from './fixtures.js';

const prisma = createTestPrisma();
const origin = 'http://127.0.0.1:5173';
const config = loadConfig({ NODE_ENV: 'test', DATABASE_URL: process.env['TEST_DATABASE_URL'], APP_ORIGIN: origin });
const app = () => createApp(config, { logger: () => undefined, routers: createApplicationRouters({ prisma, config }) });
const body = () => ({ title: 'Engineering baseline', description: 'SRS and system design ready for review.', url: 'https://example.edu/team-a/work?version=1#design' });
let fixtures: Awaited<ReturnType<typeof createBaseFixtures>>;
let student: { cookie: string; csrf: string };

async function login(email: string) {
  const result = await request(app()).post('/api/auth/login').set('Origin', origin).set('X-fastTrack-Request', '1')
    .send({ email, password: TEST_PASSWORD }).expect(200);
  return { cookie: String(result.headers['set-cookie']?.[0]).split(';')[0]!, csrf: String(result.body.data.csrfToken) };
}
const post = (value: unknown, id = fixtures.milestones.milestoneFuture.id, actor = student) => request(app())
  .post(`/api/milestones/${id}/submissions`).set('Cookie', actor.cookie).set('Origin', origin).set('X-CSRF-Token', actor.csrf)
  .set('Content-Type', 'application/json').send(JSON.stringify(value));

beforeEach(async () => { fixtures = await createBaseFixtures(prisma); student = await login('stu-a1@test.local'); });
afterAll(async () => { await cleanTestDatabase(prisma); await prisma.$disconnect(); });

describe('F-03 first-submission deadline TDD and persistence', () => {
  it.each([-1, 0, 1])('T-10/T-12/T-26 uses exact acceptedAt offset %i ms and persists that same instant', async offset => {
    const milestone = fixtures.milestones.milestoneExact;
    const acceptedAt = new Date(milestone.dueAt.getTime() + offset);
    let calls = 0;
    const service = new SubmissionService(prisma, async () => { calls++; return acceptedAt; });
    const actor = { userId: fixtures.users.stuA1.id, role: 'student' as const };
    if (offset > 0) {
      await expect(service.submit(milestone.id, body(), actor)).rejects.toMatchObject({ status: 409, code: 'DEADLINE_PASSED' });
      expect(await prisma.submission.count()).toBe(0);
    } else {
      const saved = await service.submit(milestone.id, body(), actor);
      const row = await prisma.submission.findUniqueOrThrow({ where: { id: saved.id } });
      expect(saved.submittedAt).toBe(acceptedAt.toISOString());
      expect(row.submittedAt.getTime()).toBe(acceptedAt.getTime());
      expect(row.submittedById).toBe(actor.userId);
      expect(row.version).toBe(1);
    }
    expect(calls).toBe(1);
  });

  it('T-11 rejects a first submission after the actual database deadline without writing', async () => {
    const id = fixtures.milestones.milestoneFuture.id;
    await prisma.milestone.update({ where: { id }, data: { dueAt: new Date(Date.now() - 1000) } });
    const result = await post(body(), id).expect(409);
    expect(result.body.error.code).toBe('DEADLINE_PASSED');
    expect(await prisma.submission.count()).toBe(0);
  });

  it('T-09/T-16 creates version 1 and reads the exact saved DTO after app recreation', async () => {
    const created = await post(body()).expect(201);
    expect(created.body.data.submittedBy).toEqual({ id: fixtures.users.stuA1.id, displayName: 'Student A1' });
    expect(created.body.data.version).toBe(1);
    const detail = await request(app()).get(`/api/submissions/${created.body.data.id}`).set('Cookie', student.cookie).expect(200);
    const list = await request(app()).get(`/api/milestones/${created.body.data.milestoneId}/submissions`).set('Cookie', student.cookie).expect(200);
    expect(detail.body.data).toEqual(created.body.data);
    expect(list.body.data).toEqual([detail.body.data]);
    expect(detail.headers['cache-control']).toBe('no-store');
    expect(Date.parse(detail.body.meta.serverTime)).not.toBeNaN();
    expect(Object.keys(detail.body.data).sort()).toEqual(['id','milestoneId','submittedBy','version','title','description','url','submittedAt'].sort());
  });

  it('T-13/T-26 preserves the first submission and duplicate precedence after the deadline', async () => {
    const created = await post(body()).expect(201);
    await prisma.milestone.update({ where: { id: created.body.data.milestoneId }, data: { dueAt: new Date(Date.now() - 1000) } });
    const duplicate = await post({ ...body(), title: 'Second attempt' }).expect(409);
    expect(duplicate.body.error.code).toBe('ALREADY_SUBMITTED');
    expect(await prisma.submission.count()).toBe(1);
    expect((await prisma.submission.findUniqueOrThrow({ where: { id: created.body.data.id } })).title).toBe(body().title);
  });

  it('T-13 serializes two different students to one immutable version 1', async () => {
    const teammate = await login('stu-a2@test.local');
    const results = await Promise.all([post(body()), post({ ...body(), title: 'Teammate work' }, undefined, teammate)]);
    expect(results.map(r => r.status).sort()).toEqual([201,409]);
    expect(results.find(r => r.status === 409)!.body.error.code).toBe('ALREADY_SUBMITTED');
    const rows = await prisma.submission.findMany();
    expect(rows).toHaveLength(1);
    expect(rows[0]!.version).toBe(1);
    expect(results.find(r => r.status === 201)!.body.data.id).toBe(rows[0]!.id);
  });
});
