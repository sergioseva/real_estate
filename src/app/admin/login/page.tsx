"use client";

import { useActionState } from "react";
import { login } from "@/actions/auth";

type LoginState = { error?: string } | null;

async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const result = await login(formData);
  return result as LoginState;
}

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, null);

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="w-full max-w-sm rounded-lg border border-border bg-white p-8 shadow-sm">
        <div className="text-center">
          <h1 className="text-xl font-bold tracking-[0.15em] text-primary">
            MATIAS PEREZ
          </h1>
          <p className="text-[9px] tracking-[0.25em] text-muted-foreground uppercase">
            inmuebles
          </p>
          <p className="mt-4 text-sm text-muted-foreground">
            Ingresa al panel de administracion
          </p>
        </div>

        <form action={formAction} className="mt-6 space-y-4">
          {state?.error && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
              {state.error}
            </div>
          )}
          <div className="space-y-1">
            <label htmlFor="email" className="block text-sm font-medium text-foreground">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full rounded-md border border-border bg-white px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="password" className="block text-sm font-medium text-foreground">
              Contrasena
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full rounded-md border border-border bg-white px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark transition-colors disabled:opacity-50"
          >
            {isPending ? "Ingresando..." : "Iniciar sesion"}
          </button>
        </form>
      </div>
    </div>
  );
}
