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
