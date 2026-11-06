// Test fixture helpers — B owns (R1-B00).
// Provides reusable setup/teardown for integration tests.
// MUST call requireTestDatabase() before any destructive operation.
// Guards are enforced at import time AND at fixture-creation time.

import { PrismaClient, UserRole } from '../db/generated/client/index.js';
import { PrismaPg } from '@prisma/adapter-pg';
import { requireTestDatabase } from '../db/test-database.js';
import { scryptSync, randomBytes } from 'node:crypto';

// Validate test-database boundary immediately on import.
requireTestDatabase(process.env, [
  process.env['DATABASE_URL'] ?? '',
]);

/** Hash password using the same scheme as seed/auth. */
function hashPassword(plain: string): string {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(plain, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

export const TEST_PASSWORD = 'test-password-fixture';
export const TEST_PASSWORD_HASH = hashPassword(TEST_PASSWORD);

/** Create an isolated Prisma client for integration tests using TEST_DATABASE_URL. */
export function createTestPrisma(): PrismaClient {
  const connectionString = process.env['TEST_DATABASE_URL'];
  if (!connectionString) {
    throw new Error('TEST_DATABASE_URL is required for test fixtures.');
  }
  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({ adapter });
}

/** Full fixture set: two supervisors, three students, two teams, two milestones.
 *
 * Returns all created records so tests can reference IDs directly.
 * Milestones include boundary cases: 1 ms before/at/after a reference date.
 *
 * @param prisma - test Prisma client (from createTestPrisma())
 * @param refDate - reference datetime for deadline boundary fixtures (defaults to now + 1 day)
 */
export async function createBaseFixtures(
  prisma: PrismaClient,
  refDate?: Date,
) {
  const ref = refDate ?? new Date(Date.now() + 24 * 60 * 60 * 1000);

  // Supervisors
  const supA = await prisma.user.create({
    data: {
      email: 'sup-a@test.local',
      name: 'Supervisor A',
      role: UserRole.supervisor,
      passwordHash: TEST_PASSWORD_HASH,
    },
  });

  const supB = await prisma.user.create({
    data: {
      email: 'sup-b@test.local',
      name: 'Supervisor B',
      role: UserRole.supervisor,
      passwordHash: TEST_PASSWORD_HASH,
    },
  });

  // Students
  const stuA1 = await prisma.user.create({
    data: {
      email: 'stu-a1@test.local',
      name: 'Student A1',
      role: UserRole.student,
      studentId: 'TEST-A1',
      passwordHash: TEST_PASSWORD_HASH,
    },
  });

  const stuA2 = await prisma.user.create({
    data: {
      email: 'stu-a2@test.local',
      name: 'Student A2',
      role: UserRole.student,
      studentId: 'TEST-A2',
      passwordHash: TEST_PASSWORD_HASH,
    },
  });

  const stuB1 = await prisma.user.create({
    data: {
      email: 'stu-b1@test.local',
      name: 'Student B1',
      role: UserRole.student,
      studentId: 'TEST-B1',
      passwordHash: TEST_PASSWORD_HASH,
    },
  });

  // Teams
  const teamA = await prisma.team.create({
    data: {
      name: 'Test Team A',
      supervisorId: supA.id,
      members: {
        create: [
          { studentId: stuA1.id },
          { studentId: stuA2.id },
        ],
      },
    },
  });

  const teamB = await prisma.team.create({
    data: {
      name: 'Test Team B',
      supervisorId: supB.id,
      members: {
        create: [{ studentId: stuB1.id }],
      },
    },
  });

  // Milestones with deadline boundary fixtures.
  // dueAt values: ref - 1ms (past), ref (exact boundary), ref + 1 hour (future).
  const milestonePast = await prisma.milestone.create({
    data: {
      teamId: teamA.id,
      title: 'Past deadline milestone',
      dueAt: new Date(ref.getTime() - 1),
      createdById: supA.id,
    },
  });

  const milestoneExact = await prisma.milestone.create({
    data: {
      teamId: teamA.id,
      title: 'Exact boundary milestone',
      dueAt: ref,
      createdById: supA.id,
    },
  });

  const milestoneFuture = await prisma.milestone.create({
    data: {
      teamId: teamA.id,
      title: 'Future milestone',
      dueAt: new Date(ref.getTime() + 60 * 60 * 1000),
      createdById: supA.id,
    },
  });

  const milestoneBTeam = await prisma.milestone.create({
    data: {
      teamId: teamB.id,
      title: 'Team B milestone',
      dueAt: new Date(ref.getTime() + 60 * 60 * 1000),
      createdById: supB.id,
    },
  });

  return {
    users: { supA, supB, stuA1, stuA2, stuB1 },
    teams: { teamA, teamB },
    milestones: { milestonePast, milestoneExact, milestoneFuture, milestoneBTeam },
  };
}
