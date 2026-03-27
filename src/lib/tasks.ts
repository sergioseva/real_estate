import { Pool } from "pg";

export interface Task {
  name: string;
  run: (pool: Pool) => Promise<void>;
}

// Import all one-time tasks here, in order.
// Once a task has run successfully it will never run again.
import { task as generateThumbnails } from "@/tasks/001_generate-thumbnails";
import { task as generateMicroThumbnails } from "@/tasks/002_generate-micro-thumbnails";

const tasks: Task[] = [generateThumbnails, generateMicroThumbnails];

export async function runTasks() {
  if (!process.env.DATABASE_URL) return;

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS app_tasks (
        name TEXT PRIMARY KEY,
        executed_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `);

    for (const task of tasks) {
      // Atomically claim: INSERT succeeds only once across all workers
      const result = await pool.query(
        "INSERT INTO app_tasks (name) VALUES ($1) ON CONFLICT DO NOTHING",
        [task.name]
      );
      if (result.rowCount === 0) continue;

      console.log(`[tasks] Running ${task.name}...`);
      try {
        await task.run(pool);
        console.log(`[tasks] Completed ${task.name}`);
      } catch (err) {
        // Remove claim so it can be retried on next startup
        await pool.query("DELETE FROM app_tasks WHERE name = $1", [task.name]);
        console.error(`[tasks] Failed ${task.name}:`, err);
        throw err;
      }
    }
  } finally {
    await pool.end();
  }
}
