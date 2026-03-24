import React, { useState } from "react";
import { Search } from "lucide-react";

export default function SearchBar({ onSearch, defaultValue = "", placeholder = "Cari nama kost, lokasi, atau fasilitas..." }) {
  const [query, setQuery] = useState(defaultValue);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-0 w-full max-w-xl">
      <div className="relative flex-1">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-2.5 text-sm bg-secondary border border-border rounded-l-lg focus:outline-none focus:ring-1 focus:ring-foreground/20 focus:border-foreground/20 transition placeholder:text-muted-foreground text-foreground"
        />
      </div>
      <button
        type="submit"
        className="px-5 py-2.5 text-sm font-medium bg-foreground text-background rounded-r-lg hover:bg-foreground/90 transition-colors shrink-0 border border-foreground"
      >
        Cari
      </button>
    </form>
  );
}
