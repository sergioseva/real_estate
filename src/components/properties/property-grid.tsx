import { PropertyCard } from "./property-card";
import type { Property } from "@/types";

export function PropertyGrid({ properties }: { properties: Property[] }) {
  if (properties.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-lg text-muted-foreground">
          No se encontraron propiedades con los filtros seleccionados.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
}
