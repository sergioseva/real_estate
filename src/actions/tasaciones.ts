"use server";

import { query, queryOne, queryCount } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import type { TasacionRequest } from "@/types";

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

  await queryOne(
    `INSERT INTO tasacion_requests (nombre, email, telefono, direccion, mensaje) VALUES ($1,$2,$3,$4,$5) RETURNING id`,
    [result.data.nombre, result.data.email, result.data.telefono, result.data.direccion, result.data.mensaje || ""]
  );

  revalidatePath("/admin/tasaciones");
  return { success: true };
}

export async function getTasaciones() {
  return query<TasacionRequest>(
    "SELECT * FROM tasacion_requests ORDER BY created_at DESC"
  );
}

export async function markTasacionRead(id: string) {
  await query("UPDATE tasacion_requests SET leido = true WHERE id = $1", [id]);
  revalidatePath("/admin/tasaciones");
}

export async function deleteTasacion(id: string) {
  await query("DELETE FROM tasacion_requests WHERE id = $1", [id]);
  revalidatePath("/admin/tasaciones");
}

export async function getUnreadTasacionCount() {
  return queryCount("SELECT count(*) FROM tasacion_requests WHERE leido = false");
}
