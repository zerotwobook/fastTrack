// Milestone feature DTOs — B owns (R1-B01).
// Per project_detail.md §9.4 and sprint-1-module-boundaries.md.
// Allowlist fields only; never serialize raw database models.

export interface LatestSubmissionSummary {
  id: string;
  version: number;
  submittedAt: string; // ISO 8601
  feedbackCount: number;
}

export interface MilestoneDto {
  id: string;
  teamId: string;
  title: string;
  description: string;
  dueAt: string; // ISO 8601
  cancelledAt: string | null;
  createdAt: string; // ISO 8601
  latestSubmission: LatestSubmissionSummary | null;
}

export interface CreateMilestoneInput {
  title: string;
  description: string;
  dueAt: string; // ISO 8601 with timezone
}
