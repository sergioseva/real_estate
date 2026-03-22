"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { TIPOS_PROPIEDAD, OPERACIONES } from "@/lib/constants";

export function PropertyFilters({ cities }: { cities: string[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const params = new URLSearchParams();

      for (const [key, value] of formData.entries()) {
        if (value) params.set(key, value as string);
      }

      router.push(`/propiedades?${params.toString()}`);
    },
    [router]
  );

  const handleReset = useCallback(() => {
    router.push("/propiedades");
  }, [router]);

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-border bg-white p-4 shadow-sm">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7">
        <Input
          name="search"
          placeholder="Buscar..."
          defaultValue={searchParams.get("search") || ""}
        />
        <Select
          name="operacion"
          placeholder="Operacion"
          defaultValue={searchParams.get("operacion") || ""}
          options={OPERACIONES.map((o) => ({ value: o.value, label: o.label }))}
        />
        <Select
          name="ambientes"
          placeholder="Ambientes"
          defaultValue={searchParams.get("ambientes") || ""}
          options={[1, 2, 3, 4, 5].map((n) => ({
            value: n.toString(),
            label: `${n}+`,
          }))}
        />
        <Select
          name="tipo_propiedad"
          placeholder="Tipo"
          defaultValue={searchParams.get("tipo_propiedad") || ""}
          options={TIPOS_PROPIEDAD.map((t) => ({ value: t, label: t }))}
        />
        <Select
          name="ciudad"
          placeholder="Ciudad"
          defaultValue={searchParams.get("ciudad") || ""}
          options={cities.map((c) => ({ value: c, label: c }))}
        />
        <Select
          name="dormitorios"
          placeholder="Dormitorios"
          defaultValue={searchParams.get("dormitorios") || ""}
          options={[1, 2, 3, 4, 5].map((n) => ({
            value: n.toString(),
            label: `${n}+`,
          }))}
        />
        <div className="flex gap-2">
          <Button type="submit" className="flex-1">
            <Search size={16} className="mr-1" />
            Buscar
          </Button>
          <Button type="button" variant="outline" onClick={handleReset}>
            Limpiar
          </Button>
        </div>
      </div>
    </form>
  );
}
