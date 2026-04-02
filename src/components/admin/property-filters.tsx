"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { OPERACIONES, TIPOS_PROPIEDAD } from "@/lib/constants";

export function AdminPropertyFilters({ cities }: { cities: string[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filtro = searchParams.get("filtro");
  const formRef = useRef<HTMLFormElement>(null);

  const buildParams = useCallback(() => {
    const params = new URLSearchParams();
    if (filtro) params.set("filtro", filtro);

    const orden = searchParams.get("orden");
    const dir = searchParams.get("dir");
    const cantidad = searchParams.get("cantidad");
    if (orden) params.set("orden", orden);
    if (dir) params.set("dir", dir);
    if (cantidad) params.set("cantidad", cantidad);

    if (formRef.current) {
      const formData = new FormData(formRef.current);
      for (const [key, value] of formData.entries()) {
        if (value) params.set(key, value as string);
      }
    }

    return params;
  }, [filtro, searchParams]);

  const navigate = useCallback(() => {
    router.push(`/admin/propiedades?${buildParams().toString()}`);
  }, [router, buildParams]);

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      navigate();
    },
    [navigate]
  );

  const handleReset = useCallback(() => {
    const params = new URLSearchParams();
    if (filtro) params.set("filtro", filtro);
    const qs = params.toString();
    router.push(`/admin/propiedades${qs ? `?${qs}` : ""}`);
  }, [router, filtro]);

  return (
    <form key={searchParams.toString()} ref={formRef} onSubmit={handleSubmit} className="rounded-lg border border-border bg-white p-4 shadow-sm">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6">
        <Input
          name="busqueda"
          placeholder="Buscar por titulo (Enter)..."
          defaultValue={searchParams.get("busqueda") || ""}
        />
        <Select
          name="operacion"
          placeholder="Operacion"
          defaultValue={searchParams.get("operacion") || ""}
          options={OPERACIONES.map((o) => ({ value: o.value, label: o.label }))}
          onChange={navigate}
        />
        <Select
          name="tipo_propiedad"
          placeholder="Tipo"
          defaultValue={searchParams.get("tipo_propiedad") || ""}
          options={TIPOS_PROPIEDAD.map((t) => ({ value: t, label: t }))}
          onChange={navigate}
        />
        <Select
          name="ciudad"
          placeholder="Ciudad"
          defaultValue={searchParams.get("ciudad") || ""}
          options={cities.map((c) => ({ value: c, label: c }))}
          onChange={navigate}
        />
        <Button type="button" variant="outline" onClick={handleReset} className="sm:col-span-2 lg:col-span-2">
          Limpiar filtros
        </Button>
      </div>
    </form>
  );
}
