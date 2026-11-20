import type { Prisma, PrismaClient } from '../../db/generated/client/index.js';
import { AppError } from '../../http/errors.js';
import { requireTeamAccess, requireUuid, scopedTeamWhere } from '../teams/index.js';
import { lockScopedMilestone, lockScopedTeam, readDatabaseTimeMs, runDomainTransaction } from '../shared/transactions.js';
import { MilestoneInputError, parseCancelMilestoneInput, parseMilestoneInput } from '../../../../shared/milestones.mjs';
import type { MilestoneDto } from './dto.js';

export interface MilestoneAuthContext { userId: string; role: 'student' | 'supervisor' }
export type MilestoneClock = (tx: Prisma.TransactionClient) => Promise<Date>;

const notFound = () => new AppError(404, 'NOT_FOUND', 'The requested resource was not found.');
const projection = { submissions: { orderBy: { version: 'desc' }, take: 1, include: { _count: { select: { feedback: true } } } } } satisfies Prisma.MilestoneInclude;
type Row = Prisma.MilestoneGetPayload<{ include: typeof projection }>;

function dto(row: Row): MilestoneDto {
  const latest = row.submissions[0];
  return { id: row.id, teamId: row.teamId, title: row.title, description: row.description,
    dueAt: row.dueAt.toISOString(), cancelledAt: row.cancelledAt?.toISOString() ?? null, createdAt: row.createdAt.toISOString(),
    latestSubmission: latest ? { id: latest.id, version: latest.version, submittedAt: latest.submittedAt.toISOString(), feedbackCount: latest._count.feedback } : null };
}

async function readDatabase<T>(work: () => Promise<T>): Promise<T> {
  try { return await work(); }
  catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(503, 'TEMPORARILY_UNAVAILABLE', 'The service is temporarily unavailable. Try again.');
  }
}

function parseMilestonePayload(value: unknown) {
  try { return parseMilestoneInput(value); }
  catch (error) {
    if (error instanceof MilestoneInputError) throw new AppError(400, 'INVALID_INPUT', error.message, error.fields);
    throw error;
  }
}

function parseCancelPayload(value: unknown) {
  try { parseCancelMilestoneInput(value); }
  catch (error) {
    if (error instanceof MilestoneInputError) throw new AppError(400, 'INVALID_INPUT', error.message, error.fields);
    throw error;
  }
}

export class MilestoneService {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly clock: MilestoneClock = readDatabaseTimeMs,
  ) {
    if (clock !== readDatabaseTimeMs && process.env['NODE_ENV'] !== 'test') {
      throw new TypeError('A milestone clock override is restricted to internal tests.');
    }
  }

  async createMilestone(teamId: string, value: unknown, auth: MilestoneAuthContext): Promise<MilestoneDto> {
    if (auth.role !== 'supervisor') throw new AppError(403, 'FORBIDDEN', 'This action is not allowed for your role.');
    const input = parseMilestonePayload(value);
    requireUuid(teamId);
    return runDomainTransaction(this.prisma, async tx => {
      await lockScopedTeam(tx, auth, teamId);
      const acceptedAt = await this.clock(tx);
      if (new Date(input.dueAt).getTime() <= acceptedAt.getTime()) {
        throw new AppError(400, 'INVALID_INPUT', 'The deadline must be in the future.', { dueAt: 'Choose a time after the current database time.' });
      }
      const created = await tx.milestone.create({ data: { teamId, ...input, dueAt: new Date(input.dueAt), createdById: auth.userId }, include: projection });
      return dto(created);
    });
  }

  /** Lock team then milestone and enforce F-05B precedence: cancelled -> history locked. */
  private async lockEditableMilestone(
    tx: Prisma.TransactionClient,
    id: string,
    auth: MilestoneAuthContext,
    action: 'edit' | 'cancel',
  ) {
    const initial = await tx.milestone.findFirst({ where: { id, team: scopedTeamWhere(auth) }, select: { teamId: true } });
    if (!initial) throw notFound();
    await lockScopedTeam(tx, auth, initial.teamId);
    const milestone = await lockScopedMilestone(tx, auth, initial.teamId, id);
    if (milestone.cancelledAt) {
      throw new AppError(409, 'MILESTONE_CANCELLED',
        action === 'cancel' ? 'This milestone is already cancelled.' : 'Cancelled milestones cannot be edited.');
    }
    if (await tx.submission.findFirst({ where: { milestoneId: id }, select: { id: true } })) {
      throw new AppError(409, 'MILESTONE_HISTORY_LOCKED',
        `This milestone already has a submission and cannot be ${action === 'cancel' ? 'cancelled' : 'edited'}.`);
    }
    return milestone;
  }

  async updateMilestone(id: string, value: unknown, auth: MilestoneAuthContext): Promise<MilestoneDto> {
    if (auth.role !== 'supervisor') throw new AppError(403, 'FORBIDDEN', 'This action is not allowed for your role.');
    requireUuid(id);
    const input = parseMilestonePayload(value);
    return runDomainTransaction(this.prisma, async tx => {
      await this.lockEditableMilestone(tx, id, auth, 'edit');
      const now = await this.clock(tx);
      if (new Date(input.dueAt).getTime() <= now.getTime()) {
        throw new AppError(400, 'INVALID_INPUT', 'The deadline must be in the future.', { dueAt: 'Choose a time after the current database time.' });
      }
      const updated = await tx.milestone.update({
        where: { id },
        data: { title: input.title, description: input.description, dueAt: new Date(input.dueAt) },
        include: projection,
      });
      return dto(updated);
    });
  }

  async cancelMilestone(id: string, value: unknown, auth: MilestoneAuthContext): Promise<MilestoneDto> {
    if (auth.role !== 'supervisor') throw new AppError(403, 'FORBIDDEN', 'This action is not allowed for your role.');
    requireUuid(id);
    parseCancelPayload(value);
    return runDomainTransaction(this.prisma, async tx => {
      await this.lockEditableMilestone(tx, id, auth, 'cancel');
      const cancelledAt = await this.clock(tx);
      const cancelled = await tx.milestone.update({
        where: { id },
        data: { cancelledAt },
        include: projection,
      });
      return dto(cancelled);
    });
  }

  async listMilestones(teamId: string, auth: MilestoneAuthContext) {
    requireUuid(teamId);
    return readDatabase(() => this.prisma.$transaction(async tx => {
      await requireTeamAccess(tx, auth, teamId);
      const rows = await tx.milestone.findMany({ where: { teamId, team: scopedTeamWhere(auth) }, include: projection, orderBy: [{ dueAt: 'asc' }, { id: 'asc' }] });
      return { data: rows.map(dto), meta: { serverTime: (await this.clock(tx)).toISOString() } };
    }, { isolationLevel: 'RepeatableRead' }));
  }

  async getMilestone(id: string, auth: MilestoneAuthContext) {
    requireUuid(id);
    return readDatabase(() => this.prisma.$transaction(async tx => {
      const row = await tx.milestone.findFirst({ where: { id, team: scopedTeamWhere(auth) }, include: projection });
      if (!row) throw notFound();
      return { data: dto(row), meta: { serverTime: (await this.clock(tx)).toISOString() } };
    }, { isolationLevel: 'RepeatableRead' }));
  }
}
