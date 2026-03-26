import { Pool } from "pg";
import { readdir, readFile } from "fs/promises";
import { join } from "path";

// Migrations that existed before the automatic migration system was added.
// If the database already has tables, these are marked as applied automatically.
const BASELINE_MIGRATIONS = [
  "001_initial.sql",
  "002_extended_fields.sql",
  "003_image_description.sql",
  "004_geolocation.sql",
  "005_site_settings.sql",
];

export async function runMigrations() {
  if (!process.env.DATABASE_URL) return;

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  try {
    // Ensure tracking table exists
    await pool.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        filename TEXT PRIMARY KEY,
        applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `);

    // Check if we need to seed baseline migrations for an existing database
    const { rows: applied } = await pool.query(
      "SELECT filename FROM schema_migrations"
    );

    if (applied.length === 0) {
      // Check if the database already has tables (pre-existing DB)
      const { rows: [{ exists }] } = await pool.query(`
        SELECT EXISTS (
          SELECT 1 FROM information_schema.tables
          WHERE table_schema = 'public' AND table_name = 'properties'
        )
      `);

      if (exists) {
        for (const file of BASELINE_MIGRATIONS) {
          await pool.query(
            "INSERT INTO schema_migrations (filename) VALUES ($1) ON CONFLICT DO NOTHING",
            [file]
          );
        }
        console.log("[migrate] Marked baseline migrations as applied for existing database.");
      }
    }

    // Get applied migrations (refreshed after potential seeding)
    const { rows: currentApplied } = await pool.query(
      "SELECT filename FROM schema_migrations ORDER BY filename"
    );
    const appliedSet = new Set(currentApplied.map((r: { filename: string }) => r.filename));

    // Read migration files
    const migrationsDir = join(process.cwd(), "supabase", "migrations");
    let files: string[];
    try {
      files = await readdir(migrationsDir);
    } catch {
      console.log("[migrate] No migrations directory found, skipping.");
      return;
    }

    const pending = files
      .filter((f) => f.endsWith(".sql"))
      .sort()
      .filter((f) => !appliedSet.has(f));

    if (pending.length === 0) {
      console.log("[migrate] Database is up to date.");
      return;
    }

    for (const file of pending) {
      const sql = await readFile(join(migrationsDir, file), "utf-8");

      console.log(`[migrate] Applying ${file}...`);
      await pool.query("BEGIN");
      try {
        await pool.query(sql);
        await pool.query(
          "INSERT INTO schema_migrations (filename) VALUES ($1)",
          [file]
        );
        await pool.query("COMMIT");
        console.log(`[migrate] Applied ${file}`);
      } catch (err) {
        await pool.query("ROLLBACK");
        console.error(`[migrate] Failed to apply ${file}:`, err);
        throw err;
      }
    }

    console.log(`[migrate] ${pending.length} migration(s) applied.`);
  } finally {
    await pool.end();
  }
}
