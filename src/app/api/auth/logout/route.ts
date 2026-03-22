import { logout } from "@/actions/auth";
import { NextResponse } from "next/server";

export async function POST() {
  await logout();
  return NextResponse.redirect(new URL("/admin/login", process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"));
}
