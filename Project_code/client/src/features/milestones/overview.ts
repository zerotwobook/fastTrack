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
