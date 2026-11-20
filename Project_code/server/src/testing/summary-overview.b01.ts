import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest';
import request from 'supertest';
import { createApp } from '../app.js';
import { loadConfig } from '../config.js';
import { createApplicationRouters } from '../modules/index.js';
import { readSummaryItems } from '../modules/reports/summary-items.js';
import { cleanTestDatabase, createBaseFixtures, createTestPrisma, TEST_PASSWORD, TEST_PASSWORD_HASH } from './fixtures.js';

vi.mock(import('../modules/reports/summary-items.js'), async importOriginal => {
  const original = await importOriginal();
  return { ...original, readSummaryItems: vi.fn(original.readSummaryItems) };
});

const prisma = createTestPrisma();
const origin = 'http://127.0.0.1:5173';
const config = loadConfig({ NODE_ENV: 'test', DATABASE_URL: process.env['TEST_DATABASE_URL'], APP_ORIGIN: origin });
const app = createApp(config, { logger: () => undefined, routers: createApplicationRouters({ prisma, config }) });
const empty = { total: 0, submitted: 0, pending: 0, overdue: 0, progressPercent: 0 };
let fixtures: Awaited<ReturnType<typeof createBaseFixtures>>;

async function login(email: string): Promise<string> {
  const response = await request(app).post('/api/auth/login')
    .set('Origin', origin).set('X-fastTrack-Request', '1').send({ email, password: TEST_PASSWORD }).expect(200);
  return String(response.headers['set-cookie']?.[0]).split(';')[0]!;
}

function getSummary(cookie: string, query = '') {
  return request(app).get('/api/summary' + query).set('Cookie', cookie);
}

function createMilestone(teamId: string, title: string, dueAt: Date, cancelledAt: Date | null = null) {
  return prisma.milestone.create({ data: {
    teamId, title, dueAt, cancelledAt, description: 'Summary verification fixture.', createdById: fixtures.users.supA.id,
  } });
}

function createSubmission(milestoneId: string, version = 1) {
  return prisma.submission.create({ data: {
    milestoneId, version, title: `Saved version ${version}`, description: 'Summary verification fixture.',
    url: 'https://example.edu/work', submittedAt: new Date(), submittedById: fixtures.users.stuA1.id,
  } });
}

beforeEach(async () => { fixtures = await createBaseFixtures(prisma); });
afterAll(async () => { await cleanTestDatabase(prisma); await prisma.$disconnect(); });

describe('F-08A real supervisor summary API', () => {
  it('uses weighted completion across assigned teams and filters matches independently', async () => {
    const cookie = await login('sup-a@test.local');
    const teamA = fixtures.teams.teamA;
    await prisma.milestone.deleteMany({ where: { teamId: teamA.id } });
    const teamB = await prisma.team.create({ data: { name: 'Test Team A Secondary', supervisorId: fixtures.users.supA.id } });
    const nextDay = Date.now() + 86_400_000;
    const submitted = await createMilestone(teamA.id, 'Submitted milestone', new Date(nextDay));
    await createSubmission(submitted.id);
    await createMilestone(teamA.id, 'Cancelled milestone', new Date(nextDay), new Date());
    const pendingIds = [];
    for (let index = 0; index < 9; index++) {
      const pending = await createMilestone(teamB.id, `Pending milestone ${index + 1}`, new Date(nextDay + index * 1000));
      pendingIds.push(pending.id);
    }

    const totals = { total: 10, submitted: 1, pending: 9, overdue: 0, progressPercent: 10 };
    const all = await getSummary(cookie).expect(200).expect('Cache-Control', 'no-store');
    expect(all.body.data).toMatchObject({
      totals, matchedCount: 11, filters: { teamId: null, status: null, page: 1, pageSize: 20 },
      teams: [
        { teamId: teamA.id, teamName: teamA.name, total: 1, submitted: 1, progressPercent: 100 },
        { teamId: teamB.id, teamName: teamB.name, total: 9, submitted: 0, progressPercent: 0 },
      ],
    });
    expect(all.body.data.items).toHaveLength(11);
    expect(all.body.data.items).toContainEqual(expect.objectContaining({ status: 'CANCELLED' }));
    expect(all.body.data.items.every((row: { teamId: string }) => [teamA.id, teamB.id].includes(row.teamId))).toBe(true);
    expect(Object.keys(all.body.data.items[0]).sort()).toEqual(
      ['dueAt', 'latestVersion', 'milestoneId', 'status', 'teamId', 'teamName', 'title'],
    );
    expect(all.body.meta.serverTime).toBe(all.body.data.asOf);
    expect(new Date(all.body.data.asOf).toISOString()).toBe(all.body.data.asOf);

    const filtered = await getSummary(cookie, '?status=PENDING&page=2&pageSize=8').expect(200);
    expect(filtered.body.data).toMatchObject({ totals, matchedCount: 9, teams: all.body.data.teams,
      filters: { teamId: null, status: 'PENDING', page: 2, pageSize: 8 } });
    expect(filtered.body.data.items).toEqual([expect.objectContaining({ milestoneId: pendingIds[8], status: 'PENDING' })]);

    const selected = await getSummary(cookie, `?teamId=${teamB.id.toUpperCase()}&page=1000000000&pageSize=50`).expect(200);
    expect(selected.body.data).toMatchObject({
      totals: { total: 9, submitted: 0, pending: 9, overdue: 0, progressPercent: 0 },
      matchedCount: 9, filters: { teamId: teamB.id, page: 1000000000, pageSize: 50 },
      teams: [all.body.data.teams[1]], items: [],
    });
  });

  it('keeps zero-team and cancelled-only results distinct and follows active/revision/feedback rules', async () => {
    await prisma.user.create({ data: { role: 'supervisor', email: 'empty-summary@test.local', name: 'No assigned teams', passwordHash: TEST_PASSWORD_HASH } });
    const emptyCookie = await login('empty-summary@test.local');
    const noTeams = await getSummary(emptyCookie).expect(200);
    expect(noTeams.body.data).toMatchObject({ totals: empty, matchedCount: 0, teams: [], items: [] });

    const cookie = await login('sup-a@test.local');
    const teamId = fixtures.teams.teamA.id;
    await prisma.milestone.deleteMany({ where: { teamId } });
    const past = new Date(Date.now() - 86_400_000);
    const cancelled = await createMilestone(teamId, 'Cancelled', past, new Date());
    const onlyCancelled = await getSummary(cookie).expect(200);
    expect(onlyCancelled.body.data).toMatchObject({
      totals: empty, matchedCount: 1, teams: [expect.objectContaining({ teamId, ...empty })],
      items: [expect.objectContaining({ milestoneId: cancelled.id, status: 'CANCELLED' })],
    });

    const overdue = await createMilestone(teamId, 'Overdue', past);
    const revision = await createMilestone(teamId, 'Revised', past);
    const original = await createSubmission(revision.id);
    await createSubmission(revision.id, 2);
    await prisma.feedback.create({ data: {
      submissionId: original.id, supervisorId: fixtures.users.supA.id, content: 'Feedback on the first version.',
      clientRequestId: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1',
    } });
    const withRevision = await getSummary(cookie).expect(200);
    expect(withRevision.body.data.totals).toEqual({ total: 2, submitted: 1, pending: 0, overdue: 1, progressPercent: 50 });
    expect(withRevision.body.data.items).toEqual(expect.arrayContaining([
      expect.objectContaining({ milestoneId: overdue.id, status: 'OVERDUE' }),
      expect.objectContaining({ milestoneId: revision.id, status: 'SUBMITTED', latestVersion: 2 }),
    ]));
    const latestFeedback = await getSummary(cookie, '?status=FEEDBACK_AVAILABLE').expect(200);
    expect(latestFeedback.body.data).toMatchObject({ matchedCount: 0, items: [], totals: withRevision.body.data.totals });
  });

  it('authenticates and checks role before input, rejects unsupported filters, and hides foreign teams', async () => {
    const anonymous = await request(app).get('/api/summary?page=0').expect(401);
    expect(anonymous.body.error.code).toBe('UNAUTHENTICATED');
    const student = await login('stu-a1@test.local');
    const forbidden = await getSummary(student, '?page=0').expect(403);
    expect(forbidden.body.error.code).toBe('FORBIDDEN');
    const supervisor = await login('sup-a@test.local');

    for (const [query, field] of [
      ['?unexpected=1', 'form'], ['?status=PENDING&status=OVERDUE', 'status'], ['?status[]=', 'form'],
      ['?teamId=', 'teamId'], ['?teamId=not-a-uuid', 'teamId'], ['?status=pending', 'status'],
      ['?page=+1', 'page'], ['?page=1.5', 'page'], ['?page=1%0A', 'page'], ['?page=0', 'page'],
      ['?pageSize=51', 'pageSize'], ['?page=9007199254740992', 'page'], ['?page=9007199254740991&pageSize=50', 'page'],
    ]) {
      const response = await getSummary(supervisor, query).expect(400);
      expect(response.body.error).toMatchObject({ code: 'INVALID_INPUT', fields: { [field!]: expect.any(String) } });
    }

    const foreign = await getSummary(supervisor, `?teamId=${fixtures.teams.teamB.id}`).expect(404);
    const missing = await getSummary(supervisor, '?teamId=00000000-0000-4000-8000-000000000099').expect(404);
    expect(foreign.body).toEqual(missing.body);
    expect(foreign.body.error.code).toBe('NOT_FOUND');
  });

  it('keeps totals and items in one read-only repeatable snapshot when a submission commits between them', async () => {
    const cookie = await login('sup-a@test.local');
    const milestone = fixtures.milestones.milestoneFuture;
    const actual = await vi.importActual<typeof import('../modules/reports/summary-items.js')>('../modules/reports/summary-items.js');

    vi.mocked(readSummaryItems).mockImplementationOnce(async snapshot => {
      const [mode] = await snapshot.tx.$queryRaw<{ transaction_read_only: string }[]>`SHOW transaction_read_only`;
      const [isolation] = await snapshot.tx.$queryRaw<{ transaction_isolation: string }[]>`SHOW transaction_isolation`;
      expect(mode?.transaction_read_only).toBe('on');
      expect(isolation?.transaction_isolation).toBe('repeatable read');
      await createSubmission(milestone.id);
      return actual.readSummaryItems(snapshot);
    });

    const before = await getSummary(cookie).expect(200);
    expect(before.body.data.totals.submitted).toBe(0);
    expect(before.body.data.items).toContainEqual(expect.objectContaining({ milestoneId: milestone.id, status: 'PENDING' }));
    expect(before.body.data.asOf).toBe(before.body.meta.serverTime);

    const after = await getSummary(cookie, '?status=SUBMITTED').expect(200);
    expect(after.body.data.totals.submitted).toBe(1);
    expect(after.body.data.matchedCount).toBe(1);
    expect(after.body.data.items).toEqual([expect.objectContaining({ milestoneId: milestone.id, status: 'SUBMITTED' })]);
    expect(Date.parse(after.body.data.asOf)).toBeGreaterThan(Date.parse(before.body.data.asOf));
  });
});
