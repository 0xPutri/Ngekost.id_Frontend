import React from "react";
import KostCard from "./KostCard";

function KostCardSkeleton() {
  return (
    <div className="bg-white rounded-xl overflow-hidden border border-border animate-pulse">
      <div className="aspect-[16/10] bg-secondary" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-secondary rounded w-3/4" />
        <div className="h-3 bg-secondary rounded w-1/2" />
        <div className="flex gap-1.5 mt-1">
          <div className="h-5 w-12 bg-secondary rounded-md" />
          <div className="h-5 w-16 bg-secondary rounded-md" />
        </div>
        <div className="h-px bg-border mt-2" />
        <div className="h-4 bg-secondary rounded w-1/3" />
      </div>
    </div>
  );
}

export default function KostGrid({ kosts, isLoading, emptyMessage = "Tidak ada kost ditemukan." }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <KostCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!kosts?.length) {
    return (
      <div className="text-center py-24 border border-dashed border-border rounded-xl">
        <p className="text-sm text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {kosts.map((kost) => (
        <KostCard key={kost.id} kost={kost} />
      ))}
    </div>
  );
}
