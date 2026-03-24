import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "@/lib/api";
import KostGrid from "@/components/kost/KostGrid";
import SearchBar from "@/components/kost/SearchBar";
import { ChevronLeft, ChevronRight } from "lucide-react";

const SORT_OPTIONS = [
  { value: "-created_at", label: "Terbaru" },
  { value: "created_at", label: "Terlama" },
];

export default function KostList() {
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [ordering, setOrdering] = useState("-created_at");
  const [page, setPage] = useState(1);
  const [data, setData] = useState({ results: [], count: 0, next: null, previous: null });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const params = { page, ordering };
    if (search) params.search = search;
    api.getKosts(params)
      .then((res) => setData(res))
      .finally(() => setIsLoading(false));
  }, [search, ordering, page]);

  const handleSearch = (query) => {
    setSearch(query);
    setPage(1);
  };

  const totalPages = data.count ? Math.ceil(data.count / 12) : 1;

  return (
    <div className="min-h-screen bg-white">

      {/* Header + Filter (single section) */}
      <div className="border-b border-border bg-white sticky top-[57px] z-40">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">

            {/* Left: title + count */}
            <div className="shrink-0">
              <h1 className="text-base font-bold text-foreground tracking-tight">Cari Kost</h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                {isLoading
                  ? "Memuat..."
                  : data.count > 0
                  ? `${data.count} properti ditemukan`
                  : "Temukan kost impianmu di Banyumas"}
              </p>
            </div>

            {/* Right: search + sort */}
            <div className="flex items-center gap-3 flex-1 sm:justify-end">
              <div className="flex-1 sm:max-w-sm">
                <SearchBar onSearch={handleSearch} defaultValue={search} />
              </div>

              {/* Sort pills */}
              <div className="flex items-center gap-1 shrink-0">
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => { setOrdering(opt.value); setPage(1); }}
                    className={`text-xs font-medium px-3 py-1.5 rounded-md transition-colors ${
                      ordering === opt.value
                        ? "bg-foreground text-background"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary border border-border"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-8">
        <KostGrid
          kosts={data.results}
          isLoading={isLoading}
          emptyMessage="Tidak ada kost yang sesuai pencarian."
        />

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
