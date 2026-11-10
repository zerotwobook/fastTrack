import { randomUUID } from 'node:crypto';
import request from 'supertest';
import { afterAll, beforeEach, describe, expect, it } from 'vitest';
import { createApp } from '../app.js';
import { loadConfig } from '../config.js';
import { createApplicationRouters } from '../modules/index.js';
import { createRuntimeClient } from '../db/runtime-client.js';
import { cleanExpiredLoginKeys, loginKey, rateLimitedLogin } from '../modules/auth/rate-limit.js';
import { createBaseFixtures, createTestPrisma, cleanTestDatabase, TEST_PASSWORD } from './fixtures.js';

const prisma = createTestPrisma();
const config = loadConfig({ NODE_ENV: 'test', DATABASE_URL: process.env.TEST_DATABASE_URL, APP_ORIGIN: 'http://127.0.0.1:5173' });
let at = new Date();
const clock = () => at;
const makeApp = (trustProxyHops: 0 | 1 = 0) => {
  const settings = { ...config, trustProxyHops };
  return createApp(settings, { logger: () => undefined, readiness: () => prisma.$queryRaw`SELECT 1`,
    routers: createApplicationRouters({ prisma, config: settings, now: clock }) });
};
const app = makeApp();
const login = (password = 'invalid', target = app, email = 'stu-a1@test.local') => request(target)
  .post('/api/auth/login').set('Origin', config.appOrigin).set('X-fastTrack-Request', '1').send({ email, password });
const key = loginKey('127.0.0.1');
beforeEach(async () => { at = new Date(); await createBaseFixtures(prisma); });
afterAll(async () => { await cleanTestDatabase(prisma); await prisma.$disconnect(); });

describe('A01 real PostgreSQL runtime boundaries', () => {
  it('bounds actual PostgreSQL statement work and recovers the one-connection runtime pool', async () => {
    const bounded = createRuntimeClient({ DATABASE_URL: process.env.TEST_DATABASE_URL, DB_POOL_MAX: '1',
      DB_CONNECT_TIMEOUT_MS: '100', DB_STATEMENT_TIMEOUT_MS: '100', DB_QUERY_TIMEOUT_MS: '200' });
    try {
      await bounded.$queryRaw`SELECT 1`;
      const started = Date.now();
      await expect(bounded.$queryRaw`SELECT pg_sleep(2)::text AS delay`).rejects.toThrow();
      expect(Date.now() - started).toBeLessThan(1500);
      expect(await bounded.$queryRaw`SELECT 1 AS value`).toEqual([{ value: 1 }]);
    } finally { await bounded.$disconnect(); }
  });
  it('persists failures through generic errors and blocks the fifth attempt with compatible JSON', async () => {
    for (let i = 1; i <= 4; i++) {
      const response = await login().expect(401);
      expect(response.body.error.code).toBe('INVALID_CREDENTIALS');
      expect((await prisma.authRateLimit.findUniqueOrThrow({ where: { key } })).attempts).toBe(i);
    }
    const blocked = await login().expect(429);
    expect(blocked.headers['retry-after']).toBe('900');
    expect(blocked.headers['cache-control']).toBe('no-store');
    expect(blocked.body.error).toEqual({ code: 'LOGIN_RATE_LIMITED', message: 'Too many sign-in attempts. Please try again later.', fields: {} });
    await login(TEST_PASSWORD).expect(429);
    expect(await prisma.session.count()).toBe(0);
    expect((await prisma.authRateLimit.findUniqueOrThrow({ where: { key } })).attempts).toBe(5);
  });

  it('allows login at exact lock expiry and resets only an unlocked successful key', async () => {
    for (let i = 0; i < 5; i++) await login();
    at = new Date(at.getTime() + 899_001);
    const response = await login(TEST_PASSWORD).expect(429);
    expect(response.headers['retry-after']).toBe('1');
    at = new Date(at.getTime() + 999);
    await login(TEST_PASSWORD).expect(200);
    const row = await prisma.authRateLimit.findUniqueOrThrow({ where: { key } });
    expect(row.attempts).toBe(0); expect(row.lockedUntil).toBeNull();
    expect(await prisma.session.count()).toBe(1);
  });

  it('resets an expired failure window at equality and preserves a live window before equality', async () => {
    for (let i = 0; i < 3; i++) await login().expect(401);
    at = new Date(at.getTime() + 899_999);
    await login().expect(401);
    expect((await prisma.authRateLimit.findUniqueOrThrow({ where: { key } })).attempts).toBe(4);
    at = new Date(at.getTime() + 1);
    await login().expect(401);
    expect((await prisma.authRateLimit.findUniqueOrThrow({ where: { key } })).attempts).toBe(1);
  });

  it('serializes concurrent first inserts across independent app instances without lost increments', async () => {
    const apps = [makeApp(), makeApp()];
    const results = await Promise.all(Array.from({ length: 10 }, (_, i) => login('invalid', apps[i % 2]!)));
    expect(results.filter(result => result.status === 401)).toHaveLength(4);
    expect(results.filter(result => result.status === 429)).toHaveLength(6);
    expect(await prisma.authRateLimit.count()).toBe(1);
    expect((await prisma.authRateLimit.findUniqueOrThrow({ where: { key } })).attempts).toBe(5);
    expect(await prisma.session.count()).toBe(0);
  });

  it('ignores forged forwarding in direct mode and uses the nearest verified hop in proxy mode', async () => {
    await login().set('X-Forwarded-For', '203.0.113.99').expect(401);
    expect(await prisma.authRateLimit.findUnique({ where: { key: loginKey('203.0.113.99') } })).toBeNull();
    const proxyApp = makeApp(1);
    await login('invalid', proxyApp).set('X-Forwarded-For', '198.51.100.88, 203.0.113.5').expect(401);
    expect(await prisma.authRateLimit.findUnique({ where: { key: loginKey('203.0.113.5') } })).not.toBeNull();
    expect(await prisma.authRateLimit.findUnique({ where: { key: loginKey('198.51.100.88') } })).toBeNull();
    await login('invalid', proxyApp).set('X-Forwarded-For', 'not-an-address').expect(503);
  });

  it('rejects source and shape failures before limiter/session writes', async () => {
    await request(app).post('/api/auth/login').send({}).expect(403);
    await request(app).post('/api/auth/login').set('Origin', config.appOrigin).set('X-fastTrack-Request', '1').send({}).expect(400);
    expect(await prisma.authRateLimit.count()).toBe(0); expect(await prisma.session.count()).toBe(0);
  });

  it('conceals unknown user versus wrong password and clears failures after unlocked success', async () => {
    const first = await login().expect(401);
    const second = await login('invalid', app, 'unknown@test.local').expect(401);
    expect(first.body).toEqual(second.body);
    await login(TEST_PASSWORD).expect(200);
    expect((await prisma.authRateLimit.findUniqueOrThrow({ where: { key } })).attempts).toBe(0);
  });

  it('rolls back limiter creation and session writes on an internal transaction failure', async () => {
    await expect(rateLimitedLogin(prisma, config, 'synthetic-rollback', async tx => {
      const user = await tx.user.findFirstOrThrow();
      await tx.session.create({ data: { userId: user.id, tokenHash: randomUUID(), csrfToken: 'synthetic', expiresAt: at } });
      throw new Error('synthetic internal failure');
    })).rejects.toThrow();
    expect(await prisma.authRateLimit.findUnique({ where: { key: 'synthetic-rollback' } })).toBeNull();
    expect(await prisma.session.count()).toBe(0);
  });

  it('bounds lock contention, fails closed and recovers when the lock is released', async () => {
    await login().expect(401);
    let acquired!: () => void; let release!: () => void;
    const locked = new Promise<void>(resolve => { acquired = resolve; });
    const finish = new Promise<void>(resolve => { release = resolve; });
    const holder = prisma.$transaction(async tx => {
      await tx.$queryRaw`SELECT key FROM auth_rate_limits WHERE key = ${key} FOR UPDATE`;
      acquired(); await finish;
    }, { timeout: 7000 });
    await locked;
    try {
      const start = Date.now();
      const failure = await login(TEST_PASSWORD).expect(503);
      expect(Date.now() - start).toBeLessThan(4500);
      expect(failure.body.error.code).toBe('TEMPORARILY_UNAVAILABLE');
      expect(await prisma.session.count()).toBe(0);
    } finally { release(); await holder; }
    await login(TEST_PASSWORD).expect(200);
  });

  it('cleans one bounded expired batch while preserving active locks and all domain records', async () => {
    const stale = new Date(Date.now() - 8_000_000);
    await prisma.authRateLimit.createMany({ data: Array.from({ length: 110 }, (_, i) => ({ key: `old-${i}`, attempts: 1, firstAt: stale, updatedAt: stale })) });
    await prisma.authRateLimit.create({ data: { key: 'active-lock', firstAt: stale, updatedAt: stale, lockedUntil: new Date(Date.now() + 60_000) } });
    const users = await prisma.user.count(); const milestones = await prisma.milestone.count();
    expect(await cleanExpiredLoginKeys(prisma, config)).toBe(100);
    expect(await prisma.authRateLimit.count()).toBe(11);
    expect(await prisma.authRateLimit.findUnique({ where: { key: 'active-lock' } })).not.toBeNull();
    expect(await prisma.user.count()).toBe(users); expect(await prisma.milestone.count()).toBe(milestones);
    expect(await cleanExpiredLoginKeys(prisma, config)).toBe(10);
  });

  it('reports real DB readiness independently of a synthetic disconnected probe', async () => {
    await request(app).get('/api/ready').expect(200);
    const disconnected = createApp(config, { logger: () => undefined, readiness: async () => {
      throw new Error('private connection string');
    } });
    const response = await request(disconnected).get('/api/ready').expect(503);
    expect(JSON.stringify(response.body)).not.toContain('private');
    await request(disconnected).get('/api/health').expect(200);
  });
});
