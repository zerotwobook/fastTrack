import type { MilestoneDto } from '../milestones/dto.js';

export type ProgressStatus = 'CANCELLED' | 'FEEDBACK_AVAILABLE' | 'SUBMITTED' | 'OVERDUE' | 'PENDING';

function statusOf(milestone: MilestoneDto, asOfMs: number): ProgressStatus {
  if (milestone.cancelledAt !== null) return 'CANCELLED';
  if (milestone.latestSubmission) {
    return milestone.latestSubmission.feedbackCount > 0 ? 'FEEDBACK_AVAILABLE' : 'SUBMITTED';
  }
  return asOfMs > Date.parse(milestone.dueAt) ? 'OVERDUE' : 'PENDING';
}

/** Calculate submission progress from the caller's scoped, ordered milestone snapshot. */
export function calculateProgress(milestones: readonly MilestoneDto[], asOf: Date) {
  const asOfMs = asOf.getTime();
  let total = 0;
  let submitted = 0;
  const rows = milestones.map(milestone => {
    const status = statusOf(milestone, asOfMs);
    if (status !== 'CANCELLED') {
      total++;
      if (milestone.latestSubmission) submitted++;
    }
    return { ...milestone, status };
  });
  const progressPercent = total === 0 ? 0 : Math.round(submitted * 1000 / total) / 10;
  return { total, submitted, progressPercent, milestones: rows };
}
