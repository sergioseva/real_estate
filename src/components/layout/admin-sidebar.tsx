"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Building2, FileText, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

const adminLinks = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/propiedades", label: "Propiedades", icon: Building2 },
  { href: "/admin/tasaciones", label: "Tasaciones", icon: FileText },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-64 flex-col border-r border-border bg-white">
      <div className="flex flex-col items-center border-b border-border px-6 py-4">
        <span className="text-lg font-bold tracking-[0.15em] text-primary">
          MATIAS PEREZ
        </span>
        <span className="text-[9px] tracking-[0.25em] text-muted-foreground uppercase">
          inmuebles
        </span>
        <span className="mt-1 text-xs text-muted-foreground">Admin</span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {adminLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-muted text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-primary"
              )}
            >
              <Icon size={18} />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border px-3 py-4">
        <form action="/api/auth/logout" method="post">
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-primary transition-colors"
          >
            <LogOut size={18} />
            Cerrar sesion
          </button>
        </form>
      </div>
    </aside>
  );
}
