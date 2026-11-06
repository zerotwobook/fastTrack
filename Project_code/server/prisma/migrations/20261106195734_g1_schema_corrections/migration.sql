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
ALTER TABLE "feedback" DROP CONSTRAINT IF EXISTS "feedback_submission_id_fkey";
ALTER TABLE "feedback" DROP CONSTRAINT IF EXISTS "feedback_supervisor_id_fkey";

-- 2. Drop unique constraint on teams(supervisor_id) to permit 1 supervisor to supervise multiple teams (G1-01)
DROP INDEX IF EXISTS "teams_supervisor_id_key";

-- 3. Alter "users" table: convert id to uuid, apply varchar bounds
ALTER TABLE "users" 
  ALTER COLUMN "id" TYPE UUID USING "id"::uuid,
  ALTER COLUMN "email" TYPE VARCHAR(255),
  ALTER COLUMN "password_hash" TYPE VARCHAR(255),
  ALTER COLUMN "name" TYPE VARCHAR(100),
  ALTER COLUMN "student_id" TYPE VARCHAR(50);

-- 4. Alter "sessions" table: convert ids to uuid, add revoked_at (G1-02), apply varchar bounds
ALTER TABLE "sessions"
  ALTER COLUMN "id" TYPE UUID USING "id"::uuid,
  ALTER COLUMN "user_id" TYPE UUID USING "user_id"::uuid,
  ALTER COLUMN "token_hash" TYPE VARCHAR(255),
  ALTER COLUMN "csrf_token" TYPE VARCHAR(255),
  ADD COLUMN IF NOT EXISTS "revoked_at" TIMESTAMPTZ;

-- 5. Alter "teams" table: convert ids to uuid, apply varchar bounds
ALTER TABLE "teams"
  ALTER COLUMN "id" TYPE UUID USING "id"::uuid,
  ALTER COLUMN "name" TYPE VARCHAR(100),
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
  ALTER COLUMN "description" TYPE VARCHAR(2000),
  ADD COLUMN IF NOT EXISTS "cancelled_at" TIMESTAMPTZ;

-- 8. Alter "submissions" table: convert ids to uuid, apply varchar bounds
ALTER TABLE "submissions"
  ALTER COLUMN "id" TYPE UUID USING "id"::uuid,
  ALTER COLUMN "milestone_id" TYPE UUID USING "milestone_id"::uuid,
  ALTER COLUMN "submitted_by_id" TYPE UUID USING "submitted_by_id"::uuid,
  ALTER COLUMN "title" TYPE VARCHAR(200),
  ALTER COLUMN "description" TYPE VARCHAR(2000),
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

