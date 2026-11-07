/** Browser-safe canonical validation shared by the client and API. */
export class MilestoneInputError extends Error {
  constructor(fields) { super('Check the highlighted milestone fields.'); this.fields = Object.freeze({ ...fields }); }
}
export const codePointLength = value => Array.from(value).length;

export function parseTimestamp(value) {
  const match = typeof value === 'string' && /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.(\d{1,3}))?(Z|[+-]\d{2}:\d{2})$/.exec(value);
  const fail = () => { throw new MilestoneInputError({ dueAt: 'Enter a valid date with a timezone and at most three fractional digits.' }); };
  if (!match) return fail();
  const [, yearText, monthText, dayText, hourText, minuteText, secondText, fraction = '', zone] = match;
  const [year, month, day, hour, minute, second] = [yearText, monthText, dayText, hourText, minuteText, secondText].map(Number);
  if (month < 1 || month > 12 || day < 1 || day > 31 || hour > 23 || minute > 59 || second > 59) return fail();
  const wall = new Date(0);
  wall.setUTCFullYear(year, month - 1, day); wall.setUTCHours(hour, minute, second, Number(fraction.padEnd(3, '0')));
  if (wall.getUTCFullYear() !== year || wall.getUTCMonth() !== month - 1 || wall.getUTCDate() !== day) return fail();
  let offset = 0;
  if (zone !== 'Z') {
    const hours = Number(zone.slice(1, 3)); const minutes = Number(zone.slice(4));
    if (hours > 23 || minutes > 59) return fail();
    offset = (hours * 60 + minutes) * (zone[0] === '+' ? 1 : -1);
  }
  return new Date(wall.getTime() - offset * 60_000);
}

export function parseMilestoneInput(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new MilestoneInputError({ form: 'Provide title, description and dueAt.' });
  const fields = {};
  if (Object.keys(value).some(key => !['title', 'description', 'dueAt'].includes(key))) fields.form = 'Use only title, description and dueAt.';
  const title = typeof value.title === 'string' ? value.title.trim() : '';
  const description = typeof value.description === 'string' ? value.description.trim() : '';
  if (!title || codePointLength(title) > 120) fields.title = 'Use 1-120 characters after trimming.';
  if (!description || codePointLength(description) > 4000) fields.description = 'Use 1-4,000 characters after trimming.';
  if (/[\u0000\uD800-\uDFFF]/u.test(title)) fields.title = 'Remove unsupported characters from the title.';
  if (/[\u0000\uD800-\uDFFF]/u.test(description)) fields.description = 'Remove unsupported characters from the description.';
  let dueAt;
  try { dueAt = parseTimestamp(value.dueAt).toISOString(); }
  catch (error) { Object.assign(fields, error.fields); }
  if (Object.keys(fields).length) throw new MilestoneInputError(fields);
  return { title, description, dueAt };
}

/** The input label promises Bangkok time, independent of the browser host zone. */
export function bangkokInputToIso(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2})?$/.test(value)) {
    throw new MilestoneInputError({ dueAt: 'Enter the deadline in Asia/Bangkok.' });
  }
  return parseTimestamp(`${value.length === 16 ? `${value}:00` : value}+07:00`).toISOString();
}
