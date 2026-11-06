// Feedback DTOs — B owns (R1-B02).
// Canonical contracts per project detail section 9.4 and D1 C.7/E.

export interface FeedbackSupervisorDto {
  readonly id: string;
  readonly displayName: string;
}

export interface FeedbackDto {
  readonly id: string;
  readonly submissionId: string;
  readonly supervisor: FeedbackSupervisorDto;
  readonly content: string;
  readonly clientRequestId: string;
  readonly createdAt: string;
}

export interface CreateFeedbackInput {
  readonly content: string;
  readonly clientRequestId: string;
}
