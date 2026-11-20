-- Lab 7 (CR-L7-01): widen feedback.content and its named bounds check from 4,000 to 6,000 Unicode code points.
-- Preserves all existing rows, IDs, timestamps, submission foreign keys, uniqueness constraints, and indexes.
ALTER TABLE "feedback"
  DROP CONSTRAINT IF EXISTS "feedback_content_bounds",
  ALTER COLUMN "content" TYPE VARCHAR(6000),
  ADD CONSTRAINT "feedback_content_bounds"
    CHECK (char_length(btrim("content", U&'\0009\000A\000B\000C\000D\0020\00A0\1680\2000\2001\2002\2003\2004\2005\2006\2007\2008\2009\200A\2028\2029\202F\205F\3000\FEFF')) BETWEEN 1 AND 6000);
