import { Prisma } from '../../db/generated/client/index.js';
import type { PrismaClient } from '../../db/generated/client/index.js';
import { AppError } from '../../http/errors.js';
import { requireTeamAccess, requireUuid, scopedTeamWhere } from '../teams/index.js';
import type { TeamActor } from '../teams/index.js';
import { parseSubmissionInput, SubmissionInputError } from '../../../../shared/submissions.mjs';
import { submissionDto, submissionSelect } from './dto.js';

const notFound = () => new AppError(404, 'NOT_FOUND', 'The requested resource was not found.');
const duplicate = () => new AppError(409, 'ALREADY_SUBMITTED', 'Your team has already submitted work for this milestone. Open the saved submission.');
const unavailable = () => new AppError(503, 'TEMPORARILY_UNAVAILABLE', 'The result could not be confirmed. Check saved submissions before trying again.');
export type SubmissionClock = (tx: Prisma.TransactionClient) => Promise<Date>;

export async function submissionDatabaseClock(tx: Prisma.TransactionClient): Promise<Date> {
  const rows = await tx.$queryRaw<{ now: Date }[]>`SELECT date_trunc('milliseconds',clock_timestamp()) AS now`;
  return rows[0]!.now;
}

export function scopedSubmissionWhere(auth: TeamActor): Prisma.SubmissionWhereInput {
  return { milestone: { team: scopedTeamWhere(auth) } };
}

/** B passes its operation's transaction client, then enforces its own mutation rules. */
export async function requireSubmissionAccess(db: Pick<PrismaClient, 'submission'>, auth: TeamActor, id: string) {
  requireUuid(id);
  const row = await db.submission.findFirst({ where: { id, ...scopedSubmissionWhere(auth) },
    select: { id: true, milestoneId: true, milestone: { select: { teamId: true } } } });
  if (!row) throw notFound();
  return { id: row.id, milestoneId: row.milestoneId, teamId: row.milestone.teamId };
}

export function isRolledBackContention(error: unknown): boolean {
  if (!(error instanceof Prisma.PrismaClientKnownRequestError)) return false;
  if (error.code === 'P2034') return true;
  const driver = error.meta?.['driverAdapterError'] as { cause?: { kind?: string } } | undefined;
  return error.code === 'P2010' && driver?.cause?.kind === 'TransactionWriteConflict';
}

export function isSubmissionUniqueConflict(error: unknown): boolean {
  if (!(error instanceof Prisma.PrismaClientKnownRequestError) || error.code !== 'P2002') return false;
  const target = error.meta?.['target'];
  if (Array.isArray(target) && target.length === 2 && target.includes('milestone_id') && target.includes('version')) return true;
  if (target === 'submissions_milestone_id_version_key') return true;
  const driver = error.meta?.['driverAdapterError'] as { cause?: { kind?: string; constraint?: { index?: string } } } | undefined;
  return driver?.cause?.kind === 'UniqueConstraintViolation'
    && driver.cause.constraint?.index === 'submissions_milestone_id_version_key';
}

export class SubmissionService {
  constructor(private readonly prisma: PrismaClient, private readonly clock: SubmissionClock = submissionDatabaseClock) {
    if (clock !== submissionDatabaseClock && process.env['NODE_ENV'] !== 'test') {
      throw new TypeError('A submission clock override is restricted to internal tests.');
    }
  }

  async submit(id: string, value: unknown, auth: TeamActor) {
    if (auth.role !== 'student') throw new AppError(403, 'FORBIDDEN', 'Only a student on this team can submit work.');
    requireUuid(id);
    let input;
    try { input = parseSubmissionInput(value); }
    catch (error) {
      if (error instanceof SubmissionInputError) throw new AppError(400, 'INVALID_INPUT', error.message, error.fields);
      throw error;
    }
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        return await this.prisma.$transaction(async tx => {
          const initial = await tx.milestone.findFirst({ where: { id, team: scopedTeamWhere(auth) }, select: { teamId: true } });
          if (!initial) throw notFound();
          await tx.$queryRaw`SELECT id FROM teams WHERE id=${initial.teamId}::uuid FOR UPDATE`;
          await tx.$queryRaw`SELECT id FROM milestones WHERE id=${id}::uuid AND team_id=${initial.teamId}::uuid FOR UPDATE`;
          await requireTeamAccess(tx, auth, initial.teamId);
          const milestone = await tx.milestone.findFirst({ where: { id, teamId: initial.teamId, team: scopedTeamWhere(auth) }, select: { dueAt: true, cancelledAt: true } });
          if (!milestone) throw notFound();
          if (milestone.cancelledAt) throw new AppError(409, 'MILESTONE_CANCELLED', 'This milestone was cancelled and cannot receive work.');
          if (await tx.submission.findFirst({ where: { milestoneId: id }, select: { id: true } })) throw duplicate();
          const acceptedAt = await this.clock(tx);
          // Deadline enforcement is the next TDD increment; the Draft branch retains its real RED evidence.
          const saved = await tx.submission.create({ data: { milestoneId: id, submittedById: auth.userId, version: 1,
            ...input, submittedAt: acceptedAt }, select: submissionSelect });
          return submissionDto(saved);
        }, { maxWait: 5_000, timeout: 10_000 });
      } catch (error) {
        if (error instanceof AppError) throw error;
        if (isSubmissionUniqueConflict(error)) throw duplicate();
        if (attempt < 2 && isRolledBackContention(error)) continue;
        throw unavailable();
      }
    }
    throw unavailable();
  }

  async list(id: string, auth: TeamActor) {
    requireUuid(id);
    return this.read(async tx => {
      const milestone = await tx.milestone.findFirst({ where: { id, team: scopedTeamWhere(auth) }, select: { id: true } });
      if (!milestone) throw notFound();
      const rows = await tx.submission.findMany({ where: { milestoneId: id, ...scopedSubmissionWhere(auth) }, select: submissionSelect,
        orderBy: [{ version: 'desc' }, { id: 'asc' }] });
      return { data: rows.map(submissionDto), meta: { serverTime: (await submissionDatabaseClock(tx)).toISOString() } };
    });
  }

  async detail(id: string, auth: TeamActor) {
    requireUuid(id);
    return this.read(async tx => {
      const row = await tx.submission.findFirst({ where: { id, ...scopedSubmissionWhere(auth) }, select: submissionSelect });
      if (!row) throw notFound();
      return { data: submissionDto(row), meta: { serverTime: (await submissionDatabaseClock(tx)).toISOString() } };
    });
  }

  private async read<T>(work: (tx: Prisma.TransactionClient) => Promise<T>): Promise<T> {
    try { return await this.prisma.$transaction(work, { isolationLevel: 'RepeatableRead' }); }
    catch (error) { if (error instanceof AppError) throw error; throw unavailable(); }
  }
}
