import { PropertyCard } from "@/components/properties/property-card";
import { Button } from "@/components/ui/button";
import type { Property } from "@/types";

export function FeaturedProperties({ properties }: { properties: Property[] }) {
  if (properties.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-primary">Propiedades destacadas</h2>
        <p className="mt-2 text-muted-foreground">
          Seleccion de las mejores propiedades disponibles
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {properties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>

      <div className="mt-10 text-center">
        <Button href="/propiedades" variant="outline" size="lg">
          Ver todas las propiedades
        </Button>
      </div>
    </section>
  );
}
