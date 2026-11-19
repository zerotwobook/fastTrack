import { Prisma } from '../../db/generated/client/index.js';
import type { PrismaClient } from '../../db/generated/client/index.js';
import { AppError } from '../../http/errors.js';
import { requireTeamAccess, requireUuid, scopedTeamWhere } from '../teams/model.js';
import type { TeamActor } from '../teams/model.js';

type LockedTeam = Readonly<{ id: string }>;
type LockedMilestone = Readonly<{
  id: string;
  teamId: string;
  dueAt: Date;
  cancelledAt: Date | null;
}>;

const notFound = () => new AppError(404, 'NOT_FOUND', 'The requested resource was not found.');
const unavailable = () => new AppError(503, 'TEMPORARILY_UNAVAILABLE', 'The service is temporarily unavailable. Try again.');

function teamLockScope(actor: TeamActor) {
  if (actor.role === 'supervisor') return Prisma.sql`t.supervisor_id = ${actor.userId}::uuid`;
  return Prisma.sql`EXISTS (
    SELECT 1 FROM team_members WHERE team_id = t.id AND student_id = ${actor.userId}::uuid
  )`;
}

export async function lockScopedTeam(tx: Prisma.TransactionClient, actor: TeamActor, teamId: string): Promise<LockedTeam> {
  requireUuid(teamId);
  const [locked] = await tx.$queryRaw<LockedTeam[]>`
    SELECT t.id FROM teams AS t
    WHERE t.id = ${teamId}::uuid AND ${teamLockScope(actor)}
    FOR UPDATE OF t`;
  if (!locked) throw notFound();
  // Membership can change while the lock is waiting. Read scope again after acquiring it.
  return requireTeamAccess(tx, actor, teamId);
}

/** The caller holds this team's row lock on the same transaction before locking a milestone. */
export async function lockScopedMilestone(
  tx: Prisma.TransactionClient, actor: TeamActor, teamId: string, milestoneId: string,
): Promise<LockedMilestone> {
  requireUuid(teamId);
  requireUuid(milestoneId);
  const [locked] = await tx.$queryRaw<{ id: string }[]>`
    SELECT m.id FROM milestones AS m
    JOIN teams AS t ON t.id = m.team_id
    WHERE m.id = ${milestoneId}::uuid AND m.team_id = ${teamId}::uuid AND ${teamLockScope(actor)}
    FOR UPDATE OF m`;
  if (!locked) throw notFound();
  const milestone = await tx.milestone.findFirst({
    where: { id: milestoneId, teamId, team: scopedTeamWhere(actor) },
    select: { id: true, teamId: true, dueAt: true, cancelledAt: true },
  });
  if (!milestone) throw notFound();
  return milestone;
}

export async function readDatabaseTimeMs(tx: Prisma.TransactionClient): Promise<Date> {
  const rows = await tx.$queryRaw<{ now: Date }[]>`SELECT date_trunc('milliseconds',clock_timestamp()) AS now`;
  return rows[0]!.now;
}

export function isRolledBackContention(error: unknown): boolean {
  if (!(error instanceof Prisma.PrismaClientKnownRequestError)) return false;
  if (error.code === 'P2034') return true;
  const driver = error.meta?.['driverAdapterError'] as { cause?: { kind?: string } } | undefined;
  return error.code === 'P2010' && driver?.cause?.kind === 'TransactionWriteConflict';
}

/** An optional final error mapper preserves an operation's domain-specific conflict and recovery messages. */
export async function runDomainTransaction<T>(
  prisma: PrismaClient,
  operation: (tx: Prisma.TransactionClient) => Promise<T>,
  mapError: (error: unknown) => AppError = unavailable,
): Promise<T> {
  for (let attempt = 1; ; attempt++) {
    try {
      return await prisma.$transaction(operation, { maxWait: 5_000, timeout: 10_000 });
    } catch (error) {
      if (error instanceof AppError) throw error;
      if (attempt === 3 || !isRolledBackContention(error)) throw mapError(error);
    }
  }
}
