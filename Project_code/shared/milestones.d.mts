export class MilestoneInputError extends Error {
  readonly fields: Readonly<Record<string, string>>;
  constructor(fields: Readonly<Record<string, string>>);
}
export function codePointLength(value: string): number;
export function parseTimestamp(value: unknown): Date;
export function parseMilestoneInput(value: unknown): { title: string; description: string; dueAt: string };
export function bangkokInputToIso(value: string): string;
