import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { createApp } from '../app.js';
import { loadConfig } from '../config.js';

const config = loadConfig({ NODE_ENV: 'test', DATABASE_URL: 'postgresql://localhost/fasttrack_test',
  RELEASE_SHA: 'a'.repeat(40), DB_CONNECT_TIMEOUT_MS: '10', DB_STATEMENT_TIMEOUT_MS: '10',
  DB_QUERY_TIMEOUT_MS: '20', READINESS_TIMEOUT_MS: '40' });
const logger = () => undefined;

describe('A01 bounded database readiness', () => {
  it('queries the configured database probe and reports the actual release without private data', async () => {
    let calls = 0;
    const app = createApp(config, { logger, readiness: async () => { calls++; } });
    const response = await request(app).get('/api/ready').expect(200);
    expect(calls).toBe(1);
    expect(response.body).toEqual({ status: 'ready', database: 'connected', version: config.releaseSha });
    expect(response.headers['cache-control']).toBe('no-store');
  });

  it('returns sanitized 503 on database failure and keeps liveness independent', async () => {
    let calls = 0;
    const app = createApp(config, { logger, readiness: async () => {
      calls++; throw new Error('private database password and hostname');
    } });
    await request(app).get('/api/health').expect(200);
    expect(calls).toBe(0);
    const response = await request(app).get('/api/ready').expect(503);
    expect(response.body).toEqual({ status: 'unavailable', database: 'disconnected', version: config.releaseSha });
    expect(JSON.stringify(response.body)).not.toContain('private');
  });

  it('fails closed when no database probe is configured', async () => {
    const response = await request(createApp(config, { logger })).get('/api/ready').expect(503);
    expect(response.body.status).toBe('unavailable');
  });

  it('bounds response time and shares pending work instead of exhausting a pool with probes', async () => {
    let calls = 0;
    const app = createApp(config, { logger, readiness: () => { calls++; return new Promise(() => undefined); } });
    const started = Date.now();
    const results = await Promise.all(Array.from({ length: 6 }, () => request(app).get('/api/ready')));
    expect(results.every(result => result.status === 503)).toBe(true);
    expect(calls).toBe(1);
    expect(Date.now() - started).toBeLessThan(1500);
  });

  it('recovers after a rejected probe without an unhandled late error', async () => {
    let calls = 0;
    const app = createApp(config, { logger, readiness: async () => {
      if (++calls === 1) throw new Error('synthetic unavailable database');
    } });
    await request(app).get('/api/ready').expect(503);
    await request(app).get('/api/ready').expect(200);
    expect(calls).toBe(2);
  });
});
