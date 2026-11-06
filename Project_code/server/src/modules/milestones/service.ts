import type { Prisma, PrismaClient } from '../../db/generated/client/index.js';
import { AppError } from '../../http/errors.js';
import { requireTeamAccess, requireUuid, scopedTeamWhere } from '../teams/index.js';
import { MilestoneInputError, parseMilestoneInput } from '../../../../shared/milestones.mjs';
import type { MilestoneDto } from './dto.js';

export interface MilestoneAuthContext { userId: string; role: 'student' | 'supervisor' }
const notFound = () => new AppError(404, 'NOT_FOUND', 'The requested resource was not found.');
const projection = { submissions: { orderBy: { version: 'desc' }, take: 1, include: { _count: { select: { feedback: true } } } } } satisfies Prisma.MilestoneInclude;
type Row = Prisma.MilestoneGetPayload<{ include: typeof projection }>;
function dto(row: Row): MilestoneDto {
  const latest = row.submissions[0];
  return { id: row.id, teamId: row.teamId, title: row.title, description: row.description,
    dueAt: row.dueAt.toISOString(), cancelledAt: row.cancelledAt?.toISOString() ?? null, createdAt: row.createdAt.toISOString(),
    latestSubmission: latest ? { id: latest.id, version: latest.version, submittedAt: latest.submittedAt.toISOString(), feedbackCount: latest._count.feedback } : null };
}
async function database<T>(work: () => Promise<T>): Promise<T> {
  try { return await work(); }
  catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(503, 'TEMPORARILY_UNAVAILABLE', 'The service is temporarily unavailable. Try again.');
  }
}
async function clock(tx: Prisma.TransactionClient): Promise<Date> {
  const rows = await tx.$queryRaw<{ now: Date }[]>`SELECT date_trunc('milliseconds',clock_timestamp()) AS now`;
  return rows[0]!.now;
}
export class MilestoneService {
  constructor(private readonly prisma: PrismaClient) {}
  async createMilestone(teamId: string, value: unknown, auth: MilestoneAuthContext): Promise<MilestoneDto> {
    if (auth.role !== 'supervisor') throw new AppError(403, 'FORBIDDEN', 'This action is not allowed for your role.');
    let input;
    try { input = parseMilestoneInput(value); }
    catch (error) {
      if (error instanceof MilestoneInputError) throw new AppError(400, 'INVALID_INPUT', error.message, error.fields);
      throw error;
    }
    requireUuid(teamId);
    return database(() => this.prisma.$transaction(async tx => {
      const locked = await tx.$queryRaw<{ id: string }[]>`SELECT id FROM teams WHERE id=${teamId}::uuid AND supervisor_id=${auth.userId}::uuid FOR UPDATE`;
      if (!locked.length) throw notFound();
      await requireTeamAccess(tx, auth, teamId);
      const acceptedAt = await clock(tx);
      if (new Date(input.dueAt).getTime() <= acceptedAt.getTime()) {
        throw new AppError(400, 'INVALID_INPUT', 'The deadline must be in the future.', { dueAt: 'Choose a time after the current database time.' });
      }
      const created = await tx.milestone.create({ data: { teamId, ...input, dueAt: new Date(input.dueAt), createdById: auth.userId }, include: projection });
      return dto(created);
    }, { timeout: 10_000 }));
  }
  async listMilestones(teamId: string, auth: MilestoneAuthContext) {
    requireUuid(teamId);
    return database(() => this.prisma.$transaction(async tx => {
      await requireTeamAccess(tx, auth, teamId);
      const rows = await tx.milestone.findMany({ where: { teamId, team: scopedTeamWhere(auth) }, include: projection, orderBy: [{ dueAt: 'asc' }, { id: 'asc' }] });
      return { data: rows.map(dto), meta: { serverTime: (await clock(tx)).toISOString() } };
    }, { isolationLevel: 'RepeatableRead' }));
  }
  async getMilestone(id: string, auth: MilestoneAuthContext) {
    requireUuid(id);
    return database(() => this.prisma.$transaction(async tx => {
      const row = await tx.milestone.findFirst({ where: { id, team: scopedTeamWhere(auth) }, include: projection });
      if (!row) throw notFound();
      return { data: dto(row), meta: { serverTime: (await clock(tx)).toISOString() } };
    }, { isolationLevel: 'RepeatableRead' }));
  }
}
