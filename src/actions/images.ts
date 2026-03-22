"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function uploadImage(propertyId: string, formData: FormData) {
  const supabase = await createClient();
  const file = formData.get("file") as File;

  if (!file) throw new Error("No file provided");

  const fileExt = file.name.split(".").pop();
  const fileName = `${propertyId}/${Date.now()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from("property-images")
    .upload(fileName, file);

  if (uploadError) throw uploadError;

  const { data: urlData } = supabase.storage
    .from("property-images")
    .getPublicUrl(fileName);

  // Get max display_order
  const { data: existing } = await supabase
    .from("property_images")
    .select("display_order")
    .eq("property_id", propertyId)
    .order("display_order", { ascending: false })
    .limit(1);

  const nextOrder = existing && existing.length > 0 ? existing[0].display_order + 1 : 0;

  const { error: insertError } = await supabase.from("property_images").insert({
    property_id: propertyId,
    storage_path: fileName,
    url: urlData.publicUrl,
    display_order: nextOrder,
  });

  if (insertError) throw insertError;

  revalidatePath("/admin/propiedades");
}

export async function deleteImage(imageId: string, storagePath: string) {
  const supabase = await createClient();

  await supabase.storage.from("property-images").remove([storagePath]);

  const { error } = await supabase
    .from("property_images")
    .delete()
    .eq("id", imageId);

  if (error) throw error;

  revalidatePath("/admin/propiedades");
}

export async function reorderImages(
  images: { id: string; display_order: number }[]
) {
  const supabase = await createClient();

  for (const img of images) {
    await supabase
      .from("property_images")
      .update({ display_order: img.display_order })
      .eq("id", img.id);
  }

  revalidatePath("/admin/propiedades");
}
