import { randomUUID } from 'node:crypto';
import { setTimeout as delay } from 'node:timers/promises';
import { afterAll, beforeEach, describe, expect, it } from 'vitest';
import request from 'supertest';
import { createApp } from '../app.js';
import { loadConfig } from '../config.js';
import type { Prisma } from '../db/generated/client/index.js';
import { createApplicationRouters } from '../modules/index.js';
import { cleanTestDatabase, createBaseFixtures, createTestPrisma, TEST_PASSWORD, TEST_PASSWORD_HASH } from './fixtures.js';

const prisma = createTestPrisma();
const origin = 'http://127.0.0.1:5173';
const config = loadConfig({ NODE_ENV: 'test', DATABASE_URL: process.env['TEST_DATABASE_URL'], APP_ORIGIN: origin });
const api = request(createApp(config, { logger: () => undefined, routers: createApplicationRouters({ prisma, config }) }));
const zeroCursor = '00000000-0000-0000-0000-000000000000';
const work = { title: 'First version', description: 'Persist the first saved project version.', url: 'https://example.edu/work' };
let fixtures: Awaited<ReturnType<typeof createBaseFixtures>>;
type Credentials = { cookie: string; csrf: string };

async function login(email: string): Promise<Credentials> {
  const result = await api.post('/api/auth/login').set('Origin', origin).set('X-fastTrack-Request', '1')
    .send({ email, password: TEST_PASSWORD }).expect(200);
  return { cookie: String(result.headers['set-cookie']?.[0]).split(';')[0]!, csrf: String(result.body.data.csrfToken) };
}

function mutate(method: 'post' | 'patch' | 'delete', path: string, auth: Credentials) {
  return api[method](`/api${path}`).set('Cookie', auth.cookie).set('Origin', origin).set('X-CSRF-Token', auth.csrf);
}

async function createStudent(name = 'Available Student') {
  return prisma.user.create({
    data: { email: `${randomUUID()}@test.local`, name, role: 'student', passwordHash: TEST_PASSWORD_HASH },
  });
}

async function holdRowLock(lock: (tx: Prisma.TransactionClient) => Promise<unknown>) {
  let unlock!: () => void;
  let acquired!: () => void;
  const released = new Promise<void>(resolve => { unlock = resolve; });
  const ready = new Promise<void>(resolve => { acquired = resolve; });
  const transaction = prisma.$transaction(async tx => {
    await lock(tx);
    acquired();
    await released;
  }, { timeout: 10_000 });
  await Promise.race([ready, transaction]);
  return async () => { unlock(); await transaction; };
}

async function waitForLocks(count: number) {
  for (let attempt = 0; attempt < 120; attempt++) {
    const [result] = await prisma.$queryRaw<{ count: number }[]>`
      SELECT count(*)::int AS count FROM pg_stat_activity
      WHERE datname = current_database() AND wait_event_type = 'Lock'`;
    if (result!.count >= count) return;
    await delay(25);
  }
  throw new Error(`Expected ${count} concurrent PostgreSQL lock waiters.`);
}

beforeEach(async () => { fixtures = await createBaseFixtures(prisma); });
afterAll(async () => { await cleanTestDatabase(prisma); await prisma.$disconnect(); });

describe('F-05A team planning API and persisted membership', () => {
  it('STS-01 creates an empty team owned by the current supervisor and returns the canonical DTO', async () => {
    const supervisor = await login(fixtures.users.supA.email);
    const created = await mutate('post', '/teams', supervisor).send({ name: '  Studio Team  ' }).expect(201);
    expect(created.headers['cache-control']).toBe('no-store');
    expect(created.body.data).toEqual({
      id: expect.any(String), name: 'Studio Team', members: [],
      supervisor: { id: fixtures.users.supA.id, displayName: fixtures.users.supA.name },
    });
    const loaded = await api.get(`/api/teams/${created.body.data.id}`).set('Cookie', supervisor.cookie).expect(200);
    expect(loaded.body.data).toEqual(created.body.data);
    expect(await prisma.teamMember.count({ where: { teamId: created.body.data.id } })).toBe(0);
    const second = await mutate('post', '/teams', supervisor).send({ name: 'Studio Team' }).expect(201);
    expect(second.body.data.id).not.toBe(created.body.data.id);
  });

  it('STS-02 renames an owned team with history while preserving ownership, members and saved work', async () => {
    const supervisor = await login(fixtures.users.supA.email);
    const student = await login(fixtures.users.stuA1.email);
    const teamId = fixtures.teams.teamA.id;
    const milestoneId = fixtures.milestones.milestoneFuture.id;
    const saved = await mutate('post', `/milestones/${milestoneId}/submissions`, student).send(work).expect(201);
    const members = await prisma.teamMember.findMany({ where: { teamId }, orderBy: { studentId: 'asc' } });
    const renamed = await mutate('patch', `/teams/${teamId}`, supervisor).send({ name: '  Renamed Studio  ' }).expect(200);
    expect(renamed.body.data).toMatchObject({ id: teamId, name: 'Renamed Studio', supervisor: { id: fixtures.users.supA.id } });
    expect(await prisma.teamMember.findMany({ where: { teamId }, orderBy: { studentId: 'asc' } })).toEqual(members);
    const readback = await api.get(`/api/submissions/${saved.body.data.id}`).set('Cookie', student.cookie).expect(200);
    expect(readback.body.data).toEqual(saved.body.data);
  });

  it('STS-03 and STS-28 apply session, role, source protection and generic scope errors to new routes', async () => {
    const supervisor = await login(fixtures.users.supA.email);
    const student = await login(fixtures.users.stuA1.email);
    const candidate = await createStudent();
    const id = fixtures.teams.teamB.id;
    const absent = randomUUID();
    await api.post('/api/teams').type('json').send('{invalid').expect(401);
    await mutate('post', '/teams', student).type('json').send('{invalid').expect(403);
    await api.get('/api/students/available').expect(401);
    await api.get('/api/students/available').set('Cookie', student.cookie).expect(403);
    await api.post('/api/teams').set('Cookie', supervisor.cookie).set('Origin', origin).send({ name: 'Blocked' }).expect(403);
    await mutate('post', '/teams', supervisor).type('form').send({ name: 'Blocked' }).expect(415);
    const foreignRename = await mutate('patch', `/teams/${id}`, supervisor).send({ name: 'Blocked' }).expect(404);
    const missingRename = await mutate('patch', `/teams/${absent}`, supervisor).send({ name: 'Blocked' }).expect(404);
    expect(foreignRename.body).toEqual(missingRename.body);
    const foreignAdd = await mutate('post', `/teams/${id}/members`, supervisor).send({ studentId: candidate.id }).expect(404);
    const missingAdd = await mutate('post', `/teams/${absent}/members`, supervisor).send({ studentId: candidate.id }).expect(404);
    expect(foreignAdd.body).toEqual(missingAdd.body);
    const foreignRemove = await mutate('delete', `/teams/${id}/members/${fixtures.users.stuB1.id}`, supervisor).expect(404);
    expect(foreignRemove.body).toEqual(missingAdd.body);
    expect(await prisma.team.count()).toBe(2);
    expect(await prisma.teamMember.findUnique({ where: { studentId: candidate.id } })).toBeNull();
  });

  it('STS-04 validates exact fields and trimmed Unicode boundaries without a write on rejection', async () => {
    const supervisor = await login(fixtures.users.supA.email);
    for (const invalid of [{ name: ' ' }, { name: null }, { name: 'A'.repeat(121) },
      { name: '\u0000' }, { name: '\uD800' }, { name: 'Team', supervisorId: fixtures.users.supB.id }]) {
      await mutate('post', '/teams', supervisor).send(invalid).expect(400);
    }
    expect(await prisma.team.count()).toBe(2);
    const escapedName = '\u{1F680}'.repeat(120);
    const max = await mutate('post', '/teams', supervisor).send({ name: ` ${escapedName} ` }).expect(201);
    expect(max.body.data.name).toBe(escapedName);
    const min = await mutate('post', '/teams', supervisor).send({ name: ' A ' }).expect(201);
    expect(min.body.data.name).toBe('A');
  });

  it('STS-05 pages the minimal student projection by UUID and counts the entire eligible set', async () => {
    const supervisor = await login(fixtures.users.supA.email);
    const students = await Promise.all([createStudent('Same Name'), createStudent('Same Name'), createStudent('Another Name')]);
    const expected = students.map(user => user.id).sort();
    const get = (query: string) => api.get(`/api/students/available${query}`).set('Cookie', supervisor.cookie);
    const first = await get(`?limit=2&after=${zeroCursor}`).expect(200);
    expect(first.body.data.map((item: { id: string }) => item.id)).toEqual(expected.slice(0, 2));
    for (const row of first.body.data) expect(Object.keys(row).sort()).toEqual(['displayName', 'id']);
    expect(first.headers['cache-control']).toBe('no-store');
    expect(first.body.meta).toEqual({ totalAvailable: 3, nextCursor: expected[1], serverTime: expect.any(String) });
    const second = await get(`?limit=2&after=${first.body.meta.nextCursor}`).expect(200);
    expect(second.body.data.map((item: { id: string }) => item.id)).toEqual(expected.slice(2));
    expect(second.body.meta).toMatchObject({ totalAvailable: 3, nextCursor: null });
    const end = await get(`?after=${expected[2]}`).expect(200);
    expect(end.body).toMatchObject({ data: [], meta: { totalAvailable: 3, nextCursor: null } });
    expect((await get('').expect(200)).body.data).toHaveLength(3);
  });

  it('STS-06 rejects repeated, unknown, malformed and out-of-range candidate query parameters', async () => {
    const supervisor = await login(fixtures.users.supA.email);
    for (const query of ['?limit=0', '?limit=101', '?limit=2.5', '?limit=1&limit=2', '?after=bad',
      `?after=${zeroCursor}&after=${zeroCursor}`, '?include=email', '?limit%5B%5D=2']) {
      const result = await api.get(`/api/students/available${query}`).set('Cookie', supervisor.cookie).expect(400);
      expect(result.body.error.code).toBe('INVALID_INPUT');
    }
  });

  it('STS-07 adds and removes one membership, preserves scope, and rejects duplicate, invalid and absent students', async () => {
    const supervisor = await login(fixtures.users.supA.email);
    const candidate = await createStudent();
    const path = `/teams/${fixtures.teams.teamA.id}/members`;
    const add = (studentId: string) => mutate('post', path, supervisor).send({ studentId });
    for (const invalid of ['bad', randomUUID(), fixtures.users.supA.id]) await add(invalid).expect(400);
    const added = await add(candidate.id).expect(200);
    expect(added.body.data.members).toContainEqual({ id: candidate.id, displayName: candidate.name });
    const owned = await add(candidate.id).expect(409);
    const other = await add(fixtures.users.stuB1.id).expect(409);
    expect(owned.body).toEqual(other.body);
    expect(owned.body.error.code).toBe('MEMBERSHIP_CONFLICT');
    await mutate('delete', `${path}/${candidate.id}`, supervisor).send({}).expect(400);
    expect(await prisma.teamMember.findUnique({ where: { studentId: candidate.id } })).not.toBeNull();
    const removed = await mutate('delete', `${path}/${candidate.id}`, supervisor).expect(204);
    expect(removed.text).toBe('');
    await mutate('delete', `${path}/${candidate.id}`, supervisor).expect(404);
    const available = await api.get('/api/students/available').set('Cookie', supervisor.cookie).expect(200);
    expect(available.body.data).toContainEqual({ id: candidate.id, displayName: candidate.name });
    expect(await prisma.teamMember.findUnique({ where: { studentId: candidate.id } })).toBeNull();
  });

  it('locks both member operations after submission history, including a cancelled milestone', async () => {
    const supervisor = await login(fixtures.users.supA.email);
    const student = await login(fixtures.users.stuA1.email);
    const candidate = await createStudent();
    const id = fixtures.milestones.milestoneFuture.id;
    const path = `/teams/${fixtures.teams.teamA.id}/members`;
    await mutate('post', `/milestones/${id}/submissions`, student).send(work).expect(201);
    await prisma.milestone.update({ where: { id }, data: { cancelledAt: new Date() } });
    const added = await mutate('post', path, supervisor).send({ studentId: candidate.id }).expect(409);
    const removed = await mutate('delete', `${path}/${fixtures.users.stuA1.id}`, supervisor).expect(409);
    expect(added.body.error.code).toBe('TEAM_HISTORY_LOCKED');
    expect(removed.body).toEqual(added.body);
    expect(await prisma.teamMember.findUnique({ where: { studentId: candidate.id } })).toBeNull();
    expect(await prisma.teamMember.findUnique({ where: { studentId: fixtures.users.stuA1.id } })).not.toBeNull();
    expect(await prisma.submission.count()).toBe(1);
  });

  it('STS-08 serializes simultaneous claims from two teams through the student uniqueness constraint', async () => {
    const first = await login(fixtures.users.supA.email);
    const second = await login(fixtures.users.supB.email);
    const candidate = await createStudent();
    const release = await holdRowLock(tx => tx.$queryRaw`SELECT id FROM users WHERE id = ${candidate.id}::uuid FOR UPDATE`);
    const join = (teamId: string, auth: Credentials) =>
      mutate('post', `/teams/${teamId}/members`, auth).send({ studentId: candidate.id }).then(result => result);
    const firstJoin = join(fixtures.teams.teamA.id, first);
    const secondJoin = join(fixtures.teams.teamB.id, second);
    try { await waitForLocks(2); } finally { await release(); }
    const results = await Promise.all([firstJoin, secondJoin]);
    expect(results.map(result => result.status).sort()).toEqual([200, 409]);
    expect(results.find(result => result.status === 409)?.body.error.code).toBe('MEMBERSHIP_CONFLICT');
    const saved = await prisma.teamMember.findMany({ where: { studentId: candidate.id } });
    expect(saved).toHaveLength(1);
    expect(saved[0]!.teamId).toBe(results.find(result => result.status === 200)?.body.data.id);
  });

  it.each([
    ['add', true], ['add', false], ['remove', true], ['remove', false],
  ] as const)('STS-09 serializes %s and first submission with membership first = %s', async (operation, membershipFirst) => {
    const supervisor = await login(fixtures.users.supA.email);
    const student = await login(fixtures.users.stuA1.email);
    const teamId = fixtures.teams.teamA.id;
    const target = operation === 'add' ? await createStudent() : fixtures.users.stuA1;
    const path = `/teams/${teamId}/members`;
    const change = () => (operation === 'add' ? mutate('post', path, supervisor).send({ studentId: target.id }) :
      mutate('delete', `${path}/${target.id}`, supervisor)).then(result => result);
    const submit = () => mutate('post', `/milestones/${fixtures.milestones.milestoneFuture.id}/submissions`, student)
      .send(work).then(result => result);
    const release = await holdRowLock(tx => tx.$queryRaw`SELECT id FROM teams WHERE id = ${teamId}::uuid FOR UPDATE`);
    let first: ReturnType<typeof change>;
    let second: ReturnType<typeof change>;
    try {
      first = membershipFirst ? change() : submit();
      await waitForLocks(1);
      second = membershipFirst ? submit() : change();
      await waitForLocks(2);
    } finally { await release(); }
    const results = await Promise.all([first, second]);
    const [membership, submission] = membershipFirst ? results : results.reverse();
    const removedBeforeSubmit = membershipFirst && operation === 'remove';
    expect(membership!.status).toBe(membershipFirst ? (operation === 'add' ? 200 : 204) : 409);
    if (!membershipFirst) expect(membership!.body.error.code).toBe('TEAM_HISTORY_LOCKED');
    expect(submission!.status).toBe(removedBeforeSubmit ? 404 : 201);
    expect(await prisma.submission.count()).toBe(removedBeforeSubmit ? 0 : 1);
    const member = await prisma.teamMember.findUnique({ where: { studentId: target.id } });
    expect(member?.teamId ?? null).toBe((membershipFirst === (operation === 'add')) ? teamId : null);
  });
});
