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

export function parseSubmissionInput(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new SubmissionInputError({ form: 'Provide an object with title, description and url.' });
  }
  const fields = {};
  if (Object.keys(value).some(key => !['title', 'description', 'url'].includes(key))) {
    fields.form = 'Only title, description and url are accepted.';
  }
  const result = {};
  for (const [key, maximum] of [['title', 120], ['description', 4000], ['url', 2048]]) {
    if (typeof value[key] !== 'string') {
      fields[key] = 'Enter a value using text.';
      continue;
    }
    const text = value[key].trim();
    if (codePointLength(text) < 1 || codePointLength(text) > maximum) {
      fields[key] = `Enter between 1 and ${maximum.toLocaleString('en-US')} characters.`;
    }
    result[key] = text;
  }
  if (result.url && !isWorkUrl(result.url)) fields.url = 'Use a complete http:// or https:// link without embedded credentials.';
  if (Object.keys(fields).length) throw new SubmissionInputError(fields);
  return result;
}
