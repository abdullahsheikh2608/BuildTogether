import pool from "../config/db.js";

async function runMigration() {
  try {
    await pool.query(`
      ALTER TABLE applications ADD COLUMN IF NOT EXISTS relevant_experience TEXT;
      ALTER TABLE applications ADD COLUMN IF NOT EXISTS github_url VARCHAR(255);
      ALTER TABLE applications ADD COLUMN IF NOT EXISTS portfolio_url VARCHAR(255);
      ALTER TABLE applications ADD COLUMN IF NOT EXISTS resume_url TEXT;
      ALTER TABLE applications ADD COLUMN IF NOT EXISTS resume_filename VARCHAR(255);
      ALTER TABLE applications ADD COLUMN IF NOT EXISTS skills TEXT[] DEFAULT '{}';
      ALTER TABLE applications ADD COLUMN IF NOT EXISTS availability VARCHAR(100);
      ALTER TABLE applications ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
    `);
    console.log("Applications table schema updated successfully.");
  } catch (err) {
    console.error("Error migrating applications table:", err);
  } finally {
    process.exit(0);
  }
}

runMigration();
