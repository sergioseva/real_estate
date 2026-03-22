"use client";

import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { TIPOS_PROPIEDAD, OPERACIONES } from "@/lib/constants";

export function HeroSection() {
  const router = useRouter();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const params = new URLSearchParams();

    for (const [key, value] of formData.entries()) {
      if (value) params.set(key, value as string);
    }

    router.push(`/propiedades?${params.toString()}`);
  };

  return (
    <section className="relative flex min-h-[500px] items-center justify-center bg-primary px-4 py-20">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-dark to-primary opacity-90" />

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
          Encontra tu proximo hogar
        </h1>
        <p className="mt-4 text-lg text-white/70">
          Propiedades en venta y alquiler en las mejores ubicaciones
        </p>

        {/* Search bar */}
        <form
          onSubmit={handleSearch}
          className="mt-10 rounded-xl bg-white p-4 shadow-xl sm:p-6"
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
            <Select
              name="operacion"
              placeholder="Operacion"
              options={OPERACIONES.map((o) => ({ value: o.value, label: o.label }))}
            />
            <Select
              name="tipo_propiedad"
              placeholder="Tipo de propiedad"
              options={TIPOS_PROPIEDAD.map((t) => ({ value: t, label: t }))}
            />
            <input
              name="ciudad"
              placeholder="Ciudad o zona..."
              className="w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
            <Button type="submit" size="lg" className="w-full">
              <Search size={18} className="mr-2" />
              Buscar
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}
