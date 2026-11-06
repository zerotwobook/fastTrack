export interface FeedbackLimits {
  readonly CONTENT_MIN_CHARS: number;
  readonly CONTENT_MAX_CHARS: number;
}

export declare const FEEDBACK_LIMITS: FeedbackLimits;

export declare function countCodePoints(text: unknown): number;

export declare function validateFeedbackContent(content: unknown): {
  valid: boolean;
  error?: string;
  value?: string;
};

export declare function validateClientRequestId(id: unknown): {
  valid: boolean;
  error?: string;
  value?: string;
};

export declare function validateSubmissionId(id: unknown): {
  valid: boolean;
  error?: string;
  value?: string;
};
