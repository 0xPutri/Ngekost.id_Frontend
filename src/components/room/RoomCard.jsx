import React, { useState } from "react";
import { formatRupiah, getStatusLabel, getStatusColor, getImageUrl } from "@/lib/utils/format";
import { DoorOpen, ChevronLeft, ChevronRight, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function RoomCard({ room, onSelect }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = room.images || [];
  const hasMultipleImages = images.length > 1;
  const currentImage = images[currentImageIndex]?.image;
  const imageUrl = getImageUrl(currentImage);
  const isAvailable = room.status === "available";

  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <div className="bg-white rounded-xl border border-border overflow-hidden transition-all duration-200 hover:border-foreground/15 group"
      style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}
    >
      {/* Image Carousel */}
      <div className="relative aspect-[3/2] overflow-hidden bg-secondary">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={`Kamar ${room.room_number} - Foto ${currentImageIndex + 1}`}
            className="w-full h-full object-cover transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <DoorOpen className="w-8 h-8 text-muted-foreground/40" />
          </div>
        )}

        {/* Carousel Controls */}
        {hasMultipleImages && (
          <>
            <div className="absolute inset-0 flex items-center justify-between p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <button
                onClick={prevImage}
                className="w-7 h-7 rounded-full bg-white/80 hover:bg-white text-foreground flex items-center justify-center shadow-sm backdrop-blur-sm transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextImage}
                className="w-7 h-7 rounded-full bg-white/80 hover:bg-white text-foreground flex items-center justify-center shadow-sm backdrop-blur-sm transition-all"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            
            {/* Dots Indicator */}
            <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5 z-10">
              {images.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1.5 rounded-full transition-all duration-300 shadow-sm ${
                    idx === currentImageIndex ? "w-4 bg-white" : "w-1.5 bg-white/50"
                  }`}
                />
              ))}
            </div>

            {/* Counter Badge */}
            <div className="absolute top-2.5 left-2.5 bg-black/50 backdrop-blur-md px-2 py-0.5 rounded-md flex items-center gap-1 text-white">
              <ImageIcon className="w-3 h-3" />
              <span className="text-[10px] font-medium">{currentImageIndex + 1}/{images.length}</span>
            </div>
          </>
        )}
        {/* Status Badge */}
        <div className="absolute top-2.5 right-2.5">
          <Badge className={getStatusColor(room.status)}>
            {getStatusLabel(room.status)}
          </Badge>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-baseline justify-between gap-2 mb-1.5">
          <h4 className="font-semibold text-sm text-foreground">Kamar {room.room_number}</h4>
          <span className="text-sm font-bold text-foreground shrink-0">
            {formatRupiah(room.price)}
            <span className="text-[11px] font-normal text-muted-foreground">/bln</span>
          </span>
        </div>
        {room.description && (
          <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{room.description}</p>
        )}
        <Button
          size="sm"
          onClick={() => onSelect(room)}
          disabled={!isAvailable}
          className="w-full mt-1"
          variant={isAvailable ? "default" : "outline"}
        >
          {isAvailable ? "Pesan Kamar Ini" : "Tidak Tersedia"}
        </Button>
      </div>
    </div>
  );
}
