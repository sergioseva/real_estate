import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { queryOne } from "@/lib/db";
import { getSession } from "@/lib/auth";
import type { PropertyImage } from "@/types";

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File;
  const propertyId = formData.get("propertyId") as string;

  if (!file || !propertyId) {
    return NextResponse.json({ error: "Missing file or propertyId" }, { status: 400 });
  }

  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}.${fileExt}`;
  const dir = join(process.cwd(), "public", "uploads", propertyId);
  await mkdir(dir, { recursive: true });

  const bytes = await file.arrayBuffer();
  const filePath = join(dir, fileName);
  await writeFile(filePath, Buffer.from(bytes));

  const storagePath = `/uploads/${propertyId}/${fileName}`;

  const maxOrder = await queryOne<{ max: number | null }>(
    "SELECT max(display_order) as max FROM property_images WHERE property_id = $1",
    [propertyId]
  );
  const nextOrder = (maxOrder?.max ?? -1) + 1;

  const inserted = await queryOne<PropertyImage>(
    `INSERT INTO property_images (property_id, storage_path, url, display_order)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [propertyId, storagePath, storagePath, nextOrder]
  );

  return NextResponse.json(inserted);
}
