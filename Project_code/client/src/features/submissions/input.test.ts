import { describe, expect, it } from 'vitest';
import { isWorkUrl, parseSubmissionInput, SubmissionInputError } from '../../../../shared/submissions.mjs';

const valid = { title: 'Work', description: 'Required details', url: 'https://example.edu/work' };
describe('Shared first-submission input contracts', () => {
  it('trims work and preserves a validated URL without silently normalizing its content', () => {
    const url = 'https://EXAMPLE.edu/work?x=%2f#section';
    expect(parseSubmissionInput({ title: ' Work ', description: ' Details ', url: ` ${url} ` }))
      .toEqual({ title: 'Work', description: 'Details', url });
  });
  it('accepts exact Unicode code-point maxima in title and description', () => {
    expect(parseSubmissionInput({ ...valid, title: '\u{1f680}'.repeat(120), description: 'd'.repeat(4000) }).title).toHaveLength(240);
  });
  it.each([null, [], {}, { ...valid, title: false }, { ...valid, title: ' ' }, { ...valid, description: '\u00a0\ufeff' },
    { ...valid, title: 't'.repeat(121) }, { ...valid, description: 'd'.repeat(4001) }, { ...valid, submittedAt: '2030-01-01T00:00:00Z' },
    { ...valid, role: 'student' }, { ...valid, version: 1 }])('rejects malformed, empty, oversized or authoritative input %j', value => {
    expect(() => parseSubmissionInput(value)).toThrow(SubmissionInputError);
  });
  it.each(['javascript:alert(1)', '//example.edu/work', 'https:example.edu', 'ftp://example.edu', 'https://u:p@example.edu',
    'https://example.edu/a b', 'https://example.edu/\\evil', 'https://', 'https://example.edu/\nsecret'])('rejects an unsafe or incomplete work URL %s', url => {
    expect(isWorkUrl(url)).toBe(false);
    expect(() => parseSubmissionInput({ ...valid, url })).toThrow(SubmissionInputError);
  });
  it('accepts an exact 2,048-code-point URL and rejects one extra code point', () => {
    const prefix = 'https://example.edu/'; const url = prefix + 'x'.repeat(2048 - prefix.length);
    expect(parseSubmissionInput({ ...valid, url }).url).toBe(url);
    expect(() => parseSubmissionInput({ ...valid, url: url+'x' })).toThrow(SubmissionInputError);
  });
});
