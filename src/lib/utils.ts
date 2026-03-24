import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(precio: number | string, moneda: "ARS" | "USD"): string {
  const n = Number(precio);
  if (moneda === "USD") {
    return `USD ${n.toLocaleString("es-AR")}`;
  }
  return `$ ${n.toLocaleString("es-AR")}`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export function buildWhatsAppUrl(
  phone: string,
  message: string
): string {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
