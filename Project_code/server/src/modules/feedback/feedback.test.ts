import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { randomUUID } from 'node:crypto';
import { createApp } from '../../app.js';
import { loadConfig } from '../../config.js';
import { createFeedbackRouter } from './router.js';
import { createTestPrisma, createBaseFixtures } from '../../testing/fixtures.js';
import type { PrismaClient } from '../../db/generated/client/index.js';
import type { FeedbackAuthContext } from './service.js';

describe('Feedback Module (T-17, T-18, T-19, T-20, T-24)', () => {
  let prisma: PrismaClient;
  let fixtures: Awaited<ReturnType<typeof createBaseFixtures>>;
  let submissionA: { id: string };
  let submissionB: { id: string };

  beforeAll(async () => {
    prisma = createTestPrisma();
    fixtures = await createBaseFixtures(prisma);

    // Create synthetic submission fixtures for teamA and teamB milestones
    submissionA = await prisma.submission.create({
      data: {
        milestoneId: fixtures.milestones.milestoneFuture.id,
        submittedById: fixtures.users.stuA1.id,
        version: 1,
        title: 'Team A Deliverable v1',
        description: 'Sprint 1 baseline report and source code link',
        url: 'https://example.com/team-a/deliverable',
        submittedAt: new Date(),
      },
    });

    submissionB = await prisma.submission.create({
      data: {
        milestoneId: fixtures.milestones.milestoneBTeam.id,
        submittedById: fixtures.users.stuB1.id,
        version: 1,
        title: 'Team B Deliverable v1',
        description: 'Sprint 1 baseline deliverable for team B',
        url: 'https://example.com/team-b/deliverable',
        submittedAt: new Date(),
      },
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  function buildApp(auth: FeedbackAuthContext) {
    const config = loadConfig({
      NODE_ENV: 'test',
      PORT: '3000',
      APP_ORIGIN: 'http://127.0.0.1:5173',
      DATABASE_URL:
        process.env.TEST_DATABASE_URL ??
        'postgresql://fasttrack_test:fasttrack_test_local@127.0.0.1:5433/fasttrack_test',
      SESSION_TTL_HOURS: '8',
      RELEASE_SHA: 'test-release',
    });

    const feedbackRouter = createFeedbackRouter({
      prisma,
      getAuthContext: () => auth,
    });

    return createApp(config, {
      routers: { feedback: feedbackRouter },
    });
  }

  it('T-17: assigned supervisor can create feedback for a team submission (201 Created)', async () => {
    const app = buildApp({ userId: fixtures.users.supA.id, role: 'supervisor' });
    const clientRequestId = randomUUID();

    const res = await request(app)
      .post(`/api/submissions/${submissionA.id}/feedback`)
      .set('content-type', 'application/json')
      .send({
        content: 'Excellent baseline architecture and clear documentation.',
        clientRequestId,
      });

    expect(res.status).toBe(201);
    expect(res.body.data.submissionId).toBe(submissionA.id);
    expect(res.body.data.content).toBe('Excellent baseline architecture and clear documentation.');
    expect(res.body.data.clientRequestId).toBe(clientRequestId);
    expect(res.body.data.supervisor.id).toBe(fixtures.users.supA.id);
    expect(res.body.data.supervisor.displayName).toBe('Supervisor A');
    expect(res.body.data.createdAt).toBeDefined();

    // Verify persisted record in DB
    const persisted = await prisma.feedback.findUnique({
      where: { id: res.body.data.id },
    });
    expect(persisted).not.toBeNull();
    expect(persisted?.content).toBe('Excellent baseline architecture and clear documentation.');
  });

  it('T-18: student cannot create feedback (403 Forbidden)', async () => {
    const app = buildApp({ userId: fixtures.users.stuA1.id, role: 'student' });

    const res = await request(app)
      .post(`/api/submissions/${submissionA.id}/feedback`)
      .set('content-type', 'application/json')
      .send({
        content: 'Student attempting to add feedback.',
        clientRequestId: randomUUID(),
      });

    expect(res.status).toBe(403);
    expect(res.body.error.code).toBe('FORBIDDEN');
  });

  it('T-19: unassigned supervisor cannot create feedback for another team submission (404 Not Found)', async () => {
    // supB supervises teamB, not teamA
    const app = buildApp({ userId: fixtures.users.supB.id, role: 'supervisor' });

    const res = await request(app)
      .post(`/api/submissions/${submissionA.id}/feedback`)
      .set('content-type', 'application/json')
      .send({
        content: 'Cross-team feedback attempt by unassigned supervisor.',
        clientRequestId: randomUUID(),
      });

    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe('NOT_FOUND');
  });

  it('T-20: assigned supervisor and team members can list feedback; out-of-scope users receive 404', async () => {
    // Supervisor A reading Team A feedback
    const supApp = buildApp({ userId: fixtures.users.supA.id, role: 'supervisor' });
    const supRes = await request(supApp).get(`/api/submissions/${submissionA.id}/feedback`);
    expect(supRes.status).toBe(200);
    expect(Array.isArray(supRes.body.data)).toBe(true);
    expect(supRes.body.data.length).toBeGreaterThanOrEqual(1);
    expect(supRes.body.meta.serverTime).toBeDefined();

    // Student A1 (member of Team A) reading Team A feedback
    const stuApp = buildApp({ userId: fixtures.users.stuA1.id, role: 'student' });
    const stuRes = await request(stuApp).get(`/api/submissions/${submissionA.id}/feedback`);
    expect(stuRes.status).toBe(200);
    expect(Array.isArray(stuRes.body.data)).toBe(true);

    // Student B1 (Team B) trying to read Team A feedback
    const foreignStuApp = buildApp({ userId: fixtures.users.stuB1.id, role: 'student' });
    const foreignStuRes = await request(foreignStuApp).get(`/api/submissions/${submissionA.id}/feedback`);
    expect(foreignStuRes.status).toBe(404);

    // Supervisor B trying to read Team A feedback
    const foreignSupApp = buildApp({ userId: fixtures.users.supB.id, role: 'supervisor' });
    const foreignSupRes = await request(foreignSupApp).get(`/api/submissions/${submissionA.id}/feedback`);
    expect(foreignSupRes.status).toBe(404);
  });

  it('T-24: identical retry with same clientRequestId returns 200 replay without duplicate rows', async () => {
    const app = buildApp({ userId: fixtures.users.supA.id, role: 'supervisor' });
    const clientRequestId = randomUUID();
    const content = 'Idempotent feedback test content.';

    // First attempt: 201 Created
    const res1 = await request(app)
      .post(`/api/submissions/${submissionA.id}/feedback`)
      .set('content-type', 'application/json')
      .send({ content, clientRequestId });
    expect(res1.status).toBe(201);
    const firstId = res1.body.data.id;

    // Retry with exact same clientRequestId, same content and same submission: 200 OK replay
    const res2 = await request(app)
      .post(`/api/submissions/${submissionA.id}/feedback`)
      .set('content-type', 'application/json')
      .send({ content, clientRequestId });
    expect(res2.status).toBe(200);
    expect(res2.body.data.id).toBe(firstId);

    // Ensure no duplicate rows were created in the database
    const matchingRows = await prisma.feedback.findMany({
      where: { supervisorId: fixtures.users.supA.id, clientRequestId },
    });
    expect(matchingRows.length).toBe(1);
  });

  it('T-24: reusing same clientRequestId with different content returns 409 REQUEST_KEY_REUSED', async () => {
    const app = buildApp({ userId: fixtures.users.supA.id, role: 'supervisor' });
    const clientRequestId = randomUUID();

    // First request
    const res1 = await request(app)
      .post(`/api/submissions/${submissionA.id}/feedback`)
      .set('content-type', 'application/json')
      .send({ content: 'Original intent content.', clientRequestId });
    expect(res1.status).toBe(201);

    // Second request with conflicting content
    const res2 = await request(app)
      .post(`/api/submissions/${submissionA.id}/feedback`)
      .set('content-type', 'application/json')
      .send({ content: 'Changed intent content with same request key.', clientRequestId });
    expect(res2.status).toBe(409);
    expect(res2.body.error.code).toBe('REQUEST_KEY_REUSED');
  });

  it('T-24: reusing same clientRequestId for a different submission returns 409 REQUEST_KEY_REUSED', async () => {
    const appA = buildApp({ userId: fixtures.users.supB.id, role: 'supervisor' });
    const clientRequestId = randomUUID();

    // First request on submissionB (supervised by supB)
    const res1 = await request(appA)
      .post(`/api/submissions/${submissionB.id}/feedback`)
      .set('content-type', 'application/json')
      .send({ content: 'First target submission content.', clientRequestId });
    expect(res1.status).toBe(201);

    // Create another submission for teamB to test different target by same supervisor
    const submissionB2 = await prisma.submission.create({
      data: {
        milestoneId: fixtures.milestones.milestoneBTeam.id,
        submittedById: fixtures.users.stuB1.id,
        version: 2,
        title: 'Team B Deliverable v2',
        description: 'Second version deliverable',
        url: 'https://example.com/test-b-v2',
        submittedAt: new Date(),
      },
    });

    // Reuse key on submissionB2
    const res2 = await request(appA)
      .post(`/api/submissions/${submissionB2.id}/feedback`)
      .set('content-type', 'application/json')
      .send({ content: 'First target submission content.', clientRequestId });
    expect(res2.status).toBe(409);
    expect(res2.body.error.code).toBe('REQUEST_KEY_REUSED');
  });

  it('rejects empty or whitespace-only feedback content (400 Bad Request)', async () => {
    const app = buildApp({ userId: fixtures.users.supA.id, role: 'supervisor' });

    const res = await request(app)
      .post(`/api/submissions/${submissionA.id}/feedback`)
      .set('content-type', 'application/json')
      .send({ content: '   ', clientRequestId: randomUUID() });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('INVALID_INPUT');
    expect(res.body.error.fields.content).toBeDefined();
  });

  it('rejects feedback content exceeding 4000 code points (400 Bad Request)', async () => {
    const app = buildApp({ userId: fixtures.users.supA.id, role: 'supervisor' });

    const res = await request(app)
      .post(`/api/submissions/${submissionA.id}/feedback`)
      .set('content-type', 'application/json')
      .send({ content: 'a'.repeat(4001), clientRequestId: randomUUID() });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('INVALID_INPUT');
    expect(res.body.error.fields.content).toBeDefined();
  });

  it('rejects invalid clientRequestId UUID (400 Bad Request)', async () => {
    const app = buildApp({ userId: fixtures.users.supA.id, role: 'supervisor' });

    const res = await request(app)
      .post(`/api/submissions/${submissionA.id}/feedback`)
      .set('content-type', 'application/json')
      .send({ content: 'Valid content.', clientRequestId: 'not-a-uuid' });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('INVALID_INPUT');
    expect(res.body.error.fields.clientRequestId).toBeDefined();
  });

  it('rejects invalid submissionId UUID (400 Bad Request)', async () => {
    const app = buildApp({ userId: fixtures.users.supA.id, role: 'supervisor' });

    const res = await request(app)
      .post(`/api/submissions/not-a-uuid/feedback`)
      .set('content-type', 'application/json')
      .send({ content: 'Valid content.', clientRequestId: randomUUID() });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('INVALID_INPUT');
  });
});
