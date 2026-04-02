"use client";

import { useRouter } from "next/navigation";
import { useState, useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { TIPOS_PROPIEDAD, OPERACIONES, MONEDAS, PROVINCIAS, ANTIGUEDADES } from "@/lib/constants";
import { createProperty, updateProperty } from "@/actions/properties";
import type { Property } from "@/types";

const LocationPicker = dynamic(
  () => import("@/components/admin/location-picker").then((m) => m.LocationPicker),
  { ssr: false, loading: () => <div className="h-[400px] rounded-lg border border-border bg-muted animate-pulse" /> }
);

export function PropertyForm({ property, returnUrl }: { property?: Property; returnUrl?: string }) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [antiguedad, setAntiguedad] = useState(property?.antiguedad || "a_estrenar");
  const [latitud, setLatitud] = useState<number | null>(property?.latitud ?? null);
  const [longitud, setLongitud] = useState<number | null>(property?.longitud ?? null);
  const isEditing = !!property;

  const handleLocationChange = useCallback((lat: number | null, lng: number | null) => {
    setLatitud(lat);
    setLongitud(lng);
  }, []);

  const getAddress = useCallback(() => {
    if (!formRef.current) return { direccion: "", ciudad: "", provincia: "" };
    const fd = new FormData(formRef.current);
    return {
      direccion: (fd.get("direccion") as string) || "",
      ciudad: (fd.get("ciudad") as string) || "",
      provincia: (fd.get("provincia") as string) || "",
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formData = new FormData(e.currentTarget);

      if (isEditing) {
        await updateProperty(property.id, formData);
        router.push(returnUrl || "/admin/propiedades");
      } else {
        const created = await createProperty(formData);
        router.push(`/admin/propiedades/${created.id}/editar`);
      }

      router.refresh();
    } catch (err) {
      setError("Error al guardar la propiedad. Intenta nuevamente.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">{error}</div>
      )}

      {/* Basic info */}
      <div className="rounded-lg border border-border bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold">Informacion basica</h3>
        <div className="space-y-4">
          <Input
            id="titulo"
            name="titulo"
            label="Titulo"
            defaultValue={property?.titulo}
            required
          />
          <Textarea
            id="descripcion"
            name="descripcion"
            label="Descripcion"
            defaultValue={property?.descripcion}
            rows={5}
          />
        </div>
      </div>

      {/* Price & Operation */}
      <div className="rounded-lg border border-border bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold">Precio y operacion</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Input
            id="precio"
            name="precio"
            type="number"
            label="Precio"
            defaultValue={property?.precio}
            required
          />
          <Select
            id="moneda"
            name="moneda"
            label="Moneda"
            defaultValue={property?.moneda || "USD"}
            options={MONEDAS.map((m) => ({ value: m.value, label: m.label }))}
          />
          <Select
            id="operacion"
            name="operacion"
            label="Operacion"
            defaultValue={property?.operacion || "venta"}
            options={OPERACIONES.map((o) => ({ value: o.value, label: o.label }))}
          />
        </div>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Input
            id="expensas"
            name="expensas"
            type="number"
            label="Expensas"
            defaultValue={property?.expensas || 0}
            min={0}
          />
          <Select
            id="expensas_moneda"
            name="expensas_moneda"
            label="Moneda expensas"
            defaultValue={property?.expensas_moneda || "ARS"}
            options={MONEDAS.map((m) => ({ value: m.value, label: m.label }))}
          />
          <div className="flex items-end">
            <label className="flex items-center gap-2 pb-2">
              <input
                type="checkbox"
                name="apto_credito"
                value="true"
                defaultChecked={property?.apto_credito}
                className="h-4 w-4 rounded border-border text-accent focus:ring-accent"
              />
              <span className="text-sm font-medium">Apto credito</span>
            </label>
          </div>
        </div>
      </div>

      {/* Property type & location */}
      <div className="rounded-lg border border-border bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold">Tipo y ubicacion</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Select
            id="tipo_propiedad"
            name="tipo_propiedad"
            label="Tipo de propiedad"
            defaultValue={property?.tipo_propiedad || "Casa"}
            options={TIPOS_PROPIEDAD.map((t) => ({ value: t, label: t }))}
          />
          <Input
            id="direccion"
            name="direccion"
            label="Direccion"
            defaultValue={property?.direccion}
          />
          <Input
            id="ciudad"
            name="ciudad"
            label="Ciudad"
            defaultValue={property?.ciudad}
          />
          <Select
            id="provincia"
            name="provincia"
            label="Provincia"
            defaultValue={property?.provincia}
            placeholder="Seleccionar provincia"
            options={PROVINCIAS.map((p) => ({ value: p, label: p }))}
          />
        </div>
      </div>

      {/* Caracteristicas principales */}
      <div className="rounded-lg border border-border bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold">Caracteristicas principales</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          <Input
            id="ambientes"
            name="ambientes"
            type="number"
            label="Ambientes"
            defaultValue={property?.ambientes || 0}
            min={0}
          />
          <Input
            id="dormitorios"
            name="dormitorios"
            type="number"
            label="Dormitorios"
            defaultValue={property?.dormitorios || 0}
            min={0}
          />
          <Input
            id="banos"
            name="banos"
            type="number"
            label="Banos"
            defaultValue={property?.banos || 0}
            min={0}
          />
          <Input
            id="toilettes"
            name="toilettes"
            type="number"
            label="Toilettes"
            defaultValue={property?.toilettes || 0}
            min={0}
          />
          <Input
            id="cocheras"
            name="cocheras"
            type="number"
            label="Cocheras"
            defaultValue={property?.cocheras || 0}
            min={0}
          />
        </div>
      </div>

      {/* Superficie */}
      <div className="rounded-lg border border-border bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold">Superficie</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            id="superficie_cubierta"
            name="superficie_cubierta"
            type="number"
            label="Superficie cubierta (m²)"
            defaultValue={property?.superficie_cubierta || 0}
            min={0}
          />
          <Input
            id="superficie_total"
            name="superficie_total"
            type="number"
            label="Superficie total (m²)"
            defaultValue={property?.superficie_total || 0}
            min={0}
          />
        </div>
      </div>

      {/* Antiguedad */}
      <div className="rounded-lg border border-border bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold">Antiguedad</h3>
        <div className="space-y-3">
          {ANTIGUEDADES.map((opt) => (
            <label key={opt.value} className="flex items-center gap-2">
              <input
                type="radio"
                name="antiguedad"
                value={opt.value}
                checked={antiguedad === opt.value}
                onChange={(e) => setAntiguedad(e.target.value as "a_estrenar" | "anos" | "en_construccion")}
                className="h-4 w-4 border-border text-accent focus:ring-accent"
              />
              <span className="text-sm font-medium">{opt.label}</span>
            </label>
          ))}
          {antiguedad === "anos" && (
            <div className="ml-6 mt-2 max-w-xs">
              <Input
                id="antiguedad_anos"
                name="antiguedad_anos"
                type="number"
                label="Años"
                defaultValue={property?.antiguedad_anos || 0}
                min={0}
              />
            </div>
          )}
        </div>
      </div>

      {/* Ubicacion en mapa */}
      <LocationPicker
        defaultLat={property?.latitud}
        defaultLng={property?.longitud}
        onLocationChange={handleLocationChange}
        getAddress={getAddress}
      />
      <input type="hidden" name="latitud" value={latitud ?? ""} />
      <input type="hidden" name="longitud" value={longitud ?? ""} />

      {/* Amenities */}
      <div className="rounded-lg border border-border bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold">Amenities</h3>
        <Input
          id="amenities"
          name="amenities"
          label="Amenities (JSON array)"
          defaultValue={JSON.stringify(property?.amenities || [])}
          placeholder='["Pileta", "Quincho", "SUM"]'
        />
        <p className="mt-1 text-xs text-muted-foreground">
          Formato: [&quot;Pileta&quot;, &quot;Quincho&quot;, &quot;SUM&quot;]
        </p>
      </div>

      {/* Status */}
      <div className="rounded-lg border border-border bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold">Estado</h3>
        <div className="flex gap-6">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="destacada"
              value="true"
              defaultChecked={property?.destacada}
              className="h-4 w-4 rounded border-border text-accent focus:ring-accent"
            />
            <span className="text-sm font-medium">Destacada</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="activa"
              value="true"
              defaultChecked={property?.activa !== false}
              className="h-4 w-4 rounded border-border text-accent focus:ring-accent"
            />
            <span className="text-sm font-medium">Activa</span>
          </label>
        </div>
      </div>

      {/* Submit */}
      <div className="flex gap-4">
        <Button type="submit" size="lg" disabled={loading}>
          {loading
            ? "Guardando..."
            : isEditing
            ? "Guardar cambios"
            : "Crear propiedad"}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={() => router.push(returnUrl || "/admin/propiedades")}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}
