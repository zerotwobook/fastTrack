import { loadConfig } from '../config.js';
import { cleanExpiredLoginKeys } from '../modules/auth/rate-limit.js';

try {
  if (process.env.CONFIRM_RATE_LIMIT_CLEANUP !== 'auth-rate-limits-only') throw new Error('Explicit maintenance confirmation required.');
  const config = loadConfig(process.env);
  const { prisma } = await import('../db/client.js');
  try { process.stdout.write(`Removed ${await cleanExpiredLoginKeys(prisma, config)} expired login limiter rows (one bounded batch).\n`); }
  finally { await prisma.$disconnect(); }
} catch {
  process.stderr.write('Login limiter maintenance failed. Check confirmation and runtime configuration.\n');
  process.exitCode = 1;
}
