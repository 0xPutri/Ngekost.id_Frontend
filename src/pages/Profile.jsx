import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { useNgekostAuth } from "@/lib/NgekostAuthContext";
import { formatRupiah } from "@/lib/utils/format";
import { toast } from "sonner";
import { Loader2, Save, ShoppingBag, Clock, Wallet } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const labelClass = "text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5";

function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-white animate-pulse">
      <div className="border-b border-border">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-8">
          <div className="h-6 bg-secondary rounded w-40 mb-2" />
          <div className="h-4 bg-secondary rounded w-64" />
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-10">
          <div className="lg:w-1/3 shrink-0 space-y-6">
            <div className="h-40 bg-secondary rounded-xl" />
          </div>
          <div className="lg:w-2/3 h-96 bg-secondary rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export default function Profile() {
  const { user, fetchProfile, isAuthenticated } = useNgekostAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", first_name: "", last_name: "", phone_number: "" });
  const [stats, setStats] = useState({ total: 0, pending: 0, spent: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const loadData = async () => {
      try {
        const [profileData, bookingsData] = await Promise.all([
          api.getProfile(),
          api.getBookings()
        ]);

        setForm({
          email: profileData.email || "",
          first_name: profileData.first_name || "",
          last_name: profileData.last_name || "",
          phone_number: profileData.phone_number || "",
        });

        const results = bookingsData.results || [];
        let pendingCount = 0;
        let totalSpent = 0;

        results.forEach(b => {
          if (b.status === "pending_payment" || b.status === "waiting_verification") {
            pendingCount++;
          }
          if (b.status === "paid") {
            totalSpent += parseFloat(b.total_price || 0);
          }
        });

        setStats({
          total: bookingsData.count || 0,
          pending: pendingCount,
          spent: totalSpent
        });

      } catch (err) {
        console.error("Failed to load profile data", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [isAuthenticated, navigate]);

  const handleChange = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await api.updateProfile(form);
      await fetchProfile();
      toast.success("Profil berhasil diperbarui");
    } catch (err) {
      toast.error(err.message || "Gagal memperbarui profil");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <ProfileSkeleton />;

  return (
    <div className="min-h-screen bg-white">
      
      {/* Header */}
      <div className="border-b border-border">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-8">
          <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">Pengaturan Akun</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Kelola informasi profil, preferensi akun, dan pantau aktivitas Anda.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10">
        
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Left Sidebar: Stats & Badge */}
          <div className="lg:w-1/3 shrink-0 space-y-6">
            
            {/* User Badge */}
            {user && (
              <div className="p-5 rounded-xl border border-border bg-secondary/20 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-white border border-border flex items-center justify-center text-lg font-bold text-foreground shrink-0 uppercase shadow-sm">
                    {user.username?.substring(0, 2)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-base font-bold text-foreground truncate">@{user.username}</p>
                    <p className="text-xs font-medium text-muted-foreground capitalize mt-0.5">{user.role} Ngekost</p>
                  </div>
                </div>
              </div>
            )}

            {/* Account Stats Widget */}
            <div className="p-5 rounded-xl border border-border bg-white shadow-sm space-y-5">
              <h3 className="text-sm font-bold text-foreground tracking-tight">Ringkasan Aktivitas</h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                    <ShoppingBag className="w-4 h-4 text-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">Total Pesanan</p>
                    <p className="text-sm font-bold text-foreground">{stats.total} pesanan</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4 text-orange-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">Menunggu Pembayaran</p>
                    <p className="text-sm font-bold text-foreground">{stats.pending} pesanan</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                    <Wallet className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">Total Pengeluaran</p>
                    <p className="text-sm font-bold text-foreground">{formatRupiah(stats.spent)}</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Content: Forms */}
          <div className="lg:w-2/3 space-y-8">
            
            <section>
              <div className="mb-4">
                <h2 className="text-base font-bold text-foreground tracking-tight">Informasi Pribadi</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Data diri yang digunakan untuk reservasi dan identifikasi penyewa.
                </p>
              </div>

              <form onSubmit={handleSave} className="border border-border rounded-xl bg-white shadow-sm overflow-hidden flex flex-col">
                <div className="p-5 sm:p-7 space-y-5 flex-1">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className={labelClass} htmlFor="first_name">Nama Depan</label>
                      <Input
                        id="first_name"
                        value={form.first_name}
                        onChange={handleChange("first_name")}
                        placeholder="Ketik nama depan"
                      />
                    </div>
                    <div>
                      <label className={labelClass} htmlFor="last_name">Nama Belakang</label>
                      <Input
                        id="last_name"
                        value={form.last_name}
                        onChange={handleChange("last_name")}
                        placeholder="Ketik nama belakang"
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass} htmlFor="email">Email Utama</label>
                    <Input
                      id="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange("email")}
                      placeholder="hello@ngekost.my.id"
                    />
                    <p className="text-[11px] text-muted-foreground mt-1.5 leading-relaxed">
                      Email ini akan digunakan untuk login dan menerima pembaruan status pemesanan kost Anda.
                    </p>
                  </div>

                  <div>
                    <label className={labelClass} htmlFor="phone">Nomor Telepon / WhatsApp</label>
                    <Input
                      id="phone"
                      type="tel"
                      value={form.phone_number}
                      onChange={handleChange("phone_number")}
                      placeholder="08xx-xxxx-xxxx"
                    />
                    <p className="text-[11px] text-muted-foreground mt-1.5 leading-relaxed">
                      Pastikan nomor telepon aktif untuk memudahkan pemilik kost menghubungi Anda.
                    </p>
                  </div>
                </div>

                {/* Form Footer Action */}
                <div className="bg-secondary/40 border-t border-border px-5 sm:px-7 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <span className="text-xs text-muted-foreground">Perubahan akan langsung tersimpan.</span>
                  <Button
                    type="submit"
                    disabled={isSaving}
                    className="w-full sm:w-auto"
                  >
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Simpan Perubahan
                  </Button>
                </div>
              </form>
            </section>

          </div>
        </div>

      </div>
    </div>
  );
}
