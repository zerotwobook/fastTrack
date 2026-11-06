import { ConfigError, parseDatabaseUrl } from '../config.js';
import type { Environment } from '../config.js';

function databaseName(url: URL): string {
  return decodeURIComponent(url.pathname.slice(1)).toLowerCase();
}

function databaseIdentity(url: URL): string {
  const host = ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname.toLowerCase())
    ? 'loopback' : url.hostname.toLowerCase();
  return `${host}:${url.port || '5432'}/${databaseName(url)}`;
}

/** B's future fixture reset must call this before opening its destructive connection. */
export function requireTestDatabase(env: Environment, protectedDatabaseUrls: readonly string[] = []): string {
  if (env.NODE_ENV !== 'test') throw new ConfigError('NODE_ENV (test database guard)');
  const test = parseDatabaseUrl(env.TEST_DATABASE_URL, 'TEST_DATABASE_URL');
  if (!/^[a-z0-9][a-z0-9_]*_test$/.test(databaseName(test))) throw new ConfigError('TEST_DATABASE_URL (reserved test database name)');
  for (const [key, value] of test.searchParams) {
    if (!((key === 'schema' && value === 'public') || (key === 'sslmode' && ['require', 'verify-ca', 'verify-full'].includes(value)))) {
      throw new ConfigError('TEST_DATABASE_URL (connection parameter override)');
    }
  }
  const protectedUrls = [parseDatabaseUrl(env.DATABASE_URL, 'DATABASE_URL'),
    ...protectedDatabaseUrls.map(url => parseDatabaseUrl(url, 'protected database URL'))];
  for (const protectedUrl of protectedUrls) {
    // Compare independently of credentials, query parameters and localhost spelling.
    // Equal names on other hosts are also rejected conservatively.
    if (databaseIdentity(test) === databaseIdentity(protectedUrl) || databaseName(test) === databaseName(protectedUrl)) {
      throw new ConfigError('TEST_DATABASE_URL (protected database overlap)');
    }
  }
  return test.href;
}
