import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(precio: number, moneda: "ARS" | "USD"): string {
  if (moneda === "USD") {
    return `USD ${precio.toLocaleString("es-AR")}`;
  }
  return `$ ${precio.toLocaleString("es-AR")}`;
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
