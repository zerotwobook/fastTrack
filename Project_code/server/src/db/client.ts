// Prisma client singleton — B owns (R1-B00).
// Prisma 7 requires a driver adapter; PrismaPg connects to PostgreSQL.
// DATABASE_URL must be set before this module is imported.
// Import from here throughout the server; never instantiate PrismaClient elsewhere.

import { PrismaClient } from './generated/client/index.js';
import { PrismaPg } from '@prisma/adapter-pg';

function createPrismaClient(): PrismaClient {
  const connectionString = process.env['DATABASE_URL'];
  if (!connectionString) {
    throw new Error(
      'DATABASE_URL is required but not set. ' +
        'Ensure the environment is loaded before importing the Prisma client.',
    );
  }
  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({ adapter });
}

// Singleton: one client per process (dev HMR creates a new module each reload,
// so we store the instance on globalThis to prevent exhausting DB connections).
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma: PrismaClient =
  globalForPrisma.prisma ?? createPrismaClient();

if (process.env['NODE_ENV'] !== 'production') {
  globalForPrisma.prisma = prisma;
}
