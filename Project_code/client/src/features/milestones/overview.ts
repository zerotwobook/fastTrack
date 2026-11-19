import type { MilestoneItem } from './MilestoneTrack';

/** Server time decides eligibility; cancelled/submitted rows never become pending. */
export function groupStudentMilestones(items: readonly MilestoneItem[], serverTime: string) {
  const groups: Record<'actionable' | 'overdue' | 'submitted' | 'cancelled', MilestoneItem[]> = { actionable: [], overdue: [], submitted: [], cancelled: [] };
  const ordered = [...items].sort((a, b) => Date.parse(a.dueAt) - Date.parse(b.dueAt) || a.id.localeCompare(b.id));
  for (const item of ordered) {
    const group = item.cancelledAt ? 'cancelled' : item.latestSubmission ? 'submitted' : Date.parse(item.dueAt) < Date.parse(serverTime) ? 'overdue' : 'actionable';
    groups[group].push(item);
  }
  return groups;
}

export interface MilestonePlanningState {
  readonly canEdit: boolean;
  readonly canCancel: boolean;
  readonly lockedReason: string | null;
  readonly canCreateAnother: boolean;
}

/** Derive supervisor edit/cancel eligibility and honest locked reasons from saved state. */
export function describeMilestonePlanning(item: MilestoneItem, userRole: 'student' | 'supervisor'): MilestonePlanningState {
  if (userRole !== 'supervisor') {
    return { canEdit: false, canCancel: false, lockedReason: null, canCreateAnother: false };
  }
  if (item.cancelledAt) {
    return {
      canEdit: false,
      canCancel: false,
      lockedReason: 'This milestone was cancelled and cannot be edited or cancelled again.',
      canCreateAnother: true,
    };
  }
  if (item.latestSubmission) {
    return {
      canEdit: false,
      canCancel: false,
      lockedReason: 'A submission already exists for this milestone, so it cannot be edited or cancelled.',
      canCreateAnother: true,
    };
  }
  return { canEdit: true, canCancel: true, lockedReason: null, canCreateAnother: false };
}
