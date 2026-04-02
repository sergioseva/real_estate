"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { ADMIN_PAGE_SIZE_OPTIONS } from "@/lib/constants";

export function AdminPagination({
  currentPage,
  totalPages,
  pageSize,
  total,
}: {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  total: number;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  if (total === 0) return null;

  const start = (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, total);

  const navigate = (overrides: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(overrides)) {
      params.set(key, value);
    }
    router.push(`/admin/propiedades?${params.toString()}`);
  };

  const goToPage = (page: number) => navigate({ pagina: page.toString() });

  const handlePageSize = (e: React.ChangeEvent<HTMLSelectElement>) => {
    navigate({ cantidad: e.target.value, pagina: "1" });
  };

  const pages = getPageNumbers(currentPage, totalPages);

  return (
    <div className="flex flex-col items-center gap-4 py-6 sm:flex-row sm:justify-between">
      <p className="text-sm text-muted-foreground">
        Mostrando {start}-{end} de {total} propiedad{total !== 1 ? "es" : ""}
      </p>

      {totalPages > 1 && (
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage <= 1}
          >
            <ChevronLeft size={16} />
          </Button>

          {pages.map((p, i) =>
            p === "..." ? (
              <span key={`ellipsis-${i}`} className="px-2 text-sm text-muted-foreground">
                ...
              </span>
            ) : (
              <Button
                key={p}
                variant={p === currentPage ? "default" : "outline"}
                size="sm"
                onClick={() => goToPage(p as number)}
              >
                {p}
              </Button>
            )
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage >= totalPages}
          >
            <ChevronRight size={16} />
          </Button>
        </div>
      )}

      <div className="flex items-center gap-2">
        <label className="text-sm text-muted-foreground whitespace-nowrap">Por pagina:</label>
        <select
          value={pageSize}
          onChange={handlePageSize}
          className="rounded-md border border-border bg-white px-2 py-1 text-sm"
        >
          {ADMIN_PAGE_SIZE_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

function getPageNumbers(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | "...")[] = [1];

  if (current > 3) pages.push("...");

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) pages.push(i);

  if (current < total - 2) pages.push("...");

  pages.push(total);
  return pages;
}
