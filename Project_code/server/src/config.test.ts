import { describe, expect, it } from 'vitest';
import { ConfigError, loadConfig } from './config.js';

const development = { DATABASE_URL: 'postgresql://dev:private@127.0.0.1:5432/fasttrack_dev' };

describe('runtime configuration', () => {
  it('loads the agreed local defaults without connecting to a database', () => {
    const config = loadConfig(development);
    expect(config).toEqual({ mode: 'development', port: 3000, appOrigin: 'http://127.0.0.1:5173',
      databaseUrl: development.DATABASE_URL, sessionTtlHours: 8, releaseSha: 'development' });
    expect(Object.isFrozen(config)).toBe(true);
  });

  it.each(['0', '65536', '3000abc', '3.5', '', '-1'])('rejects invalid PORT %j', port => {
    expect(() => loadConfig({ ...development, PORT: port })).toThrow('PORT');
  });

  it.each(['https://example.com/path', 'https://user:secret@example.com', 'https://example.com?token=private',
    'null', '*', 'ftp://example.com', 'https://example.com/', 'https://example.com#fragment'])('rejects an invalid origin %j', origin => {
    expect(() => loadConfig({ ...development, APP_ORIGIN: origin })).toThrow('APP_ORIGIN');
  });

  it('requires the production HTTPS origin and exact release commit', () => {
    expect(() => loadConfig({ ...development, NODE_ENV: 'production' })).toThrow('APP_ORIGIN');
    expect(() => loadConfig({ ...development, NODE_ENV: 'production', APP_ORIGIN: 'http://example.com' })).toThrow('APP_ORIGIN');
    const production = { ...development, NODE_ENV: 'production', APP_ORIGIN: 'https://example.com' };
    expect(() => loadConfig(production)).toThrow('RELEASE_SHA');
    expect(loadConfig({ ...production, RELEASE_SHA: 'a'.repeat(40) }).releaseSha).toBe('a'.repeat(40));
  });

  it.each([undefined, '', 'file:private.db', 'postgresql://localhost', 'postgresql://localhost/a/b',
    'postgresql://localhost/%', 'postgresql://localhost/%20'])('rejects missing or invalid database configuration %j', databaseUrl => {
    expect(() => loadConfig({ DATABASE_URL: databaseUrl })).toThrow('DATABASE_URL');
  });

  it('does not reveal secret values in configuration errors', () => {
    const fail = () => loadConfig({ DATABASE_URL: 'private-secret-value' });
    expect(fail).toThrow(ConfigError);
    expect(fail).not.toThrow('private-secret-value');
  });

  it('rejects unsupported runtime modes, TTL changes and unsafe release labels', () => {
    expect(() => loadConfig({ ...development, NODE_ENV: 'staging' })).toThrow('NODE_ENV');
    expect(() => loadConfig({ ...development, SESSION_TTL_HOURS: '9' })).toThrow('SESSION_TTL_HOURS');
    expect(() => loadConfig({ ...development, RELEASE_SHA: '<unsafe>' })).toThrow('RELEASE_SHA');
  });
});
