import { Building2, Eye, Tag, Home } from "lucide-react";
import { Card } from "@/components/ui/card";

interface Stats {
  total: number;
  activas: number;
  venta: number;
  alquiler: number;
}

export function StatsCards({ stats }: { stats: Stats }) {
  const cards = [
    { label: "Total propiedades", value: stats.total, icon: Building2, color: "text-blue-600" },
    { label: "Activas", value: stats.activas, icon: Eye, color: "text-green-600" },
    { label: "En venta", value: stats.venta, icon: Tag, color: "text-purple-600" },
    { label: "En alquiler", value: stats.alquiler, icon: Home, color: "text-orange-600" },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.label} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{card.label}</p>
                <p className="mt-1 text-3xl font-bold text-foreground">{card.value}</p>
              </div>
              <Icon size={32} className={card.color} />
            </div>
          </Card>
        );
      })}
    </div>
  );
}
