-- One SQL statement provides atomicity and returns the original failure to Prisma.
-- Avoid an explicitly open transaction that masks the cause during advisory unlock.
DO $g1_atomic_migration$
BEGIN
-- Corrected, still-unmerged G1 proposal. The two accepted B00 migrations are unchanged.
-- Original 633a9fe SQL is retained as a test fixture; existing ledgers are never rewritten.
-- A later forward alignment migration also supports databases that exercised that candidate.

-- Validate every legacy UUID cast before dropping any foreign key.
DO $uuid_preflight$
DECLARE target RECORD; checked_count BIGINT;
BEGIN
  FOR target IN SELECT * FROM (VALUES
      ('users', 'id'),
      ('sessions', 'id'),
      ('sessions', 'user_id'),
      ('teams', 'id'),
      ('teams', 'supervisor_id'),
      ('team_members', 'team_id'),
      ('team_members', 'student_id'),
      ('milestones', 'id'),
      ('milestones', 'team_id'),
      ('milestones', 'created_by_id'),
      ('submissions', 'id'),
      ('submissions', 'milestone_id'),
      ('submissions', 'submitted_by_id'),
      ('feedback', 'id'),
      ('feedback', 'submission_id'),
      ('feedback', 'supervisor_id'),
      ('feedback', 'client_request_id')
    ) AS targets(table_name, column_name)
  LOOP
    BEGIN
      EXECUTE format('SELECT count(%I::uuid) FROM %I', target.column_name, target.table_name) INTO checked_count;
    EXCEPTION WHEN invalid_text_representation THEN
      RAISE EXCEPTION USING ERRCODE = '22P02', MESSAGE = format('G1 UUID preflight: invalid legacy identifiers in %I.%I; no schema changes applied.', target.table_name, target.column_name);
    END;
  END LOOP;
END;
$uuid_preflight$;

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

-- Forward migration for G1 foundation corrections (Issue #51 / G1-01 to G1-05)
-- Safely converts text UUIDs to native PostgreSQL UUID type with explicit USING clause

-- 1. Drop existing foreign key constraints temporarily
ALTER TABLE "sessions" DROP CONSTRAINT IF EXISTS "sessions_user_id_fkey";
ALTER TABLE "teams" DROP CONSTRAINT IF EXISTS "teams_supervisor_id_fkey";
ALTER TABLE "team_members" DROP CONSTRAINT IF EXISTS "team_members_team_id_fkey";
ALTER TABLE "team_members" DROP CONSTRAINT IF EXISTS "team_members_student_id_fkey";
ALTER TABLE "milestones" DROP CONSTRAINT IF EXISTS "milestones_team_id_fkey";
ALTER TABLE "milestones" DROP CONSTRAINT IF EXISTS "milestones_created_by_id_fkey";
ALTER TABLE "submissions" DROP CONSTRAINT IF EXISTS "submissions_milestone_id_fkey";
ALTER TABLE "submissions" DROP CONSTRAINT IF EXISTS "submissions_submitted_by_id_fkey";
ALTER TABLE "feedback" DROP CONSTRAINT IF EXISTS "feedback_submission_id_fkey";
ALTER TABLE "feedback" DROP CONSTRAINT IF EXISTS "feedback_supervisor_id_fkey";

-- 2. Drop unique constraint on teams(supervisor_id) to permit 1 supervisor to supervise multiple teams (G1-01)
DROP INDEX IF EXISTS "teams_supervisor_id_key";

-- 3. Alter "users" table: convert id to uuid, apply varchar bounds
ALTER TABLE "users" 
  ALTER COLUMN "id" TYPE UUID USING "id"::uuid,
  ALTER COLUMN "email" TYPE TEXT,
  ALTER COLUMN "password_hash" TYPE TEXT,
  ALTER COLUMN "name" TYPE TEXT,
  ALTER COLUMN "student_id" TYPE TEXT;

-- 4. Alter "sessions" table: convert ids to uuid, add revoked_at (G1-02), apply varchar bounds
ALTER TABLE "sessions"
  ALTER COLUMN "id" TYPE UUID USING "id"::uuid,
  ALTER COLUMN "user_id" TYPE UUID USING "user_id"::uuid,
  ALTER COLUMN "token_hash" TYPE TEXT,
  ALTER COLUMN "csrf_token" TYPE TEXT,
  ADD COLUMN IF NOT EXISTS "revoked_at" TIMESTAMPTZ;

-- 5. Alter "teams" table: convert ids to uuid, apply varchar bounds
ALTER TABLE "teams"
  ALTER COLUMN "id" TYPE UUID USING "id"::uuid,
  ALTER COLUMN "name" TYPE VARCHAR(120),
  ALTER COLUMN "supervisor_id" TYPE UUID USING "supervisor_id"::uuid;

-- Add non-unique index on teams(supervisor_id)
CREATE INDEX IF NOT EXISTS "teams_supervisor_id_idx" ON "teams"("supervisor_id");

-- 6. Alter "team_members" table: convert ids to uuid
ALTER TABLE "team_members"
  ALTER COLUMN "team_id" TYPE UUID USING "team_id"::uuid,
  ALTER COLUMN "student_id" TYPE UUID USING "student_id"::uuid;

-- 7. Alter "milestones" table: convert ids to uuid, add cancelled_at (G1-02), apply varchar bounds (G1-05: title <= 120 chars)
ALTER TABLE "milestones"
  ALTER COLUMN "id" TYPE UUID USING "id"::uuid,
  ALTER COLUMN "team_id" TYPE UUID USING "team_id"::uuid,
  ALTER COLUMN "created_by_id" TYPE UUID USING "created_by_id"::uuid,
  ALTER COLUMN "title" TYPE VARCHAR(120),
  ALTER COLUMN "description" DROP DEFAULT,
  ALTER COLUMN "description" TYPE VARCHAR(4000),
  ADD COLUMN IF NOT EXISTS "cancelled_at" TIMESTAMPTZ;

-- 8. Alter "submissions" table: convert ids to uuid, apply varchar bounds
ALTER TABLE "submissions"
  ALTER COLUMN "id" TYPE UUID USING "id"::uuid,
  ALTER COLUMN "milestone_id" TYPE UUID USING "milestone_id"::uuid,
  ALTER COLUMN "submitted_by_id" TYPE UUID USING "submitted_by_id"::uuid,
  ALTER COLUMN "title" TYPE VARCHAR(120),
  ALTER COLUMN "description" DROP DEFAULT,
  ALTER COLUMN "description" TYPE VARCHAR(4000),
  ALTER COLUMN "url" TYPE VARCHAR(2048);

-- 9. Alter "feedback" table: convert ids to uuid, apply varchar bounds
ALTER TABLE "feedback"
  ALTER COLUMN "id" TYPE UUID USING "id"::uuid,
  ALTER COLUMN "submission_id" TYPE UUID USING "submission_id"::uuid,
  ALTER COLUMN "supervisor_id" TYPE UUID USING "supervisor_id"::uuid,
  ALTER COLUMN "content" TYPE VARCHAR(4000);

-- 10. Re-add foreign key constraints with native UUID types and add missing submission author relation (G1-04)
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "teams" ADD CONSTRAINT "teams_supervisor_id_fkey" FOREIGN KEY ("supervisor_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "team_members" ADD CONSTRAINT "team_members_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "team_members" ADD CONSTRAINT "team_members_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "milestones" ADD CONSTRAINT "milestones_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "milestones" ADD CONSTRAINT "milestones_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_milestone_id_fkey" FOREIGN KEY ("milestone_id") REFERENCES "milestones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_submitted_by_id_fkey" FOREIGN KEY ("submitted_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "feedback" ADD CONSTRAINT "feedback_submission_id_fkey" FOREIGN KEY ("submission_id") REFERENCES "submissions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "feedback" ADD CONSTRAINT "feedback_supervisor_id_fkey" FOREIGN KEY ("supervisor_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;


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



END;
$g1_atomic_migration$;
