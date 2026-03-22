import { PropertyForm } from "@/components/admin/property-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nueva Propiedad",
};

export default function NuevaPropiedadPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-primary">Nueva propiedad</h1>
      <p className="text-muted-foreground">
        Completa los datos para publicar una propiedad
      </p>
      <div className="mt-6">
        <PropertyForm />
      </div>
    </div>
  );
}
