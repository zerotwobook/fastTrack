import { createHash } from 'node:crypto';
import { isIP } from 'node:net';
import type { AppConfig } from '../../config.js';
import type { Prisma, PrismaClient } from '../../db/generated/client/index.js';
import { AppError } from '../../http/errors.js';

/** Canonicalize Express's selected client address, never raw forwarded headers. */
export function loginKey(address: string | undefined): string {
  if (!address || !isIP(address)) throw new AppError(503, 'TEMPORARILY_UNAVAILABLE', 'The service is temporarily unavailable. Try again.');
  let normalized = isIP(address) === 6 ? new URL(`http://[${address}]/`).hostname.slice(1, -1).toLowerCase() : address;
  const mapped = /^::ffff:([a-f0-9]{1,4}):([a-f0-9]{1,4})$/.exec(normalized);
  if (mapped) {
    const high = parseInt(mapped[1]!, 16); const low = parseInt(mapped[2]!, 16);
    normalized = [high >> 8, high & 255, low >> 8, low & 255].join('.');
  }
  return `ip-v1:${createHash('sha256').update(normalized).digest('hex')}`;
}

type Outcome<T> = { kind: 'success'; value: T } | { kind: 'invalid' } | { kind: 'limited'; retryAfter: number };

/** Commit failed attempts before the caller turns the outcome into an HTTP error. */
export async function rateLimitedLogin<T>(prisma: PrismaClient, config: AppConfig, key: string,
  authenticate: (tx: Prisma.TransactionClient, at: Date) => Promise<T | null>, clock?: () => Date): Promise<Outcome<T>> {
  return prisma.$transaction(async tx => {
    await tx.$queryRaw`SELECT set_config('lock_timeout', ${`${config.dbStatementTimeoutMs}ms`}, true)`;
    await tx.$executeRaw`INSERT INTO auth_rate_limits (key, attempts, first_at, updated_at)
      VALUES (${key}, 0, clock_timestamp(), clock_timestamp()) ON CONFLICT (key) DO NOTHING`;
    const [row] = await tx.$queryRaw<Array<{ attempts: number; first_at: Date; locked_until: Date | null }>>`
      SELECT attempts, first_at, locked_until FROM auth_rate_limits WHERE key = ${key} FOR UPDATE`;
    if (!row) throw new Error('Missing limiter state.');
    const times = await tx.$queryRaw<Array<{ at: Date }>>`SELECT clock_timestamp() AS at`;
    const at = clock ? clock() : times[0]!.at;
    if (row.locked_until && row.locked_until.getTime() > at.getTime()) {
      return { kind: 'limited', retryAfter: Math.max(1, Math.ceil((row.locked_until.getTime() - at.getTime()) / 1000)) };
    }
    const expired = row.locked_until !== null || at.getTime() - row.first_at.getTime() >= config.loginWindowSeconds * 1000;
    const failures = expired ? 0 : row.attempts;
    const firstAt = expired || failures === 0 ? at : row.first_at;
    const value = await authenticate(tx, at);
    if (value !== null) {
      await tx.$executeRaw`UPDATE auth_rate_limits SET attempts = 0, first_at = ${at}, locked_until = NULL,
        updated_at = ${at} WHERE key = ${key}`;
      return { kind: 'success', value };
    }
    const attempts = failures + 1;
    const lockedUntil = attempts >= config.loginMaxFailures ? new Date(at.getTime() + config.loginLockSeconds * 1000) : null;
    await tx.$executeRaw`UPDATE auth_rate_limits SET attempts = ${attempts}, first_at = ${firstAt},
      locked_until = ${lockedUntil}, updated_at = ${at} WHERE key = ${key}`;
    return lockedUntil ? { kind: 'limited', retryAfter: config.loginLockSeconds } : { kind: 'invalid' };
  }, { maxWait: config.dbConnectTimeoutMs, timeout: 5000 });
}

/** One bounded batch; the explicit maintenance command is separate from web startup. */
export async function cleanExpiredLoginKeys(prisma: PrismaClient, config: AppConfig): Promise<number> {
  return prisma.$transaction(async tx => {
    await tx.$queryRaw`SELECT set_config('lock_timeout', ${`${config.dbStatementTimeoutMs}ms`}, true)`;
    return tx.$executeRaw`WITH expired AS (
      SELECT key FROM auth_rate_limits
      WHERE updated_at < clock_timestamp() - (${config.loginRetentionSeconds} * interval '1 second')
        AND first_at < clock_timestamp() - (${config.loginWindowSeconds} * interval '1 second')
        AND (locked_until IS NULL OR locked_until <= clock_timestamp())
      ORDER BY updated_at LIMIT 100 FOR UPDATE SKIP LOCKED)
      DELETE FROM auth_rate_limits AS target USING expired WHERE target.key = expired.key`;
  }, { maxWait: config.dbConnectTimeoutMs, timeout: 5000 });
}
