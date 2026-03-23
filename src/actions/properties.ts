"use server";

import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";
import { ITEMS_PER_PAGE } from "@/lib/constants";
import type { Property, PropertyFilters } from "@/types";
import { revalidatePath } from "next/cache";

export async function getProperties(filters: PropertyFilters = {}) {
  const supabase = await createClient();
  const page = filters.page || 1;
  const from = (page - 1) * ITEMS_PER_PAGE;
  const to = from + ITEMS_PER_PAGE - 1;

  let query = supabase
    .from("properties")
    .select("*, images:property_images(*)", { count: "exact" })
    .eq("activa", true)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (filters.operacion) {
    query = query.eq("operacion", filters.operacion);
  }
  if (filters.tipo_propiedad) {
    query = query.eq("tipo_propiedad", filters.tipo_propiedad);
  }
  if (filters.ciudad) {
    query = query.ilike("ciudad", `%${filters.ciudad}%`);
  }
  if (filters.precio_min) {
    query = query.gte("precio", filters.precio_min);
  }
  if (filters.precio_max) {
    query = query.lte("precio", filters.precio_max);
  }
  if (filters.ambientes) {
    query = query.gte("ambientes", filters.ambientes);
  }
  if (filters.dormitorios) {
    query = query.gte("dormitorios", filters.dormitorios);
  }
  if (filters.search) {
    query = query.or(
      `titulo.ilike.%${filters.search}%,direccion.ilike.%${filters.search}%,ciudad.ilike.%${filters.search}%`
    );
  }

  const { data, count, error } = await query;

  if (error) throw error;

  return {
    properties: (data as (Property & { images: Property["images"] })[]) || [],
    total: count || 0,
    totalPages: Math.ceil((count || 0) / ITEMS_PER_PAGE),
    currentPage: page,
  };
}

export async function getFeaturedProperties() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("properties")
    .select("*, images:property_images(*)")
    .eq("activa", true)
    .eq("destacada", true)
    .order("created_at", { ascending: false })
    .limit(6);

  if (error) throw error;
  return (data as Property[]) || [];
}

export async function getPropertyBySlug(slug: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("properties")
    .select("*, images:property_images(*)")
    .eq("slug", slug)
    .eq("activa", true)
    .single();

  if (error) return null;

  // Sort images by display_order
  if (data?.images) {
    data.images.sort((a: { display_order: number }, b: { display_order: number }) => a.display_order - b.display_order);
  }

  return data as Property;
}

export async function getPropertyById(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("properties")
    .select("*, images:property_images(*)")
    .eq("id", id)
    .single();

  if (error) return null;

  if (data?.images) {
    data.images.sort((a: { display_order: number }, b: { display_order: number }) => a.display_order - b.display_order);
  }

  return data as Property;
}

export async function getAllProperties() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("properties")
    .select("*, images:property_images(*)")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data as Property[]) || [];
}

export async function createProperty(formData: FormData) {
  const supabase = await createClient();

  const titulo = formData.get("titulo") as string;
  const slug = slugify(titulo) + "-" + Date.now().toString(36);

  const propertyData = {
    titulo,
    slug,
    descripcion: formData.get("descripcion") as string,
    precio: Number(formData.get("precio")),
    moneda: formData.get("moneda") as string,
    operacion: formData.get("operacion") as string,
    tipo_propiedad: formData.get("tipo_propiedad") as string,
    direccion: formData.get("direccion") as string,
    ciudad: formData.get("ciudad") as string,
    provincia: formData.get("provincia") as string,
    ambientes: Number(formData.get("ambientes")),
    dormitorios: Number(formData.get("dormitorios")),
    banos: Number(formData.get("banos")),
    toilettes: Number(formData.get("toilettes")),
    cocheras: Number(formData.get("cocheras")),
    superficie_cubierta: Number(formData.get("superficie_cubierta")),
    superficie_total: Number(formData.get("superficie_total")),
    antiguedad: formData.get("antiguedad") as string,
    antiguedad_anos: Number(formData.get("antiguedad_anos") || 0),
    expensas: Number(formData.get("expensas") || 0),
    expensas_moneda: (formData.get("expensas_moneda") as string) || "ARS",
    apto_credito: formData.get("apto_credito") === "true",
    latitud: formData.get("latitud") ? Number(formData.get("latitud")) : null,
    longitud: formData.get("longitud") ? Number(formData.get("longitud")) : null,
    amenities: JSON.parse((formData.get("amenities") as string) || "[]"),
    destacada: formData.get("destacada") === "true",
    activa: formData.get("activa") === "true",
  };

  const { data, error } = await supabase
    .from("properties")
    .insert(propertyData)
    .select()
    .single();

  if (error) throw error;

  revalidatePath("/");
  revalidatePath("/propiedades");
  revalidatePath("/admin/propiedades");

  return data as Property;
}

export async function updateProperty(id: string, formData: FormData) {
  const supabase = await createClient();

  const propertyData = {
    titulo: formData.get("titulo") as string,
    descripcion: formData.get("descripcion") as string,
    precio: Number(formData.get("precio")),
    moneda: formData.get("moneda") as string,
    operacion: formData.get("operacion") as string,
    tipo_propiedad: formData.get("tipo_propiedad") as string,
    direccion: formData.get("direccion") as string,
    ciudad: formData.get("ciudad") as string,
    provincia: formData.get("provincia") as string,
    ambientes: Number(formData.get("ambientes")),
    dormitorios: Number(formData.get("dormitorios")),
    banos: Number(formData.get("banos")),
    toilettes: Number(formData.get("toilettes")),
    cocheras: Number(formData.get("cocheras")),
    superficie_cubierta: Number(formData.get("superficie_cubierta")),
    superficie_total: Number(formData.get("superficie_total")),
    antiguedad: formData.get("antiguedad") as string,
    antiguedad_anos: Number(formData.get("antiguedad_anos") || 0),
    expensas: Number(formData.get("expensas") || 0),
    expensas_moneda: (formData.get("expensas_moneda") as string) || "ARS",
    apto_credito: formData.get("apto_credito") === "true",
    latitud: formData.get("latitud") ? Number(formData.get("latitud")) : null,
    longitud: formData.get("longitud") ? Number(formData.get("longitud")) : null,
    amenities: JSON.parse((formData.get("amenities") as string) || "[]"),
    destacada: formData.get("destacada") === "true",
    activa: formData.get("activa") === "true",
  };

  const { error } = await supabase
    .from("properties")
    .update(propertyData)
    .eq("id", id);

  if (error) throw error;

  revalidatePath("/");
  revalidatePath("/propiedades");
  revalidatePath("/admin/propiedades");
}

export async function deleteProperty(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("properties").delete().eq("id", id);

  if (error) throw error;

  revalidatePath("/");
  revalidatePath("/propiedades");
  revalidatePath("/admin/propiedades");
}

export async function getPropertyStats() {
  const supabase = await createClient();

  const [
    { count: total },
    { count: activas },
    { count: venta },
    { count: alquiler },
  ] = await Promise.all([
    supabase.from("properties").select("*", { count: "exact", head: true }),
    supabase.from("properties").select("*", { count: "exact", head: true }).eq("activa", true),
    supabase.from("properties").select("*", { count: "exact", head: true }).eq("operacion", "venta").eq("activa", true),
    supabase.from("properties").select("*", { count: "exact", head: true }).eq("operacion", "alquiler").eq("activa", true),
  ]);

  return {
    total: total || 0,
    activas: activas || 0,
    venta: venta || 0,
    alquiler: alquiler || 0,
  };
}

export async function getCities() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("properties")
    .select("ciudad")
    .eq("activa", true);

  if (error) return [];

  const cities = [...new Set((data || []).map((p) => p.ciudad).filter(Boolean))];
  return cities.sort();
}
