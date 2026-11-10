export type RuntimeMode = 'development' | 'test' | 'production';
export type Environment = Readonly<Record<string, string | undefined>>;

export interface AppConfig {
  readonly mode: RuntimeMode;
  readonly port: number;
  readonly appOrigin: string;
  readonly databaseUrl: string;
  readonly sessionTtlHours: 8;
  readonly releaseSha: string;
  readonly trustProxyHops: 0 | 1;
  readonly dbPoolMax: number;
  readonly dbConnectTimeoutMs: number;
  readonly dbStatementTimeoutMs: number;
  readonly dbQueryTimeoutMs: number;
  readonly readinessTimeoutMs: number;
  readonly loginMaxFailures: number;
  readonly loginWindowSeconds: number;
  readonly loginLockSeconds: number;
  readonly loginRetentionSeconds: number;
}

export class ConfigError extends Error {
  constructor(field: string) {
    super(`Invalid or missing configuration: ${field}.`);
    this.name = 'ConfigError';
  }
}

function integer(env: Environment, field: string, fallback: number, max: number, min = 1): number {
  const raw = env[field] ?? String(fallback);
  if (!/^\d+$/.test(raw) || !Number.isSafeInteger(Number(raw)) || Number(raw) < min || Number(raw) > max) throw new ConfigError(field);
  return Number(raw);
}

/** Shared pool limits; also usable by explicit DB jobs without HTTP-origin configuration. */
export function databaseLimits(env: Environment) {
  return { dbPoolMax: integer(env, 'DB_POOL_MAX', 2, 20),
    dbConnectTimeoutMs: integer(env, 'DB_CONNECT_TIMEOUT_MS', 1000, 30_000),
    dbStatementTimeoutMs: integer(env, 'DB_STATEMENT_TIMEOUT_MS', 1000, 30_000),
    dbQueryTimeoutMs: integer(env, 'DB_QUERY_TIMEOUT_MS', 1500, 45_000) };
}

export function parseDatabaseUrl(value: string | undefined, field: string): URL {
  try {
    if (!value) throw new Error();
    const url = new URL(value);
    if (!['postgresql:', 'postgres:'].includes(url.protocol) || !url.hostname ||
        !/^\/[^/]+$/.test(url.pathname) || !decodeURIComponent(url.pathname.slice(1)).trim() || url.hash) {
      throw new Error();
    }
    return url;
  } catch {
    throw new ConfigError(field);
  }
}

export function loadConfig(env: Environment): AppConfig {
  const mode = env.NODE_ENV ?? 'development';
  if (mode !== 'development' && mode !== 'test' && mode !== 'production') throw new ConfigError('NODE_ENV');
  const rawPort = env.PORT ?? '3000';
  if (!/^\d+$/.test(rawPort) || Number(rawPort) < 1 || Number(rawPort) > 65535) throw new ConfigError('PORT');
  let appOrigin: string;
  try {
    const rawOrigin = env.APP_ORIGIN ?? (mode === 'production' ? '' : 'http://127.0.0.1:5173');
    const origin = new URL(rawOrigin);
    if (!['http:', 'https:'].includes(origin.protocol) || origin.username || origin.password ||
        origin.search || origin.hash || origin.pathname !== '/' || rawOrigin !== origin.origin ||
        (mode === 'production' && origin.protocol !== 'https:')) throw new Error();
    appOrigin = origin.origin;
  } catch {
    throw new ConfigError('APP_ORIGIN');
  }
  const databaseUrl = parseDatabaseUrl(env.DATABASE_URL, 'DATABASE_URL').href;
  if (env.SESSION_TTL_HOURS !== undefined && env.SESSION_TTL_HOURS !== '8') throw new ConfigError('SESSION_TTL_HOURS');
  const releaseSha = env.RELEASE_SHA ?? (mode === 'production' ? '' : mode);
  if (!/^[a-zA-Z0-9._-]{1,64}$/.test(releaseSha) ||
      (mode === 'production' && !/^[a-f0-9]{40}$/.test(releaseSha))) throw new ConfigError('RELEASE_SHA');
  const limits = databaseLimits(env);
  const readinessTimeoutMs = integer(env, 'READINESS_TIMEOUT_MS', 3000, 60_000);
  if (limits.dbConnectTimeoutMs > limits.dbQueryTimeoutMs || limits.dbStatementTimeoutMs > limits.dbQueryTimeoutMs ||
      limits.dbQueryTimeoutMs >= readinessTimeoutMs) throw new ConfigError('database/readiness deadline ordering');
  const loginWindowSeconds = integer(env, 'LOGIN_RATE_LIMIT_WINDOW_SECONDS', 900, 86_400);
  const loginLockSeconds = integer(env, 'LOGIN_RATE_LIMIT_LOCK_SECONDS', 900, 86_400);
  const loginRetentionSeconds = integer(env, 'LOGIN_RATE_LIMIT_RETENTION_SECONDS', 3600, 604_800);
  if (loginRetentionSeconds <= Math.max(loginWindowSeconds, loginLockSeconds)) throw new ConfigError('LOGIN_RATE_LIMIT_RETENTION_SECONDS');
  return Object.freeze({ mode, port: Number(rawPort), appOrigin, databaseUrl, sessionTtlHours: 8, releaseSha,
    ...limits, readinessTimeoutMs, trustProxyHops: integer(env, 'TRUST_PROXY_HOPS', 0, 1, 0) as 0 | 1,
    loginMaxFailures: integer(env, 'LOGIN_RATE_LIMIT_MAX_FAILURES', 5, 100), loginWindowSeconds, loginLockSeconds, loginRetentionSeconds });
}
