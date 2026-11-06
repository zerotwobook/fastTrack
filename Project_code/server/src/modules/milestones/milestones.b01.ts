import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../../app.js';
import { loadConfig } from '../../config.js';
import { createMilestoneRouter } from './router.js';
import { createTestPrisma, createBaseFixtures } from '../../testing/fixtures.js';
import type { PrismaClient } from '../../db/generated/client/index.js';
import type { MilestoneAuthContext } from './service.js';

describe('Milestones Module (T-05, T-06, T-07, T-08, T-25)', () => {
  let prisma: PrismaClient;
  let fixtures: Awaited<ReturnType<typeof createBaseFixtures>>;

  beforeAll(async () => {
    prisma = createTestPrisma();
    fixtures = await createBaseFixtures(prisma);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  /**
   * Build a fresh Express app for each test, injecting a fixed auth context stub.
   * This exercises MilestoneService role/scope logic without real session cookies.
   * Production wiring uses createSessionProtection().getAuthContext instead.
   */
  function buildApp(authContext: MilestoneAuthContext) {
    const config = loadConfig({
      NODE_ENV: 'test',
      PORT: '3000',
      APP_ORIGIN: 'http://127.0.0.1:5173',
      DATABASE_URL:
        process.env.TEST_DATABASE_URL,
      SESSION_TTL_HOURS: '8',
      RELEASE_SHA: 'test-release',
    });

    const milestoneRouter = createMilestoneRouter({
      prisma,
      // Inject auth context directly — no session cookie, no header fallback.
      getAuthContext: () => authContext,
      // Explicit test-only guards retain B's original service-level cases.
      // Real session/source/CSRF coverage is in milestones-review.b01.ts.
      requireSession: (_req, _res, next) => next(),
      requireSupervisor: (_req, _res, next) => next(),
      requireMutation: (_req, _res, next) => next(),
    });

    return createApp(config, {
      routers: { milestones: milestoneRouter },
    });
  }

  it('T-06: assigned supervisor can create a milestone with future dueAt', async () => {
    const app = buildApp({ userId: fixtures.users.supA.id, role: 'supervisor' });
    const futureDue = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

    const res = await request(app)
      .post(`/api/teams/${fixtures.teams.teamA.id}/milestones`)
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

  it('T-07: student cannot create a milestone (403 Forbidden)', async () => {
    const app = buildApp({ userId: fixtures.users.stuA1.id, role: 'student' });
    const futureDue = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

    const res = await request(app)
      .post(`/api/teams/${fixtures.teams.teamA.id}/milestones`)
      .set('content-type', 'application/json')
      .send({
        title: 'Student Milestone Attempt',
        description: 'Valid synthetic milestone description.',
        dueAt: futureDue,
      });

    expect(res.status).toBe(403);
    expect(res.body.error.code).toBe('FORBIDDEN');
  });

  it('T-07: unassigned supervisor cannot create milestone for another team (404 Not Found)', async () => {
    // supB does not supervise teamA
    const app = buildApp({ userId: fixtures.users.supB.id, role: 'supervisor' });
    const futureDue = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

    const res = await request(app)
      .post(`/api/teams/${fixtures.teams.teamA.id}/milestones`)
      .set('content-type', 'application/json')
      .send({
        title: 'Unauthorized Cross-Team Milestone',
        description: 'Valid synthetic milestone description.',
        dueAt: futureDue,
      });

    expect(res.status).toBe(404);
  });

  it('rejects milestone with past dueAt (400 Bad Request)', async () => {
    const app = buildApp({ userId: fixtures.users.supA.id, role: 'supervisor' });
    const pastDue = new Date(Date.now() - 10000).toISOString();

    const res = await request(app)
      .post(`/api/teams/${fixtures.teams.teamA.id}/milestones`)
      .set('content-type', 'application/json')
      .send({
        title: 'Past Milestone',
        description: 'Valid synthetic milestone description.',
        dueAt: pastDue,
      });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('INVALID_INPUT');
  });

  it('rejects milestone title exceeding canonical bound of 120 chars (400 Bad Request)', async () => {
    const app = buildApp({ userId: fixtures.users.supA.id, role: 'supervisor' });
    const futureDue = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

    const res = await request(app)
      .post(`/api/teams/${fixtures.teams.teamA.id}/milestones`)
      .set('content-type', 'application/json')
      .send({
        title: 'x'.repeat(121),
        description: 'Valid synthetic milestone description.',
        dueAt: futureDue,
      });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('INVALID_INPUT');
  });

  it('T-25: student can list milestones for their assigned team', async () => {
    const app = buildApp({ userId: fixtures.users.stuA1.id, role: 'student' });

    const res = await request(app)
      .get(`/api/teams/${fixtures.teams.teamA.id}/milestones`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.meta.serverTime).toBeDefined();
  });

  it('student cannot list milestones of an unassigned team (404 Not Found)', async () => {
    // stuA1 is not in teamB
    const app = buildApp({ userId: fixtures.users.stuA1.id, role: 'student' });

    const res = await request(app)
      .get(`/api/teams/${fixtures.teams.teamB.id}/milestones`);

    expect(res.status).toBe(404);
  });
});
