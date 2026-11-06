// Pure shared feedback validation for client and server.
// B owns (R1-B02).

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const FEEDBACK_LIMITS = Object.freeze({
  CONTENT_MIN_CHARS: 1,
  CONTENT_MAX_CHARS: 4000,
});

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
  return { valid: true, value: id };
}

/**
 * Validates submissionId is a valid UUID.
 */
export function validateSubmissionId(id) {
  if (typeof id !== 'string' || !UUID_REGEX.test(id)) {
    return { valid: false, error: 'The submission ID must be a valid UUID.' };
  }
  return { valid: true, value: id };
}
