import Link from "next/link";
import { Suspense } from "react";
import { Plus, Edit, Archive } from "lucide-react";
import { getAdminProperties, getAdminCities } from "@/actions/properties";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArchiveButton, UnarchiveButton, DeleteButton, ActiveToggle, VendidaToggle } from "@/components/admin/property-actions";
import { AdminPropertyFilters } from "@/components/admin/property-filters";
import { SortableHeader } from "@/components/admin/sortable-header";
import { AdminPagination } from "@/components/admin/admin-pagination";
import { formatPrice, formatDate } from "@/lib/utils";
import { ADMIN_ITEMS_PER_PAGE } from "@/lib/constants";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Administrar Propiedades",
};

export default async function AdminPropiedadesPage({
  searchParams,
}: {
  searchParams: Promise<{
    filtro?: string;
    busqueda?: string;
    operacion?: string;
    tipo_propiedad?: string;
    ciudad?: string;
    orden?: string;
    dir?: string;
    pagina?: string;
    cantidad?: string;
  }>;
}) {
  const params = await searchParams;
  const showArchived = params.filtro === "archivadas";
  const orden = params.orden || "fecha_alta";
  const dir = (params.dir === "asc" ? "asc" : "desc") as "asc" | "desc";

  const [result, cities] = await Promise.all([
    getAdminProperties({
      filtro: showArchived ? "archivadas" : "activas",
      busqueda: params.busqueda,
      operacion: params.operacion,
      tipo_propiedad: params.tipo_propiedad,
      ciudad: params.ciudad,
      orden,
      dir,
      pagina: params.pagina ? Number(params.pagina) : 1,
      cantidad: params.cantidad ? Number(params.cantidad) : ADMIN_ITEMS_PER_PAGE,
    }),
    getAdminCities(),
  ]);

  const { properties, total, totalPages, currentPage, pageSize } = result;

  const currentQs = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value) currentQs.set(key, value);
  }
  const returnUrl = `/admin/propiedades${currentQs.size ? `?${currentQs.toString()}` : ""}`;

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">Propiedades</h1>
          <p className="text-muted-foreground">
            {total} propiedad{total !== 1 ? "es" : ""}
            {showArchived ? " archivadas" : ""}
          </p>
        </div>
        {!showArchived && (
          <Button href="/admin/propiedades/nueva">
            <Plus size={16} className="mr-2" />
            Nueva propiedad
          </Button>
        )}
      </div>

      {/* Tabs */}
      <div className="mt-4 flex gap-2 border-b border-border">
        <Link
          href="/admin/propiedades"
          className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
            !showArchived
              ? "border-accent text-accent"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Activas
        </Link>
        <Link
          href="/admin/propiedades?filtro=archivadas"
          className={`inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
            showArchived
              ? "border-accent text-accent"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Archive size={14} />
          Archivadas
        </Link>
      </div>

      {/* Filters */}
      <div className="mt-4">
        <Suspense>
          <AdminPropertyFilters cities={cities} />
        </Suspense>
      </div>

      {/* Mobile: card layout */}
      <div className="mt-6 space-y-3 md:hidden">
        {properties.map((property) => (
          <div key={property.id} className="rounded-lg border border-border bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-medium text-sm leading-tight">
                <Link href={`/admin/propiedades/${property.id}/editar?returnUrl=${encodeURIComponent(returnUrl)}`} className="hover:text-accent">
                  {property.titulo}
                </Link>
              </h3>
              <div className="flex shrink-0 items-center gap-2">
                {!showArchived && (
                  <Link
                    href={`/admin/propiedades/${property.id}/editar?returnUrl=${encodeURIComponent(returnUrl)}`}
                    className="text-accent hover:text-accent-light"
                    title="Editar"
                  >
                    <Edit size={16} />
                  </Link>
                )}
                {showArchived ? (
                  <>
                    <UnarchiveButton propertyId={property.id} />
                    <DeleteButton propertyId={property.id} propertyTitle={property.titulo} />
                  </>
                ) : (
                  <ArchiveButton propertyId={property.id} />
                )}
              </div>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
              <Badge variant={property.operacion === "venta" ? "default" : "accent"}>
                {property.operacion}
              </Badge>
              <span className="text-xs text-muted-foreground">{property.tipo_propiedad}</span>
              {!showArchived && (
                <>
                  <label className="flex items-center gap-1 text-xs">
                    <ActiveToggle propertyId={property.id} activa={property.activa} />
                    Activa
                  </label>
                  <label className="flex items-center gap-1 text-xs">
                    <VendidaToggle propertyId={property.id} vendida={property.vendida} operacion={property.operacion} />
                    {property.operacion === "alquiler" ? "Alquilada" : "Vendida"}
                  </label>
                </>
              )}
            </div>
            <div className="mt-2 flex items-center justify-between text-sm">
              <span className="font-medium">{formatPrice(property.precio, property.moneda)}</span>
              <span className="text-muted-foreground text-xs">{property.ciudad}</span>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              Alta: {formatDate(property.fecha_alta)}
              {showArchived && property.fecha_archivada && (
                <> · Archivada: {formatDate(property.fecha_archivada)}</>
              )}
            </div>
          </div>
        ))}
        {properties.length === 0 && (
          <div className="py-12 text-center text-muted-foreground">
            {showArchived
              ? "No hay propiedades archivadas."
              : "No hay propiedades. Crea la primera."}
          </div>
        )}
      </div>

      {/* Desktop: table layout */}
      <div className="mt-6 hidden overflow-hidden rounded-lg border border-border bg-white shadow-sm md:block">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-muted">
            <tr>
              <SortableHeader column="titulo" label="Titulo" currentSort={orden} currentDir={dir} />
              <SortableHeader column="operacion" label="Operacion" currentSort={orden} currentDir={dir} />
              <SortableHeader column="tipo" label="Tipo" currentSort={orden} currentDir={dir} />
              <SortableHeader column="precio" label="Precio" currentSort={orden} currentDir={dir} />
              <SortableHeader column="ciudad" label="Ciudad" currentSort={orden} currentDir={dir} />
              {!showArchived && (
                <>
                  <SortableHeader column="activa" label="Activa" currentSort={orden} currentDir={dir} />
                  <SortableHeader column="vendida" label="Cerrada" currentSort={orden} currentDir={dir} />
                </>
              )}
              <SortableHeader column="fecha_alta" label="Fecha alta" currentSort={orden} currentDir={dir} />
              {showArchived && (
                <SortableHeader column="fecha_archivada" label="Fecha archivada" currentSort={orden} currentDir={dir} />
              )}
              <th className="px-3 py-3 font-medium text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {properties.map((property) => (
              <tr key={property.id} className="hover:bg-muted/50">
                <td className="px-4 py-3 font-medium">
                  <Link href={`/admin/propiedades/${property.id}/editar?returnUrl=${encodeURIComponent(returnUrl)}`} className="hover:text-accent">
                    {property.titulo}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <Badge variant={property.operacion === "venta" ? "default" : "accent"}>
                    {property.operacion}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                  {property.tipo_propiedad}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {formatPrice(property.precio, property.moneda)}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {property.ciudad}
                </td>
                {!showArchived && (
                  <>
                    <td className="px-4 py-3 text-center">
                      <ActiveToggle propertyId={property.id} activa={property.activa} />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <VendidaToggle propertyId={property.id} vendida={property.vendida} operacion={property.operacion} />
                    </td>
                  </>
                )}
                <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                  {formatDate(property.fecha_alta)}
                </td>
                {showArchived && (
                  <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                    {property.fecha_archivada ? formatDate(property.fecha_archivada) : "—"}
                  </td>
                )}
                <td className="px-3 py-3">
                  <div className="flex items-center justify-center gap-2">
                    {!showArchived && (
                      <Link
                        href={`/admin/propiedades/${property.id}/editar?returnUrl=${encodeURIComponent(returnUrl)}`}
                        className="text-accent hover:text-accent-light"
                        title="Editar"
                      >
                        <Edit size={16} />
                      </Link>
                    )}
                    {showArchived ? (
                      <>
                        <UnarchiveButton propertyId={property.id} />
                        <DeleteButton propertyId={property.id} propertyTitle={property.titulo} />
                      </>
                    ) : (
                      <ArchiveButton propertyId={property.id} />
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {properties.length === 0 && (
              <tr>
                <td colSpan={showArchived ? 8 : 8} className="px-4 py-8 text-center text-muted-foreground">
                  {showArchived
                    ? "No hay propiedades archivadas."
                    : "No hay propiedades. Crea la primera."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <Suspense>
        <AdminPagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          total={total}
        />
      </Suspense>
    </div>
  );
}
