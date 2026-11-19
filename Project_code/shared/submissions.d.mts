export interface SubmissionInput { title: string; description: string; url: string }
export interface RevisionInput extends SubmissionInput { expectedVersion: number }
export const MAX_SUBMISSION_VERSION: number;
export class SubmissionInputError extends Error {
  readonly fields: Readonly<Record<string, string>>;
  constructor(fields: Readonly<Record<string, string>>);
}
export function isWorkUrl(value: unknown): value is string;
export function parseSubmissionInput(value: unknown): SubmissionInput;
export function parseRevisionInput(value: unknown): RevisionInput;
