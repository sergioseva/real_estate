import Link from "next/link";
import { Plus, Edit, Eye, EyeOff } from "lucide-react";
import { getAllProperties } from "@/actions/properties";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Administrar Propiedades",
};

export default async function AdminPropiedadesPage() {
  const properties = await getAllProperties();

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">Propiedades</h1>
          <p className="text-muted-foreground">
            {properties.length} propiedad{properties.length !== 1 ? "es" : ""}
          </p>
        </div>
        <Button href="/admin/propiedades/nueva">
          <Plus size={16} className="mr-2" />
          Nueva propiedad
        </Button>
      </div>

      {/* Mobile: card layout */}
      <div className="mt-6 space-y-3 md:hidden">
        {properties.map((property) => (
          <div key={property.id} className="rounded-lg border border-border bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-medium text-sm leading-tight">{property.titulo}</h3>
              <Link
                href={`/admin/propiedades/${property.id}/editar`}
                className="shrink-0 inline-flex items-center gap-1 text-accent hover:text-accent-light text-sm"
              >
                <Edit size={14} />
                Editar
              </Link>
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
          </div>
        ))}
        {properties.length === 0 && (
          <div className="py-12 text-center text-muted-foreground">
            No hay propiedades. Crea la primera.
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
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/propiedades/${property.id}/editar`}
                    className="inline-flex items-center gap-1 text-accent hover:text-accent-light"
                  >
                    <Edit size={14} />
                    Editar
                  </Link>
                </td>
              </tr>
            ))}
            {properties.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                  No hay propiedades. Crea la primera.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
