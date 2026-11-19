import { describe, expect, it } from 'vitest';
import type { MilestoneItem } from './MilestoneTrack';
import { describeMilestonePlanning, groupStudentMilestones } from './overview';
const now = '2030-01-01T12:00:00.000Z';
const item = (id: string, dueAt = now, extra: Partial<MilestoneItem> = {}): MilestoneItem => ({ id, teamId: 'team', title: id, description: 'Work', dueAt, createdAt: now, cancelledAt: null, latestSubmission: null, ...extra });
const saved = { id: 'submission', version: 1, submittedAt: now, feedbackCount: 0 };
describe('Student overview prioritization from authoritative server time', () => {
  it('separates actionable, overdue, submitted and cancelled rows without dropping or duplicating work', () => {
    const rows = [item('past', '2030-01-01T11:59:59.999Z'), item('next', '2030-01-02T12:00:00Z'),
      item('saved-past', '2029-01-01T12:00:00Z', { latestSubmission: saved }), item('cancelled', now, { cancelledAt: now })];
    const grouped = groupStudentMilestones(rows, now);
    expect(grouped.actionable.map(row => row.id)).toEqual(['next']); expect(grouped.overdue.map(row => row.id)).toEqual(['past']);
    expect(grouped.submitted.map(row => row.id)).toEqual(['saved-past']); expect(grouped.cancelled.map(row => row.id)).toEqual(['cancelled']);
    expect(Object.values(grouped).flat().map(row => row.id).sort()).toEqual(rows.map(row => row.id).sort());
  });
  it('keeps the exact deadline equality actionable and the following millisecond overdue', () => {
    expect(groupStudentMilestones([item('equal')], now).actionable).toHaveLength(1);
    expect(groupStudentMilestones([item('equal')], '2030-01-01T12:00:00.001Z').overdue).toHaveLength(1);
  });
  it('sorts each group by dueAt then ID without mutating the API array', () => {
    const rows = [item('b'), item('future', '2030-01-02T12:00:00Z'), item('a')];
    expect(groupStudentMilestones(rows, now).actionable.map(row => row.id)).toEqual(['a', 'b', 'future']);
    expect(rows.map(row => row.id)).toEqual(['b', 'future', 'a']);
  });
  it('never offers submitted or cancelled work as actionable even before its deadline', () => {
    const grouped = groupStudentMilestones([item('saved', now, { latestSubmission: saved }), item('cancelled', now, { cancelledAt: now, latestSubmission: saved })], now);
    expect(grouped.actionable).toEqual([]); expect(grouped.submitted.map(row => row.id)).toEqual(['saved']); expect(grouped.cancelled.map(row => row.id)).toEqual(['cancelled']);
  });
});

describe('F-05B supervisor planning state and locked reasons', () => {
  it('permits edit and cancel only for supervisors on active unsubmitted milestones', () => {
    expect(describeMilestonePlanning(item('active'), 'supervisor')).toEqual({
      canEdit: true,
      canCancel: true,
      lockedReason: null,
      canCreateAnother: false,
    });
    expect(describeMilestonePlanning(item('active'), 'student')).toEqual({
      canEdit: false,
      canCancel: false,
      lockedReason: null,
      canCreateAnother: false,
    });
  });

  it('explains why submitted and cancelled milestones are locked and allows creating another milestone', () => {
    const withSubmission = describeMilestonePlanning(item('saved', now, { latestSubmission: saved }), 'supervisor');
    expect(withSubmission.canEdit).toBe(false);
    expect(withSubmission.canCancel).toBe(false);
    expect(withSubmission.canCreateAnother).toBe(true);
    expect(withSubmission.lockedReason).toContain('submission already exists');

    const cancelled = describeMilestonePlanning(item('cancelled', now, { cancelledAt: now }), 'supervisor');
    expect(cancelled.canEdit).toBe(false);
    expect(cancelled.canCancel).toBe(false);
    expect(cancelled.canCreateAnother).toBe(true);
    expect(cancelled.lockedReason).toContain('cancelled');
  });
});
