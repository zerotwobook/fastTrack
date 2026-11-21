import { afterAll, beforeEach, describe, expect, it } from 'vitest';
import request from 'supertest';
import { Prisma } from '../db/generated/client/index.js';
import { createApp } from '../app.js';
import { loadConfig } from '../config.js';
import { createApplicationRouters } from '../modules/index.js';
import { readSummaryItems } from '../modules/reports/summary-items.js';
import { cleanTestDatabase, createBaseFixtures, createTestPrisma, TEST_PASSWORD } from './fixtures.js';

const prisma = createTestPrisma();
const origin = 'http://127.0.0.1:5173';
const config = loadConfig({ NODE_ENV: 'test', DATABASE_URL: process.env['TEST_DATABASE_URL'], APP_ORIGIN: origin });
const app = () => createApp(config, { logger: () => undefined, routers: createApplicationRouters({ prisma, config }) });

let fixtures: Awaited<ReturnType<typeof createBaseFixtures>>;

async function login(email: string) {
  const response = await request(app())
    .post('/api/auth/login')
    .set('Origin', origin)
    .set('X-fastTrack-Request', '1')
    .send({ email, password: TEST_PASSWORD })
    .expect(200);
  return { cookie: String(response.headers['set-cookie']?.[0]).split(';')[0]!, csrf: String(response.body.data.csrfToken) };
}

beforeEach(async () => {
  fixtures = await createBaseFixtures(prisma);
});

afterAll(async () => {
  await cleanTestDatabase(prisma);
  await prisma.$disconnect();
});

describe('F-08B drill-down item query, sorting, pagination, snapshots, and scope (R3-B01)', () => {
  it('F08-STS-03 / worked example: matches cancelled-inclusive unfiltered counts and paged PENDING items', async () => {
    await prisma.milestone.deleteMany();

    const teamA2 = await prisma.team.create({
      data: { name: 'Team Alpha Secondary', supervisorId: fixtures.users.supA.id },
    });
    const asOf = new Date('2026-11-20T06:00:00.000Z');

    const submittedM = await prisma.milestone.create({
      data: {
        teamId: fixtures.teams.teamA.id,
        title: 'Submitted A',
        description: 'Has v1 submission without feedback.',
        dueAt: new Date('2026-11-19T06:00:00.000Z'),
        createdById: fixtures.users.supA.id,
      },
    });
    await prisma.submission.create({
      data: {
        milestoneId: submittedM.id,
        submittedById: fixtures.users.stuA1.id,
        version: 1,
        title: 'V1',
        description: 'Submitted payload',
        url: 'https://example.edu/v1',
        submittedAt: new Date('2026-11-19T05:00:00.000Z'),
      },
    });

    await prisma.milestone.create({
      data: {
        teamId: fixtures.teams.teamA.id,
        title: 'Cancelled A',
        description: 'Cancelled work remains visible when status filter is omitted.',
        dueAt: new Date('2026-11-18T06:00:00.000Z'),
        cancelledAt: new Date('2026-11-18T00:00:00.000Z'),
        createdById: fixtures.users.supA.id,
      },
    });

    for (let i = 1; i <= 9; i++) {
      await prisma.milestone.create({
        data: {
          teamId: teamA2.id,
          title: `Pending milestone ${i}`,
          description: 'Pending future work.',
          dueAt: new Date(`2026-11-${String(20 + i).padStart(2, '0')}T06:00:00.000Z`),
          createdById: fixtures.users.supA.id,
        },
      });
    }

    const teamIds = [fixtures.teams.teamA.id, teamA2.id];
    const [unfiltered, pendingPage2] = await prisma.$transaction(async tx => [
      await readSummaryItems({
        tx,
        teamIds,
        asOf,
        filters: { teamId: null, status: null, page: 1, pageSize: 20 },
      }),
      await readSummaryItems({
        tx,
        teamIds,
        asOf,
        filters: { teamId: null, status: 'PENDING', page: 2, pageSize: 8 },
      }),
    ], { isolationLevel: Prisma.TransactionIsolationLevel.RepeatableRead });

    expect(unfiltered.matchedCount).toBe(11);
    expect(unfiltered.items).toHaveLength(11);
    expect(unfiltered.items.some(item => item.status === 'CANCELLED')).toBe(true);

    expect(pendingPage2.matchedCount).toBe(9);
    expect(pendingPage2.items).toHaveLength(1);
    expect(pendingPage2.items[0]).toMatchObject({
      teamId: teamA2.id,
      teamName: 'Team Alpha Secondary',
      title: 'Pending milestone 9',
      status: 'PENDING',
      latestVersion: null,
    });
  });

  it('F08-STS-05: breaks tied dueAt timestamps deterministically by milestone ID across pages and handles out-of-range pages', async () => {
    await prisma.milestone.deleteMany();

    const teamA2 = await prisma.team.create({
      data: { name: 'Team Tied Pair', supervisorId: fixtures.users.supA.id },
    });
    const tiedDue = new Date('2026-11-25T12:00:00.000Z');
    const createdIds: string[] = [];

    for (let i = 0; i < 7; i++) {
      const m = await prisma.milestone.create({
        data: {
          teamId: i % 2 === 0 ? fixtures.teams.teamA.id : teamA2.id,
          title: `Tied ${i}`,
          description: 'Identical due timestamp.',
          dueAt: tiedDue,
          createdById: fixtures.users.supA.id,
        },
      });
      createdIds.push(m.id);
    }

    const asOf = new Date('2026-11-20T06:00:00.000Z');
    const teamIds = [fixtures.teams.teamA.id, teamA2.id];

    const pages = await prisma.$transaction(async tx => Promise.all([1, 2, 3, 4, 5].map(page => readSummaryItems({
      tx,
      teamIds,
      asOf,
      filters: { teamId: null, status: null, page, pageSize: 2 },
    }))), { isolationLevel: Prisma.TransactionIsolationLevel.RepeatableRead });

    expect(pages.map(p => p.matchedCount)).toEqual([7, 7, 7, 7, 7]);
    expect(pages.map(p => p.items.length)).toEqual([2, 2, 2, 1, 0]);

    const seenIds = pages.flatMap(p => p.items.map(item => item.milestoneId));
    expect(seenIds).toHaveLength(7);
    expect(new Set(seenIds).size).toBe(7);
    expect([...seenIds]).toEqual([...createdIds].sort());

    const [maxPage, hugeBeyondLast] = await prisma.$transaction(async tx => [
      await readSummaryItems({ tx, teamIds, asOf, filters: { teamId: null, status: null, page: 1, pageSize: 50 } }),
      await readSummaryItems({ tx, teamIds, asOf, filters: { teamId: null, status: null, page: 999_999_999, pageSize: 50 } }),
    ], { isolationLevel: Prisma.TransactionIsolationLevel.RepeatableRead });

    expect(maxPage.matchedCount).toBe(7);
    expect(maxPage.items).toHaveLength(7);
    expect(hugeBeyondLast).toEqual({ matchedCount: 7, items: [] });
  });

  it('F-07 parity: handles exact deadline equality, +1ms overdue, cancelled precedence, and ignores feedback on superseded versions', async () => {
    await prisma.milestone.deleteMany();

    const exactDue = new Date('2026-11-22T10:00:00.000Z');
    const [mExact, mOverdueCancelled, mSupersededFeedback, mLatestFeedback] = await Promise.all([
      prisma.milestone.create({
        data: {
          teamId: fixtures.teams.teamA.id,
          title: 'Exact Boundary',
          description: 'Due equals asOf.',
          dueAt: exactDue,
          createdById: fixtures.users.supA.id,
        },
      }),
      prisma.milestone.create({
        data: {
          teamId: fixtures.teams.teamA.id,
          title: 'Cancelled Past Due',
          description: 'Cancelled wins over overdue.',
          dueAt: new Date(exactDue.getTime() - 10_000),
          cancelledAt: new Date('2026-11-20T00:00:00.000Z'),
          createdById: fixtures.users.supA.id,
        },
      }),
      prisma.milestone.create({
        data: {
          teamId: fixtures.teams.teamA.id,
          title: 'Old Feedback Only',
          description: 'v1 has feedback, v2 does not.',
          dueAt: new Date(exactDue.getTime() + 10_000),
          createdById: fixtures.users.supA.id,
        },
      }),
      prisma.milestone.create({
        data: {
          teamId: fixtures.teams.teamA.id,
          title: 'Latest Feedback',
          description: 'v2 has feedback.',
          dueAt: new Date(exactDue.getTime() + 20_000),
          createdById: fixtures.users.supA.id,
        },
      }),
    ]);

    const sOldV1 = await prisma.submission.create({
      data: {
        milestoneId: mSupersededFeedback.id,
        submittedById: fixtures.users.stuA1.id,
        version: 1,
        title: 'v1',
        description: 'v1 desc',
        url: 'https://example.edu/old-v1',
        submittedAt: new Date('2026-11-21T00:00:00.000Z'),
      },
    });
    await prisma.feedback.create({
      data: {
        submissionId: sOldV1.id,
        supervisorId: fixtures.users.supA.id,
        content: 'Fix v1',
        clientRequestId: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1',
      },
    });
    await prisma.submission.create({
      data: {
        milestoneId: mSupersededFeedback.id,
        submittedById: fixtures.users.stuA1.id,
        version: 2,
        title: 'v2',
        description: 'v2 without feedback yet',
        url: 'https://example.edu/old-v2',
        submittedAt: new Date('2026-11-21T01:00:00.000Z'),
      },
    });

    const sLatestV2 = await prisma.submission.create({
      data: {
        milestoneId: mLatestFeedback.id,
        submittedById: fixtures.users.stuA1.id,
        version: 2,
        title: 'v2',
        description: 'latest feedback present',
        url: 'https://example.edu/latest-v2',
        submittedAt: new Date('2026-11-21T02:00:00.000Z'),
      },
    });
    await prisma.feedback.create({
      data: {
        submissionId: sLatestV2.id,
        supervisorId: fixtures.users.supA.id,
        content: 'Reviewed v2',
        clientRequestId: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2',
      },
    });

    const teamIds = [fixtures.teams.teamA.id];
    const atExact = await prisma.$transaction(
      tx => readSummaryItems({ tx, teamIds, asOf: exactDue, filters: { teamId: null, status: null, page: 1, pageSize: 20 } }),
      { isolationLevel: Prisma.TransactionIsolationLevel.RepeatableRead },
    );
    const byIdExact = new Map(atExact.items.map(i => [i.milestoneId, i]));
    expect(byIdExact.get(mExact.id)?.status).toBe('PENDING');
    expect(byIdExact.get(mOverdueCancelled.id)?.status).toBe('CANCELLED');
    expect(byIdExact.get(mSupersededFeedback.id)).toMatchObject({ status: 'SUBMITTED', latestVersion: 2 });
    expect(byIdExact.get(mLatestFeedback.id)).toMatchObject({ status: 'FEEDBACK_AVAILABLE', latestVersion: 2 });

    const [overdueAfter1ms, feedbackOnly, submittedOnly] = await prisma.$transaction(async tx => {
      const plus1ms = new Date(exactDue.getTime() + 1);
      return Promise.all([
        readSummaryItems({ tx, teamIds, asOf: plus1ms, filters: { teamId: null, status: 'OVERDUE', page: 1, pageSize: 20 } }),
        readSummaryItems({ tx, teamIds, asOf: plus1ms, filters: { teamId: null, status: 'FEEDBACK_AVAILABLE', page: 1, pageSize: 20 } }),
        readSummaryItems({ tx, teamIds, asOf: plus1ms, filters: { teamId: null, status: 'SUBMITTED', page: 1, pageSize: 20 } }),
      ]);
    }, { isolationLevel: Prisma.TransactionIsolationLevel.RepeatableRead });

    expect(overdueAfter1ms.items.map(i => i.milestoneId)).toEqual([mExact.id]);
    expect(feedbackOnly.items.map(i => i.milestoneId)).toEqual([mLatestFeedback.id]);
    expect(submittedOnly.items.map(i => i.milestoneId)).toEqual([mSupersededFeedback.id]);
  });

  it('F08-STS-03: preserves repeatable-read snapshot isolation across concurrent submission commits and observes updates on later reads', async () => {
    const milestone = fixtures.milestones.milestoneFuture;
    const asOfBefore = new Date('2026-11-20T06:00:00.000Z');

    let releaseCommit!: () => void;
    let signalTxStarted!: () => void;
    const txStarted = new Promise<void>(resolve => { signalTxStarted = resolve; });
    const allowSnapshotRead = new Promise<void>(resolve => { releaseCommit = resolve; });

    const snapshotReadPromise = prisma.$transaction(async tx => {
      await tx.$queryRaw`SELECT 1`;
      signalTxStarted();
      await allowSnapshotRead;
      return readSummaryItems({
        tx,
        teamIds: [fixtures.teams.teamA.id],
        asOf: asOfBefore,
        filters: { teamId: fixtures.teams.teamA.id, status: null, page: 1, pageSize: 20 },
      });
    }, { isolationLevel: Prisma.TransactionIsolationLevel.RepeatableRead });

    await txStarted;
    await prisma.submission.create({
      data: {
        milestoneId: milestone.id,
        submittedById: fixtures.users.stuA1.id,
        version: 1,
        title: 'Concurrent submission',
        description: 'Committed while summary transaction is open.',
        url: 'https://example.edu/concurrent',
        submittedAt: new Date('2026-11-20T06:00:01.000Z'),
      },
    });
    releaseCommit();

    const snapshotPage = await snapshotReadPromise;
    const snapshotTarget = snapshotPage.items.find(i => i.milestoneId === milestone.id);
    expect(snapshotTarget).toMatchObject({ status: 'PENDING', latestVersion: null });

    const afterCommitPage = await prisma.$transaction(
      tx => readSummaryItems({
        tx,
        teamIds: [fixtures.teams.teamA.id],
        asOf: new Date('2026-11-20T06:00:02.000Z'),
        filters: { teamId: fixtures.teams.teamA.id, status: null, page: 1, pageSize: 20 },
      }),
      { isolationLevel: Prisma.TransactionIsolationLevel.RepeatableRead },
    );
    const updatedTarget = afterCommitPage.items.find(i => i.milestoneId === milestone.id);
    expect(updatedTarget).toMatchObject({ status: 'SUBMITTED', latestVersion: 1 });
  });

  it('F08-STS-04: denies cross-team queries and milestone detail reads without revealing foreign data', async () => {
    const asOf = new Date();
    const foreignResult = await prisma.$transaction(
      tx => readSummaryItems({
        tx,
        teamIds: [fixtures.teams.teamB.id],
        asOf,
        filters: { teamId: fixtures.teams.teamA.id, status: null, page: 1, pageSize: 20 },
      }),
      { isolationLevel: Prisma.TransactionIsolationLevel.RepeatableRead },
    );
    expect(foreignResult).toEqual({ matchedCount: 0, items: [] });

    const supB = await login('sup-b@test.local');
    const detailRes = await request(app())
      .get(`/api/milestones/${fixtures.milestones.milestoneFuture.id}`)
      .set('Cookie', supB.cookie)
      .expect(404);
    expect(detailRes.body.error.code).toBe('NOT_FOUND');

    await request(app())
      .get(`/api/milestones/${fixtures.milestones.milestoneFuture.id}`)
      .expect(401);
  });
});
