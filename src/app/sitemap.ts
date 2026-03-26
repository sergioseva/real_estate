import type { MetadataRoute } from "next";
import { query } from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const properties = await query<{ slug: string; updated_at: string }>(
    "SELECT slug, updated_at FROM properties WHERE activa = true AND archivada = false"
  );

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://matiasperezinmuebles.com.ar";

  const propertyUrls = properties.map((p) => ({
    url: `${baseUrl}/propiedades/${p.slug}`,
    lastModified: new Date(p.updated_at),
  }));

  return [
    { url: baseUrl, lastModified: new Date() },
    { url: `${baseUrl}/propiedades`, lastModified: new Date() },
    { url: `${baseUrl}/alquiler`, lastModified: new Date() },
    { url: `${baseUrl}/venta`, lastModified: new Date() },
    { url: `${baseUrl}/tasacion`, lastModified: new Date() },
    { url: `${baseUrl}/nosotros`, lastModified: new Date() },
    { url: `${baseUrl}/contacto`, lastModified: new Date() },
    ...propertyUrls,
  ];
}
