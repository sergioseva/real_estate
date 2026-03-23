"use client";

import { MessageCircle } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/utils";

export function WhatsAppButton({ phoneNumber }: { phoneNumber: string }) {
  const url = buildWhatsAppUrl(
    phoneNumber,
    "Hola! Me comunico desde el sitio web de Matias Perez Inmuebles."
  );

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-lg transition-transform hover:scale-110"
      aria-label="Contactar por WhatsApp"
    >
      <MessageCircle size={28} />
    </a>
  );
}
