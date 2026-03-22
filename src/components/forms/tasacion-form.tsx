"use client";

import { useActionState } from "react";
import { createTasacion } from "@/actions/tasaciones";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

type State = {
  error?: Record<string, string[]>;
  success?: boolean;
} | null;

async function handleTasacion(_prevState: State, formData: FormData): Promise<State> {
  const result = await createTasacion(formData);
  return result as State;
}

export function TasacionForm() {
  const [state, formAction, isPending] = useActionState(handleTasacion, null);

  if (state?.success) {
    return (
      <div className="rounded-lg bg-green-50 p-6 text-center">
        <h3 className="text-lg font-semibold text-green-800">
          Solicitud enviada!
        </h3>
        <p className="mt-2 text-sm text-green-700">
          Nos pondremos en contacto a la brevedad.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <Input
        id="nombre"
        name="nombre"
        label="Nombre completo"
        placeholder="Tu nombre"
        required
        error={state?.error?.nombre?.[0]}
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          id="email"
          name="email"
          type="email"
          label="Email"
          placeholder="tu@email.com"
          required
          error={state?.error?.email?.[0]}
        />
        <Input
          id="telefono"
          name="telefono"
          label="Telefono"
          placeholder="+54 9 11 ..."
          required
          error={state?.error?.telefono?.[0]}
        />
      </div>
      <Input
        id="direccion"
        name="direccion"
        label="Direccion del inmueble"
        placeholder="Calle, numero, localidad"
        required
        error={state?.error?.direccion?.[0]}
      />
      <Textarea
        id="mensaje"
        name="mensaje"
        label="Mensaje adicional (opcional)"
        placeholder="Detalles adicionales sobre la propiedad..."
        rows={4}
      />
      <Button type="submit" size="lg" className="w-full" disabled={isPending}>
        {isPending ? "Enviando..." : "Solicitar tasacion"}
      </Button>
    </form>
  );
}
