export type RuntimeMode = 'development' | 'test' | 'production';
export type Environment = Readonly<Record<string, string | undefined>>;

export interface AppConfig {
  readonly mode: RuntimeMode;
  readonly port: number;
  readonly appOrigin: string;
  readonly databaseUrl: string;
  readonly sessionTtlHours: 8;
  readonly releaseSha: string;
}

export class ConfigError extends Error {
  constructor(field: string) {
    super(`Invalid or missing configuration: ${field}.`);
    this.name = 'ConfigError';
  }
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
  return Object.freeze({ mode, port: Number(rawPort), appOrigin, databaseUrl, sessionTtlHours: 8, releaseSha });
}
