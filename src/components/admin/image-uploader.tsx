"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { Upload, X, GripVertical, Pencil, Check } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { deleteImage, reorderImages } from "@/actions/images";
import type { PropertyImage } from "@/types";

function SortableImage({
  image,
  onDelete,
  onDescriptionSave,
}: {
  image: PropertyImage;
  onDelete: (id: string, path: string) => void;
  onDescriptionSave: (id: string, descripcion: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [desc, setDesc] = useState(image.descripcion || "");

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: image.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleSave = () => {
    onDescriptionSave(image.id, desc);
    setEditing(false);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group relative flex-shrink-0 overflow-hidden rounded-lg border border-border"
    >
      <div className="relative h-32 w-40">
        <Image src={image.url} alt="" fill className="object-cover" sizes="160px" />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
        <button
          {...attributes}
          {...listeners}
          className="absolute left-1 top-1 rounded bg-white/80 p-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab"
        >
          <GripVertical size={14} />
        </button>
        <div className="absolute right-1 top-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setEditing(!editing)}
            className="rounded bg-white/80 p-1 text-foreground hover:bg-white"
            title="Editar descripcion"
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={() => onDelete(image.id, image.storage_path)}
            className="rounded-full bg-red-500 p-1 text-white"
          >
            <X size={14} />
          </button>
        </div>
        {image.descripcion && !editing && (
          <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-2 py-1">
            <p className="text-[10px] text-white truncate">{image.descripcion}</p>
          </div>
        )}
      </div>
      {editing && (
        <div className="flex items-center gap-1 border-t border-border bg-white p-1.5">
          <input
            type="text"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Descripcion..."
            className="w-full rounded border border-border px-2 py-1 text-xs focus:border-accent focus:outline-none"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSave();
            }}
            autoFocus
          />
          <button
            onClick={handleSave}
            className="rounded bg-accent p-1 text-white hover:bg-accent-light"
          >
            <Check size={14} />
          </button>
        </div>
      )}
    </div>
  );
}

export function ImageUploader({
  propertyId,
  initialImages = [],
}: {
  propertyId: string;
  initialImages?: PropertyImage[];
}) {
  const [images, setImages] = useState<PropertyImage[]>(
    [...initialImages].sort((a, b) => a.display_order - b.display_order)
  );
  const [uploading, setUploading] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files || files.length === 0) return;

      setUploading(true);
      try {
        for (const file of Array.from(files)) {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("propertyId", propertyId);

          const res = await fetch("/api/images/upload", {
            method: "POST",
            body: formData,
          });

          if (!res.ok) throw new Error("Upload failed");

          const inserted = await res.json() as PropertyImage;
          setImages((prev) => [...prev, inserted]);
        }
      } catch (err) {
        console.error("Upload error:", err);
      } finally {
        setUploading(false);
        e.target.value = "";
      }
    },
    [propertyId]
  );

  const handleDelete = useCallback(
    async (imageId: string, storagePath: string) => {
      try {
        await deleteImage(imageId, storagePath);
        setImages((prev) => prev.filter((img) => img.id !== imageId));
      } catch (err) {
        console.error("Delete error:", err);
      }
    },
    []
  );

  const handleDescriptionSave = useCallback(
    async (imageId: string, descripcion: string) => {
      try {
        await fetch(`/api/images/${imageId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ descripcion }),
        });

        setImages((prev) =>
          prev.map((img) =>
            img.id === imageId ? { ...img, descripcion } : img
          )
        );
      } catch (err) {
        console.error("Description save error:", err);
      }
    },
    []
  );

  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      const oldIndex = images.findIndex((img) => img.id === active.id);
      const newIndex = images.findIndex((img) => img.id === over.id);
      const newOrder = arrayMove(images, oldIndex, newIndex);

      setImages(newOrder);

      try {
        await reorderImages(
          newOrder.map((img, i) => ({ id: img.id, display_order: i }))
        );
      } catch (err) {
        console.error("Reorder error:", err);
      }
    },
    [images]
  );

  return (
    <div className="rounded-lg border border-border bg-white p-6">
      <h3 className="mb-4 text-lg font-semibold">Imagenes</h3>

      {/* Upload area */}
      <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border p-8 hover:border-accent transition-colors">
        <Upload size={32} className="text-muted-foreground" />
        <span className="mt-2 text-sm text-muted-foreground">
          {uploading ? "Subiendo..." : "Click para subir imagenes"}
        </span>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleUpload}
          className="hidden"
          disabled={uploading}
        />
      </label>

      {/* Image grid with drag & drop */}
      {images.length > 0 && (
        <div className="mt-4">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={images.map((img) => img.id)}
              strategy={horizontalListSortingStrategy}
            >
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((image) => (
                  <SortableImage
                    key={image.id}
                    image={image}
                    onDelete={handleDelete}
                    onDescriptionSave={handleDescriptionSave}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
          <p className="mt-2 text-xs text-muted-foreground">
            Arrastra para reordenar. Click en el lapiz para agregar descripcion.
          </p>
        </div>
      )}
    </div>
  );
}
