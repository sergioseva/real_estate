import { ContactForm } from "@/components/forms/contact-form";
import { Phone, Mail, MapPin } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contacto",
};

export default function ContactoPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-primary">Contacto</h1>
        <p className="mt-2 text-muted-foreground">
          Estamos para ayudarte. Envianos tu consulta.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-2">
        {/* Contact info */}
        <div>
          <h2 className="text-xl font-semibold text-primary">
            Informacion de contacto
          </h2>
          <div className="mt-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                <Phone size={18} className="text-accent" />
              </div>
              <div>
                <p className="text-sm font-medium">Telefono</p>
                <p className="text-sm text-muted-foreground">+54 9 11 1234-5678</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                <Mail size={18} className="text-accent" />
              </div>
              <div>
                <p className="text-sm font-medium">Email</p>
                <p className="text-sm text-muted-foreground">info@matiasperezinmuebles.com</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                <MapPin size={18} className="text-accent" />
              </div>
              <div>
                <p className="text-sm font-medium">Direccion</p>
                <p className="text-sm text-muted-foreground">Buenos Aires, Argentina</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact form */}
        <div>
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
