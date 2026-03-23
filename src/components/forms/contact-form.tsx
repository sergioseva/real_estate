"use client";

import { useActionState } from "react";
import { sendContactEmail } from "@/actions/contact";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export function ContactForm() {
  const [state, formAction, pending] = useActionState(
    async (_prev: { success?: boolean; error?: string } | null, formData: FormData) => {
      return await sendContactEmail(formData);
    },
    null
  );

  if (state?.success) {
    return (
      <div className="rounded-lg bg-green-50 p-6 text-center">
        <h3 className="text-lg font-semibold text-green-800">
          Mensaje enviado
        </h3>
        <p className="mt-2 text-sm text-green-700">
          Gracias por tu consulta. Te responderemos a la brevedad.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      {state?.error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {state.error}
        </div>
      )}
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
      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? "Enviando..." : "Enviar mensaje"}
      </Button>
    </form>
  );
}
