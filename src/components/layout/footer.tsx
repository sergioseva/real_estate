import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-primary text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Brand */}
          <div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-[0.2em]">
                MATIAS PEREZ
              </span>
              <span className="text-[10px] tracking-[0.3em] text-white/60 uppercase">
                inmuebles
              </span>
            </div>
            <p className="mt-4 text-sm text-white/70">
              Tu inmobiliaria de confianza. Encontrá la propiedad ideal para vos.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">
              Navegacion
            </h3>
            <ul className="mt-4 space-y-2">
              {[
                { href: "/alquiler", label: "Alquiler" },
                { href: "/venta", label: "Venta" },
                { href: "/tasacion", label: "Tasaciones" },
                { href: "/nosotros", label: "Nosotros" },
                { href: "/contacto", label: "Contacto" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">
              Contacto
            </h3>
            <ul className="mt-4 space-y-3">
              <li className="flex items-center gap-2 text-sm text-white/70">
                <Phone size={16} />
                <span>+54 9 11 1234-5678</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-white/70">
                <Mail size={16} />
                <span>info@matiasperezinmuebles.com</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-white/70">
                <MapPin size={16} />
                <span>Buenos Aires, Argentina</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-white/20 pt-8 text-center text-sm text-white/50">
          &copy; {new Date().getFullYear()} Matias Perez Inmuebles. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
