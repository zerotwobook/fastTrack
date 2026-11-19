import { describe, expect, it } from 'vitest';
import type { MilestoneDto } from '../milestones/dto.js';
import { calculateProgress } from './calculation.js';

const at = new Date('2030-06-01T11:30:00.000Z');
const submitted = { id: 'work-1', version: 1, submittedAt: at.toISOString(), feedbackCount: 0 };

function milestone(id: string, overrides: Partial<MilestoneDto> = {}): MilestoneDto {
  return {
    id, teamId: 'team-a', title: id, description: 'Synthetic milestone for progress calculation.',
    dueAt: at.toISOString(), cancelledAt: null, createdAt: '2030-05-01T00:00:00.000Z',
    latestSubmission: null, ...overrides,
  };
}

describe('F-07 progress calculation', () => {
  it('counts submitted milestones once and excludes cancelled history from both totals', () => {
    const rows = [
      milestone('cancelled', { cancelledAt: at.toISOString(), latestSubmission: { ...submitted, feedbackCount: 3 } }),
      milestone('feedback', { latestSubmission: { ...submitted, version: 2, feedbackCount: 1 } }),
      milestone('revision', { latestSubmission: { ...submitted, version: 3 }, dueAt: '2030-06-01T11:29:59.999Z' }),
      milestone('submitted', { latestSubmission: submitted }),
      milestone('due-now'),
    ];
    Object.freeze(rows);
    for (const row of rows) Object.freeze(row);
    const snapshot = calculateProgress(rows, at);
    expect(snapshot).toMatchObject({ total: 4, submitted: 3, progressPercent: 75 });
    expect(snapshot.milestones.map(row => row.status)).toEqual([
      'CANCELLED', 'FEEDBACK_AVAILABLE', 'SUBMITTED', 'SUBMITTED', 'PENDING',
    ]);
    expect(snapshot.milestones.map(row => row.id)).toEqual(rows.map(row => row.id));
    expect(rows[0]).not.toHaveProperty('status');
  });

  it('retains cancelled rows and returns a finite zero for an empty denominator', () => {
    const empty = calculateProgress([], at);
    expect(empty).toEqual({ total: 0, submitted: 0, progressPercent: 0, milestones: [] });
    const cancelled = calculateProgress([milestone('cancelled', { cancelledAt: at.toISOString() })], at);
    expect(cancelled).toMatchObject({ total: 0, submitted: 0, progressPercent: 0, milestones: [{ status: 'CANCELLED' }] });
  });

  it('uses the supplied time and treats one millisecond after the deadline as overdue', () => {
    const due = milestone('boundary');
    expect(calculateProgress([due], new Date(at.getTime() - 1)).milestones[0]?.status).toBe('PENDING');
    expect(calculateProgress([due], at).milestones[0]?.status).toBe('PENDING');
    expect(calculateProgress([due], new Date(at.getTime() + 1)).milestones[0]?.status).toBe('OVERDUE');
  });

  it('rounds once to one decimal and uses counts when combining scoped rows for a future summary', () => {
    const completed = milestone('completed', { latestSubmission: submitted });
    const pending = Array.from({ length: 9 }, (_, index) => milestone(`pending-${index}`, { teamId: 'team-b' }));
    expect(calculateProgress([completed, ...pending.slice(0, 2)], at).progressPercent).toBe(33.3);
    expect(calculateProgress([completed, ...pending], at)).toMatchObject({ total: 10, submitted: 1, progressPercent: 10 });
  });
});
