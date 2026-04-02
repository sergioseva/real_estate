import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getPropertyById } from "@/actions/properties";
import { PropertyForm } from "@/components/admin/property-form";
import { ImageUploader } from "@/components/admin/image-uploader";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Editar Propiedad",
};

export default async function EditarPropiedadPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ returnUrl?: string }>;
}) {
  const [{ id }, { returnUrl }] = await Promise.all([params, searchParams]);
  const property = await getPropertyById(id);

  if (!property) notFound();

  return (
    <div>
      <Link
        href={returnUrl || "/admin/propiedades"}
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-2"
      >
        <ArrowLeft size={16} />
        Volver a propiedades
      </Link>
      <h1 className="text-2xl font-bold text-primary">Editar propiedad</h1>
      <p className="text-muted-foreground">{property.titulo}</p>

      <div className="mt-6 space-y-6">
        <ImageUploader
          propertyId={property.id}
          initialImages={property.images || []}
        />
        <PropertyForm property={property} returnUrl={returnUrl} />
      </div>
    </div>
  );
}
