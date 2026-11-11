import { PrismaClient } from './generated/client/index.js';
import { PrismaPg } from '@prisma/adapter-pg';
import { databaseLimits, parseDatabaseUrl } from '../config.js';
import type { Environment } from '../config.js';

/** One bounded pool per process; explicit jobs and guarded tests can use the same factory. */
export function createRuntimeClient(env: Environment): PrismaClient {
  const connectionString = parseDatabaseUrl(env.DATABASE_URL, 'DATABASE_URL').href;
  const limits = databaseLimits(env);
  const adapter = new PrismaPg({ connectionString, max: limits.dbPoolMax,
    connectionTimeoutMillis: limits.dbConnectTimeoutMs, statement_timeout: limits.dbStatementTimeoutMs,
    query_timeout: limits.dbQueryTimeoutMs }, { onPoolError: () => { process.stderr.write('Database pool unavailable.\n'); } });
  return new PrismaClient({ adapter });
}
