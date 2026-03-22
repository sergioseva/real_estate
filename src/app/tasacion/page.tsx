import { TasacionForm } from "@/components/forms/tasacion-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tasacion",
  description: "Solicita una tasacion gratuita de tu propiedad",
};

export default function TasacionPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-primary">Solicitar tasacion</h1>
        <p className="mt-2 text-muted-foreground">
          Completa el formulario y te enviaremos una tasacion sin cargo
        </p>
      </div>
      <div className="mt-10">
        <TasacionForm />
      </div>
    </div>
  );
}
