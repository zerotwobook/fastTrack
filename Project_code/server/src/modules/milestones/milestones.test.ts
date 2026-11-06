import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../../app.js';
import { loadConfig } from '../../config.js';
import { createMilestoneRouter } from './router.js';
import { createTestPrisma, createBaseFixtures } from '../../testing/fixtures.js';
import type { PrismaClient } from '../../db/generated/client/index.js';

describe('Milestones Module (T-05, T-06, T-07, T-08, T-25)', () => {
  let prisma: PrismaClient;
  let fixtures: Awaited<ReturnType<typeof createBaseFixtures>>;
  let app: ReturnType<typeof createApp>;

  beforeAll(async () => {
    prisma = createTestPrisma();
    fixtures = await createBaseFixtures(prisma);

    const config = loadConfig({
      NODE_ENV: 'test',
      PORT: '3000',
      APP_ORIGIN: 'http://127.0.0.1:5173',
      DATABASE_URL: process.env.TEST_DATABASE_URL ?? 'postgresql://fasttrack_test:fasttrack_test_local@127.0.0.1:5433/fasttrack_test',
      SESSION_TTL_HOURS: '8',
      RELEASE_SHA: 'test-release',
    });

    const milestoneRouter = createMilestoneRouter({ prisma });

    app = createApp(config, {
      routers: { milestones: milestoneRouter },
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('T-05: assigned supervisor can create a milestone with future dueAt', async () => {
    const futureDue = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    const res = await request(app)
      .post(`/api/teams/${fixtures.teams.teamA.id}/milestones`)
      .set('x-user-id', fixtures.users.supA.id)
      .set('x-user-role', 'supervisor')
      .set('content-type', 'application/json')
      .send({
        title: 'Sprint 1 Review',
        description: 'Complete deliverables for Sprint 1',
        dueAt: futureDue,
      });

    expect(res.status).toBe(201);
    expect(res.body.data.title).toBe('Sprint 1 Review');
    expect(res.body.data.teamId).toBe(fixtures.teams.teamA.id);
    expect(res.body.data.latestSubmission).toBeNull();
  });

  it('T-06: student cannot create a milestone (403 Forbidden)', async () => {
    const futureDue = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    const res = await request(app)
      .post(`/api/teams/${fixtures.teams.teamA.id}/milestones`)
      .set('x-user-id', fixtures.users.stuA1.id)
      .set('x-user-role', 'student')
      .set('content-type', 'application/json')
      .send({
        title: 'Student Milestone Attempt',
        dueAt: futureDue,
      });

    expect(res.status).toBe(403);
    expect(res.body.error.code).toBe('FORBIDDEN');
  });

  it('T-07: unassigned supervisor cannot create milestone for another team (404 Not Found)', async () => {
    const futureDue = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    const res = await request(app)
      .post(`/api/teams/${fixtures.teams.teamA.id}/milestones`)
      .set('x-user-id', fixtures.users.supB.id) // supB does not supervise teamA
      .set('x-user-role', 'supervisor')
      .set('content-type', 'application/json')
      .send({
        title: 'Unauthorized Cross-Team Milestone',
        dueAt: futureDue,
      });

    expect(res.status).toBe(404);
  });

  it('rejects milestone with past dueAt (400 Bad Request)', async () => {
    const pastDue = new Date(Date.now() - 10000).toISOString();
    const res = await request(app)
      .post(`/api/teams/${fixtures.teams.teamA.id}/milestones`)
      .set('x-user-id', fixtures.users.supA.id)
      .set('x-user-role', 'supervisor')
      .set('content-type', 'application/json')
      .send({
        title: 'Past Milestone',
        dueAt: pastDue,
      });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('INVALID_INPUT');
  });

  it('rejects milestone title exceeding canonical bound of 120 chars (400 Bad Request)', async () => {
    const futureDue = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
    const res = await request(app)
      .post(`/api/teams/${fixtures.teams.teamA.id}/milestones`)
      .set('x-user-id', fixtures.users.supA.id)
      .set('x-user-role', 'supervisor')
      .set('content-type', 'application/json')
      .send({
        title: 'x'.repeat(121),
        dueAt: futureDue,
      });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('INVALID_INPUT');
  });

  it('T-08: student can list milestones for their assigned team', async () => {
    const res = await request(app)
      .get(`/api/teams/${fixtures.teams.teamA.id}/milestones`)
      .set('x-user-id', fixtures.users.stuA1.id)
      .set('x-user-role', 'student');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.meta.serverTime).toBeDefined();
  });

  it('student cannot list milestones of an unassigned team (404 Not Found)', async () => {
    const res = await request(app)
      .get(`/api/teams/${fixtures.teams.teamB.id}/milestones`)
      .set('x-user-id', fixtures.users.stuA1.id) // stuA1 is not in teamB
      .set('x-user-role', 'student');

    expect(res.status).toBe(404);
  });
});
