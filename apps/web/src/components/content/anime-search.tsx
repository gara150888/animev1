"use client";

import * as React from "react";
import { SearchIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { AnimeSearchResult } from "./types";

export function AnimeSearch({
  onSelect,
}: {
  onSelect: (item: AnimeSearchResult) => void;
}) {
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<AnimeSearchResult[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [searched, setSearched] = React.useState(false);

  React.useEffect(() => {
    const term = query.trim();
    if (!term) {
      setResults([]);
      setSearched(false);
      return;
    }

    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/anime/search?q=${encodeURIComponent(term)}`);
        if (!res.ok) throw new Error("Search failed");
        const data = await res.json();
        setResults(Array.isArray(data) ? data : []);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
        setSearched(true);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="grid gap-1.5">
      <Label htmlFor="anime-search">Search anime</Label>
      <div className="relative">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          id="anime-search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search AniList to prefill"
          className="pl-8"
        />
      </div>

      {loading ? (
        <p className="text-xs text-muted-foreground">Searching…</p>
      ) : searched && results.length === 0 ? (
        <p className="text-xs text-muted-foreground">No results.</p>
      ) : results.length > 0 ? (
        <ul className="grid gap-1 rounded-lg border p-1">
          {results.map((item, index) => (
            <li key={`${item.slug}-${item.releaseYear ?? "n"}-${index}`}>
              <Button
                type="button"
                variant="ghost"
                className="h-auto w-full justify-start gap-2 px-2 py-1.5"
                onClick={() => onSelect(item)}
              >
                {item.poster ? (
                  <img
                    src={item.poster}
                    alt=""
                    className="h-12 w-8 shrink-0 rounded-sm border border-border object-cover"
                  />
                ) : (
                  <div className="h-12 w-8 shrink-0 rounded-sm border border-dashed" />
                )}
                <span className="flex min-w-0 flex-col items-start gap-0.5">
                  <span className="w-full truncate text-left text-sm font-medium">
                    {item.title.slice(0, 50)}{item.title.length > 50 ? "..." : ""}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {item.releaseYear ?? "—"} {item.type}
                  </span>
                </span>
              </Button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
