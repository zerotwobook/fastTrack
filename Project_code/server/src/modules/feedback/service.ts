import { Prisma } from '../../db/generated/client/index.js';
import type { PrismaClient } from '../../db/generated/client/index.js';
import { AppError } from '../../http/errors.js';
import { requireTeamAccess, requireUuid } from '../teams/index.js';
import type { TeamActor } from '../teams/index.js';
import { requireSubmissionAccess } from '../submissions/index.js';
import { isRolledBackContention } from '../submissions/service.js';
import { parseFeedbackInput, FeedbackInputError } from '../../../../shared/feedback.mjs';
import type { FeedbackDto } from './dto.js';

export type FeedbackAuthContext = TeamActor;
type FeedbackWithSupervisor = Prisma.FeedbackGetPayload<{
  include: { supervisor: { select: { id: true; name: true } } };
}>;
const includeSupervisor = { supervisor: { select: { id: true, name: true } } } as const;
const unavailable = () => new AppError(503, 'TEMPORARILY_UNAVAILABLE', 'The result could not be confirmed. Check saved feedback before trying again.');
const conflict = () => new AppError(409, 'REQUEST_KEY_REUSED', 'The request key has already been used for different feedback content or target.');

/** Match this constraint only, including the Prisma PostgreSQL driver-adapter shape. */
export function isFeedbackUniqueConflict(error: unknown): boolean {
  if (!(error instanceof Prisma.PrismaClientKnownRequestError) || error.code !== 'P2002') return false;
  const target = error.meta?.['target'];
  if (Array.isArray(target) && target.length === 2 && target.includes('supervisor_id') && target.includes('client_request_id')) return true;
  if (target === 'feedback_supervisor_id_client_request_id_key') return true;
  const driver = error.meta?.['driverAdapterError'] as { cause?: { kind?: string; constraint?: { index?: string } } } | undefined;
  return driver?.cause?.kind === 'UniqueConstraintViolation'
    && driver.cause.constraint?.index === 'feedback_supervisor_id_client_request_id_key';
}
function dto(row: FeedbackWithSupervisor): FeedbackDto {
  return { id: row.id, submissionId: row.submissionId,
    supervisor: { id: row.supervisor.id, displayName: row.supervisor.name }, content: row.content,
    clientRequestId: row.clientRequestId, createdAt: row.createdAt.toISOString() };
}

export class FeedbackService {
  constructor(private readonly prisma: PrismaClient) {}

  async createFeedback(submissionId: string, body: unknown, auth: FeedbackAuthContext): Promise<{ status: 200 | 201; data: FeedbackDto }> {
    if (auth.role !== 'supervisor') throw new AppError(403, 'FORBIDDEN', 'This action is not allowed for your role.');
    requireUuid(submissionId);
    let input;
    try { input = parseFeedbackInput(body); }
    catch (error) {
      if (error instanceof FeedbackInputError) throw new AppError(400, 'INVALID_INPUT', error.message, error.fields);
      throw error;
    }
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        return await this.prisma.$transaction(async tx => {
          const initial = await requireSubmissionAccess(tx, auth, submissionId);
          // Serialize with shared team mutations and recheck assignment after the lock.
          await tx.$queryRaw`SELECT id FROM teams WHERE id=${initial.teamId}::uuid FOR UPDATE`;
          await requireTeamAccess(tx, auth, initial.teamId);
          const submission = await requireSubmissionAccess(tx, auth, submissionId);
          const existing = await tx.feedback.findUnique({ where: { supervisorId_clientRequestId: {
            supervisorId: auth.userId, clientRequestId: input.clientRequestId,
          } }, include: includeSupervisor });
          if (existing) {
            if (existing.submissionId !== submission.id || existing.content !== input.content) throw conflict();
            return { status: 200 as const, data: dto(existing) };
          }
          const saved = await tx.feedback.create({ data: { submissionId: submission.id, supervisorId: auth.userId,
            content: input.content, clientRequestId: input.clientRequestId }, include: includeSupervisor });
          return { status: 201 as const, data: dto(saved) };
        }, { maxWait: 5_000, timeout: 10_000 });
      } catch (error) {
        if (error instanceof AppError) throw error;
        // A different authorized team may race on the supervisor-wide UUID. Only a
        // confirmed rolled-back transaction is repeated, with scope checked again.
        if (attempt < 2 && (isFeedbackUniqueConflict(error) || isRolledBackContention(error))) continue;
        throw unavailable();
      }
    }
    throw unavailable();
  }

  async listFeedback(submissionId: string, auth: FeedbackAuthContext): Promise<FeedbackDto[]> {
    requireUuid(submissionId);
    try {
      return await this.prisma.$transaction(async tx => {
        const submission = await requireSubmissionAccess(tx, auth, submissionId);
        const rows = await tx.feedback.findMany({ where: { submissionId: submission.id },
          orderBy: [{ createdAt: 'asc' }, { id: 'asc' }], include: includeSupervisor });
        return rows.map(dto);
      }, { isolationLevel: 'RepeatableRead' });
    } catch (error) { if (error instanceof AppError) throw error; throw unavailable(); }
  }
}
