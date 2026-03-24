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

export default function SignIn() {
  const navigate = useNavigate();
  const { login } = useNgekostAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error("Masukkan username dan password");
      return;
    }
    setIsLoading(true);
    try {
      await login(username, password);
      toast.success("Berhasil masuk!");
      navigate("/");
    } catch (err) {
      toast.error(err.message || "Username atau password salah");
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
            {/* Brand icon */}
            <div className="w-11 h-11 rounded-xl border border-white/20 flex items-center justify-center mx-auto mb-7">
              <svg width="20" height="20" viewBox="0 0 14 14" fill="none">
                <rect x="1" y="1" width="5" height="5" rx="1" fill="white" />
                <rect x="8" y="1" width="5" height="5" rx="1" fill="white" opacity="0.5" />
                <rect x="1" y="8" width="5" height="5" rx="1" fill="white" opacity="0.5" />
                <rect x="8" y="8" width="5" height="5" rx="1" fill="white" opacity="0.3" />
              </svg>
            </div>
            <h2 className="text-xl font-bold leading-snug mb-2">
              Belum punya akun?
            </h2>
            <p className="text-sm text-white/60 leading-relaxed mb-8">
              Daftar dan temukan hunian kost terbaik di Banyumas.
            </p>
            <Link
              to="/register"
              className="inline-flex items-center justify-center px-7 py-2 rounded-full border border-white/30 text-white text-sm font-semibold hover:bg-white hover:text-foreground transition-all duration-200"
            >
              Daftar
            </Link>
          </div>
        </div>

        {/* Panel Kanan (Form) */}
        <div className="flex-1 flex flex-col justify-center bg-white px-8 py-10 lg:px-12">
          <div className="max-w-xs mx-auto w-full">
            <div className="mb-7">
              <h1 className="text-2xl font-bold text-foreground tracking-tight">Masuk ke Akun</h1>
              <p className="text-sm text-muted-foreground mt-1">Selamat datang kembali</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="username" className={labelClass}>Username</label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="username_anda"
                  autoComplete="username"
                />
              </div>

              <div>
                <label htmlFor="password" className={labelClass}>Password</label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full mt-1"
              >
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                Masuk
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground mt-6 lg:hidden">
              Belum punya akun?{" "}
              <Link to="/register" className="font-semibold text-teal">Daftar sekarang</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
