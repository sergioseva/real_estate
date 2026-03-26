import Link from "next/link";
import { Plus, Edit, Eye, EyeOff, Archive } from "lucide-react";
import { getAllProperties } from "@/actions/properties";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArchiveButton, UnarchiveButton, DeleteButton } from "@/components/admin/property-actions";
import { formatPrice, formatDate } from "@/lib/utils";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Administrar Propiedades",
};

export default async function AdminPropiedadesPage({
  searchParams,
}: {
  searchParams: Promise<{ filtro?: string }>;
}) {
  const { filtro } = await searchParams;
  const showArchived = filtro === "archivadas";
  const filter = showArchived ? "archivadas" : "activas";
  const properties = await getAllProperties(filter);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">Propiedades</h1>
          <p className="text-muted-foreground">
            {properties.length} propiedad{properties.length !== 1 ? "es" : ""}
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

      {/* Mobile: card layout */}
      <div className="mt-6 space-y-3 md:hidden">
        {properties.map((property) => (
          <div key={property.id} className="rounded-lg border border-border bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-medium text-sm leading-tight">{property.titulo}</h3>
              {!showArchived && (
                <Link
                  href={`/admin/propiedades/${property.id}/editar`}
                  className="shrink-0 inline-flex items-center gap-1 text-accent hover:text-accent-light text-sm"
                >
                  <Edit size={14} />
                  Editar
                </Link>
              )}
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
              <Badge variant={property.operacion === "venta" ? "default" : "accent"}>
                {property.operacion}
              </Badge>
              {property.activa ? (
                <span className="flex items-center gap-1 text-green-600 text-xs">
                  <Eye size={12} /> Activa
                </span>
              ) : (
                <span className="flex items-center gap-1 text-muted-foreground text-xs">
                  <EyeOff size={12} /> Inactiva
                </span>
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
            <div className="mt-3 flex items-center gap-3 border-t border-border pt-3">
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
              <th className="px-4 py-3 font-medium">Titulo</th>
              <th className="px-4 py-3 font-medium">Operacion</th>
              <th className="px-4 py-3 font-medium">Precio</th>
              <th className="px-4 py-3 font-medium">Ciudad</th>
              <th className="px-4 py-3 font-medium">Estado</th>
              <th className="px-4 py-3 font-medium">Fecha alta</th>
              {showArchived && <th className="px-4 py-3 font-medium">Fecha archivada</th>}
              <th className="px-4 py-3 font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {properties.map((property) => (
              <tr key={property.id} className="hover:bg-muted/50">
                <td className="px-4 py-3 font-medium">{property.titulo}</td>
                <td className="px-4 py-3">
                  <Badge
                    variant={
                      property.operacion === "venta" ? "default" : "accent"
                    }
                  >
                    {property.operacion}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  {formatPrice(property.precio, property.moneda)}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {property.ciudad}
                </td>
                <td className="px-4 py-3">
                  {property.activa ? (
                    <span className="flex items-center gap-1 text-green-600">
                      <Eye size={14} /> Activa
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <EyeOff size={14} /> Inactiva
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                  {formatDate(property.fecha_alta)}
                </td>
                {showArchived && (
                  <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                    {property.fecha_archivada ? formatDate(property.fecha_archivada) : "—"}
                  </td>
                )}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {!showArchived && (
                      <Link
                        href={`/admin/propiedades/${property.id}/editar`}
                        className="inline-flex items-center gap-1 text-accent hover:text-accent-light"
                      >
                        <Edit size={14} />
                        Editar
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
                <td colSpan={showArchived ? 8 : 7} className="px-4 py-8 text-center text-muted-foreground">
                  {showArchived
                    ? "No hay propiedades archivadas."
                    : "No hay propiedades. Crea la primera."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
