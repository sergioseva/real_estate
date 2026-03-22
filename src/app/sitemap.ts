import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();

  const { data: properties } = await supabase
    .from("properties")
    .select("slug, updated_at")
    .eq("activa", true);

  const propertyUrls =
    properties?.map((p) => ({
      url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://matiasperezinmuebles.com"}/propiedades/${p.slug}`,
      lastModified: new Date(p.updated_at),
    })) || [];

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://matiasperezinmuebles.com";

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
