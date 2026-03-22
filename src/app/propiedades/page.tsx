import { Suspense } from "react";
import { getProperties, getCities } from "@/actions/properties";
import { PropertyGrid } from "@/components/properties/property-grid";
import { PropertyFilters } from "@/components/properties/property-filters";
import { Pagination } from "@/components/properties/pagination";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Propiedades",
};

export default async function PropiedadesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const filters = {
    operacion: params.operacion,
    tipo_propiedad: params.tipo_propiedad,
    ciudad: params.ciudad,
    ambientes: params.ambientes ? Number(params.ambientes) : undefined,
    dormitorios: params.dormitorios ? Number(params.dormitorios) : undefined,
    search: params.search,
    page: params.page ? Number(params.page) : 1,
  };

  const [{ properties, totalPages, currentPage }, cities] = await Promise.all([
    getProperties(filters),
    getCities(),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-primary">Propiedades</h1>
      <p className="mt-2 text-muted-foreground">
        Encontra la propiedad ideal para vos
      </p>

      <div className="mt-6">
        <Suspense fallback={null}>
          <PropertyFilters cities={cities} />
        </Suspense>
      </div>

      <div className="mt-8">
        <PropertyGrid properties={properties} />
      </div>

      <Pagination currentPage={currentPage} totalPages={totalPages} />
    </div>
  );
}
