"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";

export function SortableHeader({
  column,
  label,
  currentSort,
  currentDir,
}: {
  column: string;
  label: string;
  currentSort: string;
  currentDir: "asc" | "desc";
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const isActive = currentSort === column;

  const handleClick = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("orden", column);
    if (isActive) {
      params.set("dir", currentDir === "asc" ? "desc" : "asc");
    } else {
      params.set("dir", "desc");
    }
    params.delete("pagina");
    router.push(`/admin/propiedades?${params.toString()}`);
  };

  return (
    <th
      className="px-4 py-3 font-medium cursor-pointer select-none hover:bg-muted/80 transition-colors"
      onClick={handleClick}
    >
      <span className="inline-flex items-center gap-1">
        {label}
        {isActive ? (
          currentDir === "asc" ? (
            <ChevronUp size={14} />
          ) : (
            <ChevronDown size={14} />
          )
        ) : (
          <ChevronsUpDown size={14} className="text-muted-foreground/50" />
        )}
      </span>
    </th>
  );
}
