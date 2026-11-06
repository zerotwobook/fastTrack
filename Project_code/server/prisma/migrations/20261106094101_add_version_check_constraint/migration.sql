-- Add CHECK constraint: submissions.version must be >= 1.
-- This prevents application bugs from inserting version 0 or negative versions.
-- Enforced at DB level in addition to application-layer validation.
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_version_min" CHECK (version >= 1);
