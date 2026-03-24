import React from "react";
import { Link } from "react-router-dom";
import { formatRupiah, formatDate, getStatusLabel, getStatusColor } from "@/lib/utils/format";
import { CalendarDays, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function BookingCard({ booking }) {
  return (
    <div className="bg-white rounded-xl border border-border p-4 sm:p-5 transition-all duration-200 hover:border-foreground/20"
      style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        
        {/* Left: Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5 mb-2">
            <Badge className={getStatusColor(booking.status)}>
              {getStatusLabel(booking.status)}
            </Badge>
            <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
              #{booking.id}
            </span>
          </div>

          <h3 className="font-semibold text-foreground text-base leading-snug truncate">
            {booking.kost_name}
          </h3>
          <p className="text-sm text-muted-foreground mt-0.5 truncate">
            {booking.room_details}
          </p>

          <div className="flex items-center gap-1.5 mt-2.5 text-xs text-muted-foreground">
            <CalendarDays className="w-3.5 h-3.5 shrink-0" />
            <span>{formatDate(booking.start_date)} &middot; {booking.duration_months} bulan</span>
          </div>
        </div>

        {/* Right: Price & Action */}
        <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0 border-t border-border sm:border-0 pt-3 sm:pt-0 mt-1 sm:mt-0">
          <span className="text-base font-bold text-foreground">
            {formatRupiah(booking.total_price)}
          </span>
          <Button variant="outline" size="sm" asChild className="gap-1.5 h-8 text-xs font-semibold">
            <Link to={`/bookings/${booking.id}`}>
              Detail <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </Button>
        </div>

      </div>
    </div>
  );
}
