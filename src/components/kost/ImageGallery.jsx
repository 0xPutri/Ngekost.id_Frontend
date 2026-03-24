import React, { useState } from "react";
import { getImageUrl } from "@/lib/utils/format";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ImageGallery({ images = [] }) {
  const [active, setActive] = useState(0);

  if (!images.length) {
    return (
      <div className="aspect-video bg-secondary rounded-xl flex items-center justify-center">
        <div className="w-10 h-10 rounded-lg bg-border flex items-center justify-center">
          <svg width="18" height="18" viewBox="0 0 14 14" fill="none">
            <rect x="1" y="1" width="5" height="5" rx="1" fill="hsl(var(--muted-foreground))" />
            <rect x="8" y="1" width="5" height="5" rx="1" fill="hsl(var(--muted-foreground))" opacity="0.5" />
            <rect x="1" y="8" width="5" height="5" rx="1" fill="hsl(var(--muted-foreground))" opacity="0.5" />
            <rect x="8" y="8" width="5" height="5" rx="1" fill="hsl(var(--muted-foreground))" opacity="0.3" />
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Main Image */}
      <div className="relative aspect-video bg-secondary rounded-xl overflow-hidden">
        <img
          src={getImageUrl(images[active]?.image)}
          alt={images[active]?.caption || "Gambar kost"}
          className="w-full h-full object-cover"
        />
        {images.length > 1 && (
          <>
            <button
              onClick={() => setActive((prev) => (prev - 1 + images.length) % images.length)}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-foreground/60 text-background flex items-center justify-center hover:bg-foreground/80 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActive((prev) => (prev + 1) % images.length)}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-foreground/60 text-background flex items-center justify-center hover:bg-foreground/80 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-foreground/50 text-background text-xs px-2.5 py-1 rounded-full tabular-nums">
              {active + 1} / {images.length}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setActive(i)}
              className={`w-16 h-14 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                i === active
                  ? "border-foreground opacity-100"
                  : "border-transparent opacity-50 hover:opacity-80"
              }`}
            >
              <img src={getImageUrl(img.image)} alt={img.caption || ""} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
