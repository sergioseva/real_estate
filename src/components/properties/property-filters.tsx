"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { CollapsibleSection } from "@/components/ui/collapsible-section";
import {
  TIPOS_PROPIEDAD,
  OPERACIONES,
  MONEDAS,
  PROVINCIAS,
  ANTIGUEDADES,
} from "@/lib/constants";

const OPERACION_LABELS: Record<string, string> = Object.fromEntries(
  OPERACIONES.map((o) => [o.value, o.label])
);
const ANTIGUEDAD_LABELS: Record<string, string> = Object.fromEntries(
  ANTIGUEDADES.map((a) => [a.value, a.label])
);

const CHIP_ORDER = [
  "operacion",
  "tipo_propiedad",
  "provincia",
  "ciudad",
  "moneda",
  "precio_min",
  "precio_max",
  "ambientes",
  "dormitorios",
  "apto_credito",
  "antiguedad",
  "superficie_cubierta_min",
  "superficie_cubierta_max",
  "superficie_total_min",
  "superficie_total_max",
  "search",
] as const;

function chipLabel(key: string, value: string): string {
  switch (key) {
    case "operacion":
      return OPERACION_LABELS[value] ?? value;
    case "moneda":
      return value;
    case "precio_min":
      return `Desde ${value}`;
    case "precio_max":
      return `Hasta ${value}`;
    case "ambientes":
      return `${value}+ ambientes`;
    case "dormitorios":
      return `${value}+ dormitorios`;
    case "apto_credito":
      return "Apto crédito";
    case "antiguedad":
      return ANTIGUEDAD_LABELS[value] ?? value;
    case "superficie_cubierta_min":
      return `Cub. desde ${value}m²`;
    case "superficie_cubierta_max":
      return `Cub. hasta ${value}m²`;
    case "superficie_total_min":
      return `Total desde ${value}m²`;
    case "superficie_total_max":
      return `Total hasta ${value}m²`;
    case "search":
      return `"${value}"`;
    default:
      return value;
  }
}

export function PropertyFilters({
  cities,
  lockedOperacion,
}: {
  cities: string[];
  lockedOperacion?: "venta" | "alquiler";
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  const submitForm = useCallback(
    (form: HTMLFormElement) => {
      const formData = new FormData(form);
      const params = new URLSearchParams();
      for (const [key, value] of formData.entries()) {
        if (value) params.set(key, value as string);
      }
      const qs = params.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname);
    },
    [router, pathname]
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      submitForm(e.currentTarget);
      setMobileOpen(false);
    },
    [submitForm]
  );

  const handleChange = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      submitForm(e.currentTarget);
    },
    [submitForm]
  );

  const handleReset = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const form = (e.currentTarget as HTMLElement).closest("form");
      if (form) {
        form.querySelectorAll("input, select").forEach((el) => {
          if (el instanceof HTMLInputElement) {
            if (el.type === "hidden") return;
            if (el.type === "checkbox") el.checked = false;
            else if (el.type === "radio") el.checked = el.value === "";
            else el.value = "";
          } else if (el instanceof HTMLSelectElement) {
            el.value = "";
          }
        });
      }
      router.push(pathname);
      setMobileOpen(false);
    },
    [router, pathname]
  );

  const removeParam = useCallback(
    (key: string, form: HTMLFormElement | null) => {
      if (form) {
        form.querySelectorAll(`[name="${key}"]`).forEach((el) => {
          if (el instanceof HTMLInputElement) {
            if (el.type === "checkbox") {
              el.checked = false;
            } else if (el.type === "radio") {
              el.checked = el.value === "";
            } else {
              el.value = "";
            }
          } else if (el instanceof HTMLSelectElement) {
            el.value = "";
          }
        });
      }
      const params = new URLSearchParams(searchParams.toString());
      params.delete(key);
      params.delete("page");
      const qs = params.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname);
    },
    [router, pathname, searchParams]
  );

  const activeChips = CHIP_ORDER.flatMap((key) => {
    if (key === "operacion" && lockedOperacion) return [];
    const value = searchParams.get(key);
    if (!value) return [];
    return [{ key, value }];
  });

  const formContent = (
    <>
      {lockedOperacion && (
        <input type="hidden" name="operacion" value={lockedOperacion} />
      )}

      <Input
        name="search"
        placeholder="Buscar..."
        defaultValue={searchParams.get("search") || ""}
      />

      {activeChips.length > 0 && (
        <div className="mt-3 rounded-md bg-muted/50 p-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Filtros activos
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {activeChips.map(({ key, value }) => (
              <button
                key={key}
                type="button"
                onClick={(e) => {
                  const form = (e.currentTarget as HTMLElement).closest("form");
                  removeParam(key, form as HTMLFormElement | null);
                }}
                className="inline-flex items-center gap-1 rounded-full border border-accent bg-accent/10 px-2.5 py-1 text-xs font-medium text-accent hover:bg-accent/20"
              >
                {chipLabel(key, value)}
                <X size={12} />
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-2">
        {!lockedOperacion && (
          <CollapsibleSection title="Operación" defaultOpen>
            <Select
              name="operacion"
              placeholder="Cualquiera"
              defaultValue={searchParams.get("operacion") || ""}
              options={OPERACIONES.map((o) => ({ value: o.value, label: o.label }))}
            />
          </CollapsibleSection>
        )}

        <CollapsibleSection title="Precios" defaultOpen>
          <div className="flex items-center gap-4">
            {MONEDAS.map((m) => (
              <label key={m.value} className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="moneda"
                  value={m.value}
                  defaultChecked={searchParams.get("moneda") === m.value}
                  className="h-4 w-4 accent-accent"
                />
                {m.label}
              </label>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Input
              name="precio_min"
              type="number"
              min="0"
              placeholder="Desde"
              defaultValue={searchParams.get("precio_min") || ""}
            />
            <Input
              name="precio_max"
              type="number"
              min="0"
              placeholder="Hasta"
              defaultValue={searchParams.get("precio_max") || ""}
            />
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="Apto crédito">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="apto_credito"
              value="true"
              defaultChecked={searchParams.get("apto_credito") === "true"}
              className="h-4 w-4 accent-accent"
            />
            Solo propiedades aptas para crédito
          </label>
        </CollapsibleSection>

        <CollapsibleSection title="Tipo de Propiedad">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="tipo_propiedad"
              value=""
              defaultChecked={!searchParams.get("tipo_propiedad")}
              className="h-4 w-4 accent-accent"
            />
            Todos
          </label>
          {TIPOS_PROPIEDAD.map((t) => (
            <label key={t} className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="tipo_propiedad"
                value={t}
                defaultChecked={searchParams.get("tipo_propiedad") === t}
                className="h-4 w-4 accent-accent"
              />
              {t}
            </label>
          ))}
        </CollapsibleSection>

        <CollapsibleSection title="Ubicación">
          <Select
            name="provincia"
            placeholder="Provincia"
            defaultValue={searchParams.get("provincia") || ""}
            options={PROVINCIAS.map((p) => ({ value: p, label: p }))}
          />
          <Select
            name="ciudad"
            placeholder="Ciudad"
            defaultValue={searchParams.get("ciudad") || ""}
            options={cities.map((c) => ({ value: c, label: c }))}
          />
        </CollapsibleSection>

        <CollapsibleSection title="Cantidad de Ambientes">
          <div className="flex flex-wrap gap-3">
            <label className="flex items-center gap-1.5 text-sm">
              <input
                type="radio"
                name="ambientes"
                value=""
                defaultChecked={!searchParams.get("ambientes")}
                className="h-4 w-4 accent-accent"
              />
              Todos
            </label>
            {[1, 2, 3, 4, 5].map((n) => (
              <label key={n} className="flex items-center gap-1.5 text-sm">
                <input
                  type="radio"
                  name="ambientes"
                  value={n.toString()}
                  defaultChecked={searchParams.get("ambientes") === n.toString()}
                  className="h-4 w-4 accent-accent"
                />
                {n}+
              </label>
            ))}
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="Dormitorios">
          <div className="flex flex-wrap gap-3">
            <label className="flex items-center gap-1.5 text-sm">
              <input
                type="radio"
                name="dormitorios"
                value=""
                defaultChecked={!searchParams.get("dormitorios")}
                className="h-4 w-4 accent-accent"
              />
              Todos
            </label>
            {[1, 2, 3, 4, 5].map((n) => (
              <label key={n} className="flex items-center gap-1.5 text-sm">
                <input
                  type="radio"
                  name="dormitorios"
                  value={n.toString()}
                  defaultChecked={searchParams.get("dormitorios") === n.toString()}
                  className="h-4 w-4 accent-accent"
                />
                {n}+
              </label>
            ))}
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="Antigüedad">
          <Select
            name="antiguedad"
            placeholder="Cualquiera"
            defaultValue={searchParams.get("antiguedad") || ""}
            options={ANTIGUEDADES.map((a) => ({ value: a.value, label: a.label }))}
          />
        </CollapsibleSection>

        <CollapsibleSection title="Superficie Cubierta">
          <div className="grid grid-cols-2 gap-2">
            <Input
              name="superficie_cubierta_min"
              type="number"
              min="0"
              placeholder="Desde m²"
              defaultValue={searchParams.get("superficie_cubierta_min") || ""}
            />
            <Input
              name="superficie_cubierta_max"
              type="number"
              min="0"
              placeholder="Hasta m²"
              defaultValue={searchParams.get("superficie_cubierta_max") || ""}
            />
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="Superficie Total">
          <div className="grid grid-cols-2 gap-2">
            <Input
              name="superficie_total_min"
              type="number"
              min="0"
              placeholder="Desde m²"
              defaultValue={searchParams.get("superficie_total_min") || ""}
            />
            <Input
              name="superficie_total_max"
              type="number"
              min="0"
              placeholder="Hasta m²"
              defaultValue={searchParams.get("superficie_total_max") || ""}
            />
          </div>
        </CollapsibleSection>
      </div>

      <div className="mt-4 flex gap-2">
        <Button type="submit" variant="accent" className="flex-1">
          <Search size={16} className="mr-1" />
          Aplicar
        </Button>
        <Button type="button" variant="outline" onClick={handleReset}>
          Limpiar
        </Button>
      </div>
    </>
  );

  return (
    <>
      <div className="md:hidden">
        <Button
          type="button"
          variant="outline"
          onClick={() => setMobileOpen(true)}
          className="w-full"
        >
          <SlidersHorizontal size={16} className="mr-1" />
          Filtros{activeChips.length > 0 ? ` (${activeChips.length})` : ""}
        </Button>
      </div>

      <form
        onSubmit={handleSubmit}
        onChange={handleChange}
        className="hidden rounded-lg border border-border bg-white p-4 shadow-sm md:block"
      >
        {formContent}
      </form>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
          />
          <form
            onSubmit={handleSubmit}
            onChange={handleChange}
            className="absolute inset-y-0 left-0 flex w-[90%] max-w-sm flex-col overflow-y-auto bg-white p-4 shadow-xl"
          >
            <div className="mb-3 flex items-center justify-between border-b border-border pb-2">
              <h2 className="text-lg font-semibold">Filtros</h2>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="rounded p-1 hover:bg-muted"
                aria-label="Cerrar"
              >
                <X size={20} />
              </button>
            </div>
            {formContent}
          </form>
        </div>
      )}
    </>
  );
}
