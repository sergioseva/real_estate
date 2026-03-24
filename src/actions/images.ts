"use server";

import { query } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { unlink } from "fs/promises";
import { join } from "path";

export async function deleteImage(imageId: string, storagePath: string) {
  // Delete file from disk
  try {
    const filePath = join(process.cwd(), "public", storagePath);
    await unlink(filePath);
  } catch {
    // File may not exist, continue with DB cleanup
  }

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
