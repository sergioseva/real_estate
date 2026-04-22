import { Suspense } from "react";
import { getProperties, getCities } from "@/actions/properties";
import { PropertyGrid } from "@/components/properties/property-grid";
import { PropertyFilters } from "@/components/properties/property-filters";
import { PropertySort } from "@/components/properties/property-sort";
import { Pagination } from "@/components/properties/pagination";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Propiedades",
};

const toNum = (v?: string) => (v ? Number(v) : undefined);
const toMoneda = (v?: string): "ARS" | "USD" | undefined =>
  v === "ARS" || v === "USD" ? v : undefined;

export default async function PropiedadesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const filters = {
    operacion: params.operacion,
    tipo_propiedad: params.tipo_propiedad,
    provincia: params.provincia,
    ciudad: params.ciudad,
    moneda: toMoneda(params.moneda),
    precio_min: toNum(params.precio_min),
    precio_max: toNum(params.precio_max),
    ambientes: toNum(params.ambientes),
    dormitorios: toNum(params.dormitorios),
    apto_credito: params.apto_credito === "true" ? true : undefined,
    antiguedad: params.antiguedad,
    superficie_cubierta_min: toNum(params.superficie_cubierta_min),
    superficie_cubierta_max: toNum(params.superficie_cubierta_max),
    superficie_total_min: toNum(params.superficie_total_min),
    superficie_total_max: toNum(params.superficie_total_max),
    search: params.search,
    orden: params.orden,
    page: toNum(params.page) ?? 1,
  };

  const [{ properties, total, totalPages, currentPage }, cities] = await Promise.all([
    getProperties(filters),
    getCities(),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-primary">Propiedades</h1>
      <p className="mt-2 text-muted-foreground">
        Encontra la propiedad ideal para vos
      </p>

      <div className="mt-6 md:grid md:grid-cols-[280px_1fr] md:gap-6">
        <aside>
          <Suspense fallback={null}>
            <PropertyFilters cities={cities} />
          </Suspense>
        </aside>

        <div className="mt-4 md:mt-0">
          <div className="mb-4 flex items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              {total} {total === 1 ? "propiedad" : "propiedades"}
            </p>
            <Suspense fallback={null}>
              <PropertySort />
            </Suspense>
          </div>
          <PropertyGrid properties={properties} />
          <Pagination currentPage={currentPage} totalPages={totalPages} />
        </div>
      </div>
    </div>
  );
}
