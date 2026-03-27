import { Pool } from "pg";

export interface Task {
  name: string;
  run: (pool: Pool) => Promise<void>;
}

// Import all one-time tasks here, in order.
// Once a task has run successfully it will never run again.
import { task as generateThumbnails } from "@/tasks/001_generate-thumbnails";

const tasks: Task[] = [generateThumbnails];

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

    const { rows } = await pool.query("SELECT name FROM app_tasks");
    const executed = new Set(rows.map((r: { name: string }) => r.name));

    const pending = tasks.filter((t) => !executed.has(t.name));

    if (pending.length === 0) {
      console.log("[tasks] All tasks up to date.");
      return;
    }

    for (const task of pending) {
      console.log(`[tasks] Running ${task.name}...`);
      try {
        await task.run(pool);
        await pool.query(
          "INSERT INTO app_tasks (name) VALUES ($1) ON CONFLICT DO NOTHING",
          [task.name]
        );
        console.log(`[tasks] Completed ${task.name}`);
      } catch (err) {
        console.error(`[tasks] Failed ${task.name}:`, err);
        throw err;
      }
    }

    console.log(`[tasks] ${pending.length} task(s) executed.`);
  } finally {
    await pool.end();
  }
}
