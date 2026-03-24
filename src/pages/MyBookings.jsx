import React, { useState, useEffect } from "react";
import { api } from "@/lib/api";
import BookingCard from "@/components/booking/BookingCard";
import { ChevronLeft, ChevronRight, CalendarCheck } from "lucide-react";

/* Loading Skeleton */
function BookingsSkeleton() {
  return (
    <div className="min-h-screen bg-white animate-pulse">
      <div className="border-b border-border">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-8">
          <div className="h-6 bg-secondary rounded w-48 mb-2" />
          <div className="h-4 bg-secondary rounded w-32" />
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-8 grid grid-cols-1 lg:grid-cols-2 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-28 bg-secondary rounded-xl" />
        ))}
      </div>
    </div>
  );
}

export default function MyBookings() {
  const [data, setData] = useState({ results: [], count: 0, next: null, previous: null });
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setIsLoading(true);
    api.getBookings({ page })
      .then((res) => setData(res))
      .finally(() => setIsLoading(false));
  }, [page]);

  const totalPages = data.count ? Math.ceil(data.count / 12) : 1;

  if (isLoading && page === 1) return <BookingsSkeleton />;

  return (
    <div className="min-h-screen bg-white">
      
      {/* Header */}
      <div className="border-b border-border">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-secondary/80 border border-border rounded-lg flex items-center justify-center shrink-0">
              <CalendarCheck className="w-5 h-5 text-foreground" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">Pesanan Saya</h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                {data.count > 0 ? `${data.count} pesanan ditemukan` : "Riwayat pemesanan kost Anda"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-8">
        
        {data.results.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-border rounded-xl">
            <CalendarCheck className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm font-medium text-foreground">Belum ada pesanan.</p>
            <p className="text-xs text-muted-foreground mt-1">Cari kost dan mulai pemesanan pertama Anda.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {data.results.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {(data.next || data.previous) && (
          <div className="flex items-center justify-between mt-10 pt-6 border-t border-border">
            <span className="text-sm text-muted-foreground">
              Halaman{" "}
              <span className="font-semibold text-foreground">{page}</span>
              {totalPages > 1 && (
                <> dari <span className="font-semibold text-foreground">{totalPages}</span></>
              )}
            </span>
            <div className="flex gap-2">
              <button
                disabled={!data.previous}
                onClick={() => setPage(page - 1)}
                className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 border border-border rounded-md hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Sebelumnya
              </button>
              <button
                disabled={!data.next}
                onClick={() => setPage(page + 1)}
                className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 border border-border rounded-md hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Selanjutnya <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
