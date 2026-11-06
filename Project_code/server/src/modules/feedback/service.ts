// Feedback domain service — B owns (R1-B02).
// Scoped team queries, append-only version association, and clientRequestId retry safety.

import type { Prisma, PrismaClient } from '../../db/generated/client/index.js';
import { AppError } from '../../http/errors.js';
import { database } from '../auth/security.js';
import { requireUuid, scopedTeamWhere } from '../teams/index.js';
import type { TeamActor } from '../teams/index.js';
import { parseFeedbackInput, FeedbackInputError } from '../../../../shared/feedback.mjs';
import type { FeedbackDto } from './dto.js';

export type FeedbackAuthContext = TeamActor;

const notFound = () => new AppError(404, 'NOT_FOUND', 'The requested resource was not found.');

type FeedbackWithSupervisor = Prisma.FeedbackGetPayload<{
  include: { supervisor: { select: { id: true; name: true } } };
}>;

function toFeedbackDto(row: FeedbackWithSupervisor): FeedbackDto {
  return {
    id: row.id,
    submissionId: row.submissionId,
    supervisor: {
      id: row.supervisor.id,
      displayName: row.supervisor.name,
    },
    content: row.content,
    clientRequestId: row.clientRequestId,
    createdAt: row.createdAt.toISOString(),
  };
}

export class FeedbackService {
  constructor(private readonly prisma: PrismaClient) {}

  /**
   * Helper: fetches a submission by ID and verifies scope using shared scopedTeamWhere.
   * Both missing submission and foreign-team submission return identical 404
   * to avoid leaking the existence of foreign records.
   */
  private async requireSubmissionAccess(submissionId: string, auth: FeedbackAuthContext) {
    requireUuid(submissionId);

    const submission = await database(() =>
      this.prisma.submission.findFirst({
        where: {
          id: submissionId,
          milestone: {
            team: scopedTeamWhere(auth),
          },
        },
        select: {
          id: true,
          milestoneId: true,
        },
      }),
    );

    if (!submission) {
      throw notFound();
    }

    return submission;
  }

  /**
   * Create feedback for an exact submission version.
   * - Supervisor role required.
   * - Enforces scope before checking clientRequestId.
   * - Idempotency: same supervisor + key + target + content returns 200 replay.
   * - Same key + different target or content returns 409 REQUEST_KEY_REUSED.
   */
  async createFeedback(
    submissionId: string,
    body: unknown,
    auth: FeedbackAuthContext,
  ): Promise<{ status: 200 | 201; data: FeedbackDto }> {
    if (auth.role !== 'supervisor') {
      throw new AppError(403, 'FORBIDDEN', 'This action is not allowed for your role.');
    }

    let input: { content: string; clientRequestId: string };
    try {
      input = parseFeedbackInput(body);
    } catch (error) {
      if (error instanceof FeedbackInputError) {
        throw new AppError(400, 'INVALID_INPUT', error.message, error.fields);
      }
      throw error;
    }

    // Enforce scope BEFORE idempotency lookup (§9.5) to avoid cross-tenant probing
    const submission = await this.requireSubmissionAccess(submissionId, auth);

    // Check existing feedback with this clientRequestId for this supervisor
    const existing = await database(() =>
      this.prisma.feedback.findUnique({
        where: {
          supervisorId_clientRequestId: {
            supervisorId: auth.userId,
            clientRequestId: input.clientRequestId,
          },
        },
        include: { supervisor: { select: { id: true, name: true } } },
      }),
    );

    if (existing) {
      if (existing.submissionId === submission.id && existing.content === input.content) {
        // Same request replay (§9.5: returns existing record with 200)
        return { status: 200, data: toFeedbackDto(existing) };
      }
      // Conflicting intent reuse
      throw new AppError(
        409,
        'REQUEST_KEY_REUSED',
        'The request key has already been used for different feedback content or target.',
      );
    }

    // Insert new feedback
    try {
      const created = await database(() =>
        this.prisma.feedback.create({
          data: {
            submissionId: submission.id,
            supervisorId: auth.userId,
            content: input.content,
            clientRequestId: input.clientRequestId,
          },
          include: { supervisor: { select: { id: true, name: true } } },
        }),
      );
      return { status: 201, data: toFeedbackDto(created) };
    } catch (err: unknown) {
      // Handle concurrent insert race condition on unique [supervisorId, clientRequestId]
      if (typeof err === 'object' && err !== null && 'code' in err && (err as { code: string }).code === 'P2002') {
        const raced = await database(() =>
          this.prisma.feedback.findUnique({
            where: {
              supervisorId_clientRequestId: {
                supervisorId: auth.userId,
                clientRequestId: input.clientRequestId,
              },
            },
            include: { supervisor: { select: { id: true, name: true } } },
          }),
        );
        if (raced && raced.submissionId === submission.id && raced.content === input.content) {
          return { status: 200, data: toFeedbackDto(raced) };
        }
        throw new AppError(
          409,
          'REQUEST_KEY_REUSED',
          'The request key has already been used for different feedback content or target.',
        );
      }
      throw err;
    }
  }

  /**
   * List feedback for a submission in chronological order.
   * Both assigned supervisor and team members can read.
   */
  async listFeedback(submissionId: string, auth: FeedbackAuthContext): Promise<FeedbackDto[]> {
    const submission = await this.requireSubmissionAccess(submissionId, auth);

    const items = await database(() =>
      this.prisma.feedback.findMany({
        where: { submissionId: submission.id },
        orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
        include: { supervisor: { select: { id: true, name: true } } },
      }),
    );

    return items.map(toFeedbackDto);
  }
}
