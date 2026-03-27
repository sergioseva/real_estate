"use client";

import { thumbUrl } from "@/lib/utils";

export function ThumbnailImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <img
      src={thumbUrl(src)}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={(e) => {
        e.currentTarget.onerror = null;
        e.currentTarget.src = src;
      }}
      className={className}
    />
  );
}
