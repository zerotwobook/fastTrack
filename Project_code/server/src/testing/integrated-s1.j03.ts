import { afterAll, beforeEach, describe, expect, it } from 'vitest';
import { createHash, randomUUID } from 'node:crypto';
import { fork, spawnSync } from 'node:child_process';
import type { ChildProcess } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { createBaseFixtures, createTestPrisma, cleanTestDatabase, TEST_PASSWORD } from './fixtures.js';
import { requireTestDatabase } from '../db/test-database.js';
import type { MilestoneDto } from '../modules/milestones/dto.js';
import type { SubmissionDto } from '../modules/submissions/dto.js';
import type { FeedbackDto } from '../modules/feedback/dto.js';

const prisma = createTestPrisma();
const root = fileURLToPath(new URL('../../../', import.meta.url));
let fixtures: Awaited<ReturnType<typeof createBaseFixtures>>;
beforeEach(async () => { fixtures = await createBaseFixtures(prisma); });
afterAll(async () => { await cleanTestDatabase(prisma); await prisma.$disconnect(); });
type Actor = { cookie: string; csrf: string };

async function compiledRuntime() {
  let child: ChildProcess | undefined;
  const start = async () => {
    child = fork(new URL('../../../scripts/serve-submission-restart.mjs', import.meta.url), [], {
      env: { ...process.env, NODE_ENV: 'test', RESTART_PROTECTED_DATABASE_URL: process.env['DATABASE_URL']!, DATABASE_URL: process.env['TEST_DATABASE_URL']! },
      stdio: ['ignore','ignore','ignore','ipc'], windowsHide: true,
    });
    const running = child;
    const url = await new Promise<string>((resolve,reject) => {
      const timer = setTimeout(() => reject(new Error('Compiled integrated app did not become ready.')), 8000);
      running.once('error', error => { clearTimeout(timer); reject(error); });
      running.once('exit', code => { clearTimeout(timer); reject(new Error(`Compiled app exited before ready (${code}).`)); });
      running.once('message', value => {
        clearTimeout(timer); const message = value as { type: string; url: string };
        if (message.type === 'ready') resolve(message.url); else reject(new Error('Unexpected restart message.'));
      });
    });
    return { url, pid: running.pid };
  };
  const stop = async () => {
    if (!child || child.exitCode !== null) return;
    const running = child;
    await new Promise<void>((resolve,reject) => {
      const timer = setTimeout(() => { running.kill(); reject(new Error('Compiled integrated app did not stop.')); }, 7000);
      running.once('exit', code => { clearTimeout(timer); code === 0 ? resolve() : reject(new Error('Compiled app shutdown failed.')); });
      running.send('stop');
    });
  };
  return { start, stop };
}
function seed() {
  requireTestDatabase(process.env, [process.env['DATABASE_URL']!]);
  const result = spawnSync(process.execPath, [process.env.npm_execpath!, 'run', 'db:seed', '--workspace', '@fasttrack/server'], {
    cwd: root, env: { ...process.env, DATABASE_URL: process.env['TEST_DATABASE_URL']!, DEMO_SEED_PASSWORD: randomUUID() },
    encoding: 'utf8', windowsHide: true, timeout: 30000,
  });
  expect(result.status, 'Explicit reserved-test seed must succeed.').toBe(0);
}
async function fingerprint() {
  const tables = await Promise.all([
    prisma.user.findMany({ orderBy: { id: 'asc' } }), prisma.session.findMany({ orderBy: { id: 'asc' } }),
    prisma.team.findMany({ orderBy: { id: 'asc' } }), prisma.teamMember.findMany({ orderBy: [{ teamId: 'asc' }, { studentId: 'asc' }] }),
    prisma.milestone.findMany({ orderBy: { id: 'asc' } }), prisma.submission.findMany({ orderBy: { id: 'asc' } }),
    prisma.feedback.findMany({ orderBy: { id: 'asc' } }),
  ]);
  // Compare private auth fields without printing tokens/hashes in a failing assertion.
  return tables.map(rows => createHash('sha256').update(JSON.stringify(rows)).digest('hex'));
}

describe('Sprint 1 integrated compiled HTTP and durable data', () => {
  it('T-21/T-22/T-25/T-31 creates, submits, appends and scopes feedback; repeat seed and actual process restart preserve all records', async () => {
    seed(); const runtime = await compiledRuntime();
    try {
      let process = await runtime.start(); const originalPid = process.pid;
      const login = async (email: string): Promise<Actor> => {
        const response = await fetch(`${process.url}/api/auth/login`, { method: 'POST', headers: { Origin: process.url, 'Content-Type': 'application/json', 'X-fastTrack-Request': '1' }, body: JSON.stringify({ email, password: TEST_PASSWORD }) });
        expect(response.status).toBe(200);
        return { cookie: response.headers.get('set-cookie')!.split(';')[0]!, csrf: (await response.json() as { data: { csrfToken: string } }).data.csrfToken };
      };
      const call = async <T>(path: string, actor: Actor, expected: number, body?: unknown) => {
        const response = await fetch(`${process.url}/api${path}`, { method: body === undefined ? 'GET' : 'POST',
          headers: { Cookie: actor.cookie, ...(body === undefined ? {} : { Origin: process.url, 'Content-Type': 'application/json', 'X-CSRF-Token': actor.csrf }) },
          ...(body === undefined ? {} : { body: JSON.stringify(body) }) });
        expect(response.status, `Expected HTTP ${expected} for ${path}`).toBe(expected);
        expect(response.headers.get('cache-control')).toBe('no-store');
        return await response.json() as { data: T; meta?: { serverTime: string }; error?: { code: string } };
      };
      const supervisor = await login('sup-a@test.local'); const student = await login('stu-a1@test.local');
      const teammate = await login('stu-a2@test.local'); const foreign = await login('sup-b@test.local');
      const milestone = (await call<MilestoneDto>(`/teams/${fixtures.teams.teamA.id}/milestones`, supervisor, 201,
        { title: 'Integrated checkpoint', description: 'A real cross-feature journey.', dueAt: new Date(Date.now()+3600000).toISOString() })).data;
      expect((await call<MilestoneDto>(`/milestones/${milestone.id}`, student, 200)).data.latestSubmission).toBeNull();
      const submission = (await call<SubmissionDto>(`/milestones/${milestone.id}/submissions`, student, 201,
        { title: 'Integrated first version', description: 'Immutable work before the deadline.', url: 'https://example.com/integrated-work' })).data;
      expect(submission.version).toBe(1); expect(submission.submittedBy.id).toBe(fixtures.users.stuA1.id);
      const intent = { content: 'Feedback tied to this exact version.', clientRequestId: randomUUID() };
      const feedback = (await call<FeedbackDto>(`/submissions/${submission.id}/feedback`, supervisor, 201, intent)).data;
      expect((await call<FeedbackDto>(`/submissions/${submission.id}/feedback`, supervisor, 200, intent)).data).toEqual(feedback);
      expect((await call<unknown>(`/submissions/${submission.id}/feedback`, supervisor, 409, { ...intent, content: 'Changed intent' })).error?.code).toBe('REQUEST_KEY_REUSED');
      const second = (await call<FeedbackDto>(`/submissions/${submission.id}/feedback`, supervisor, 201,
        { content: 'A second deliberate append.', clientRequestId: randomUUID() })).data;
      const savedFeedback = (await call<FeedbackDto[]>(`/submissions/${submission.id}/feedback`, teammate, 200)).data;
      expect(savedFeedback).toEqual([feedback, second]); expect(savedFeedback.every(row => row.submissionId === submission.id)).toBe(true);
      const detail = await call<MilestoneDto>(`/milestones/${milestone.id}`, student, 200);
      const list = await call<MilestoneDto[]>(`/teams/${milestone.teamId}/milestones`, student, 200);
      expect(detail.data.latestSubmission).toMatchObject({ id: submission.id, version: 1, feedbackCount: 2 });
      expect(list.data.find(row => row.id === milestone.id)).toEqual(detail.data); expect(Date.parse(list.meta!.serverTime)).not.toBeNaN();
      const before = await fingerprint(); seed(); expect(await fingerprint()).toEqual(before);
      await runtime.stop(); process = await runtime.start(); expect(process.pid).not.toBe(originalPid);
      expect((await call<SubmissionDto>(`/submissions/${submission.id}`, student, 200)).data).toEqual(submission);
      expect((await call<FeedbackDto[]>(`/submissions/${submission.id}/feedback`, teammate, 200)).data).toEqual(savedFeedback);
      expect((await call<MilestoneDto>(`/milestones/${milestone.id}`, supervisor, 200)).data).toEqual(detail.data);
      await call('/auth/me', student, 200); expect(await fingerprint()).toEqual(before);
      await call(`/submissions/${submission.id}/feedback`, foreign, 404);
      await call(`/submissions/${submission.id}/feedback`, student, 403, { content: 'Forbidden student write', clientRequestId: randomUUID() });
      expect((await call(`/milestones/${milestone.id}/submissions`, teammate, 409,
        { title: 'Duplicate', description: 'Rejected after restart.', url: 'https://example.com/duplicate' })).error?.code).toBe('ALREADY_SUBMITTED');
      expect(await fingerprint()).toEqual(before);
      const logout = await fetch(`${process.url}/api/auth/logout`, { method: 'POST', headers: { Origin: process.url, Cookie: student.cookie, 'X-CSRF-Token': student.csrf } });
      expect(logout.status).toBe(204); await call('/auth/me', student, 401);
      expect(await prisma.submission.count()).toBe(1); expect(await prisma.feedback.count()).toBe(2);
    } finally { await runtime.stop(); }
  });
});
