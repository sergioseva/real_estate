"use client";

import dynamic from "next/dynamic";

const PropertyMap = dynamic(
  () => import("./property-map").then((m) => m.PropertyMap),
  { ssr: false }
);

export function PropertyMapWrapper({
  lat,
  lng,
  titulo,
}: {
  lat: number;
  lng: number;
  titulo?: string;
}) {
  return <PropertyMap lat={lat} lng={lng} titulo={titulo} />;
}
