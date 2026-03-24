import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { api } from "@/lib/api";
import { useNgekostAuth } from "@/lib/NgekostAuthContext";
import { formatRupiah, getImageUrl } from "@/lib/utils/format";
import ImageGallery from "@/components/kost/ImageGallery";
import RoomCard from "@/components/room/RoomCard";
import BookingDialog from "@/components/booking/BookingDialog";
import { MapPin, User, ChevronRight, X } from "lucide-react";

function parseFacilities(str) {
  if (!str) return [];
  return str.split(",").map((s) => s.trim()).filter(Boolean);
}

/* Loading skeleton */
function DetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-8 py-8 space-y-6 animate-pulse">
      <div className="h-4 bg-secondary rounded w-40" />
      <div className="aspect-video bg-secondary rounded-xl" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="h-7 bg-secondary rounded w-2/3" />
          <div className="h-4 bg-secondary rounded w-1/2" />
          <div className="h-24 bg-secondary rounded-xl" />
          <div className="h-24 bg-secondary rounded-xl" />
        </div>
        <div className="h-48 bg-secondary rounded-xl" />
      </div>
    </div>
  );
}

export default function KostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useNgekostAuth();
  const [kost, setKost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showBooking, setShowBooking] = useState(false);
  const [zoomedImage, setZoomedImage] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    api.getKostDetail(id)
      .then((data) => setKost(data))
      .finally(() => setIsLoading(false));
  }, [id]);

  const handleSelectRoom = (room) => {
    if (!isAuthenticated) { navigate("/login"); return; }
    setSelectedRoom(room);
    setShowBooking(true);
  };

  if (isLoading) return <DetailSkeleton />;

  if (!kost) {
    return (
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-24 text-center">
        <p className="text-sm text-muted-foreground">Kost tidak ditemukan.</p>
      </div>
    );
  }

  const facilities = parseFacilities(kost.facilities);

  return (
    <div className="min-h-screen bg-white">

      {/* Breadcrumb */}
      <div className="border-b border-border">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-3">
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Link to="/kost" className="hover:text-foreground transition-colors">Cari Kost</Link>
            <ChevronRight className="w-3.5 h-3.5 shrink-0" />
            <span className="text-foreground font-medium truncate max-w-[200px] sm:max-w-xs">
              {kost.name}
            </span>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-8">

        {/* Gallery */}
        <ImageGallery images={kost.images} />

        {/* 2-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-8">

          {/* Left: info */}
          <div className="lg:col-span-2 space-y-0">

            {/* Title */}
            <div className="pb-5 border-b border-border">
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">{kost.name}</h1>
              <div className="flex items-center gap-1.5 mt-2 text-muted-foreground">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                <span className="text-sm">{kost.address}</span>
              </div>
              {kost.owner_name && (
                <div className="flex items-center gap-1.5 mt-1 text-muted-foreground">
                  <User className="w-3.5 h-3.5 shrink-0" />
                  <span className="text-sm">Pemilik: {kost.owner_name}</span>
                </div>
              )}
            </div>

            {/* Description */}
            {kost.description && (
              <div className="py-5 border-b border-border">
                <h3 className="text-sm font-semibold text-foreground mb-2">Deskripsi</h3>
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                  {kost.description}
                </p>
              </div>
            )}

            {/* Facilities */}
            {facilities.length > 0 && (
              <div className="py-5 border-b border-border">
                <h3 className="text-sm font-semibold text-foreground mb-3">Fasilitas</h3>
                <div className="flex flex-wrap gap-2">
                  {facilities.map((f) => (
                    <span
                      key={f}
                      className="text-xs text-muted-foreground bg-secondary border border-border px-3 py-1 rounded-md capitalize font-medium"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Rooms */}
            <div className="pt-6">
              <h3 className="text-base font-bold text-foreground tracking-tight mb-4">
                Daftar Kamar
                <span className="text-sm font-normal text-muted-foreground ml-2">
                  ({kost.rooms?.length || 0})
                </span>
              </h3>
              {kost.rooms?.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {kost.rooms.map((room) => (
                    <RoomCard key={room.id} room={room} onSelect={handleSelectRoom} />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Belum ada kamar yang terdaftar.</p>
              )}
            </div>
          </div>

          {/* Right: sidebar */}
          <div>
            <div className="border border-border rounded-xl p-5 sticky top-[57px] shadow-sm">
              <h3 className="text-sm font-semibold text-foreground mb-3">Biaya Sewa</h3>
              {kost.min_price > 0 && (
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-foreground">
                    {formatRupiah(kost.min_price)}
                  </span>
                  <span className="text-sm text-muted-foreground">/bulan</span>
                </div>
              )}
              <p className="text-xs text-muted-foreground mt-1 mb-4">Mulai dari harga kamar terendah</p>

              {/* Payment methods */}
              {kost.payment_methods?.length > 0 && (
                <div className="border-t border-border pt-4">
                  <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-3">
                    Metode Pembayaran
                  </h4>
                  <div className="space-y-2">
                    {kost.payment_methods.map((pm) => (
                      <div key={pm.id} className="flex items-center gap-3 p-2.5 bg-secondary/50 rounded-lg border border-border">
                        {pm.image && (
                          <div
                            className="w-8 h-8 rounded bg-white p-0.5 border border-border cursor-zoom-in hover:border-foreground/50 transition-colors shrink-0"
                            onClick={() => setZoomedImage(getImageUrl(pm.image))}
                          >
                            <img src={getImageUrl(pm.image)} alt={pm.name} className="w-full h-full object-contain" />
                          </div>
                        )}
                        <span className="text-sm font-medium text-foreground">{pm.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Booking Dialog */}
      {showBooking && selectedRoom && (
        <BookingDialog
          open={showBooking}
          onClose={() => setShowBooking(false)}
          room={selectedRoom}
          kostName={kost.name}
          paymentMethods={kost.payment_methods || []}
        />
      )}

      {zoomedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8"
          onClick={() => setZoomedImage(null)}
        >
          <button
            className="absolute top-6 right-6 w-12 h-12 bg-white/10 text-white rounded-full flex items-center justify-center hover:bg-white/25 transition-colors z-10"
            onClick={() => setZoomedImage(null)}
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={zoomedImage}
            alt="Zoomed"
            className="max-h-full max-w-full rounded-xl object-contain shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
