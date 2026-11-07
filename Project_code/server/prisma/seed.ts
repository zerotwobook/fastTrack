// Seed script — B owns (R1-B00 / R1-B00-FIX-01).
// Run with: node --env-file=server/.env --import tsx server/prisma/seed.ts
// DEMO_SEED_PASSWORD must be supplied through the environment; no default credential is used.
// Idempotent & Add-only: safe to run multiple times (G1-08).
// Existing records are preserved; never overwrites edited names, passwords, membership or history.

import { PrismaClient, UserRole } from '../src/db/generated/client/index.js';
import { PrismaPg } from '@prisma/adapter-pg';
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

async function main() {
  const rawPassword = process.env.DEMO_SEED_PASSWORD;
  if (!rawPassword) {
    throw new Error(
      'DEMO_SEED_PASSWORD environment variable is required. ' +
        'Set it in server/.env or pass it explicitly. No default credential is accepted.',
    );
  }

  console.log('Seeding demo users and teams (idempotent, add-only)…');

  // ---------------------------------------------------------------------------
  // Supervisors — find or create (add-only: do NOT overwrite name or password on existing)
  // ---------------------------------------------------------------------------
  let supervisorA = await prisma.user.findUnique({ where: { email: 'supervisor.a@fasttrack.local' } });
  if (!supervisorA) {
    supervisorA = await prisma.user.create({
      data: {
        email: 'supervisor.a@fasttrack.local',
        name: 'Supervisor A',
        role: UserRole.supervisor,
        passwordHash: hashPassword(rawPassword),
      },
    });
  }

  let supervisorB = await prisma.user.findUnique({ where: { email: 'supervisor.b@fasttrack.local' } });
  if (!supervisorB) {
    supervisorB = await prisma.user.create({
      data: {
        email: 'supervisor.b@fasttrack.local',
        name: 'Supervisor B',
        role: UserRole.supervisor,
        passwordHash: hashPassword(rawPassword),
      },
    });
  }

  // ---------------------------------------------------------------------------
  // Students — find or create (add-only)
  // ---------------------------------------------------------------------------
  let studentA1 = await prisma.user.findUnique({ where: { email: 'student.a1@fasttrack.local' } });
  if (!studentA1) {
    studentA1 = await prisma.user.create({
      data: {
        email: 'student.a1@fasttrack.local',
        name: 'Student A1',
        role: UserRole.student,
        studentId: '67000000001',
        passwordHash: hashPassword(rawPassword),
      },
    });
  }

  let studentA2 = await prisma.user.findUnique({ where: { email: 'student.a2@fasttrack.local' } });
  if (!studentA2) {
    studentA2 = await prisma.user.create({
      data: {
        email: 'student.a2@fasttrack.local',
        name: 'Student A2',
        role: UserRole.student,
        studentId: '67000000002',
        passwordHash: hashPassword(rawPassword),
      },
    });
  }

  let studentB1 = await prisma.user.findUnique({ where: { email: 'student.b1@fasttrack.local' } });
  if (!studentB1) {
    studentB1 = await prisma.user.create({
      data: {
        email: 'student.b1@fasttrack.local',
        name: 'Student B1',
        role: UserRole.student,
        studentId: '67000000003',
        passwordHash: hashPassword(rawPassword),
      },
    });
  }

  // ---------------------------------------------------------------------------
  // Teams — find or create (add-only, G1-08: preserve custom names if edited)
  // ---------------------------------------------------------------------------
  let teamA = await prisma.team.findFirst({ where: { supervisorId: supervisorA.id } });
  if (!teamA) {
    teamA = await prisma.team.create({
      data: { name: 'Team A', supervisorId: supervisorA.id },
    });
  }

  let teamB = await prisma.team.findFirst({ where: { supervisorId: supervisorB.id } });
  if (!teamB) {
    teamB = await prisma.team.create({
      data: { name: 'Team B', supervisorId: supervisorB.id },
    });
  }

  // ---------------------------------------------------------------------------
  // Team membership — idempotent via unique studentId constraint.
  // ---------------------------------------------------------------------------
  for (const { teamId, studentId } of [
    { teamId: teamA.id, studentId: studentA1.id },
    { teamId: teamA.id, studentId: studentA2.id },
    { teamId: teamB.id, studentId: studentB1.id },
  ]) {
    await prisma.teamMember
      .create({ data: { teamId, studentId } })
      .catch((err: { code?: string }) => {
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
