import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { formatRupiah } from "@/lib/utils/format";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const labelClass = "text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5";

export default function BookingDialog({ open, onClose, room, kostName }) {
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState("");
  const [duration, setDuration] = useState("1");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const price = parseFloat(room.price) || 0;
  const durationNum = parseInt(duration) || 1;
  const total = price * durationNum;

  const handleSubmit = async () => {
    if (!startDate) {
      toast.error("Pilih tanggal mulai sewa");
      return;
    }
    setIsSubmitting(true);
    try {
      const booking = await api.createBooking({
        room: room.id,
        start_date: startDate,
        duration_months: durationNum,
      });
      toast.success("Booking berhasil dibuat!");
      onClose();
      navigate(`/bookings/${booking.id}`);
    } catch (err) {
      toast.error(err.message || "Gagal membuat booking");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Pesan Kamar</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Price Info */}
          <div className="flex justify-between items-center py-3 border-b border-border">
            <div>
              <p className="text-xs text-muted-foreground">{kostName}</p>
              <p className="text-sm font-semibold text-foreground">Kamar {room.room_number}</p>
            </div>
            <span className="text-sm font-bold text-foreground">{formatRupiah(price)}<span className="text-xs font-normal text-muted-foreground">/bln</span></span>
          </div>

          {/* Start Date */}
          <div>
            <label className={labelClass}>Tanggal Mulai Sewa</label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
            />
          </div>

          {/* Duration */}
          <div>
            <label className={labelClass}>Durasi Sewa</label>
            <Select value={duration} onValueChange={setDuration}>
              <SelectTrigger className="h-[42px] text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 6, 12].map((m) => (
                  <SelectItem key={m} value={String(m)}>{m} bulan</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Total */}
          <div className="bg-secondary/50 border border-border rounded-lg p-4">
            <div className="flex items-baseline justify-between">
              <span className="text-sm font-medium text-foreground">Total Pembayaran</span>
              <span className="text-xl font-bold text-foreground">{formatRupiah(total)}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {formatRupiah(price)} × {durationNum} bulan
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1"
            >
              Batal
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              Konfirmasi Booking
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
