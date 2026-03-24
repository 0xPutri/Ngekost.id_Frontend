import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { api } from "@/lib/api";
import { formatRupiah, formatDate, getStatusLabel, getStatusColor, getImageUrl } from "@/lib/utils/format";
import { toast } from "sonner";
import { ChevronRight, CalendarDays, Clock, Building2, DoorOpen, Upload, Loader2, Image as ImageIcon, CreditCard, X } from "lucide-react";

function DetailSkeleton() {
  return (
    <div className="min-h-screen bg-white animate-pulse">
      <div className="border-b border-border">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-3">
          <div className="h-3.5 bg-secondary rounded w-40" />
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-8 space-y-6">
        <div className="h-7 bg-secondary rounded w-1/3" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-4">
            <div className="h-40 bg-secondary rounded-xl" />
            <div className="h-48 bg-secondary rounded-xl" />
          </div>
          <div className="h-64 bg-secondary rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export default function BookingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [zoomedImage, setZoomedImage] = useState(null);

  const fetchBooking = () => {
    setIsLoading(true);
    api.getBookingDetail(id)
      .then(async (data) => {
        setBooking(data);
        if (data.status === "pending_payment") {
          try {
            const room = await api.getRoomDetail(data.room);
            const methods = await api.getKostPaymentMethods(room.kost);
            setPaymentMethods(methods.results || methods);
          } catch (err) {
            console.error("Gagal memuat metode pembayaran", err);
          }
        }
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => { fetchBooking(); }, [id]);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Pilih file bukti pembayaran terlebih dahulu");
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", selectedFile);
      await api.uploadPayment(id, formData);
      toast.success("Bukti pembayaran berhasil diunggah!");
      setSelectedFile(null);
      setPreview(null);
      fetchBooking();
    } catch (err) {
      toast.error(err.message || "Gagal mengunggah bukti pembayaran");
    } finally {
      setUploading(false);
    }
  };

  if (isLoading) return <DetailSkeleton />;

  if (!booking) {
    return (
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-24 text-center">
        <p className="text-sm text-muted-foreground">Booking tidak ditemukan.</p>
      </div>
    );
  }

  const canUpload = booking.status === "pending_payment";

  return (
    <div className="min-h-screen bg-white">

      {/* Breadcrumb */}
      <div className="border-b border-border">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-3">
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Link to="/bookings" className="hover:text-foreground transition-colors">Pesanan</Link>
            <ChevronRight className="w-3.5 h-3.5 shrink-0" />
            <span className="text-foreground font-medium">Detail #{booking.id}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-6 border-b border-border">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
              Detail Pesanan <span className="text-muted-foreground font-normal">#{booking.id}</span>
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Dibuat {formatDate(booking.created_at)}</p>
          </div>
          <span className={`inline-flex items-center text-xs font-semibold px-3 py-1 rounded-full self-start shrink-0 ${getStatusColor(booking.status)}`}>
            {getStatusLabel(booking.status)}
          </span>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-6">

          {/* Left Column: Info & Upload */}
          <div className="lg:col-span-2 space-y-0">
            
            {/* Info Grid */}
            <div className="pb-6 border-b border-border">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex items-start gap-3">
                  <Building2 className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold">Nama Kost</p>
                    <p className="text-sm font-semibold text-foreground mt-0.5">{booking.kost_name}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <DoorOpen className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold">Kamar</p>
                    <p className="text-sm font-semibold text-foreground mt-0.5">{booking.room_details}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CalendarDays className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold">Tanggal Mulai</p>
                    <p className="text-sm font-semibold text-foreground mt-0.5">{formatDate(booking.start_date)}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold">Durasi</p>
                    <p className="text-sm font-semibold text-foreground mt-0.5">{booking.duration_months} bulan</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bukti Pembayaran */}
            <div className="pt-6">
              <h3 className="text-base font-bold text-foreground tracking-tight mb-4">Bukti Pembayaran</h3>

              {booking.payment_proof?.image ? (
                <div className="space-y-3">
                  <div 
                    className="rounded-xl overflow-hidden border border-border bg-secondary/30 cursor-zoom-in"
                    onClick={() => setZoomedImage(getImageUrl(booking.payment_proof.image))}
                  >
                    <img
                      src={getImageUrl(booking.payment_proof.image)}
                      alt="Bukti pembayaran"
                      className="w-full max-h-80 object-contain hover:opacity-90 transition-opacity"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Diunggah: {formatDate(booking.payment_proof.uploaded_at)}
                  </p>
                </div>

              ) : canUpload ? (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Unggah bukti transfer setelah melakukan pembayaran. Bukti akan diverifikasi oleh pemilik kost.
                  </p>

                  {/* Upload Area */}
                  <label className="block cursor-pointer">
                    <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                      preview ? "border-border" : "border-border hover:border-foreground/30"
                    }`}>
                      {preview ? (
                        <img src={preview} alt="Preview" className="max-h-56 mx-auto rounded-lg object-contain" />
                      ) : (
                        <>
                          <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                          <p className="text-sm font-medium text-foreground">Klik atau seret file gambar ke sini</p>
                          <p className="text-xs text-muted-foreground mt-1">Format: JPG, PNG, atau JPEG</p>
                        </>
                      )}
                    </div>
                    <input type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
                  </label>

                  {selectedFile && (
                    <div className="flex items-center justify-between gap-3 bg-secondary/50 p-3 rounded-lg border border-border">
                      <span className="text-xs font-medium text-foreground truncate pl-1">{selectedFile.name}</span>
                      <button
                        onClick={handleUpload}
                        disabled={uploading}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-foreground text-background hover:bg-foreground/90 transition-colors disabled:opacity-50 shrink-0"
                      >
                        {uploading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                        Unggah Bukti
                      </button>
                    </div>
                  )}
                </div>

              ) : (
                <div className="flex items-center gap-2 text-muted-foreground py-4">
                  <ImageIcon className="w-4 h-4 shrink-0" />
                  <span className="text-sm">Belum ada bukti pembayaran.</span>
                </div>
              )}
            </div>

          </div>

          {/* Right Column: Sidebar */}
          <div>
            <div className="border border-border rounded-xl p-5 sticky top-[57px] shadow-sm">
              <h3 className="text-sm font-semibold text-foreground mb-3">Ringkasan Pembayaran</h3>
              
              <div className="flex flex-col gap-1 mb-5">
                <span className="text-xs text-muted-foreground">Total Tagihan</span>
                <span className="text-3xl font-bold text-foreground">
                  {formatRupiah(booking.total_price)}
                </span>
              </div>

              {/* Payment Methods */}
              {canUpload && paymentMethods.length > 0 && (
                <div className="border-t border-border pt-5">
                  <h4 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    Cara Pembayaran
                  </h4>
                  <div className="space-y-3">
                    {paymentMethods.map((pm) => (
                      <div key={pm.id} className="border border-border rounded-xl p-3.5 bg-secondary/30">
                        <div className="flex items-center gap-3 mb-2">
                          {pm.image ? (
                            <img src={getImageUrl(pm.image)} alt={pm.name} className="w-8 h-8 object-contain shrink-0 rounded bg-white p-0.5 border border-border" />
                          ) : (
                            <CreditCard className="w-5 h-5 text-muted-foreground shrink-0" />
                          )}
                          <span className="text-sm font-semibold text-foreground">{pm.name}</span>
                        </div>
                        
                        {pm.image && (
                          <button 
                            onClick={() => setZoomedImage(getImageUrl(pm.image))}
                            className="mt-1 w-full text-xs font-medium text-foreground border border-border py-2 rounded-lg bg-white hover:bg-secondary/80 transition-colors"
                          >
                            Tampilkan QRIS / Rekening
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

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
