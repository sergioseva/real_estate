"use server";

import { query } from "@/lib/db";
import { thumbUrl } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { unlink } from "fs/promises";
import { join } from "path";

export async function deleteImage(imageId: string, storagePath: string) {
  // Delete file and thumbnail from disk
  const filePath = join(process.cwd(), "public", storagePath);
  const thumbPath = join(process.cwd(), "public", thumbUrl(storagePath));
  await Promise.all([
    unlink(filePath).catch(() => {}),
    unlink(thumbPath).catch(() => {}),
  ]);

  await query("DELETE FROM property_images WHERE id = $1", [imageId]);
  revalidatePath("/admin/propiedades");
}

export async function reorderImages(
  images: { id: string; display_order: number }[]
) {
  for (const img of images) {
    await query(
      "UPDATE property_images SET display_order = $1 WHERE id = $2",
      [img.display_order, img.id]
    );
  }
  revalidatePath("/admin/propiedades");
}
