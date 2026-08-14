ALTER TABLE "applications" ADD COLUMN IF NOT EXISTS "relevant_experience" TEXT;
ALTER TABLE "applications" ADD COLUMN IF NOT EXISTS "github_url" VARCHAR(255);
ALTER TABLE "applications" ADD COLUMN IF NOT EXISTS "portfolio_url" VARCHAR(255);
ALTER TABLE "applications" ADD COLUMN IF NOT EXISTS "resume_url" TEXT;
ALTER TABLE "applications" ADD COLUMN IF NOT EXISTS "resume_filename" VARCHAR(255);
ALTER TABLE "applications" ADD COLUMN IF NOT EXISTS "skills" TEXT[] DEFAULT '{}';
ALTER TABLE "applications" ADD COLUMN IF NOT EXISTS "availability" VARCHAR(100);

ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "reset_token" VARCHAR(255);
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "reset_token_expires" TIMESTAMP(6);

ALTER TYPE "notification_type" ADD VALUE IF NOT EXISTS 'deadline';