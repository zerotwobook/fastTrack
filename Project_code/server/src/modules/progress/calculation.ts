import type { LatestSubmissionSummary, MilestoneDto } from '../milestones/dto.js';

export type ProgressStatus = 'CANCELLED' | 'FEEDBACK_AVAILABLE' | 'SUBMITTED' | 'OVERDUE' | 'PENDING';

interface ProgressMilestone {
  cancelledAt: string | Date | null;
  dueAt: string | Date;
  latestSubmission: Pick<LatestSubmissionSummary, 'feedbackCount'> | null;
}

export function progressStatus(milestone: ProgressMilestone, asOfMs: number): ProgressStatus {
  if (milestone.cancelledAt !== null) return 'CANCELLED';
  if (milestone.latestSubmission) {
    return milestone.latestSubmission.feedbackCount > 0 ? 'FEEDBACK_AVAILABLE' : 'SUBMITTED';
  }
  const dueAtMs = typeof milestone.dueAt === 'string' ? Date.parse(milestone.dueAt) : milestone.dueAt.getTime();
  return asOfMs > dueAtMs ? 'OVERDUE' : 'PENDING';
}

export function submissionProgressPercent(submitted: number, total: number): number {
  return total === 0 ? 0 : Math.round(submitted * 1000 / total) / 10;
}

/** Calculate submission progress from the caller's scoped, ordered milestone snapshot. */
export function calculateProgress(milestones: readonly MilestoneDto[], asOf: Date) {
  const asOfMs = asOf.getTime();
  let total = 0;
  let submitted = 0;
  const rows = milestones.map(milestone => {
    const status = progressStatus(milestone, asOfMs);
    if (status !== 'CANCELLED') {
      total++;
      if (milestone.latestSubmission) submitted++;
    }
    return { ...milestone, status };
  });
  const progressPercent = submissionProgressPercent(submitted, total);
  return { total, submitted, progressPercent, milestones: rows };
}
