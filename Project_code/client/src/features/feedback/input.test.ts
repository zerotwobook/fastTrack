import { describe, it, expect } from 'vitest';
import {
  validateFeedbackContent,
  validateClientRequestId,
  validateSubmissionId,
  countCodePoints,
} from '../../../../shared/feedback.mjs';

describe('Shared Feedback Input Validation', () => {
  it('counts Unicode code points accurately without surrogate pair splitting', () => {
    expect(countCodePoints('hello')).toBe(5);
    expect(countCodePoints('👍🎉')).toBe(2);
    expect(countCodePoints('ทดสอบ')).toBe(5);
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
});
