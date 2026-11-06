import { describe, expect, it } from 'vitest';
import { bangkokInputToIso, codePointLength, MilestoneInputError, parseMilestoneInput, parseTimestamp } from '../../../../shared/milestones.mjs';
const good = { title: 'Work', description: 'Complete this work.', dueAt: '2030-01-02T18:30:00+07:00' };
describe('Canonical milestone validation shared with the API', () => {
  it('counts trimmed Unicode code points and permits the full description bound', () => {
    const title = '\u{1f680}'.repeat(120);
    const result = parseMilestoneInput({ ...good, title: ` ${title} `, description: 'd'.repeat(4000) });
    expect(codePointLength(result.title)).toBe(120); expect(result.title).toBe(title); expect(result.description.length).toBe(4000);
  });
  it.each([null, [], { ...good, title: 3 }, { ...good, description: '' }, { ...good, createdById: 'forged' }, { ...good, title: 'x'.repeat(121) }])('rejects invalid/authoritative input %j', value => {
    expect(() => parseMilestoneInput(value)).toThrow(MilestoneInputError);
  });
  it.each(['2030-02-30T12:00:00Z', '2030-01-01T12:00:00.1234Z', '2030-01-01T12:00:00', '2030-01-01T12:00:00+24:00'])('rejects invalid timestamp %s', value => {
    expect(() => parseTimestamp(value)).toThrow(MilestoneInputError);
  });
  it('treats HH:mm as seconds 00 in Bangkok independent of host timezone', () => {
    expect(bangkokInputToIso('2030-01-02T18:30')).toBe('2030-01-02T11:30:00.000Z');
    expect(parseTimestamp(good.dueAt).toISOString()).toBe('2030-01-02T11:30:00.000Z');
  });
});
