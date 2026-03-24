import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import KostGrid from "@/components/kost/KostGrid";
import SearchBar from "@/components/kost/SearchBar";
import { formatRupiah, getImageUrl } from "@/lib/utils/format";
import { ArrowRight, MapPin, ShieldCheck, Zap } from "lucide-react";

const STATS = [
  { value: "500+", label: "Kost Terdaftar" },
  { value: "2.000+", label: "Tenant Aktif" },
  { value: "98%", label: "Kepuasan Pengguna" },
];

const FEATURES = [
  {
    icon: MapPin,
    title: "Lokasi Strategis",
    desc: "Kost terpilih di pusat kota Banyumas dan sekitar kampus.",
  },
  {
    icon: ShieldCheck,
    title: "Terverifikasi",
    desc: "Setiap properti diverifikasi langsung oleh tim kami.",
  },
  {
    icon: Zap,
    title: "Booking Instan",
    desc: "Proses pemesanan cepat, tanpa biaya tersembunyi.",
  },
];

/* Featured Card */
function FeaturedKostCard({ kost }) {
  const imageUrl = getImageUrl(kost.images?.[0]?.image);
  const facilities = kost.facilities
    ? kost.facilities.split(",").map((f) => f.trim()).filter(Boolean).slice(0, 3)
    : [];

  return (
    <Link
      to={`/kost/${kost.id}`}
      className="group block bg-white rounded-xl border border-border overflow-hidden"
      style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.06), 0 0 0 0.5px rgba(0,0,0,0.04)" }}
    >
      {/* Image */}
      <div className="aspect-[16/10] bg-secondary overflow-hidden relative">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={kost.name}
            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-10 h-10 rounded-lg bg-border flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 14 14" fill="none">
                <rect x="1" y="1" width="5" height="5" rx="1" fill="hsl(var(--muted-foreground))" />
                <rect x="8" y="1" width="5" height="5" rx="1" fill="hsl(var(--muted-foreground))" opacity="0.5" />
                <rect x="1" y="8" width="5" height="5" rx="1" fill="hsl(var(--muted-foreground))" opacity="0.5" />
                <rect x="8" y="8" width="5" height="5" rx="1" fill="hsl(var(--muted-foreground))" opacity="0.3" />
              </svg>
            </div>
          </div>
        )}
        <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 bg-teal text-white text-[11px] font-semibold px-2.5 py-1 rounded-full">
          Kost Terbaru
        </div>
      </div>

      {/* Body */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-sm text-foreground leading-snug line-clamp-1">
              {kost.name}
            </h3>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1 line-clamp-1">
              <MapPin className="w-3 h-3 shrink-0" />
              {kost.address}
            </p>
          </div>
          {kost.min_price > 0 && (
            <div className="text-right shrink-0">
              <p className="font-bold text-teal text-sm">{formatRupiah(kost.min_price)}</p>
              <p className="text-[10px] text-muted-foreground">/bulan</p>
            </div>
          )}
        </div>

        {facilities.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {facilities.map((f) => (
              <span key={f} className="text-[11px] text-muted-foreground bg-secondary px-2 py-0.5 rounded-md capitalize font-medium">
                {f}
              </span>
            ))}
          </div>
        )}

        <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors flex items-center gap-1">
            Lihat Detail <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </span>
        </div>
      </div>
    </Link>
  );
}

/* Skeleton */
function FeaturedKostSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-border overflow-hidden animate-pulse"
      style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.06)" }}>
      <div className="aspect-[16/10] bg-secondary" />
      <div className="p-4 space-y-3">
        <div className="h-3.5 bg-secondary rounded w-3/4" />
        <div className="h-3 bg-secondary rounded w-1/2" />
        <div className="flex gap-1.5 mt-1">
          <div className="h-5 bg-secondary rounded w-10" />
          <div className="h-5 bg-secondary rounded w-10" />
          <div className="h-5 bg-secondary rounded w-14" />
        </div>
        <div className="h-px bg-border mt-2" />
        <div className="h-3 bg-secondary rounded w-20" />
      </div>
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const [kosts, setKosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.getKosts({ ordering: "-created_at" })
      .then((data) => setKosts(data.results || []))
      .finally(() => setIsLoading(false));
  }, []);

  const handleSearch = (query) => {
    navigate(`/kost?search=${encodeURIComponent(query)}`);
  };

  return (
    <div className="bg-white">

      {/* Hero */}
      <section className="border-b border-border">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-20 sm:py-28 lg:py-36">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

            {/* Left */}
            <div className="max-w-3xl">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 border border-border rounded-full px-3 py-1 mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-teal" />
                <span className="text-xs font-medium text-muted-foreground tracking-wide">Platform Kost #1 di Banyumas</span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground tracking-tight leading-[1.12]">
                Temukan hunian
                <br />
                <span className="text-teal">terbaik</span> di Banyumas.
              </h1>

              {/* Sub-text */}
              <p className="text-base sm:text-lg text-muted-foreground mt-5 max-w-xl leading-relaxed">
                Marketplace kost untuk mahasiswa dan pekerja. Cari, bandingkan, dan booking dalam hitungan menit.
              </p>

              {/* Search */}
              <div className="mt-8">
                <SearchBar onSearch={handleSearch} />
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-8 mt-12 pt-8 border-t border-border">
                {STATS.map((s) => (
                  <div key={s.label}>
                    <div className="text-xl font-bold text-foreground">{s.value}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right */}
            <div className="hidden lg:block">
              {isLoading ? (
                <FeaturedKostSkeleton />
              ) : kosts[0] ? (
                <FeaturedKostCard kost={kosts[0]} />
              ) : null}
            </div>

          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-b border-border">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border rounded-xl overflow-hidden border border-border">
            {FEATURES.map((f) => (
              <div key={f.title} className="bg-white p-6 hover:bg-secondary/30 transition-colors">
                <div className="w-8 h-8 rounded-lg border border-border flex items-center justify-center mb-3">
                  <f.icon className="w-3.5 h-3.5 text-foreground" />
                </div>
                <h3 className="font-semibold text-foreground text-sm">{f.title}</h3>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Kost */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 pt-12 pb-16">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-foreground tracking-tight">Kost Terbaru</h2>
            <p className="text-sm text-muted-foreground mt-0.5">Properti yang baru bergabung di platform</p>
          </div>
          <button
            onClick={() => navigate("/kost")}
            className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group"
          >
            Lihat semua
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
        <KostGrid kosts={kosts.slice(0, 8)} isLoading={isLoading} />
      </section>

      {/* CTA Banner */}
      <section className="border-t border-border">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-foreground">Siap menemukan kost impianmu?</h3>
            <p className="text-sm text-muted-foreground mt-0.5">Ribuan pilihan kost menanti. Mulai pencarian sekarang.</p>
          </div>
          <button
            onClick={() => navigate("/kost")}
            className="flex items-center gap-2 bg-foreground text-background px-4 py-2 rounded-lg text-sm font-semibold hover:bg-foreground/90 transition-colors shrink-0"
          >
            Jelajahi Kost <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

    </div>
  );
}
