export async function onRequestInit() {
  // Only run once on the server, not on every request
}

export async function register() {
  // Run migrations on server startup (Node.js runtime only)
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { runMigrations } = await import("@/lib/migrate");
    await runMigrations();
  }
}
