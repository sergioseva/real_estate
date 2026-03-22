"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export function PropertyMap({
  lat,
  lng,
  titulo,
}: {
  lat: number;
  lng: number;
  titulo?: string;
}) {
  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold text-primary">Ubicacion</h2>
      <div className="mt-3 h-[350px] overflow-hidden rounded-lg border border-border">
        <MapContainer
          center={[lat, lng]}
          zoom={15}
          className="h-full w-full"
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[lat, lng]} icon={markerIcon}>
            {titulo && <Popup>{titulo}</Popup>}
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
}
