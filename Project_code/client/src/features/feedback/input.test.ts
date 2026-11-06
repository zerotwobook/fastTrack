import { describe, it, expect } from 'vitest';
import {
  validateFeedbackContent,
  validateClientRequestId,
  validateSubmissionId,
  countCodePoints,
  parseFeedbackInput,
  FeedbackInputError,
} from '../../../../shared/feedback.mjs';

describe('Shared Feedback Input Validation', () => {
  it('counts Unicode code points accurately without surrogate pair splitting', () => {
    expect(countCodePoints('hello')).toBe(5);
    expect(countCodePoints('\u{1F44D}\u{1F389}')).toBe(2);
    expect(countCodePoints('\u0e17\u0e14\u0e2a\u0e2d\u0e1a')).toBe(5);
  });

  it('validates feedback content within 1 to 4000 code points', () => {
    expect(validateFeedbackContent('Good job!').valid).toBe(true);
    expect(validateFeedbackContent('Good job!').value).toBe('Good job!');

    // Whitespace trimming
    expect(validateFeedbackContent('   Trimmed feedback   ').value).toBe('Trimmed feedback');

    // Empty or whitespace
    expect(validateFeedbackContent('').valid).toBe(false);
    expect(validateFeedbackContent('   ').valid).toBe(false);

    // Boundary check
    expect(validateFeedbackContent('a'.repeat(4000)).valid).toBe(true);
    expect(validateFeedbackContent('a'.repeat(4001)).valid).toBe(false);

    // Non-string
    expect(validateFeedbackContent(123).valid).toBe(false);
    expect(validateFeedbackContent(null).valid).toBe(false);
  });

  it('validates clientRequestId as UUID', () => {
    expect(validateClientRequestId('123e4567-e89b-12d3-a456-426614174000').valid).toBe(true);
    expect(validateClientRequestId('not-a-uuid').valid).toBe(false);
    expect(validateClientRequestId(null).valid).toBe(false);
  });

  it('validates submissionId as UUID', () => {
    expect(validateSubmissionId('123e4567-e89b-12d3-a456-426614174000').valid).toBe(true);
    expect(validateSubmissionId('invalid-id').valid).toBe(false);
  });

  it('parseFeedbackInput validates valid objects and rejects unknown keys or bad shapes', () => {
    // Valid input
    const valid = parseFeedbackInput({
      content: '  Great work on this version.  ',
      clientRequestId: '123e4567-e89b-12d3-a456-426614174000',
    });
    expect(valid.content).toBe('Great work on this version.');
    expect(valid.clientRequestId).toBe('123e4567-e89b-12d3-a456-426614174000');

    // Non-object
    expect(() => parseFeedbackInput('string')).toThrow(FeedbackInputError);
    expect(() => parseFeedbackInput(null)).toThrow(FeedbackInputError);
    expect(() => parseFeedbackInput([1, 2, 3])).toThrow(FeedbackInputError);

    // Unknown keys
    try {
      parseFeedbackInput({
        content: 'Valid content',
        clientRequestId: '123e4567-e89b-12d3-a456-426614174000',
        extraField: true,
      });
      expect.fail('Should have thrown');
    } catch (err) {
      expect(err).toBeInstanceOf(FeedbackInputError);
      expect((err as FeedbackInputError).fields.form).toBe('Use only content and clientRequestId.');
    }
  });
});


describe('Feedback PostgreSQL text boundaries', () => {
  it.each(['bad\u0000text', 'bad\ud800text', 'bad\udffftext'])('rejects invalid Unicode or null content %#', value => {
    expect(validateFeedbackContent(value).valid).toBe(false);
  });
  it('accepts four thousand astral characters as four thousand code points', () => {
    expect(validateFeedbackContent('\u{1F680}'.repeat(4000)).valid).toBe(true);
    expect(validateFeedbackContent('\u{1F680}'.repeat(4001)).valid).toBe(false);
  });
});
