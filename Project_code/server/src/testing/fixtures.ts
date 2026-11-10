// Test fixture helpers — B owns (R1-B00 / R1-B00-FIX-01).
// Provides reusable setup/teardown for integration tests.
// MUST call requireTestDatabase() before any destructive operation and at client creation (G1-07).

import { PrismaClient, UserRole } from '../db/generated/client/index.js';
import { PrismaPg } from '@prisma/adapter-pg';
import { requireTestDatabase } from '../db/test-database.js';
import { ConfigError } from '../config.js';
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

// Only this factory can bind a concrete client to the validated connection string.
const testClientTargets = new WeakMap<PrismaClient, string>();

function assertTestClientTarget(prisma: PrismaClient): void {
  const target = requireTestDatabase(process.env);
  if (testClientTargets.get(prisma) !== target) {
    throw new ConfigError('test fixture client (unverified or changed database target)');
  }
}

/** Create a client bound to the validated, reserved test database. */
export function createTestPrisma(): PrismaClient {
  const target = requireTestDatabase(process.env);
  const client = new PrismaClient({ adapter: new PrismaPg({ connectionString: target }) });
  testClientTargets.set(client, target);
  return client;
}

/** Validate the actual client binding before deleting anything, then clean atomically. */
export async function cleanTestDatabase(prisma: PrismaClient) {
  assertTestClientTarget(prisma);
  await prisma.$transaction([
    prisma.authRateLimit.deleteMany(),
    prisma.feedback.deleteMany(), prisma.submission.deleteMany(), prisma.milestone.deleteMany(),
    prisma.teamMember.deleteMany(), prisma.team.deleteMany(), prisma.session.deleteMany(), prisma.user.deleteMany(),
  ]);
}

/** Full fixture set: two supervisors, three students, two teams, milestones with exact boundary fixtures. */
export async function createBaseFixtures(
  prisma: PrismaClient,
  refDate?: Date,
) {
  assertTestClientTarget(prisma);
  await cleanTestDatabase(prisma);

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

  // Milestones with exact deadline boundary fixtures (G1-06: -1ms, equal 0ms, +1ms, plus general future)
  const milestonePast = await prisma.milestone.create({
    data: {
      teamId: teamA.id,
      title: 'Past deadline milestone',
      description: 'Synthetic milestone fixture with valid required content.',
      dueAt: new Date(ref.getTime() - 1),
      createdById: supA.id,
    },
  });

  const milestoneExact = await prisma.milestone.create({
    data: {
      teamId: teamA.id,
      title: 'Exact boundary milestone',
      description: 'Synthetic milestone fixture with valid required content.',
      dueAt: ref,
      createdById: supA.id,
    },
  });

  const milestoneBoundaryPlus1ms = await prisma.milestone.create({
    data: {
      teamId: teamA.id,
      title: 'Boundary plus one ms milestone',
      description: 'Synthetic milestone fixture with valid required content.',
      dueAt: new Date(ref.getTime() + 1),
      createdById: supA.id,
    },
  });

  const milestoneFuture = await prisma.milestone.create({
    data: {
      teamId: teamA.id,
      title: 'Future milestone',
      description: 'Synthetic milestone fixture with valid required content.',
      dueAt: new Date(ref.getTime() + 60 * 60 * 1000),
      createdById: supA.id,
    },
  });

  const milestoneBTeam = await prisma.milestone.create({
    data: {
      teamId: teamB.id,
      title: 'Team B milestone',
      description: 'Synthetic milestone fixture with valid required content.',
      dueAt: new Date(ref.getTime() + 60 * 60 * 1000),
      createdById: supB.id,
    },
  });

  return {
    users: { supA, supB, stuA1, stuA2, stuB1 },
    teams: { teamA, teamB },
    milestones: { milestonePast, milestoneExact, milestoneBoundaryPlus1ms, milestoneFuture, milestoneBTeam },
  };
}
