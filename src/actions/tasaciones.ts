"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const tasacionSchema = z.object({
  nombre: z.string().min(2, "El nombre es requerido"),
  email: z.string().email("Email invalido"),
  telefono: z.string().min(8, "Telefono invalido"),
  direccion: z.string().min(5, "La direccion es requerida"),
  mensaje: z.string().optional(),
});

export async function createTasacion(formData: FormData) {
  const raw = {
    nombre: formData.get("nombre") as string,
    email: formData.get("email") as string,
    telefono: formData.get("telefono") as string,
    direccion: formData.get("direccion") as string,
    mensaje: (formData.get("mensaje") as string) || "",
  };

  const result = tasacionSchema.safeParse(raw);
  if (!result.success) {
    return { error: result.error.flatten().fieldErrors };
  }

  const supabase = await createClient();

  const { error } = await supabase.from("tasacion_requests").insert(result.data);

  if (error) throw error;

  revalidatePath("/admin/tasaciones");
  return { success: true };
}

export async function getTasaciones() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("tasacion_requests")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function markTasacionRead(id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("tasacion_requests")
    .update({ leido: true })
    .eq("id", id);

  if (error) throw error;

  revalidatePath("/admin/tasaciones");
}

export async function deleteTasacion(id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("tasacion_requests")
    .delete()
    .eq("id", id);

  if (error) throw error;

  revalidatePath("/admin/tasaciones");
}

export async function getUnreadTasacionCount() {
  const supabase = await createClient();

  const { count, error } = await supabase
    .from("tasacion_requests")
    .select("*", { count: "exact", head: true })
    .eq("leido", false);

  if (error) return 0;
  return count || 0;
}
