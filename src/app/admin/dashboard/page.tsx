import { getPropertyStats } from "@/actions/properties";
import { getUnreadTasacionCount } from "@/actions/tasaciones";
import { StatsCards } from "@/components/admin/stats-cards";
import { SavedBanner } from "@/components/admin/saved-banner";
import { FileText } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const { saved } = await searchParams;
  const [stats, unreadTasaciones] = await Promise.all([
    getPropertyStats(),
    getUnreadTasacionCount(),
  ]);

  return (
    <div>
      {saved && <SavedBanner />}
      <h1 className="text-2xl font-bold text-primary">Dashboard</h1>
      <p className="text-muted-foreground">
        Bienvenido al panel de administracion
      </p>

      <div className="mt-6">
        <StatsCards stats={stats} />
      </div>

      {unreadTasaciones > 0 && (
        <div className="mt-6">
          <Link
            href="/admin/tasaciones"
            className="flex items-center gap-3 rounded-lg border border-orange-200 bg-orange-50 p-4 text-orange-800 hover:bg-orange-100 transition-colors"
          >
            <FileText size={20} />
            <span className="text-sm font-medium">
              Tenes {unreadTasaciones} solicitud{unreadTasaciones > 1 ? "es" : ""} de
              tasacion sin leer
            </span>
          </Link>
        </div>
      )}
    </div>
  );
}
