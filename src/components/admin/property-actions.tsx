"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Archive, ArchiveRestore, Trash2 } from "lucide-react";
import { archiveProperty, unarchiveProperty, deleteProperty } from "@/actions/properties";

export function ArchiveButton({ propertyId }: { propertyId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleArchive = async () => {
    if (!confirm("¿Archivar esta propiedad? No sera visible en el sitio.")) return;
    setLoading(true);
    try {
      await archiveProperty(propertyId);
      router.refresh();
    } catch {
      alert("Error al archivar la propiedad.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleArchive}
      disabled={loading}
      className="inline-flex items-center gap-1 text-amber-600 hover:text-amber-700 disabled:opacity-50"
      title="Archivar"
    >
      <Archive size={14} />
      <span className="hidden lg:inline">Archivar</span>
    </button>
  );
}

export function UnarchiveButton({ propertyId }: { propertyId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleUnarchive = async () => {
    setLoading(true);
    try {
      await unarchiveProperty(propertyId);
      router.refresh();
    } catch {
      alert("Error al desarchivar la propiedad.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleUnarchive}
      disabled={loading}
      className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 disabled:opacity-50"
      title="Restaurar"
    >
      <ArchiveRestore size={14} />
      <span className="hidden lg:inline">Restaurar</span>
    </button>
  );
}

export function DeleteButton({ propertyId, propertyTitle }: { propertyId: string; propertyTitle: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`¿Eliminar definitivamente "${propertyTitle}"?\n\nEsta accion no se puede deshacer. Se eliminaran tambien todas las fotos.`)) return;
    setLoading(true);
    try {
      await deleteProperty(propertyId);
      router.refresh();
    } catch {
      alert("Error al eliminar la propiedad.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="inline-flex items-center gap-1 text-red-600 hover:text-red-700 disabled:opacity-50"
      title="Eliminar definitivamente"
    >
      <Trash2 size={14} />
      <span className="hidden lg:inline">Eliminar</span>
    </button>
  );
}
