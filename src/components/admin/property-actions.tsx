"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Archive, ArchiveRestore, Trash2 } from "lucide-react";
import { archiveProperty, unarchiveProperty, deleteProperty, togglePropertyActive } from "@/actions/properties";

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
      className="text-amber-600 hover:text-amber-700 disabled:opacity-50"
      title="Archivar"
    >
      <Archive size={16} />
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
      className="text-blue-600 hover:text-blue-700 disabled:opacity-50"
      title="Restaurar"
    >
      <ArchiveRestore size={16} />
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
      className="text-red-600 hover:text-red-700 disabled:opacity-50"
      title="Eliminar definitivamente"
    >
      <Trash2 size={16} />
    </button>
  );
}

export function ActiveToggle({ propertyId, activa }: { propertyId: string; activa: boolean }) {
  const [optimistic, setOptimistic] = useState(activa);
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    const newValue = !optimistic;
    setOptimistic(newValue);
    setLoading(true);
    try {
      await togglePropertyActive(propertyId, newValue);
    } catch {
      setOptimistic(!newValue);
      alert("Error al cambiar el estado.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <input
      type="checkbox"
      checked={optimistic}
      onChange={handleToggle}
      disabled={loading}
      className="h-4 w-4 cursor-pointer rounded border-border text-accent focus:ring-accent disabled:opacity-50"
      title={optimistic ? "Desactivar" : "Activar"}
    />
  );
}
