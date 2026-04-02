import { notFound } from "next/navigation";
import { Bed, Bath, Home, MapPin, Car, Ruler, Calendar, BadgeCheck, DoorOpen } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";
import { getPropertyBySlug } from "@/actions/properties";
import { Gallery } from "@/components/properties/gallery";
import { PropertyMapWrapper } from "@/components/properties/property-map-wrapper";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice, buildWhatsAppUrl } from "@/lib/utils";
import { SITE_NAME } from "@/lib/constants";
import { getContactInfo } from "@/actions/settings";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  if (!property) return { title: "Propiedad no encontrada" };

  return {
    title: property.titulo,
    description: `${property.tipo_propiedad} en ${property.operacion} - ${formatPrice(property.precio, property.moneda)} - ${property.ciudad}`,
  };
}

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);

  if (!property) notFound();

  const contactInfo = await getContactInfo();
  const whatsappUrl = buildWhatsAppUrl(
    contactInfo.whatsapp_number,
    `Hola! Estoy interesado en la propiedad: ${property.titulo} (${property.operacion}). Link: ${property.slug}`
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left: Gallery + Description */}
        <div className="lg:col-span-2">
          <Gallery images={property.images || []} vendida={property.vendida} operacion={property.operacion} />

          <div className="mt-6">
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant={property.operacion === "venta" ? "default" : "accent"}>
                {property.operacion === "venta" ? "Venta" : "Alquiler"}
              </Badge>
              <Badge variant="outline">{property.tipo_propiedad}</Badge>
            </div>

            <h1 className="mt-4 text-3xl font-bold text-primary">
              {property.titulo}
            </h1>

            <p className="mt-2 flex items-center gap-2 text-muted-foreground">
              <MapPin size={16} />
              {property.direccion}, {property.ciudad}, {property.provincia}
            </p>

            <p className="mt-4 text-3xl font-bold text-accent">
              {formatPrice(property.precio, property.moneda)}
            </p>
            {property.expensas > 0 && (
              <p className="mt-1 text-sm text-muted-foreground">
                + Expensas: {property.expensas_moneda} {property.expensas.toLocaleString()}
              </p>
            )}

            {/* Features grid */}
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {property.ambientes > 0 && (
                <div className="flex items-center gap-2 rounded-lg border border-border p-3">
                  <Home size={20} className="text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{property.ambientes}</p>
                    <p className="text-xs text-muted-foreground">Ambientes</p>
                  </div>
                </div>
              )}
              {property.dormitorios > 0 && (
                <div className="flex items-center gap-2 rounded-lg border border-border p-3">
                  <Bed size={20} className="text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{property.dormitorios}</p>
                    <p className="text-xs text-muted-foreground">Dormitorios</p>
                  </div>
                </div>
              )}
              {property.banos > 0 && (
                <div className="flex items-center gap-2 rounded-lg border border-border p-3">
                  <Bath size={20} className="text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{property.banos}</p>
                    <p className="text-xs text-muted-foreground">Baños</p>
                  </div>
                </div>
              )}
              {property.toilettes > 0 && (
                <div className="flex items-center gap-2 rounded-lg border border-border p-3">
                  <DoorOpen size={20} className="text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{property.toilettes}</p>
                    <p className="text-xs text-muted-foreground">Toilettes</p>
                  </div>
                </div>
              )}
              {property.cocheras > 0 && (
                <div className="flex items-center gap-2 rounded-lg border border-border p-3">
                  <Car size={20} className="text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{property.cocheras}</p>
                    <p className="text-xs text-muted-foreground">Cocheras</p>
                  </div>
                </div>
              )}
              {property.superficie_cubierta > 0 && (
                <div className="flex items-center gap-2 rounded-lg border border-border p-3">
                  <Ruler size={20} className="text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{property.superficie_cubierta} m²</p>
                    <p className="text-xs text-muted-foreground">Sup. cubierta</p>
                  </div>
                </div>
              )}
              {property.superficie_total > 0 && (
                <div className="flex items-center gap-2 rounded-lg border border-border p-3">
                  <Ruler size={20} className="text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{property.superficie_total} m²</p>
                    <p className="text-xs text-muted-foreground">Sup. total</p>
                  </div>
                </div>
              )}
              {property.antiguedad && (
                <div className="flex items-center gap-2 rounded-lg border border-border p-3">
                  <Calendar size={20} className="text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">
                      {property.antiguedad === "a_estrenar"
                        ? "A estrenar"
                        : property.antiguedad === "en_construccion"
                          ? "En construcción"
                          : `${property.antiguedad_anos} años`}
                    </p>
                    <p className="text-xs text-muted-foreground">Antigüedad</p>
                  </div>
                </div>
              )}
              {property.apto_credito && (
                <div className="flex items-center gap-2 rounded-lg border border-border p-3">
                  <BadgeCheck size={20} className="text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Sí</p>
                    <p className="text-xs text-muted-foreground">Apto crédito</p>
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            {property.descripcion && (
              <div className="mt-8">
                <h2 className="text-xl font-semibold text-primary">Descripcion</h2>
                <div className="mt-3 whitespace-pre-line text-muted-foreground">
                  {property.descripcion}
                </div>
              </div>
            )}

            {/* Amenities */}
            {property.amenities && property.amenities.length > 0 && (
              <div className="mt-8">
                <h2 className="text-xl font-semibold text-primary">Amenities</h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {property.amenities.map((amenity) => (
                    <Badge key={amenity} variant="outline">
                      {amenity}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Mapa */}
            {property.latitud && property.longitud && (
              <PropertyMapWrapper
                lat={property.latitud}
                lng={property.longitud}
                titulo={property.titulo}
              />
            )}
          </div>
        </div>

        {/* Right: Contact sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-lg border border-border bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-primary">
              Consultar por esta propiedad
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Contactanos para mas informacion o agendar una visita.
            </p>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-md bg-green-500 px-4 py-3 text-sm font-medium text-white hover:bg-green-600 transition-colors"
            >
              <WhatsAppIcon size={18} />
              Consultar por WhatsApp
            </a>
            <div className="mt-6 border-t border-border pt-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">
                {SITE_NAME}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
