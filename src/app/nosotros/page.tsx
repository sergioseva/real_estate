import { Building2, Users, Award, Clock } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nosotros",
};

export default function NosotrosPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-primary">Nosotros</h1>
        <p className="mt-4 mx-auto max-w-2xl text-muted-foreground">
          En Matias Perez Inmuebles nos dedicamos a conectar personas con su hogar ideal.
          Con anos de experiencia en el mercado inmobiliario, brindamos un servicio personalizado
          y profesional.
        </p>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            icon: Building2,
            title: "Propiedades",
            description: "Amplio portfolio de propiedades en las mejores ubicaciones",
          },
          {
            icon: Users,
            title: "Atencion personalizada",
            description: "Acompanamiento durante todo el proceso de compra o alquiler",
          },
          {
            icon: Award,
            title: "Experiencia",
            description: "Anos de trayectoria en el mercado inmobiliario",
          },
          {
            icon: Clock,
            title: "Disponibilidad",
            description: "Estamos disponibles para atenderte cuando lo necesites",
          },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.title} className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <Icon size={28} className="text-accent" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-primary">{item.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
