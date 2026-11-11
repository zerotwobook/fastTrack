-- Additive Lab 5 proposal by A; B reviews/integrates this new migration.
-- Applied Sprint 1 migration files and domain records remain unchanged.
CREATE TABLE "auth_rate_limits" (
    "key" VARCHAR(128) NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "first_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "locked_until" TIMESTAMPTZ,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "auth_rate_limits_pkey" PRIMARY KEY ("key"),
    CONSTRAINT "auth_rate_limits_attempts_nonnegative" CHECK ("attempts" >= 0)
);
CREATE INDEX "auth_rate_limits_updated_at_idx" ON "auth_rate_limits" ("updated_at");
