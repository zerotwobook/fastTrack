// Pure shared feedback validation for client and server.
// B owns (R1-B02).

export class FeedbackInputError extends Error {
  constructor(fields) {
    super('Check the highlighted feedback fields.');
    this.fields = Object.freeze({ ...fields });
  }
}

export const FEEDBACK_LIMITS = Object.freeze({
  CONTENT_MIN_CHARS: 1,
  CONTENT_MAX_CHARS: 4000,
});

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Counts Unicode code points correctly without surrogate-pair splitting.
 */
export function countCodePoints(text) {
  if (typeof text !== 'string') return 0;
  return Array.from(text).length;
}

/**
 * Validates feedback content:
 * - Must be a string
 * - Trimmed length must be between 1 and 4,000 code points
 */
export function validateFeedbackContent(content) {
  if (typeof content !== 'string') {
    return { valid: false, error: 'Feedback content must be text.' };
  }
  const trimmed = content.trim();
  if (/[\u0000\uD800-\uDFFF]/u.test(trimmed)) {
    return { valid: false, error: 'Use valid Unicode text without a null character.' };
  }
  const count = countCodePoints(trimmed);
  if (count < FEEDBACK_LIMITS.CONTENT_MIN_CHARS) {
    return { valid: false, error: 'Feedback content cannot be empty.' };
  }
  if (count > FEEDBACK_LIMITS.CONTENT_MAX_CHARS) {
    return { valid: false, error: `Feedback content cannot exceed ${FEEDBACK_LIMITS.CONTENT_MAX_CHARS} characters.` };
  }
  return { valid: true, value: trimmed };
}

/**
 * Validates clientRequestId is a valid UUID.
 */
export function validateClientRequestId(id) {
  if (typeof id !== 'string' || !UUID_REGEX.test(id)) {
    return { valid: false, error: 'The client request ID must be a valid UUID.' };
  }
  return { valid: true, value: id.toLowerCase() };
}

/**
 * Validates submissionId is a valid UUID.
 */
export function validateSubmissionId(id) {
  if (typeof id !== 'string' || !UUID_REGEX.test(id)) {
    return { valid: false, error: 'The submission ID must be a valid UUID.' };
  }
  return { valid: true, value: id.toLowerCase() };
}

/**
 * Parses and validates feedback creation payload:
 * - Rejects non-objects and arrays
 * - Rejects unknown keys
 * - Validates trimmed content bounds (1-4,000 code points)
 * - Validates clientRequestId format (UUID)
 */
export function parseFeedbackInput(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new FeedbackInputError({ form: 'Provide content and clientRequestId.' });
  }

  const fields = {};
  if (Object.keys(value).some((key) => !['content', 'clientRequestId'].includes(key))) {
    fields.form = 'Use only content and clientRequestId.';
  }

  const contentCheck = validateFeedbackContent(value.content);
  if (!contentCheck.valid) {
    fields.content = contentCheck.error;
  }

  const keyCheck = validateClientRequestId(value.clientRequestId);
  if (!keyCheck.valid) {
    fields.clientRequestId = keyCheck.error;
  }

  if (Object.keys(fields).length > 0) {
    throw new FeedbackInputError(fields);
  }

  return {
    content: contentCheck.value,
    clientRequestId: keyCheck.value,
  };
}
