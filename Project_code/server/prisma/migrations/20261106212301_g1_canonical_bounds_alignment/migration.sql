-- Forward alignment for an already-exercised, unmerged G1 candidate.
-- No row rewrites, resets, checksum updates or edits to the accepted B00 migrations.
BEGIN;

-- Reject invalid existing content before changing schema; never truncate or replace it.
DO $bounds_preflight$
DECLARE rule RECORD; invalid_count BIGINT; whitespace CONSTANT TEXT := U&'\0009\000A\000B\000C\000D\0020\00A0\1680\2000\2001\2002\2003\2004\2005\2006\2007\2008\2009\200A\2028\2029\202F\205F\3000\FEFF';
BEGIN
  FOR rule IN SELECT * FROM (VALUES
      ('teams', 'name', 120),
      ('milestones', 'title', 120),
      ('milestones', 'description', 4000),
      ('submissions', 'title', 120),
      ('submissions', 'description', 4000),
      ('submissions', 'url', 2048),
      ('feedback', 'content', 4000)
    ) AS rules(table_name, column_name, max_length)
  LOOP
    EXECUTE format('SELECT count(*) FROM %I WHERE %I IS NULL OR char_length(%I) > $1 OR char_length(btrim(%I, $2)) < 1',
      rule.table_name, rule.column_name, rule.column_name, rule.column_name)
      INTO invalid_count USING rule.max_length, whitespace;
    IF invalid_count > 0 THEN
      RAISE EXCEPTION USING ERRCODE = '23514', MESSAGE = format('G1 bounds preflight: %s invalid rows in %I.%I; resolve data without truncation before retrying.', invalid_count, rule.table_name, rule.column_name);
    END IF;
  END LOOP;
END;
$bounds_preflight$;

-- Identity fields had no such caps in the accepted data model; preserve existing values.
ALTER TABLE "users"
  ALTER COLUMN "email" TYPE TEXT, ALTER COLUMN "password_hash" TYPE TEXT,
  ALTER COLUMN "name" TYPE TEXT, ALTER COLUMN "student_id" TYPE TEXT;
ALTER TABLE "sessions" ALTER COLUMN "token_hash" TYPE TEXT, ALTER COLUMN "csrf_token" TYPE TEXT;
ALTER TABLE "teams" ALTER COLUMN "name" TYPE VARCHAR(120);
ALTER TABLE "milestones" ALTER COLUMN "title" TYPE VARCHAR(120),
  ALTER COLUMN "description" DROP DEFAULT, ALTER COLUMN "description" TYPE VARCHAR(4000);
ALTER TABLE "submissions" ALTER COLUMN "title" TYPE VARCHAR(120),
  ALTER COLUMN "description" DROP DEFAULT, ALTER COLUMN "description" TYPE VARCHAR(4000),
  ALTER COLUMN "url" TYPE VARCHAR(2048);
ALTER TABLE "feedback" ALTER COLUMN "content" TYPE VARCHAR(4000);

-- Required content must remain nonblank after Unicode whitespace trimming.
DO $required_bound$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'teams_name_bounds' AND conrelid = 'teams'::regclass) THEN
    ALTER TABLE "teams" ADD CONSTRAINT "teams_name_bounds"
      CHECK (char_length(btrim("name", U&'\0009\000A\000B\000C\000D\0020\00A0\1680\2000\2001\2002\2003\2004\2005\2006\2007\2008\2009\200A\2028\2029\202F\205F\3000\FEFF')) BETWEEN 1 AND 120);
  END IF;
END;
$required_bound$;
DO $required_bound$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'milestones_title_bounds' AND conrelid = 'milestones'::regclass) THEN
    ALTER TABLE "milestones" ADD CONSTRAINT "milestones_title_bounds"
      CHECK (char_length(btrim("title", U&'\0009\000A\000B\000C\000D\0020\00A0\1680\2000\2001\2002\2003\2004\2005\2006\2007\2008\2009\200A\2028\2029\202F\205F\3000\FEFF')) BETWEEN 1 AND 120);
  END IF;
END;
$required_bound$;
DO $required_bound$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'milestones_description_bounds' AND conrelid = 'milestones'::regclass) THEN
    ALTER TABLE "milestones" ADD CONSTRAINT "milestones_description_bounds"
      CHECK (char_length(btrim("description", U&'\0009\000A\000B\000C\000D\0020\00A0\1680\2000\2001\2002\2003\2004\2005\2006\2007\2008\2009\200A\2028\2029\202F\205F\3000\FEFF')) BETWEEN 1 AND 4000);
  END IF;
END;
$required_bound$;
DO $required_bound$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'submissions_title_bounds' AND conrelid = 'submissions'::regclass) THEN
    ALTER TABLE "submissions" ADD CONSTRAINT "submissions_title_bounds"
      CHECK (char_length(btrim("title", U&'\0009\000A\000B\000C\000D\0020\00A0\1680\2000\2001\2002\2003\2004\2005\2006\2007\2008\2009\200A\2028\2029\202F\205F\3000\FEFF')) BETWEEN 1 AND 120);
  END IF;
END;
$required_bound$;
DO $required_bound$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'submissions_description_bounds' AND conrelid = 'submissions'::regclass) THEN
    ALTER TABLE "submissions" ADD CONSTRAINT "submissions_description_bounds"
      CHECK (char_length(btrim("description", U&'\0009\000A\000B\000C\000D\0020\00A0\1680\2000\2001\2002\2003\2004\2005\2006\2007\2008\2009\200A\2028\2029\202F\205F\3000\FEFF')) BETWEEN 1 AND 4000);
  END IF;
END;
$required_bound$;
DO $required_bound$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'submissions_url_bounds' AND conrelid = 'submissions'::regclass) THEN
    ALTER TABLE "submissions" ADD CONSTRAINT "submissions_url_bounds"
      CHECK (char_length(btrim("url", U&'\0009\000A\000B\000C\000D\0020\00A0\1680\2000\2001\2002\2003\2004\2005\2006\2007\2008\2009\200A\2028\2029\202F\205F\3000\FEFF')) BETWEEN 1 AND 2048);
  END IF;
END;
$required_bound$;
DO $required_bound$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'feedback_content_bounds' AND conrelid = 'feedback'::regclass) THEN
    ALTER TABLE "feedback" ADD CONSTRAINT "feedback_content_bounds"
      CHECK (char_length(btrim("content", U&'\0009\000A\000B\000C\000D\0020\00A0\1680\2000\2001\2002\2003\2004\2005\2006\2007\2008\2009\200A\2028\2029\202F\205F\3000\FEFF')) BETWEEN 1 AND 4000);
  END IF;
END;
$required_bound$;

COMMIT;
