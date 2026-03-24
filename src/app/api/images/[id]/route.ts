import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { descripcion } = await request.json();

  await query(
    "UPDATE property_images SET descripcion = $1 WHERE id = $2",
    [descripcion, id]
  );

  return NextResponse.json({ success: true });
}
