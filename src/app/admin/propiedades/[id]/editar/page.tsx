import { notFound } from "next/navigation";
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
