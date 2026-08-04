-- AlterTable
-- Tracks when the automatic weekly report generator last notified this
-- startup's founder, so the scheduled job doesn't resend a report until
-- a full week has passed (and doesn't spam founders on every server
-- restart, the same problem `reminder_sent_at` solves for tasks).
ALTER TABLE "startups" ADD COLUMN "last_weekly_report_at" TIMESTAMP(6);