import React from "react";
import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";
import { formatRupiah, getImageUrl } from "@/lib/utils/format";

export default function KostCard({ kost }) {
  const image = kost.images?.[0]?.image;
  const imageUrl = getImageUrl(image);

  const facilities = kost.facilities
    ? kost.facilities.split(",").map((f) => f.trim()).filter(Boolean).slice(0, 3)
    : [];

  return (
    <Link to={`/kost/${kost.id}`} className="group block">
      <div className="bg-white rounded-xl overflow-hidden border border-border transition-all duration-200 hover:border-foreground/15"
        style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}
        onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.08)"}
        onMouseLeave={e => e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.04)"}
      >
        {/* Image */}
        <div className="relative aspect-[16/10] overflow-hidden bg-secondary">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={kost.name}
              className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500 ease-out"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-9 h-9 rounded-lg bg-border flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 14 14" fill="none">
                  <rect x="1" y="1" width="5" height="5" rx="1" fill="hsl(var(--muted-foreground))" />
                  <rect x="8" y="1" width="5" height="5" rx="1" fill="hsl(var(--muted-foreground))" opacity="0.5" />
                  <rect x="1" y="8" width="5" height="5" rx="1" fill="hsl(var(--muted-foreground))" opacity="0.5" />
                  <rect x="8" y="8" width="5" height="5" rx="1" fill="hsl(var(--muted-foreground))" opacity="0.3" />
                </svg>
              </div>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          {/* Name & Address */}
          <h3 className="font-semibold text-[14px] text-foreground leading-snug line-clamp-1 group-hover:text-teal transition-colors duration-150">
            {kost.name}
          </h3>
          <div className="flex items-center gap-1 mt-1">
            <MapPin className="w-3 h-3 text-muted-foreground shrink-0" />
            <span className="text-xs text-muted-foreground line-clamp-1">{kost.address}</span>
          </div>

          {/* Facilities */}
          {facilities.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2.5">
              {facilities.map((f) => (
                <span
                  key={f}
                  className="text-[11px] text-muted-foreground bg-secondary px-2 py-0.5 rounded capitalize font-medium"
                >
                  {f}
                </span>
              ))}
            </div>
          )}

          {/* Price */}
          <div className="mt-3 pt-3 border-t border-border">
            {kost.min_price > 0 ? (
              <div className="flex items-baseline gap-1">
                <span className="text-sm font-bold text-foreground">
                  {formatRupiah(kost.min_price)}
                </span>
                <span className="text-[11px] text-muted-foreground">/bulan</span>
              </div>
            ) : (
              <span className="text-xs text-muted-foreground">Hubungi pemilik</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
