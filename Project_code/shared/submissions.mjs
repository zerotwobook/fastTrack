import { codePointLength } from './milestones.mjs';

export class SubmissionInputError extends Error {
  constructor(fields) {
    super('Check the highlighted fields.');
    this.name = 'SubmissionInputError';
    this.fields = fields;
  }
}

export function isWorkUrl(value) {
  if (typeof value !== 'string' || !/^https?:\/\//i.test(value) || /[\s\\\u0000-\u001f\u007f]/u.test(value)) return false;
  try {
    const parsed = new URL(value);
    return ['http:', 'https:'].includes(parsed.protocol) && !!parsed.hostname && !parsed.username && !parsed.password;
  } catch { return false; }
}

export const MAX_SUBMISSION_VERSION = 2_147_483_647;

function parseSubmissionFields(value, allowedKeys, shapeMessage, keysMessage) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new SubmissionInputError({ form: shapeMessage });
  }
  const fields = {};
  if (Object.keys(value).some(key => !allowedKeys.includes(key))) {
    fields.form = keysMessage;
  }
  const result = {};
  for (const [key, maximum] of [['title', 120], ['description', 4000], ['url', 2048]]) {
    if (typeof value[key] !== 'string') {
      fields[key] = 'Enter a value using text.';
      continue;
    }
    const text = value[key].trim();
    if (/[\u0000\uD800-\uDFFF]/u.test(text)) {
      fields[key] = 'Use valid Unicode text without a null character.';
    } else if (codePointLength(text) < 1 || codePointLength(text) > maximum) {
      fields[key] = `Enter between 1 and ${maximum.toLocaleString('en-US')} characters.`;
    }
    result[key] = text;
  }
  if (result.url && !isWorkUrl(result.url)) fields.url = 'Use a complete http:// or https:// link without embedded credentials.';
  return { fields, result };
}

export function parseSubmissionInput(value) {
  const { fields, result } = parseSubmissionFields(
    value,
    ['title', 'description', 'url'],
    'Provide an object with title, description and url.',
    'Only title, description and url are accepted.',
  );
  if (Object.keys(fields).length) throw new SubmissionInputError(fields);
  return result;
}

export function parseRevisionInput(value) {
  const { fields, result } = parseSubmissionFields(
    value,
    ['title', 'description', 'url', 'expectedVersion'],
    'Provide an object with title, description, url and expectedVersion.',
    'Only title, description, url and expectedVersion are accepted.',
  );
  const expected = value && typeof value === 'object' && !Array.isArray(value) ? value.expectedVersion : undefined;
  if (typeof expected !== 'number' || !Number.isSafeInteger(expected) || expected < 1 || expected > MAX_SUBMISSION_VERSION) {
    fields.expectedVersion = 'Enter a whole expected version between 1 and 2,147,483,647.';
  }
  if (Object.keys(fields).length) throw new SubmissionInputError(fields);
  return { ...result, expectedVersion: expected };
}
