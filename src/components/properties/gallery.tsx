"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { PropertyImage } from "@/types";

export function Gallery({ images }: { images: PropertyImage[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  if (!images || images.length === 0) {
    return (
      <div className="aspect-video w-full rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
        Sin imagenes
      </div>
    );
  }

  const sorted = [...images].sort((a, b) => a.display_order - b.display_order);

  const goTo = (index: number) => {
    if (index < 0) setCurrentIndex(sorted.length - 1);
    else if (index >= sorted.length) setCurrentIndex(0);
    else setCurrentIndex(index);
  };

  return (
    <>
      {/* Main image */}
      <div
        className="relative aspect-video w-full cursor-pointer overflow-hidden rounded-lg bg-muted"
        onClick={() => setLightboxOpen(true)}
      >
        <img
          src={sorted[currentIndex].url}
          alt={`Imagen ${currentIndex + 1}`}
          className="absolute inset-0 h-full w-full object-cover"
        />
        {sorted.length > 1 && (
          <>
            <button
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
              onClick={(e) => {
                e.stopPropagation();
                goTo(currentIndex - 1);
              }}
            >
              <ChevronLeft size={20} />
            </button>
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
              onClick={(e) => {
                e.stopPropagation();
                goTo(currentIndex + 1);
              }}
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
        <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between px-3 pb-2">
          {sorted[currentIndex].descripcion ? (
            <span className="rounded-md bg-black/60 px-3 py-1.5 text-sm text-white">
              {sorted[currentIndex].descripcion}
            </span>
          ) : (
            <span />
          )}
          <span className="rounded-md bg-black/50 px-2 py-1 text-xs text-white">
            {currentIndex + 1} / {sorted.length}
          </span>
        </div>
      </div>

      {/* Thumbnails */}
      {sorted.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
          {sorted.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setCurrentIndex(i)}
              className={`relative h-16 w-20 flex-shrink-0 overflow-hidden rounded-md border-2 transition-colors ${
                i === currentIndex ? "border-accent" : "border-transparent"
              }`}
            >
              <img
                src={img.url}
                alt={`Thumbnail ${i + 1}`}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90">
          <button
            className="absolute right-4 top-4 text-white hover:text-white/80"
            onClick={() => setLightboxOpen(false)}
          >
            <X size={32} />
          </button>
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-3 text-white hover:bg-white/30"
            onClick={() => goTo(currentIndex - 1)}
          >
            <ChevronLeft size={28} />
          </button>
          <div className="relative h-[80vh] w-[90vw] flex items-center justify-center">
            <img
              src={sorted[currentIndex].url}
              alt={`Imagen ${currentIndex + 1}`}
              className="max-h-full max-w-full object-contain"
            />
          </div>
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-3 text-white hover:bg-white/30"
            onClick={() => goTo(currentIndex + 1)}
          >
            <ChevronRight size={28} />
          </button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1">
            {sorted[currentIndex].descripcion && (
              <span className="rounded-md bg-black/60 px-3 py-1.5 text-sm text-white">
                {sorted[currentIndex].descripcion}
              </span>
            )}
            <span className="rounded-md bg-black/50 px-2 py-1 text-xs text-white">
              {currentIndex + 1} / {sorted.length}
            </span>
          </div>
        </div>
      )}
    </>
  );
}
