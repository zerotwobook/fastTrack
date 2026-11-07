import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { Router } from 'express';
import request from 'supertest';
import { afterEach, describe, expect, it } from 'vitest';
import { createApp } from './app.js';
import { loadConfig } from './config.js';
import { AppError, parseJsonBody, requireJsonBody } from './http/errors.js';
import type { RequestLog } from './http/request-context.js';

const config = loadConfig({ NODE_ENV: 'test', DATABASE_URL: 'postgresql://localhost/fasttrack_dev', RELEASE_SHA: 'test-sha' });
const quiet = { logger: () => undefined };
const temporaryDirectories: string[] = [];
afterEach(async () => { await Promise.all(temporaryDirectories.splice(0).map(path => rm(path, { recursive: true, force: true }))); });

describe('API composition and safe transport', () => {
  it('reports process liveness and version without claiming database readiness', async () => {
    const response = await request(createApp(config, quiet)).get('/api/health').expect(200);
    expect(response.body).toEqual({ status: 'ok', version: 'test-sha' });
    expect(response.headers['cache-control']).toBe('no-store');
    expect(response.headers['x-content-type-options']).toBe('nosniff');
    expect(response.headers['x-powered-by']).toBeUndefined();
  });

  it('generates a new correlation ID instead of trusting caller input', async () => {
    const app = createApp(config, quiet);
    const first = await request(app).get('/api/health').set('X-Request-Id', 'untrusted-value');
    const second = await request(app).get('/api/health');
    expect(first.headers['x-request-id']).toMatch(/^[a-f0-9-]{36}$/);
    expect(first.headers['x-request-id']).not.toBe(second.headers['x-request-id']);
  });

  it('does not expose unimplemented identity/domain/readiness endpoints', async () => {
    for (const path of ['/api/auth/me', '/api/teams', '/api/milestones', '/api/ready']) {
      const response = await request(createApp(config, quiet)).get(path).set('Accept', 'text/html').expect(404);
      expect(response.body).toEqual({ error: { code: 'NOT_FOUND', message: 'The requested resource was not found.', fields: {} } });
    }
  });

  it('mounts explicit full relative routes without creating listeners or changing another app', async () => {
    const milestoneRouter = Router();
    milestoneRouter.get('/teams/:teamId/milestones', (req, res) => { res.json({ data: { teamId: req.params.teamId } }); });
    const app = createApp(config, { ...quiet, routers: { milestones: milestoneRouter } });
    await request(app).get('/api/teams/example/milestones').expect(200, { data: { teamId: 'example' } });
    await request(createApp(config, quiet)).get('/api/teams/example/milestones').expect(404);
  });

  it('redacts thrown errors and logs only method, route template, status, duration and request ID', async () => {
    const logs: RequestLog[] = [];
    const router = Router();
    router.get('/probe/:id', () => { throw new Error('SQL password=private-secret payload=private-payload'); });
    const response = await request(createApp(config, { routers: { feedback: router }, logger: entry => logs.push(entry) }))
      .get('/api/probe/private-record?password=private-query').set('Cookie', 'session=private-cookie').expect(500);
    expect(response.body).toEqual({ error: { code: 'INTERNAL_ERROR', message: 'The request could not be completed.', fields: {} } });
    expect(logs).toHaveLength(1);
    expect(logs[0]).toMatchObject({ method: 'GET', route: '/probe/:id', status: 500, requestId: response.headers['x-request-id'] });
    expect(logs[0]?.durationMs).toBeGreaterThanOrEqual(0);
    expect(JSON.stringify([response.body, logs])).not.toContain('private-');
  });

  it('preserves approved public domain errors and field details', async () => {
    const router = Router();
    router.post('/probe', () => { throw new AppError(409, 'CONFLICT', 'This request conflicts with saved data.', { title: 'Use a different title.' }); });
    const response = await request(createApp(config, { ...quiet, routers: { milestones: router } })).post('/api/probe').expect(409);
    expect(response.body.error).toEqual({ code: 'CONFLICT', message: 'This request conflicts with saved data.', fields: { title: 'Use a different title.' } });
  });

  it('rejects malformed JSON without echoing the original request', async () => {
    const router = Router();
    router.post('/probe', requireJsonBody, parseJsonBody, (_req, res) => { res.sendStatus(204); });
    const response = await request(createApp(config, { ...quiet, routers: { auth: router } })).post('/api/probe').set('Content-Type', 'application/json').send('{"secret":"private-payload"').expect(400);
    expect(response.body.error.code).toBe('INVALID_INPUT');
    expect(JSON.stringify(response.body)).not.toContain('private-payload');
  });

  it('enforces the JSON type only where a router explicitly requests it', async () => {
    const router = Router();
    router.post('/probe', requireJsonBody, parseJsonBody, (req, res) => { res.json({ data: req.body }); });
    const app = createApp(config, { ...quiet, routers: { auth: router } });
    await request(app).post('/api/probe').type('text').send('private-payload').expect(415);
    await request(app).post('/api/probe').send({ title: 'Example' }).expect(200, { data: { title: 'Example' } });
    const large = await request(app).post('/api/probe').send({ title: 'x'.repeat(70_000) }).expect(400);
    expect(large.body.error.code).toBe('INVALID_INPUT');
  });

  it('leaves request parsing after route protection instead of leaking input errors first', async () => {
    const router = Router();
    router.post('/protected-probe', (_req, _res, next) => next(new AppError(401, 'UNAUTHENTICATED', 'Sign in to continue.')),
      requireJsonBody, parseJsonBody, (_req, res) => { res.sendStatus(204); });
    await request(createApp(config, { ...quiet, routers: { auth: router } }))
      .post('/api/protected-probe').set('Content-Type', 'application/json').send('{invalid').expect(401);
  });

  it('serves the built shell on browser routes but keeps unknown API/assets JSON 404', async () => {
    const directory = await mkdtemp(join(tmpdir(), 'fasttrack-app-test-'));
    temporaryDirectories.push(directory);
    await writeFile(join(directory, 'index.html'), '<!doctype html><title>fastTrack shell</title>');
    const app = createApp(config, { ...quiet, clientDirectory: directory });
    await request(app).get('/teams/example').set('Accept', 'text/html').expect(200, /fastTrack shell/);
    const missing = await request(app).get('/api/missing').set('Accept', 'text/html').expect(404);
    expect(missing.type).toBe('application/json');
    await request(app).get('/missing.js').set('Accept', 'text/html').expect(404);
  });
});
