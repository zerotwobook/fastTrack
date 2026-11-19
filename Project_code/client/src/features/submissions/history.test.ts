import { describe, expect, it } from 'vitest';
import { describeSubmissionHistory } from './history';
import type { SubmissionRecord } from './Submission';

const entry = (id: string, version: number): SubmissionRecord => ({
  id,
  milestoneId: 'milestone-1',
  submittedBy: { id: 'stu-1', displayName: 'Student A1' },
  version,
  title: `Submission v${version}`,
  description: 'Synthetic submission body.',
  url: `https://example.edu/v${version}`,
  submittedAt: '2030-01-01T12:00:00.000Z',
});

describe('F-06 submission history helpers', () => {
  it('identifies old-version views without mutating the source array and exposes the latest entry', () => {
    const v1 = entry('sub-1', 1);
    const v2 = entry('sub-2', 2);
    const input = [v1, v2];

    const oldSummary = describeSubmissionHistory(v1, input);
    expect(oldSummary.orderedHistory.map(row => row.version)).toEqual([2, 1]);
    expect(oldSummary.latest?.id).toBe('sub-2');
    expect(oldSummary.isOldVersion).toBe(true);
    expect(input.map(row => row.version)).toEqual([1, 2]);

    const latestSummary = describeSubmissionHistory(v2, input);
    expect(latestSummary.isOldVersion).toBe(false);
    expect(latestSummary.latest?.id).toBe('sub-2');
  });

  it('uses ascending ID tie-break if identical versions exist and handles empty history safely', () => {
    const b = entry('b-id', 2);
    const a = entry('a-id', 2);
    const tied = describeSubmissionHistory(b, [b, a]);
    expect(tied.orderedHistory.map(row => row.id)).toEqual(['a-id', 'b-id']);

    const empty = describeSubmissionHistory(entry('sub-1', 1), []);
    expect(empty.latest).toBeNull();
    expect(empty.isOldVersion).toBe(false);
  });
});
