import { Pool } from "pg";

const pool = process.env.DATABASE_URL
  ? new Pool({ connectionString: process.env.DATABASE_URL })
  : null;

export async function query<T = Record<string, unknown>>(
  text: string,
  params?: unknown[]
): Promise<T[]> {
  if (!pool) return [];
  const result = await pool.query(text, params);
  return result.rows as T[];
}

export async function queryOne<T = Record<string, unknown>>(
  text: string,
  params?: unknown[]
): Promise<T | null> {
  const rows = await query<T>(text, params);
  return rows[0] ?? null;
}

export async function queryCount(
  text: string,
  params?: unknown[]
): Promise<number> {
  if (!pool) return 0;
  const result = await pool.query(text, params);
  return parseInt(result.rows[0]?.count ?? "0", 10);
}
