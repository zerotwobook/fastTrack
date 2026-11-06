import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { randomUUID } from 'node:crypto';
import request from 'supertest';
import { createApp } from '../app.js';
import { loadConfig } from '../config.js';
import { createApplicationRouters } from '../modules/index.js';
import { Prisma } from '../db/generated/client/index.js';
import type { PrismaClient } from '../db/generated/client/index.js';
import { FeedbackService, isFeedbackUniqueConflict } from '../modules/feedback/service.js';
import { createBaseFixtures, createTestPrisma, cleanTestDatabase, TEST_PASSWORD } from './fixtures.js';

const prisma = createTestPrisma();
const origin = 'http://127.0.0.1:5173';
const config = loadConfig({ NODE_ENV: 'test', DATABASE_URL: process.env['TEST_DATABASE_URL'], APP_ORIGIN: origin });
const app = () => createApp(config, { logger: () => undefined, routers: createApplicationRouters({ prisma, config }) });
let fixtures: Awaited<ReturnType<typeof createBaseFixtures>>;
let id: string;
let supervisor: { cookie: string; csrf: string };
async function login(email: string) {
  const res = await request(app()).post('/api/auth/login').set('Origin', origin).set('X-fastTrack-Request', '1')
    .send({ email, password: TEST_PASSWORD }).expect(200);
  return { cookie: String(res.headers['set-cookie']?.[0]).split(';')[0]!, csrf: String(res.body.data.csrfToken) };
}
const input = () => ({ content: 'Review the immutable first version.', clientRequestId: randomUUID() });
const post = (body: unknown, target = id, actor = supervisor) => request(app()).post(`/api/submissions/${target}/feedback`)
  .set('Cookie', actor.cookie).set('Origin', origin).set('X-CSRF-Token', actor.csrf).set('Content-Type', 'application/json').send(JSON.stringify(body));
const get = (target = id, actor = supervisor) => request(app()).get(`/api/submissions/${target}/feedback`).set('Cookie', actor.cookie);
beforeEach(async () => {
  fixtures = await createBaseFixtures(prisma);
  supervisor = await login('sup-a@test.local');
  const student = await login('stu-a1@test.local');
  const saved = await request(app()).post(`/api/milestones/${fixtures.milestones.milestoneFuture.id}/submissions`)
    .set('Cookie', student.cookie).set('Origin', origin).set('X-CSRF-Token', student.csrf)
    .send({ title: 'Version one', description: 'Created through the actual submission API.', url: 'https://example.com/work' }).expect(201);
  id = saved.body.data.id;
});
afterAll(async () => { await cleanTestDatabase(prisma); await prisma.$disconnect(); });

describe('F-04 real sessions, immutable versions and idempotent retries', () => {
  it('T-17/T-20 persists server identity/time and returns only the DTO after application recreation', async () => {
    const body = input(); const res = await post({ ...body, content: '  Preserved version feedback.  ' }).expect(201);
    const row = await prisma.feedback.findUniqueOrThrow({ where: { id: res.body.data.id } });
    expect(row.supervisorId).toBe(fixtures.users.supA.id); expect(row.submissionId).toBe(id);
    expect(row.content).toBe('Preserved version feedback.'); expect(res.body.data.createdAt).toBe(row.createdAt.toISOString());
    expect(Object.keys(res.body.data).sort()).toEqual(['id','submissionId','supervisor','content','clientRequestId','createdAt'].sort());
    expect(res.body.data.supervisor).toEqual({ id: fixtures.users.supA.id, displayName: 'Supervisor A' });
    const student = await login('stu-a2@test.local'); const read = await get(id, student).expect(200);
    expect(read.body.data).toEqual([res.body.data]); expect(read.headers['cache-control']).toBe('no-store');
    expect(Date.parse(read.body.meta.serverTime)).not.toBeNaN();
    expect((await get().expect(200)).body.data).toEqual(read.body.data);
  });
  it('T-24 replays a trimmed identical intent with one row and conflicts on changed content', async () => {
    const body = input(); const first = await post(body).expect(201);
    const replay = await post({ ...body, content: `  ${body.content}  ` }).expect(200);
    expect(replay.body.data).toEqual(first.body.data);
    expect((await post({ ...body, content: 'Changed intent' }).expect(409)).body.error.code).toBe('REQUEST_KEY_REUSED');
    expect(await prisma.feedback.count()).toBe(1);
  });
  it('T-24 concurrent identical HTTP requests return one 201 and the remaining 200 with one persisted row', async () => {
    const body = input(); const results = await Promise.all(Array.from({ length: 12 }, () => post(body)));
    expect(results.map(r => r.status).sort()).toEqual([200,200,200,200,200,200,200,200,200,200,200,201]);
    expect(new Set(results.map(r => r.body.data?.id)).size).toBe(1); expect(await prisma.feedback.count()).toBe(1);
  });
  it('T-24 concurrent different intents on one key return 201/409 and preserve the winner', async () => {
    const body = input(); const results = await Promise.all([post(body), post({ ...body, content: 'Different intent' })]);
    expect(results.map(r => r.status).sort()).toEqual([201,409]);
    const winner = results.find(r => r.status === 201)!;
    expect((await prisma.feedback.findMany()).map(r => r.content)).toEqual([winner.body.data.content]);
  });
  it('keeps feedback on its exact version, allows after the deadline, and rejects key reuse on another authorized version', async () => {
    const body = input(); await post(body).expect(201);
    const row = await prisma.submission.findUniqueOrThrow({ where: { id } });
    const next = await prisma.submission.create({ data: { milestoneId: row.milestoneId, version: 2, submittedById: row.submittedById,
      title: 'Synthetic future version', description: 'Association fixture, not an S1 revision endpoint.', url: row.url, submittedAt: new Date() } });
    expect((await get(next.id).expect(200)).body.data).toEqual([]);
    expect((await post(body, next.id).expect(409)).body.error.code).toBe('REQUEST_KEY_REUSED');
    await prisma.milestone.update({ where: { id: row.milestoneId }, data: { dueAt: new Date(Date.now() - 1000) } });
    await post(input()).expect(201); expect(await prisma.feedback.count({ where: { submissionId: next.id } })).toBe(0);
  });
  it('orders feedback by createdAt and id without changing the content', async () => {
    const a = await post(input()).expect(201); const b = await post({ ...input(), content: '<script>alert(1)</script>\nPlain feedback' }).expect(201);
    const time = new Date('2026-11-01T00:00:00.000Z');
    await prisma.feedback.updateMany({ data: { createdAt: time } });
    const rows = (await get().expect(200)).body.data;
    expect(rows.map((x: { id: string }) => x.id)).toEqual([a.body.data.id,b.body.data.id].sort());
    expect(rows.some((x: { content: string }) => x.content === '<script>alert(1)</script>\nPlain feedback')).toBe(true);
  });
  it.each(['student','foreign-student','foreign-supervisor','missing'])('denies %s without a write or cross-team key oracle', async kind => {
    const body = input(); await post(body).expect(201);
    const who = await login(kind === 'student' ? 'stu-a1@test.local' : kind === 'foreign-student' ? 'stu-b1@test.local' : kind === 'foreign-supervisor' ? 'sup-b@test.local' : 'sup-a@test.local');
    const target = kind === 'missing' ? randomUUID() : id;
    const expected = kind === 'student' || kind === 'foreign-student' ? 403 : 404;
    await post(body,target,who).expect(expected);
    if (kind !== 'student') await get(target,who).expect(404);
    expect(await prisma.feedback.count()).toBe(1);
  });
  it('authenticates before parsing, rejects missing/expired/revoked sessions and source/CSRF before input', async () => {
    const path = `/api/submissions/${id}/feedback`;
    await request(app()).post(path).set('Content-Type','application/json').send('{').expect(401);
    await request(app()).get(path).expect(401);
    await request(app()).post(path).set('Cookie',supervisor.cookie).set('Origin','https://foreign.example').set('Content-Type','application/json').send('{').expect(403);
    await request(app()).post(path).set('Cookie',supervisor.cookie).set('Origin',origin).set('Content-Type','application/json').send('{').expect(403);
    await prisma.session.updateMany({ data: { expiresAt: new Date(Date.now() - 1000) } }); await get().expect(401);
    supervisor = await login('sup-a@test.local'); await prisma.session.updateMany({ data: { revokedAt: new Date() } }); await get().expect(401);
    expect(await prisma.feedback.count()).toBe(0);
  });
  it.each(['bad\u0000text','bad\ud800text','bad\udffftext', '', '  ', 'a'.repeat(4001)])('rejects invalid content %# with a field error and no write', async content => {
    const result = await post({ ...input(), content }).expect(400);
    expect(result.body.error.code).toBe('INVALID_INPUT'); expect(result.body.error.fields.content).toBeTruthy();
    expect(await prisma.feedback.count()).toBe(0);
  });
  it('supports 4000 astral code points and normalizes UUID casing on retry', async () => {
    const body = { ...input(), content: '\u{1F680}'.repeat(4000) };
    const saved = await post(body,id.toUpperCase()).expect(201);
    expect((await post({ ...body, clientRequestId: body.clientRequestId.toUpperCase() }).expect(200)).body.data.id).toBe(saved.body.data.id);
    expect(await prisma.feedback.count()).toBe(1);
  });
  it.each(['supervisorId','submissionId','createdAt','version'])('rejects spoofed field %s with no write', async field => {
    await post({ ...input(), [field]: randomUUID() }).expect(400); expect(await prisma.feedback.count()).toBe(0);
  });
  it('fails closed on database outages without exposing SQL or writing', async () => {
    const spy = vi.spyOn(prisma,'$transaction').mockRejectedValueOnce(new Error('secret SQL database URL'));
    const res = await get(); spy.mockRestore();
    expect(res.status).toBe(503); expect(res.body.error.code).toBe('TEMPORARILY_UNAVAILABLE');
    expect(JSON.stringify(res.body)).not.toContain('secret SQL');
    expect(await prisma.feedback.count()).toBe(0);
  });
});


describe('F-04 transaction boundaries and actual driver conflicts', () => {
  it('handles a forced supervisor-wide key race across two authorized teams after actual PostgreSQL rollback', async () => {
    await prisma.team.update({ where: { id: fixtures.teams.teamB.id }, data: { supervisorId: fixtures.users.supA.id } });
    const other = await prisma.submission.create({ data: { milestoneId: fixtures.milestones.milestoneBTeam.id, version: 1,
      submittedById: fixtures.users.stuB1.id, submittedAt: new Date(), title: 'Other team work', description: 'Race fixture.', url: 'https://example.com/other' } });
    let count = 0; let release!: () => void; const gate = new Promise<void>(resolve => { release = resolve; });
    const wrapped = new Proxy(prisma, { get(target, name) {
      if (name !== '$transaction') return Reflect.get(target, name);
      return (work: (tx: Prisma.TransactionClient) => Promise<unknown>, options: object) => target.$transaction(async tx => {
        const guarded = new Proxy(tx, { get(client, field) {
          if (field !== 'feedback') return Reflect.get(client, field);
          return new Proxy(client.feedback, { get(delegate, method) {
            if (method !== 'findUnique') return Reflect.get(delegate, method);
            return async (...args: Parameters<typeof delegate.findUnique>) => {
              const result = await delegate.findUnique(...args);
              if (++count <= 2) { if (count === 2) release(); await gate; }
              return result;
            };
          } });
        } });
        return work(guarded);
      }, options);
    } }) as PrismaClient;
    const service = new FeedbackService(wrapped); const body = input(); const actor = { userId: fixtures.users.supA.id, role: 'supervisor' as const };
    const results = await Promise.allSettled([service.createFeedback(id,body,actor),service.createFeedback(other.id,body,actor)]);
    expect(results.map(r => r.status === 'fulfilled' ? r.value.status : r.reason.status).sort()).toEqual([201,409]);
    expect(await prisma.feedback.count()).toBe(1);
  });
  it('recognizes the real feedback UUID constraint and excludes primary-key or plain-object errors', async () => {
    const created = await post(input()).expect(201); const row = await prisma.feedback.findUniqueOrThrow({ where: { id: created.body.data.id } });
    const { id: ignored, ...data } = row;
    try { await prisma.feedback.create({ data }); throw new Error('Expected a real key conflict.'); }
    catch (error) { expect(isFeedbackUniqueConflict(error)).toBe(true); }
    try { await prisma.feedback.create({ data: { ...data, id: row.id, clientRequestId: randomUUID() } }); throw new Error('Expected a primary-key conflict.'); }
    catch (error) { expect(isFeedbackUniqueConflict(error)).toBe(false); }
    expect(isFeedbackUniqueConflict({ code: 'P2002', meta: { target: ['supervisor_id','client_request_id'] } })).toBe(false);
    expect(await prisma.feedback.count()).toBe(1);
  });
  it.each(['P2034','P2028','UNKNOWN'])('bounds or avoids retry for technical condition %s', async code => {
    const error = code === 'UNKNOWN' ? new Error('private database detail') : new Prisma.PrismaClientKnownRequestError('private database detail', { code, clientVersion: '7.10.1' });
    const spy = vi.spyOn(prisma,'$transaction').mockRejectedValue(error);
    const result = await post(input()); const calls = spy.mock.calls.length; spy.mockRestore();
    expect(result.status).toBe(503); expect(JSON.stringify(result.body)).not.toContain('private database');
    expect(calls).toBe(code === 'P2034' ? 3 : 1); expect(await prisma.feedback.count()).toBe(0);
  });
  it('rechecks assignment after an actual team lock wait before any feedback write', async () => {
    let release!: () => void; let acquired!: () => void;
    const gate = new Promise<void>(r => { release = r; }); const held = new Promise<void>(r => { acquired = r; });
    const blocker = prisma.$transaction(async tx => {
      await tx.$queryRaw`SELECT id FROM teams WHERE id=${fixtures.teams.teamA.id}::uuid FOR UPDATE`;
      acquired(); await gate;
      await tx.team.update({ where: { id: fixtures.teams.teamA.id }, data: { supervisorId: fixtures.users.supB.id } });
    }, { timeout: 10000 });
    await held; const pending = post(input()).then(r => r);
    try {
      let waiting = false;
      for (let attempt = 0; attempt < 100; attempt++) {
        const rows = await prisma.$queryRaw<{ waiting: boolean }[]>`SELECT EXISTS(SELECT 1 FROM pg_stat_activity WHERE datname=current_database() AND wait_event_type='Lock') AS waiting`;
        if (rows[0]!.waiting) { waiting = true; break; }
        await new Promise(r => setTimeout(r,20));
      }
      expect(waiting).toBe(true);
    } finally { release(); await blocker; }
    expect((await pending).status).toBe(404); expect(await prisma.feedback.count()).toBe(0);
  });
});
