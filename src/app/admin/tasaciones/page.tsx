import { getTasaciones, markTasacionRead, deleteTasacion } from "@/actions/tasaciones";
import { Badge } from "@/components/ui/badge";
import { Mail, MailOpen, Trash2 } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Solicitudes de Tasacion",
};

export default async function AdminTasacionesPage() {
  const tasaciones = await getTasaciones();

  return (
    <div>
      <h1 className="text-2xl font-bold text-primary">
        Solicitudes de tasacion
      </h1>
      <p className="text-muted-foreground">
        {tasaciones.length} solicitud{tasaciones.length !== 1 ? "es" : ""}
      </p>

      <div className="mt-6 space-y-4">
        {tasaciones.map((tasacion) => (
          <div
            key={tasacion.id}
            className={`rounded-lg border bg-white p-4 shadow-sm ${
              tasacion.leido ? "border-border" : "border-accent"
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                {tasacion.leido ? (
                  <MailOpen size={20} className="mt-0.5 text-muted-foreground" />
                ) : (
                  <Mail size={20} className="mt-0.5 text-accent" />
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{tasacion.nombre}</h3>
                    {!tasacion.leido && (
                      <Badge variant="accent">Nueva</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {tasacion.email} &middot; {tasacion.telefono}
                  </p>
                  <p className="mt-1 text-sm">
                    <span className="font-medium">Direccion:</span>{" "}
                    {tasacion.direccion}
                  </p>
                  {tasacion.mensaje && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      {tasacion.mensaje}
                    </p>
                  )}
                  <p className="mt-2 text-xs text-muted-foreground">
                    {new Date(tasacion.created_at).toLocaleDateString("es-AR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                {!tasacion.leido && (
                  <form action={async () => {
                    "use server";
                    await markTasacionRead(tasacion.id);
                  }}>
                    <button
                      type="submit"
                      className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-primary transition-colors"
                      title="Marcar como leida"
                    >
                      <MailOpen size={16} />
                    </button>
                  </form>
                )}
                <form action={async () => {
                  "use server";
                  await deleteTasacion(tasacion.id);
                }}>
                  <button
                    type="submit"
                    className="rounded-md p-2 text-muted-foreground hover:bg-red-50 hover:text-red-500 transition-colors"
                    title="Eliminar"
                  >
                    <Trash2 size={16} />
                  </button>
                </form>
              </div>
            </div>
          </div>
        ))}

        {tasaciones.length === 0 && (
          <div className="py-12 text-center text-muted-foreground">
            No hay solicitudes de tasacion
          </div>
        )}
      </div>
    </div>
  );
}
