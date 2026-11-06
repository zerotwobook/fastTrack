// Seed script — B owns (R1-B00).
// Run with: node --env-file=server/.env --import tsx server/prisma/seed.ts
// DEMO_SEED_PASSWORD must be supplied through the environment; no default credential is used.
// Idempotent: safe to run multiple times. Existing records are preserved; duplicates are skipped.
// Never resets passwords, moves members or removes submissions on repeat runs.
// Production seed does NOT auto-create demo users; pass an explicit DEMO_SEED_PASSWORD env value.
// Test fixture reset is handled separately by the test helper (guarded by requireTestDatabase).

import { PrismaClient, UserRole } from '../src/db/generated/client/index.js';
import { PrismaPg } from '@prisma/adapter-pg';
import { createHash } from 'node:crypto';
import { scryptSync, randomBytes } from 'node:crypto';

const connectionString = process.env['DATABASE_URL'];
if (!connectionString) {
  throw new Error('DATABASE_URL is required for seed. Set it in server/.env or pass it explicitly.');
}
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

/** Hash a plain-text password with scrypt (same scheme the auth module will use). */
function hashPassword(plain: string): string {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(plain, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

/** Idempotent upsert for a User. Never overwrites passwordHash on conflict. */
async function upsertUser(data: {
  email: string;
  name: string;
  role: UserRole;
  studentId?: string;
  passwordHash: string;
}) {
  return prisma.user.upsert({
    where: { email: data.email },
    create: data,
    update: {
      // Preserve existing password; only update non-sensitive metadata if needed.
      name: data.name,
      studentId: data.studentId ?? null,
    },
  });
}

async function main() {
  const rawPassword = process.env.DEMO_SEED_PASSWORD;
  if (!rawPassword) {
    throw new Error(
      'DEMO_SEED_PASSWORD environment variable is required. ' +
        'Set it in server/.env or pass it explicitly. No default credential is accepted.',
    );
  }

  console.log('Seeding demo users and teams (idempotent)…');

  // ---------------------------------------------------------------------------
  // Supervisors
  // ---------------------------------------------------------------------------
  const supervisorA = await upsertUser({
    email: 'supervisor.a@fasttrack.local',
    name: 'Supervisor A',
    role: UserRole.supervisor,
    passwordHash: hashPassword(rawPassword),
  });

  const supervisorB = await upsertUser({
    email: 'supervisor.b@fasttrack.local',
    name: 'Supervisor B',
    role: UserRole.supervisor,
    passwordHash: hashPassword(rawPassword),
  });

  // ---------------------------------------------------------------------------
  // Students
  // ---------------------------------------------------------------------------
  const studentA1 = await upsertUser({
    email: 'student.a1@fasttrack.local',
    name: 'Student A1',
    role: UserRole.student,
    studentId: '67000000001',
    passwordHash: hashPassword(rawPassword),
  });

  const studentA2 = await upsertUser({
    email: 'student.a2@fasttrack.local',
    name: 'Student A2',
    role: UserRole.student,
    studentId: '67000000002',
    passwordHash: hashPassword(rawPassword),
  });

  const studentB1 = await upsertUser({
    email: 'student.b1@fasttrack.local',
    name: 'Student B1',
    role: UserRole.student,
    studentId: '67000000003',
    passwordHash: hashPassword(rawPassword),
  });

  // ---------------------------------------------------------------------------
  // Teams — one supervisor per team (unique constraint on supervisorId).
  // Use upsert by supervisorId since that is unique; name may be updated.
  // ---------------------------------------------------------------------------
  const teamA = await prisma.team.upsert({
    where: { supervisorId: supervisorA.id },
    create: { name: 'Team A', supervisorId: supervisorA.id },
    update: { name: 'Team A' },
  });

  const teamB = await prisma.team.upsert({
    where: { supervisorId: supervisorB.id },
    create: { name: 'Team B', supervisorId: supervisorB.id },
    update: { name: 'Team B' },
  });

  // ---------------------------------------------------------------------------
  // Team membership — idempotent via unique studentId constraint.
  // Never moves a student to another team; skip if already in any team.
  // ---------------------------------------------------------------------------
  for (const { teamId, studentId } of [
    { teamId: teamA.id, studentId: studentA1.id },
    { teamId: teamA.id, studentId: studentA2.id },
    { teamId: teamB.id, studentId: studentB1.id },
  ]) {
    await prisma.teamMember
      .create({ data: { teamId, studentId } })
      .catch((err: { code?: string }) => {
        // P2002 = unique constraint violation — student already a member; safe to skip.
        if (err?.code === 'P2002') return;
        throw err;
      });
  }

  console.log(
    `Seed complete. Teams: ${teamA.name} (supervisor ${supervisorA.email}), ` +
      `${teamB.name} (supervisor ${supervisorB.email}).`,
  );
  console.log(
    `Students: ${studentA1.email}, ${studentA2.email} in Team A; ${studentB1.email} in Team B.`,
  );
}

main()
  .catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

