import { MAX_SUBMISSION_VERSION } from '../../../../shared/submissions.mjs';
import type { MilestoneItem } from '../milestones/MilestoneTrack';
import type { SubmissionRecord } from './Submission';

export interface SubmissionHistorySummary {
  readonly orderedHistory: readonly SubmissionRecord[];
  readonly latest: SubmissionRecord | null;
  readonly isOldVersion: boolean;
}

/** Order history descending by version with ID tie-break and flag non-latest views. */
export function describeSubmissionHistory(
  current: SubmissionRecord,
  history: readonly SubmissionRecord[],
): SubmissionHistorySummary {
  const orderedHistory = [...history].sort((a, b) => b.version - a.version || a.id.localeCompare(b.id));
  const latest = orderedHistory[0] ?? null;
  return {
    orderedHistory,
    latest,
    isOldVersion: latest !== null && current.id !== latest.id,
  };
}

export function describeRevisionRestriction(
  milestone: Pick<MilestoneItem, 'cancelledAt' | 'dueAt'>,
  serverTime: string,
  latestVersion: number,
): string | null {
  if (milestone.cancelledAt) return 'This milestone was cancelled and cannot receive revisions.';
  if (latestVersion >= MAX_SUBMISSION_VERSION) return 'This milestone has reached the maximum supported submission version.';
  if (Date.parse(serverTime) > Date.parse(milestone.dueAt)) return 'The deadline has passed. New revisions cannot be submitted.';
  return null;
}
