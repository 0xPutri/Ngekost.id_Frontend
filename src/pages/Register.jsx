import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useNgekostAuth } from "@/lib/NgekostAuthContext";
import { toast } from "sonner";
import { Loader2, Eye, EyeOff } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const labelClass =
  "text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5";

function DarkDecorations() {
  return (
    <>
      <div className="absolute -bottom-16 -right-16 w-52 h-52 rounded-full border-[36px] border-white/5" />
      <div className="absolute -top-10 -left-10 w-36 h-36 rounded-full border-[24px] border-white/5" />
      <div className="absolute top-14 right-10 w-4 h-4 border-2 border-white/20 rotate-45" />
      <div className="absolute bottom-24 left-8 w-3 h-3 border-2 border-white/15 rotate-45" />
      <div className="absolute top-1/2 left-5 w-2 h-2 bg-white/10 rotate-45" />
    </>
  );
}

export default function Register() {
  const navigate = useNavigate();
  const { register } = useNgekostAuth();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    password_confirm: "",
    first_name: "",
    last_name: "",
    phone_number: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.email || !form.password) {
      toast.error("Lengkapi data yang wajib diisi");
      return;
    }
    if (form.password !== form.password_confirm) {
      toast.error("Password tidak cocok");
      return;
    }
    setIsLoading(true);
    try {
      await register({ ...form, role: "tenant" });
      toast.success("Registrasi berhasil! Silakan masuk.");
      navigate("/login");
    } catch (err) {
      const data = err.data;
      if (data && typeof data === "object") {
        const msgs = Object.values(data).flat();
        msgs.forEach((m) => toast.error(typeof m === "string" ? m : JSON.stringify(m)));
      } else {
        toast.error(err.message || "Registrasi gagal");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-secondary/40 px-4 py-10">
      <div className="w-full max-w-3xl flex rounded-2xl overflow-hidden border border-border shadow-sm">
        {/* Panel Kiri (Dark) */}
        <div className="hidden lg:flex lg:w-[38%] relative flex-col items-center justify-center p-10 text-white overflow-hidden bg-foreground">
          <DarkDecorations />
          <div className="relative z-10 text-center">
            <div className="w-11 h-11 rounded-xl border border-white/20 flex items-center justify-center mx-auto mb-7">
              <svg width="20" height="20" viewBox="0 0 14 14" fill="none">
                <rect x="1" y="1" width="5" height="5" rx="1" fill="white" />
                <rect x="8" y="1" width="5" height="5" rx="1" fill="white" opacity="0.5" />
                <rect x="1" y="8" width="5" height="5" rx="1" fill="white" opacity="0.5" />
                <rect x="8" y="8" width="5" height="5" rx="1" fill="white" opacity="0.3" />
              </svg>
            </div>
            <h2 className="text-xl font-bold leading-snug mb-2">
              Sudah punya akun?
            </h2>
            <p className="text-sm text-white/60 leading-relaxed mb-8">
              Masuk dan lanjutkan mencari kost terbaik di Banyumas.
            </p>
            <Link
              to="/login"
              className="inline-flex items-center justify-center px-7 py-2 rounded-full border border-white/30 text-white text-sm font-semibold hover:bg-white hover:text-foreground transition-all duration-200"
            >
              Masuk
            </Link>
          </div>
        </div>

        {/* Panel Kanan (Form) */}
        <div className="flex-1 flex flex-col justify-center bg-white px-8 py-10 lg:px-12">
          <div className="max-w-sm mx-auto w-full">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-foreground tracking-tight">Buat Akun Baru</h1>
              <p className="text-sm text-muted-foreground mt-1">Daftar untuk mulai mencari kost di Banyumas</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* Nama */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="first_name" className={labelClass}>Nama Depan</label>
                  <Input
                    id="first_name"
                    value={form.first_name}
                    onChange={handleChange("first_name")}
                    placeholder="Ketik nama depan"
                  />
                </div>
                <div>
                  <label htmlFor="last_name" className={labelClass}>Nama Belakang</label>
                  <Input
                    id="last_name"
                    value={form.last_name}
                    onChange={handleChange("last_name")}
                    placeholder="Ketik nama belakang"
                  />
                </div>
              </div>

              {/* Username */}
              <div>
                <label htmlFor="username" className={labelClass}>
                  Username <span className="text-teal normal-case tracking-normal font-medium">*</span>
                </label>
                <Input
                  id="username"
                  value={form.username}
                  onChange={handleChange("username")}
                  placeholder="username_anda"
                  autoComplete="username"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className={labelClass}>
                  Email <span className="text-teal normal-case tracking-normal font-medium">*</span>
                </label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange("email")}
                  placeholder="hello@ngekost.my.id"
                  autoComplete="email"
                />
              </div>

              {/* Telepon */}
              <div>
                <label htmlFor="phone" className={labelClass}>Nomor Telepon</label>
                <Input
                  id="phone"
                  value={form.phone_number}
                  onChange={handleChange("phone_number")}
                  placeholder="08xx-xxxx-xxxx"
                />
              </div>

              {/* Password row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="password" className={labelClass}>
                    Password <span className="text-teal normal-case tracking-normal font-medium">*</span>
                  </label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={handleChange("password")}
                      placeholder="Minimal 8 karakter"
                      autoComplete="new-password"
                      className="pr-9"
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label htmlFor="password_confirm" className={labelClass}>Konfirmasi</label>
                  <Input
                    id="password_confirm"
                    type="password"
                    value={form.password_confirm}
                    onChange={handleChange("password_confirm")}
                    placeholder="••••••••"
                    autoComplete="new-password"
                  />
                </div>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full mt-1"
              >
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                Daftar Sekarang
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground mt-5 lg:hidden">
              Sudah punya akun?{" "}
              <Link to="/login" className="font-semibold text-teal">Masuk</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
