import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await query("SELECT 1");
    return NextResponse.json({ status: "ok", timestamp: new Date().toISOString() });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ status: "error", error: message }, { status: 500 });
  }
}
