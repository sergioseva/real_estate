import Link from "next/link";
import { Bed, Home, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ThumbnailImage } from "@/components/ui/thumbnail-image";
import { formatPrice } from "@/lib/utils";
import type { Property } from "@/types";

export function PropertyCard({ property }: { property: Property }) {
  const mainImage = property.images?.sort((a, b) => a.display_order - b.display_order)[0];

  return (
    <Link href={`/propiedades/${property.slug}`} className="group block">
      <div className="overflow-hidden rounded-lg border border-border bg-white shadow-sm transition-shadow hover:shadow-md">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          {mainImage ? (
            <ThumbnailImage
              src={mainImage.url}
              alt={property.titulo}
              className="absolute inset-0 h-full w-full object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              <Home size={40} />
            </div>
          )}
          <div className="absolute left-3 top-3 flex gap-2">
            <Badge variant={property.operacion === "venta" ? "default" : "accent"}>
              {property.operacion === "venta" ? "Venta" : "Alquiler"}
            </Badge>
          </div>

          {/* Overlay con m² y dormitorios */}
          <div className="absolute bottom-0 left-0 right-0 flex items-center gap-4 bg-gradient-to-t from-black/70 to-transparent px-3 pb-2.5 pt-6 text-white">
            <span className="flex items-center gap-1.5 text-sm font-medium">
              {property.superficie_cubierta || 0} m²
              <Home size={15} />
            </span>
            <span className="flex items-center gap-1.5 text-sm font-medium">
              {property.dormitorios}
              <Bed size={15} />
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <p className="text-lg font-bold text-primary">
            {formatPrice(property.precio, property.moneda)}
          </p>
          <h3 className="mt-1 text-sm font-semibold text-foreground line-clamp-1">
            {property.titulo}
          </h3>
          <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin size={12} />
            {property.direccion}, {property.ciudad}
          </p>
        </div>
      </div>
    </Link>
  );
}
