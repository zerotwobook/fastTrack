import { randomUUID } from 'node:crypto';
import request from 'supertest';
import { afterAll, expect, it } from 'vitest';
import { createApp } from '../app.js';
import { loadConfig } from '../config.js';
import { createApplicationRouters } from '../modules/index.js';
import { cleanTestDatabase, createBaseFixtures, createTestPrisma, TEST_PASSWORD } from './fixtures.js';

const prisma = createTestPrisma();
const origin = 'http://127.0.0.1:5173';
const config = loadConfig({
  NODE_ENV: 'test', DATABASE_URL: process.env['TEST_DATABASE_URL'], APP_ORIGIN: origin,
});
const api = request(createApp(config, { logger: () => undefined, routers: createApplicationRouters({ prisma, config }) }));

async function login(email: string) {
  const response = await api.post('/api/auth/login').set('Origin', origin).set('X-fastTrack-Request', '1')
    .send({ email, password: TEST_PASSWORD }).expect(200);
  return { cookie: String(response.headers['set-cookie']?.[0]).split(';')[0]!, csrf: String(response.body.data.csrfToken) };
}

function post(path: string, session: Awaited<ReturnType<typeof login>>, body: object) {
  return api.post(`/api${path}`).set('Cookie', session.cookie).set('Origin', origin)
    .set('X-CSRF-Token', session.csrf).send(body);
}

function read(path: string, session: Awaited<ReturnType<typeof login>>) {
  return api.get(`/api${path}`).set('Cookie', session.cookie);
}

afterAll(async () => { await cleanTestDatabase(prisma); await prisma.$disconnect(); });

it('STS-32 keeps progress and existing feedback correct after a real revision race', async () => {
  const { teams: { teamA }, users, milestones } = await createBaseFixtures(prisma);
  const [firstStudent, secondStudent, supervisor, foreignStudent, foreignSupervisor] = await Promise.all([
    login(users.stuA1.email), login(users.stuA2.email), login(users.supA.email),
    login(users.stuB1.email), login(users.supB.email),
  ]);
  const work = { title: 'Initial work', description: 'Saved Sprint 2 fixture.', url: 'https://example.edu/work' };
  const teamPath = `/teams/${teamA.id}`;
  const progressPath = `${teamPath}/progress`;
  const itemPath = `/milestones/${milestones.milestoneFuture.id}`;

  const toCancel = await post(`${teamPath}/milestones`, supervisor, {
    title: 'Retired task', description: 'Retained in the progress list after cancellation.',
    dueAt: new Date(Date.now() + 86_400_000).toISOString(),
  }).expect(201);
  const cancelledId = toCancel.body.data.id as string;
  await post(`/milestones/${cancelledId}/cancel`, supervisor, {}).expect(200);
  for (const item of [milestones.milestoneExact, milestones.milestoneBoundaryPlus1ms]) {
    await post(`/milestones/${item.id}/submissions`, firstStudent, work).expect(201);
  }
  const initial = await post(`${itemPath}/submissions`, firstStudent, work).expect(201);
  const v1 = initial.body.data;
  const v1Path = `/submissions/${v1.id}`;
  const feedback = await post(`${v1Path}/feedback`, supervisor, {
    content: 'Review of the first saved version.', clientRequestId: randomUUID(),
  }).expect(201);
  const initialRow = await prisma.submission.findUniqueOrThrow({ where: { id: v1.id } });
  const initialFeedback = await prisma.feedback.findUniqueOrThrow({ where: { id: feedback.body.data.id } });
  expect(initialFeedback.submissionId).toBe(v1.id);
  const reviewed = await read(progressPath, supervisor).expect(200);
  expect(reviewed.body.data).toMatchObject({ total: 4, submitted: 3, progressPercent: 75 });
  expect(reviewed.body.data.milestones).toContainEqual(expect.objectContaining({
    id: milestones.milestoneFuture.id, status: 'FEEDBACK_AVAILABLE',
    latestSubmission: expect.objectContaining({ id: v1.id, version: 1, feedbackCount: 1 }),
  }));

  const revisions = await Promise.all([
    post(`${itemPath}/revisions`, firstStudent, { ...work, title: 'Revision from A1', expectedVersion: 1 }),
    post(`${itemPath}/revisions`, secondStudent, { ...work, title: 'Revision from A2', expectedVersion: 1 }),
  ]);
  expect(revisions.map(response => response.status).sort()).toEqual([201, 409]);
  const saved = revisions.find(response => response.status === 201)!.body.data;
  expect(revisions.find(response => response.status === 409)!.body.error.code).toBe('VERSION_CONFLICT');
  const savedBy = saved.title === 'Revision from A1' ? users.stuA1 : users.stuA2;
  expect(saved).toMatchObject({ version: 2, submittedBy: { id: savedBy.id } });

  const history = await read(`${itemPath}/submissions`, secondStudent).expect(200);
  expect(history.body.data).toEqual([saved, v1]);
  expect((await read(v1Path, secondStudent).expect(200)).body.data).toEqual(v1);
  const v2Path = `/submissions/${saved.id}`;
  expect((await read(`${v1Path}/feedback`, secondStudent).expect(200)).body.data).toEqual([feedback.body.data]);
  expect((await read(`${v2Path}/feedback`, secondStudent).expect(200)).body.data).toEqual([]);
  expect(await prisma.submission.findUniqueOrThrow({ where: { id: v1.id } })).toEqual(initialRow);
  expect(await prisma.feedback.findUniqueOrThrow({ where: { id: initialFeedback.id } })).toEqual(initialFeedback);
  expect(await prisma.submission.findMany({
    where: { milestoneId: milestones.milestoneFuture.id }, orderBy: { version: 'desc' },
    select: { id: true, version: true, submittedById: true },
  })).toEqual([
    { id: saved.id, version: 2, submittedById: savedBy.id },
    { id: v1.id, version: 1, submittedById: users.stuA1.id },
  ]);

  const current = await read(progressPath, secondStudent).expect(200);
  expect(current.headers['cache-control']).toBe('no-store');
  expect(current.body.data).toMatchObject({ asOf: current.body.meta.serverTime, total: 4, submitted: 3, progressPercent: 75 });
  expect(current.body.data.milestones).toEqual(expect.arrayContaining([
    expect.objectContaining({ id: cancelledId, status: 'CANCELLED', latestSubmission: null }),
    expect.objectContaining({
      id: milestones.milestoneFuture.id, status: 'SUBMITTED',
      latestSubmission: expect.objectContaining({ id: saved.id, version: 2, feedbackCount: 0 }),
    }),
  ]));

  for (const outsider of [foreignStudent, foreignSupervisor]) {
    const absent = await read(`/submissions/${randomUUID()}`, outsider).expect(404);
    for (const path of [v1Path, v2Path, `${v1Path}/feedback`, `${itemPath}/submissions`, progressPath]) {
      expect((await read(path, outsider).expect(404)).body).toEqual(absent.body);
    }
  }
  await post(`${itemPath}/revisions`, foreignStudent, { ...work, expectedVersion: 2 }).expect(404);
  expect(await prisma.submission.count({ where: { milestoneId: milestones.milestoneFuture.id } })).toBe(2);
});
