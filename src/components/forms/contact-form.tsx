"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export function ContactForm() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const subject = encodeURIComponent("Consulta desde el sitio web");
    const body = encodeURIComponent(
      `Nombre: ${formData.get("nombre")}\nEmail: ${formData.get("email")}\nTelefono: ${formData.get("telefono")}\n\n${formData.get("mensaje")}`
    );
    window.location.href = `mailto:info@matiasperezinmuebles.com?subject=${subject}&body=${body}`;
    setSent(true);
  };

  if (sent) {
    return (
      <div className="rounded-lg bg-green-50 p-6 text-center">
        <h3 className="text-lg font-semibold text-green-800">
          Redirigiendo a tu cliente de email...
        </h3>
        <p className="mt-2 text-sm text-green-700">
          Si no se abrio automaticamente, escribinos a info@matiasperezinmuebles.com
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        id="contact-nombre"
        name="nombre"
        label="Nombre"
        placeholder="Tu nombre"
        required
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          id="contact-email"
          name="email"
          type="email"
          label="Email"
          placeholder="tu@email.com"
          required
        />
        <Input
          id="contact-telefono"
          name="telefono"
          label="Telefono"
          placeholder="+54 9 11 ..."
        />
      </div>
      <Textarea
        id="contact-mensaje"
        name="mensaje"
        label="Mensaje"
        placeholder="Tu consulta..."
        rows={5}
        required
      />
      <Button type="submit" size="lg" className="w-full">
        Enviar mensaje
      </Button>
    </form>
  );
}
