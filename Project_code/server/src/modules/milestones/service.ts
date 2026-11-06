// Milestone domain service — B owns (R1-B01).
// Encapsulates scoped queries, supervisor checks, future dueAt validation, and DTO projection.

import type { PrismaClient } from '../../db/generated/client/index.js';
import { AppError } from '../../http/errors.js';
import type { CreateMilestoneInput, MilestoneDto } from './dto.js';

export interface MilestoneAuthContext {
  userId: string;
  role: 'student' | 'supervisor';
}

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export class MilestoneService {
  constructor(private readonly prisma: PrismaClient) {}

  /**
   * Helper: verify user has access to this team.
   * - Supervisor: must be the assigned supervisor for this team.
   * - Student: must be a member of this team.
   */
  private async assertTeamAccess(teamId: string, auth: MilestoneAuthContext): Promise<void> {
    if (!UUID_REGEX.test(teamId)) {
      throw new AppError(400, 'INVALID_INPUT', 'Team ID must be a valid UUID');
    }

    const team = await this.prisma.team.findUnique({
      where: { id: teamId },
      include: { members: true },
    });

    if (!team) {
      // 404 does not reveal existence of out-of-scope records
      throw new AppError(404, 'NOT_FOUND', 'Team not found or access denied');
    }

    if (auth.role === 'supervisor') {
      if (team.supervisorId !== auth.userId) {
        throw new AppError(404, 'NOT_FOUND', 'Team not found or access denied');
      }
    } else if (auth.role === 'student') {
      const isMember = team.members.some((m) => m.studentId === auth.userId);
      if (!isMember) {
        throw new AppError(404, 'NOT_FOUND', 'Team not found or access denied');
      }
    } else {
      throw new AppError(403, 'FORBIDDEN', 'Access denied');
    }
  }

  /**
   * Create a milestone for a team.
   * Only assigned supervisor can create.
   */
  async createMilestone(
    teamId: string,
    input: CreateMilestoneInput,
    auth: MilestoneAuthContext,
  ): Promise<MilestoneDto> {
    if (auth.role !== 'supervisor') {
      throw new AppError(403, 'FORBIDDEN', 'Only assigned supervisor can create milestones');
    }

    await this.assertTeamAccess(teamId, auth);

    // Title validation: min 1, max 120 (per canonical schema bounds G1-05 / BR-08)
    const title = (input.title ?? '').trim();
    if (!title || title.length > 120) {
      throw new AppError(400, 'INVALID_INPUT', 'Title is required and must not exceed 120 characters', {
        title: 'Title must be between 1 and 120 characters',
      });
    }

    // Description validation: max 2000 chars
    const description = (input.description ?? '').trim();
    if (description.length > 2000) {
      throw new AppError(400, 'INVALID_INPUT', 'Description must not exceed 2000 characters', {
        description: 'Description exceeds maximum allowed length',
      });
    }

    if (!input.dueAt) {
      throw new AppError(400, 'INVALID_INPUT', 'dueAt is required', {
        dueAt: 'dueAt timestamp is required',
      });
    }

    // Must be valid ISO 8601 with explicit timezone (Z or +HH:mm/-HH:mm)
    const isoWithTzRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})$/;
    if (!isoWithTzRegex.test(input.dueAt)) {
      throw new AppError(400, 'INVALID_INPUT', 'dueAt must be a valid ISO 8601 string with explicit timezone', {
        dueAt: 'Timezone offset or Z required',
      });
    }

    const dueDate = new Date(input.dueAt);
    if (isNaN(dueDate.getTime())) {
      throw new AppError(400, 'INVALID_INPUT', 'dueAt is an invalid date', {
        dueAt: 'Invalid date value',
      });
    }

    if (dueDate.getTime() <= Date.now()) {
      throw new AppError(400, 'INVALID_INPUT', 'dueAt must be in the future', {
        dueAt: 'Deadline must be future dated',
      });
    }

    const milestone = await this.prisma.milestone.create({
      data: {
        teamId,
        title,
        description,
        dueAt: dueDate,
        createdById: auth.userId,
      },
    });

    return {
      id: milestone.id,
      teamId: milestone.teamId,
      title: milestone.title,
      description: milestone.description,
      dueAt: milestone.dueAt.toISOString(),
      cancelledAt: null,
      createdAt: milestone.createdAt.toISOString(),
      latestSubmission: null,
    };
  }

  /**
   * List all milestones for a team with latest submission projection.
   * Ordered by dueAt asc, id asc.
   */
  async listMilestones(teamId: string, auth: MilestoneAuthContext): Promise<MilestoneDto[]> {
    await this.assertTeamAccess(teamId, auth);

    const milestones = await this.prisma.milestone.findMany({
      where: { teamId },
      include: {
        submissions: {
          orderBy: { version: 'desc' },
          take: 1,
          include: {
            _count: {
              select: { feedback: true },
            },
          },
        },
      },
      orderBy: [{ dueAt: 'asc' }, { id: 'asc' }],
    });

    return milestones.map((m) => {
      const latest = m.submissions[0];
      return {
        id: m.id,
        teamId: m.teamId,
        title: m.title,
        description: m.description,
        dueAt: m.dueAt.toISOString(),
        cancelledAt: m.cancelledAt ? m.cancelledAt.toISOString() : null,
        createdAt: m.createdAt.toISOString(),
        latestSubmission: latest
          ? {
              id: latest.id,
              version: latest.version,
              submittedAt: latest.submittedAt.toISOString(),
              feedbackCount: latest._count.feedback,
            }
          : null,
      };
    });
  }

  /**
   * Get single milestone detail with latest submission projection.
   */
  async getMilestone(id: string, auth: MilestoneAuthContext): Promise<MilestoneDto> {
    if (!UUID_REGEX.test(id)) {
      throw new AppError(400, 'INVALID_INPUT', 'Milestone ID must be a valid UUID');
    }

    const milestone = await this.prisma.milestone.findUnique({
      where: { id },
      include: {
        submissions: {
          orderBy: { version: 'desc' },
          take: 1,
          include: {
            _count: {
              select: { feedback: true },
            },
          },
        },
      },
    });

    if (!milestone) {
      throw new AppError(404, 'NOT_FOUND', 'Milestone not found or access denied');
    }

    await this.assertTeamAccess(milestone.teamId, auth);

    const latest = milestone.submissions[0];
    return {
      id: milestone.id,
      teamId: milestone.teamId,
      title: milestone.title,
      description: milestone.description,
      dueAt: milestone.dueAt.toISOString(),
      cancelledAt: milestone.cancelledAt ? milestone.cancelledAt.toISOString() : null,
      createdAt: milestone.createdAt.toISOString(),
      latestSubmission: latest
        ? {
            id: latest.id,
            version: latest.version,
            submittedAt: latest.submittedAt.toISOString(),
            feedbackCount: latest._count.feedback,
          }
        : null,
    };
  }
}
