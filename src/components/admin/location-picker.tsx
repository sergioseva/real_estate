"use client";

import { useState, useCallback } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin, Search, Loader2 } from "lucide-react";

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function ClickHandler({
  onLocationSelect,
}: {
  onLocationSelect: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function FlyToPosition({ position }: { position: [number, number] | null }) {
  const map = useMap();
  if (position) {
    map.flyTo(position, 16, { duration: 1.2 });
  }
  return null;
}

export function LocationPicker({
  defaultLat,
  defaultLng,
  onLocationChange,
  getAddress,
}: {
  defaultLat?: number | null;
  defaultLng?: number | null;
  onLocationChange: (lat: number | null, lng: number | null) => void;
  getAddress?: () => { direccion: string; ciudad: string; provincia: string };
}) {
  const [position, setPosition] = useState<[number, number] | null>(
    defaultLat && defaultLng ? [defaultLat, defaultLng] : null
  );
  const [flyTarget, setFlyTarget] = useState<[number, number] | null>(null);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState("");

  const center: [number, number] = position || [-34.6037, -58.3816];

  const handleLocationSelect = useCallback(
    (lat: number, lng: number) => {
      setPosition([lat, lng]);
      setFlyTarget([lat, lng]);
      onLocationChange(lat, lng);
      setSearchError("");
    },
    [onLocationChange]
  );

  const handleClear = useCallback(() => {
    setPosition(null);
    setFlyTarget(null);
    onLocationChange(null, null);
    setSearchError("");
  }, [onLocationChange]);

  const handleSearchAddress = useCallback(async () => {
    if (!getAddress) return;

    const { direccion, ciudad, provincia } = getAddress();

    if (!direccion && !ciudad && !provincia) {
      setSearchError("Completá al menos la dirección o ciudad para buscar");
      return;
    }

    const parts = [direccion, ciudad, provincia, "Argentina"].filter(Boolean);

    setSearching(true);
    setSearchError("");

    try {
      const query = encodeURIComponent(parts.join(", "));
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1&countrycodes=ar`,
        {
          headers: {
            "Accept-Language": "es",
          },
        }
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lng = parseFloat(data[0].lon);
        setPosition([lat, lng]);
        setFlyTarget([lat, lng]);
        onLocationChange(lat, lng);
      } else {
        setSearchError("No se encontró la dirección. Probá con menos detalle o marcá manualmente.");
      }
    } catch {
      setSearchError("Error al buscar la dirección. Intentá de nuevo.");
    } finally {
      setSearching(false);
    }
  }, [getAddress, onLocationChange]);

  return (
    <div className="rounded-lg border border-border bg-white p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold">Ubicacion en el mapa</h3>
          <p className="text-xs text-muted-foreground">
            Buscá por dirección o hacé click en el mapa
          </p>
        </div>
        <div className="flex gap-2">
          {getAddress && (
            <button
              type="button"
              onClick={handleSearchAddress}
              disabled={searching}
              className="inline-flex items-center gap-1.5 rounded-md bg-accent px-3 py-1.5 text-xs font-medium text-white hover:bg-accent-light transition-colors disabled:opacity-50"
            >
              {searching ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Search size={14} />
              )}
              {searching ? "Buscando..." : "Buscar dirección"}
            </button>
          )}
          {position && (
            <button
              type="button"
              onClick={handleClear}
              className="rounded-md border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted transition-colors"
            >
              Quitar pin
            </button>
          )}
        </div>
      </div>

      {searchError && (
        <p className="mb-3 text-xs text-red-500">{searchError}</p>
      )}

      <div className="h-[300px] overflow-hidden rounded-lg border border-border">
        <MapContainer
          center={center}
          zoom={position ? 15 : 12}
          className="h-full w-full"
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ClickHandler onLocationSelect={handleLocationSelect} />
          <FlyToPosition position={flyTarget} />
          {position && <Marker position={position} icon={markerIcon} />}
        </MapContainer>
      </div>

      {position && (
        <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin size={12} />
          Lat: {Number(position[0]).toFixed(6)}, Lng: {Number(position[1]).toFixed(6)}
        </p>
      )}
    </div>
  );
}
