import { codePointLength } from './milestones.mjs';

export class TeamNameInputError extends Error {}

export function parseTeamName(value) {
  const name = typeof value === 'string' ? value.trim() : '';
  if (!name || codePointLength(name) > 120) {
    throw new TeamNameInputError('Enter a team name with 1–120 characters after trimming.');
  }
  if (/[\u0000\uD800-\uDFFF]/u.test(name)) {
    throw new TeamNameInputError('Use valid Unicode text without a null character.');
  }
  return name;
}
