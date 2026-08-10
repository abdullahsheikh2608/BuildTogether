-- Global Search performance indexes.
-- pg_trgm lets Postgres use a GIN index to accelerate ILIKE '%term%'
-- lookups (a plain btree index can't help with a leading wildcard).
CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX IF NOT EXISTS idx_startups_title_trgm
    ON startups USING gin (title gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_tasks_title_trgm
    ON tasks USING gin (title gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_profiles_full_name_trgm
    ON profiles USING gin (full_name gin_trgm_ops);

-- Speeds up the "founder's own startups/tasks/applications" filters
-- that every search query runs first.
CREATE INDEX IF NOT EXISTS idx_startups_founder_id
    ON startups (founder_id);

CREATE INDEX IF NOT EXISTS idx_tasks_startup_id
    ON tasks (startup_id);

CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to
    ON tasks (assigned_to);

CREATE INDEX IF NOT EXISTS idx_applications_startup_id
    ON applications (startup_id);