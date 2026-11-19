import type { PrismaClient } from '../../db/generated/client/index.js';
import { AppError } from '../../http/errors.js';
import { lockScopedMilestone, lockScopedTeam, runDomainTransaction } from '../shared/transactions.js';
import { requireUuid, scopedTeamWhere } from '../teams/index.js';
import type { TeamActor } from '../teams/index.js';
import { MAX_SUBMISSION_VERSION, parseRevisionInput, SubmissionInputError } from '../../../../shared/submissions.mjs';
import { submissionDto, submissionSelect } from './dto.js';
import { isSubmissionUniqueConflict, submissionDatabaseClock } from './service.js';
import type { SubmissionClock } from './service.js';

const notFound = () => new AppError(404, 'NOT_FOUND', 'The requested resource was not found.');
const versionConflict = () => new AppError(
  409,
  'VERSION_CONFLICT',
  'A newer submission version already exists. Review the latest version before submitting a revision.',
);
const unavailable = () => new AppError(
  503,
  'TEMPORARILY_UNAVAILABLE',
  'The result could not be confirmed. Inspect saved submissions before submitting another revision.',
);

export class RevisionService {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly clock: SubmissionClock = submissionDatabaseClock,
  ) {
    if (clock !== submissionDatabaseClock && process.env['NODE_ENV'] !== 'test') {
      throw new TypeError('A submission clock override is restricted to internal tests.');
    }
  }

  /** Append one atomic next-version revision preserving all prior versions and feedback links. */
  async revise(id: string, value: unknown, auth: TeamActor) {
    if (auth.role !== 'student') throw new AppError(403, 'FORBIDDEN', 'Only a student on this team can submit work.');
    requireUuid(id);
    let input;
    try { input = parseRevisionInput(value); }
    catch (error) {
      if (error instanceof SubmissionInputError) throw new AppError(400, 'INVALID_INPUT', error.message, error.fields);
      throw error;
    }

    return runDomainTransaction(this.prisma, async tx => {
      const initial = await tx.milestone.findFirst({ where: { id, team: scopedTeamWhere(auth) }, select: { teamId: true } });
      if (!initial) throw notFound();
      await lockScopedTeam(tx, auth, initial.teamId);
      const milestone = await lockScopedMilestone(tx, auth, initial.teamId, id);
      if (milestone.cancelledAt) {
        throw new AppError(409, 'MILESTONE_CANCELLED', 'This milestone was cancelled and cannot receive work.');
      }
      const latest = await tx.submission.findFirst({
        where: { milestoneId: id },
        orderBy: [{ version: 'desc' }, { id: 'asc' }],
        select: { id: true, version: true },
      });
      if (!latest) {
        throw new AppError(409, 'SUBMISSION_REQUIRED', 'Submit initial work before creating a revision.');
      }
      if (latest.version !== input.expectedVersion) {
        throw versionConflict();
      }
      if (latest.version >= MAX_SUBMISSION_VERSION) {
        throw new AppError(409, 'VERSION_LIMIT_REACHED', 'This milestone has reached the maximum supported submission version.');
      }
      const acceptedAt = await this.clock(tx);
      if (acceptedAt.getTime() > milestone.dueAt.getTime()) {
        throw new AppError(409, 'DEADLINE_PASSED', 'The deadline has passed. Your work was not saved.');
      }
      const saved = await tx.submission.create({
        data: {
          milestoneId: id,
          submittedById: auth.userId,
          version: latest.version + 1,
          title: input.title,
          description: input.description,
          url: input.url,
          submittedAt: acceptedAt,
        },
        select: submissionSelect,
      });
      return submissionDto(saved);
    }, error => isSubmissionUniqueConflict(error) ? versionConflict() : unavailable());
  }
}
