import type { Prisma } from '../../db/generated/client/index.js';

export interface SubmissionDto {
  id: string;
  milestoneId: string;
  submittedBy: { id: string; displayName: string };
  version: number;
  title: string;
  description: string;
  url: string;
  submittedAt: string;
}

export const submissionSelect = {
  id: true, milestoneId: true, version: true, title: true, description: true, url: true, submittedAt: true,
  submittedBy: { select: { id: true, name: true } },
} satisfies Prisma.SubmissionSelect;

export function submissionDto(row: Prisma.SubmissionGetPayload<{ select: typeof submissionSelect }>): SubmissionDto {
  return {
    id: row.id, milestoneId: row.milestoneId,
    submittedBy: { id: row.submittedBy.id, displayName: row.submittedBy.name },
    version: row.version, title: row.title, description: row.description, url: row.url,
    submittedAt: row.submittedAt.toISOString(),
  };
}
