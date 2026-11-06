export interface SubmissionInput { title: string; description: string; url: string }
export class SubmissionInputError extends Error {
  readonly fields: Readonly<Record<string, string>>;
  constructor(fields: Readonly<Record<string, string>>);
}
export function isWorkUrl(value: unknown): value is string;
export function parseSubmissionInput(value: unknown): SubmissionInput;
