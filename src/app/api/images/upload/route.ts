import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import sharp from "sharp";
import { queryOne } from "@/lib/db";
import { getSession } from "@/lib/auth";
import type { PropertyImage } from "@/types";

const MAX_WIDTH = 1920;
const THUMB_WIDTH = 600;
const MICRO_WIDTH = 150;
const QUALITY = 80;

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

  const timestamp = Date.now();
  const fileName = `${timestamp}.webp`;
  const thumbName = `${timestamp}_thumb.webp`;
  const microName = `${timestamp}_micro.webp`;
  const dir = join(process.cwd(), "public", "uploads", propertyId);
  await mkdir(dir, { recursive: true });

  const bytes = await file.arrayBuffer();
  const source = sharp(Buffer.from(bytes)).rotate();

  const [optimized, thumbnail, micro] = await Promise.all([
    source.clone().resize({ width: MAX_WIDTH, withoutEnlargement: true }).webp({ quality: QUALITY }).toBuffer(),
    source.clone().resize({ width: THUMB_WIDTH, withoutEnlargement: true }).webp({ quality: QUALITY }).toBuffer(),
    source.clone().resize({ width: MICRO_WIDTH, withoutEnlargement: true }).webp({ quality: 70 }).toBuffer(),
  ]);

  await Promise.all([
    writeFile(join(dir, fileName), optimized),
    writeFile(join(dir, thumbName), thumbnail),
    writeFile(join(dir, microName), micro),
  ]);

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
