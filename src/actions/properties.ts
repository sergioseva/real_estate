"use server";

import { query, queryOne, queryCount } from "@/lib/db";
import { slugify } from "@/lib/utils";
import { ITEMS_PER_PAGE, ADMIN_ITEMS_PER_PAGE, ADMIN_SORTABLE_COLUMNS } from "@/lib/constants";
import type { Property, PropertyFilters, PropertyImage } from "@/types";
import { revalidatePath } from "next/cache";
import { unlink, rmdir } from "fs/promises";
import { join } from "path";

async function attachImages(properties: Property[]): Promise<Property[]> {
  if (properties.length === 0) return [];
  const ids = properties.map((p) => p.id);
  const images = await query<PropertyImage>(
    `SELECT * FROM property_images WHERE property_id = ANY($1) ORDER BY display_order`,
    [ids]
  );
  const imageMap = new Map<string, PropertyImage[]>();
  for (const img of images) {
    const list = imageMap.get(img.property_id) || [];
    list.push(img);
    imageMap.set(img.property_id, list);
  }
  return properties.map((p) => ({ ...p, images: imageMap.get(p.id) || [] }));
}

export async function getProperties(filters: PropertyFilters = {}) {
  const page = filters.page || 1;
  const offset = (page - 1) * ITEMS_PER_PAGE;

  const conditions: string[] = ["activa = true", "archivada = false"];
  const params: unknown[] = [];
  let paramIdx = 1;

  if (filters.operacion) {
    conditions.push(`operacion = $${paramIdx++}`);
    params.push(filters.operacion);
  }
  if (filters.tipo_propiedad) {
    conditions.push(`tipo_propiedad = $${paramIdx++}`);
    params.push(filters.tipo_propiedad);
  }
  if (filters.ciudad) {
    conditions.push(`ciudad ILIKE $${paramIdx++}`);
    params.push(`%${filters.ciudad}%`);
  }
  if (filters.precio_min) {
    conditions.push(`precio >= $${paramIdx++}`);
    params.push(filters.precio_min);
  }
  if (filters.precio_max) {
    conditions.push(`precio <= $${paramIdx++}`);
    params.push(filters.precio_max);
  }
  if (filters.ambientes) {
    conditions.push(`ambientes >= $${paramIdx++}`);
    params.push(filters.ambientes);
  }
  if (filters.dormitorios) {
    conditions.push(`dormitorios >= $${paramIdx++}`);
    params.push(filters.dormitorios);
  }
  if (filters.search) {
    conditions.push(`(titulo ILIKE $${paramIdx} OR direccion ILIKE $${paramIdx} OR ciudad ILIKE $${paramIdx})`);
    params.push(`%${filters.search}%`);
    paramIdx++;
  }

  const where = conditions.join(" AND ");
  const countParams = [...params];
  const total = await queryCount(`SELECT count(*) FROM properties WHERE ${where}`, countParams);

  params.push(ITEMS_PER_PAGE, offset);
  const properties = await query<Property>(
    `SELECT * FROM properties WHERE ${where} ORDER BY created_at DESC LIMIT $${paramIdx++} OFFSET $${paramIdx++}`,
    params
  );

  const withImages = await attachImages(properties);

  return {
    properties: withImages,
    total,
    totalPages: Math.ceil(total / ITEMS_PER_PAGE),
    currentPage: page,
  };
}

export async function getFeaturedProperties() {
  const properties = await query<Property>(
    `SELECT * FROM properties WHERE activa = true AND archivada = false AND destacada = true ORDER BY created_at DESC LIMIT 6`
  );
  return attachImages(properties);
}

export async function getPropertyBySlug(slug: string) {
  const property = await queryOne<Property>(
    `SELECT * FROM properties WHERE slug = $1 AND activa = true AND archivada = false`,
    [slug]
  );
  if (!property) return null;
  const images = await query<PropertyImage>(
    `SELECT * FROM property_images WHERE property_id = $1 ORDER BY display_order`,
    [property.id]
  );
  return { ...property, images };
}

export async function getPropertyById(id: string) {
  const property = await queryOne<Property>(
    `SELECT * FROM properties WHERE id = $1`,
    [id]
  );
  if (!property) return null;
  const images = await query<PropertyImage>(
    `SELECT * FROM property_images WHERE property_id = $1 ORDER BY display_order`,
    [property.id]
  );
  return { ...property, images };
}

export async function getAllProperties(filter?: "activas" | "archivadas") {
  let where = "";
  if (filter === "archivadas") where = "WHERE archivada = true";
  else if (filter === "activas") where = "WHERE archivada = false";
  const properties = await query<Property>(
    `SELECT * FROM properties ${where} ORDER BY created_at DESC`
  );
  return attachImages(properties);
}

export async function getAdminProperties(filters: {
  filtro?: "activas" | "archivadas";
  busqueda?: string;
  operacion?: string;
  tipo_propiedad?: string;
  ciudad?: string;
  orden?: string;
  dir?: "asc" | "desc";
  pagina?: number;
  cantidad?: number;
} = {}) {
  const pageSize = filters.cantidad || ADMIN_ITEMS_PER_PAGE;
  const page = filters.pagina || 1;
  const offset = (page - 1) * pageSize;

  const conditions: string[] = [];
  const params: unknown[] = [];
  let paramIdx = 1;

  if (filters.filtro === "archivadas") {
    conditions.push("archivada = true");
  } else {
    conditions.push("archivada = false");
  }

  if (filters.busqueda) {
    conditions.push(`titulo ILIKE $${paramIdx++}`);
    params.push(`%${filters.busqueda}%`);
  }

  if (filters.operacion) {
    conditions.push(`operacion = $${paramIdx++}`);
    params.push(filters.operacion);
  }

  if (filters.tipo_propiedad) {
    conditions.push(`tipo_propiedad = $${paramIdx++}`);
    params.push(filters.tipo_propiedad);
  }

  if (filters.ciudad) {
    conditions.push(`ciudad ILIKE $${paramIdx++}`);
    params.push(`%${filters.ciudad}%`);
  }

  const where = conditions.join(" AND ");
  const countParams = [...params];
  const total = await queryCount(`SELECT count(*) FROM properties WHERE ${where}`, countParams);

  const sortCol = ADMIN_SORTABLE_COLUMNS[filters.orden || "fecha_alta"] || "fecha_alta";
  const sortDir = filters.dir === "asc" ? "ASC" : "DESC";

  params.push(pageSize, offset);
  const properties = await query<Property>(
    `SELECT * FROM properties WHERE ${where} ORDER BY ${sortCol} ${sortDir} LIMIT $${paramIdx++} OFFSET $${paramIdx++}`,
    params
  );

  return {
    properties,
    total,
    totalPages: Math.ceil(total / pageSize),
    currentPage: page,
    pageSize,
  };
}

export async function togglePropertyActive(id: string, activa: boolean) {
  await query("UPDATE properties SET activa = $1 WHERE id = $2", [activa, id]);
  revalidatePath("/", "layout");
}

export async function togglePropertyVendida(id: string, vendida: boolean) {
  await query("UPDATE properties SET vendida = $1 WHERE id = $2", [vendida, id]);
  revalidatePath("/", "layout");
}

export async function getAdminCities() {
  const rows = await query<{ ciudad: string }>(
    "SELECT DISTINCT ciudad FROM properties WHERE ciudad != '' ORDER BY ciudad"
  );
  return rows.map((r) => r.ciudad);
}

function extractPropertyData(formData: FormData) {
  return {
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
    vendida: formData.get("vendida") === "true",
  };
}

export async function createProperty(formData: FormData) {
  const d = extractPropertyData(formData);
  const slug = slugify(d.titulo) + "-" + Date.now().toString(36);

  const result = await queryOne<Property>(
    `INSERT INTO properties (titulo, slug, descripcion, precio, moneda, operacion, tipo_propiedad, direccion, ciudad, provincia, ambientes, dormitorios, banos, toilettes, cocheras, superficie_cubierta, superficie_total, antiguedad, antiguedad_anos, expensas, expensas_moneda, apto_credito, latitud, longitud, amenities, destacada, activa, vendida)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28)
     RETURNING *`,
    [d.titulo, slug, d.descripcion, d.precio, d.moneda, d.operacion, d.tipo_propiedad, d.direccion, d.ciudad, d.provincia, d.ambientes, d.dormitorios, d.banos, d.toilettes, d.cocheras, d.superficie_cubierta, d.superficie_total, d.antiguedad, d.antiguedad_anos, d.expensas, d.expensas_moneda, d.apto_credito, d.latitud, d.longitud, d.amenities, d.destacada, d.activa, d.vendida]
  );

  revalidatePath("/", "layout");
  return result as Property;
}

export async function updateProperty(id: string, formData: FormData) {
  const d = extractPropertyData(formData);

  await query(
    `UPDATE properties SET titulo=$1, descripcion=$2, precio=$3, moneda=$4, operacion=$5, tipo_propiedad=$6, direccion=$7, ciudad=$8, provincia=$9, ambientes=$10, dormitorios=$11, banos=$12, toilettes=$13, cocheras=$14, superficie_cubierta=$15, superficie_total=$16, antiguedad=$17, antiguedad_anos=$18, expensas=$19, expensas_moneda=$20, apto_credito=$21, latitud=$22, longitud=$23, amenities=$24, destacada=$25, activa=$26, vendida=$27
     WHERE id=$28`,
    [d.titulo, d.descripcion, d.precio, d.moneda, d.operacion, d.tipo_propiedad, d.direccion, d.ciudad, d.provincia, d.ambientes, d.dormitorios, d.banos, d.toilettes, d.cocheras, d.superficie_cubierta, d.superficie_total, d.antiguedad, d.antiguedad_anos, d.expensas, d.expensas_moneda, d.apto_credito, d.latitud, d.longitud, d.amenities, d.destacada, d.activa, d.vendida, id]
  );

  revalidatePath("/", "layout");
}

export async function archiveProperty(id: string) {
  await query("UPDATE properties SET archivada = true, fecha_archivada = now() WHERE id = $1", [id]);
  revalidatePath("/", "layout");
}

export async function unarchiveProperty(id: string) {
  await query("UPDATE properties SET archivada = false, fecha_archivada = NULL WHERE id = $1", [id]);
  revalidatePath("/", "layout");
}

export async function deleteProperty(id: string) {
  // Get all images to delete files from disk
  const images = await query<PropertyImage>(
    "SELECT * FROM property_images WHERE property_id = $1",
    [id]
  );

  // Delete image files from disk
  for (const img of images) {
    try {
      const filePath = join(process.cwd(), "public", img.storage_path);
      await unlink(filePath);
    } catch {
      // File may not exist, continue
    }
  }

  // Try to remove the property's upload directory
  try {
    const dirPath = join(process.cwd(), "public", "uploads", id);
    await rmdir(dirPath);
  } catch {
    // Directory may not exist or not be empty
  }

  // Delete property (cascade will remove image records)
  await query("DELETE FROM properties WHERE id = $1", [id]);
  revalidatePath("/", "layout");
}

export async function getPropertyStats() {
  const [total, activas, venta, alquiler, archivadas] = await Promise.all([
    queryCount("SELECT count(*) FROM properties WHERE archivada = false"),
    queryCount("SELECT count(*) FROM properties WHERE activa = true AND archivada = false"),
    queryCount("SELECT count(*) FROM properties WHERE operacion = 'venta' AND activa = true AND archivada = false"),
    queryCount("SELECT count(*) FROM properties WHERE operacion = 'alquiler' AND activa = true AND archivada = false"),
    queryCount("SELECT count(*) FROM properties WHERE archivada = true"),
  ]);
  return { total, activas, venta, alquiler, archivadas };
}

export async function getCities() {
  const rows = await query<{ ciudad: string }>(
    "SELECT DISTINCT ciudad FROM properties WHERE activa = true AND archivada = false AND ciudad != '' ORDER BY ciudad"
  );
  return rows.map((r) => r.ciudad);
}
