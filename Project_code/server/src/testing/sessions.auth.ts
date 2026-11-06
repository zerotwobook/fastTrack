import { createHash, randomBytes, randomUUID } from 'node:crypto';
import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest';
import request from 'supertest';
import { Router } from 'express';
import { createApp } from '../app.js';
import { loadConfig } from '../config.js';
import { createApplicationRouters } from '../modules/index.js';
import { createSessionProtection } from '../modules/auth/index.js';
import { cleanTestDatabase, createBaseFixtures, createTestPrisma, TEST_PASSWORD, TEST_PASSWORD_HASH } from './fixtures.js';

const prisma = createTestPrisma();
const origin = 'http://127.0.0.1:5173';
const config = loadConfig({ NODE_ENV: 'test', DATABASE_URL: process.env.TEST_DATABASE_URL, APP_ORIGIN: origin });
let at = new Date();
const now = () => at;
const app = createApp(config, { logger: () => undefined, routers: createApplicationRouters({ prisma, config, now }) });
let fixture: Awaited<ReturnType<typeof createBaseFixtures>>;
const hash = (value: string) => createHash('sha256').update(value).digest('hex');
const login = (email = 'stu-a1@test.local', password = TEST_PASSWORD, cookie?: string) => {
  const req = request(app).post('/api/auth/login').set('Origin', origin).set('X-fastTrack-Request', '1');
  if (cookie) req.set('Cookie', cookie);
  return req.send({ email, password });
};
const cookieOf = (response: request.Response) => String(response.headers['set-cookie']?.[0]).split(';')[0]!;
const rawToken = (cookie: string) => cookie.slice(cookie.indexOf('=') + 1);
beforeEach(async () => { at = new Date(); fixture = await createBaseFixtures(prisma); });
afterAll(async () => { await cleanTestDatabase(prisma); await prisma.$disconnect(); });

describe('F-01 real PostgreSQL session and team contracts', () => {
  it.each(['stu-a1@test.local', 'sup-a@test.local'])('T-01 authenticates %s with real seed-compatible hash and allowlisted DTO', async email => {
    const response = await login(email).expect(200);
    const cookie = cookieOf(response);
    const record = await prisma.session.findFirstOrThrow();
    expect(record.tokenHash).toBe(hash(rawToken(cookie)));
    expect(record.tokenHash).not.toBe(rawToken(cookie));
    expect(record.expiresAt.getTime() - record.createdAt.getTime()).toBe(8 * 60 * 60 * 1000);
    expect(record.csrfToken).toBe(response.body.data.csrfToken);
    expect(record.csrfToken).not.toBe(rawToken(cookie));
    expect(Object.keys(response.body.data).sort()).toEqual(['csrfToken', 'user']);
    expect(Object.keys(response.body.data.user).sort()).toEqual(['displayName', 'id', 'role']);
    expect(JSON.stringify(response.body)).not.toContain(TEST_PASSWORD_HASH);
    expect(JSON.stringify(response.body)).not.toContain(rawToken(cookie));
    expect(response.headers['set-cookie']?.[0]).toMatch(/HttpOnly/);
    expect(response.headers['set-cookie']?.[0]).toMatch(/SameSite=Lax/);
    expect(response.headers['set-cookie']?.[0]).not.toMatch(/Secure/);
    expect(response.headers['cache-control']).toBe('no-store');
    const me = await request(app).get('/api/auth/me').set('Cookie', cookie).expect(200);
    expect(me.body).toEqual(response.body);
    at = new Date(at.getTime() + 1000);
    await request(app).get('/api/auth/me').set('Cookie', cookie).expect(200);
    expect((await prisma.session.findUniqueOrThrow({ where: { id: record.id } })).expiresAt).toEqual(record.expiresAt);
  });
  it('T-02 conceals unknown email versus bad password and creates no session', async () => {
    const wrong = await login('stu-a1@test.local', 'incorrect').expect(401);
    const unknown = await login('unknown@test.local', 'incorrect').expect(401);
    expect(wrong.body).toEqual(unknown.body);
    expect(await prisma.session.count()).toBe(0);
  });
  it.each([{}, { email: '', password: '' }, { email: 'stu-a1@test.local', password: TEST_PASSWORD, role: 'supervisor' }, [], null])('T-02 rejects invalid or spoofed credentials without writes: %j', async body => {
    await request(app).post('/api/auth/login').set('Origin', origin).set('X-fastTrack-Request', '1').set('Content-Type', 'application/json').send(JSON.stringify(body)).expect(400);
    expect(await prisma.session.count()).toBe(0);
  });
  it.each(['missing', 'foreign', 'null', 'header'])('T-23 denies %s login protection before parsing or writes', async variant => {
    const req = request(app).post('/api/auth/login');
    if (variant !== 'missing') req.set('Origin', variant === 'foreign' ? 'https://foreign.example' : variant === 'null' ? 'null' : origin);
    if (variant !== 'header') req.set('X-fastTrack-Request', '1');
    await req.set('Content-Type', 'application/json').send('{broken').expect(403);
    expect(await prisma.session.count()).toBe(0);
  });
  it('T-23 permits same-origin Referer fallback but never overrides a foreign Origin', async () => {
    await request(app).post('/api/auth/login').set('Referer', `${origin}/login`).set('X-fastTrack-Request', '1').send({ email: 'stu-a1@test.local', password: TEST_PASSWORD }).expect(200);
    await request(app).post('/api/auth/login').set('Origin', 'https://foreign.example').set('Referer', origin).set('X-fastTrack-Request', '1').send({ email: 'stu-a1@test.local', password: TEST_PASSWORD }).expect(403);
    expect(await prisma.session.count()).toBe(1);
  });
  it('T-23 rejects form login and rotates the old browser session on re-login', async () => {
    await request(app).post('/api/auth/login').set('Origin', origin).set('X-fastTrack-Request', '1').type('form').send({ email: 'stu-a1@test.local', password: TEST_PASSWORD }).expect(415);
    const first = await login().expect(200);
    const next = await login('sup-b@test.local', TEST_PASSWORD, cookieOf(first)).expect(200);
    expect(cookieOf(next)).not.toBe(cookieOf(first));
    expect(next.body.data.csrfToken).not.toBe(first.body.data.csrfToken);
    await request(app).get('/api/auth/me').set('Cookie', cookieOf(first)).expect(401);
    const me = await request(app).get('/api/auth/me').set('Cookie', cookieOf(next)).expect(200);
    expect(me.body.data.user.id).toBe(fixture.users.supB.id);
    expect(await prisma.session.count({ where: { revokedAt: { not: null } } })).toBe(1);
  });
  it.each(['/api/auth/me', '/api/teams', '/api/teams/not-a-uuid'])('T-03 rejects missing/forged identity before reading %s', async path => {
    await request(app).get(path).set('X-User-Id', fixture.users.supA.id).set('X-User-Role', 'supervisor').expect(401);
    await request(app).get(path).set('Cookie', `fasttrack_session=${randomBytes(32).toString('base64url')}`).expect(401);
  });
  it('T-03 expires at equality, rejects revocation and rejects ambiguous duplicate cookies', async () => {
    const result = await login().expect(200); const cookie = cookieOf(result);
    const session = await prisma.session.findFirstOrThrow();
    at = new Date(session.expiresAt.getTime() - 1);
    await request(app).get('/api/auth/me').set('Cookie', cookie).expect(200);
    at = session.expiresAt;
    await request(app).get('/api/auth/me').set('Cookie', cookie).expect(401);
    at = new Date(session.createdAt.getTime() + 1);
    await prisma.session.update({ where: { id: session.id }, data: { revokedAt: at } });
    await request(app).get('/api/auth/me').set('Cookie', cookie).expect(401);
    await request(app).get('/api/auth/me').set('Cookie', `${cookie}; ${cookie}`).expect(401);
  });
  it('T-04 rejects wrong/missing CSRF without revocation then logout prevents replay and preserves another device', async () => {
    const first = await login().expect(200); const other = await login().expect(200); const cookie = cookieOf(first);
    for (const csrf of ['', randomBytes(32).toString('base64url')]) {
      await request(app).post('/api/auth/logout').set('Origin', origin).set('Cookie', cookie).set('X-CSRF-Token', csrf).expect(403);
      expect(await prisma.session.count({ where: { revokedAt: { not: null } } })).toBe(0);
    }
    const result = await request(app).post('/api/auth/logout').set('Origin', origin).set('Cookie', cookie).set('X-CSRF-Token', first.body.data.csrfToken).expect(204);
    expect(result.text).toBe(''); expect(result.headers['set-cookie']?.[0]).toContain('fasttrack_session=;');
    await request(app).get('/api/auth/me').set('Cookie', cookie).expect(401);
    await request(app).get('/api/auth/me').set('Cookie', cookieOf(other)).expect(200);
    expect(await prisma.session.count({ where: { revokedAt: { not: null } } })).toBe(1);
  });
  it('T-04 permits anonymous logout only with allowed source and clears the cookie', async () => {
    await request(app).post('/api/auth/logout').expect(403);
    await request(app).post('/api/auth/logout').set('Origin', origin).expect(204);
  });
  it('T-23 rejects a foreign source even with a valid session and CSRF without writing', async () => {
    const logged = await login().expect(200);
    await request(app).post('/api/auth/logout').set('Cookie', cookieOf(logged)).set('Origin', 'https://foreign.example').set('X-CSRF-Token', logged.body.data.csrfToken).expect(403);
    expect(await prisma.session.count({ where: { revokedAt: { not: null } } })).toBe(0);
  });
  it('T-03 converts a session database failure into a safe 503 with no private response', async () => {
    const logged = await login().expect(200);
    vi.spyOn(prisma.session, 'findUnique').mockRejectedValueOnce(new Error('synthetic private database detail'));
    const response = await request(app).get('/api/auth/me').set('Cookie', cookieOf(logged)).expect(503);
    expect(response.body.error.code).toBe('TEMPORARILY_UNAVAILABLE');
    expect(JSON.stringify(response.body)).not.toContain('synthetic private');
    expect(response.body.data).toBeUndefined();
  });
  it.each(['stu-a1@test.local', 'sup-a@test.local', 'sup-b@test.local'])('T-05 scopes list/detail for %s and conceals missing versus foreign team', async email => {
    const result = await login(email).expect(200); const cookie = cookieOf(result);
    const own = email === 'sup-b@test.local' ? fixture.teams.teamB : fixture.teams.teamA;
    const foreign = own.id === fixture.teams.teamA.id ? fixture.teams.teamB : fixture.teams.teamA;
    const list = await request(app).get('/api/teams').set('Cookie', cookie).expect(200);
    expect(list.body.data.map((t: { id: string }) => t.id)).toEqual([own.id]);
    expect(list.headers['cache-control']).toBe('no-store');
    expect(list.body.meta.serverTime).toBe(at.toISOString());
    const detail = await request(app).get(`/api/teams/${own.id}`).set('Cookie', cookie).expect(200);
    expect(detail.body.data).toEqual(list.body.data[0]);
    expect(Object.keys(detail.body.data).sort()).toEqual(['id', 'members', 'name', 'supervisor']);
    expect(Object.keys(detail.body.data.supervisor).sort()).toEqual(['displayName', 'id']);
    const denied = await request(app).get(`/api/teams/${foreign.id}`).set('Cookie', cookie).expect(404);
    const absent = await request(app).get(`/api/teams/${randomUUID()}`).set('Cookie', cookie).expect(404);
    expect(denied.body).toEqual(absent.body);
    expect(JSON.stringify(list.body)).not.toContain('password');
    await request(app).get('/api/teams/invalid').set('Cookie', cookie).expect(400);
  });
  it('T-05 handles no-team students and multiple assigned teams in stable order', async () => {
    await prisma.teamMember.deleteMany({ where: { studentId: fixture.users.stuA1.id } });
    const student = await login().expect(200);
    expect((await request(app).get('/api/teams').set('Cookie', cookieOf(student)).expect(200)).body.data).toEqual([]);
    const second = await prisma.team.create({ data: { name: 'A second team', supervisorId: fixture.users.supA.id } });
    const sup = await login('sup-a@test.local').expect(200);
    const list = await request(app).get('/api/teams').set('Cookie', cookieOf(sup)).expect(200);
    expect(list.body.data.map((t: { id: string }) => t.id)).toEqual([second.id, fixture.teams.teamA.id]);
  });
  it('T-23 shared protection is fail-closed before JSON parsing and supplies immutable DB-derived identity', async () => {
    const protection = createSessionProtection({ prisma, config, now }); const router = Router();
    router.post('/probe', protection.requireSession, protection.requireRole('supervisor'), protection.requireMutation, async (req, res) => {
      const context = await protection.getAuthContext(req); expect(Object.isFrozen(context)).toBe(true); res.json({ data: context });
    });
    const protectedApp = createApp(config, { logger: () => undefined, routers: { auth: router } });
    await request(protectedApp).post('/api/probe').set('Content-Type', 'application/json').send('{broken').expect(401);
    const student = await login().expect(200);
    await request(protectedApp).post('/api/probe').set('Cookie', cookieOf(student)).expect(403);
    const sup = await login('sup-a@test.local').expect(200);
    await request(protectedApp).post('/api/probe').set('Cookie', cookieOf(sup)).set('Origin', origin).expect(403);
    const result = await request(protectedApp).post('/api/probe').set('Cookie', cookieOf(sup)).set('Origin', origin).set('X-CSRF-Token', sup.body.data.csrfToken).set('X-User-Id', fixture.users.supB.id).expect(200);
    expect(result.body.data.userId).toBe(fixture.users.supA.id);
  });
  it('T-01 HTTPS configuration sets Secure on the host-only cookie', async () => {
    const https = { ...config, appOrigin: 'https://fasttrack.example.edu' };
    const secureApp = createApp(https, { logger: () => undefined, routers: createApplicationRouters({ prisma, config: https, now }) });
    const response = await request(secureApp).post('/api/auth/login').set('Origin', https.appOrigin).set('X-fastTrack-Request', '1').send({ email: 'stu-a1@test.local', password: TEST_PASSWORD }).expect(200);
    expect(response.headers['set-cookie']?.[0]).toMatch(/; Secure/);
    expect(response.headers['set-cookie']?.[0]).not.toContain('Domain=');
  });
});
