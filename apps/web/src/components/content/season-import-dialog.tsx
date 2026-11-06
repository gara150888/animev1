"use client";

import * as React from "react";
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { SeasonImportResult } from "./types";

export function SeasonImportDialog({
  open,
  onOpenChange,
  contentId,
  defaultSlug,
  existingNumbers,
  onImported,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contentId: string;
  defaultSlug: string;
  existingNumbers: number[];
  onImported: (result: SeasonImportResult) => void;
}) {
  const [slug, setSlug] = React.useState("");
  const [seriesTitle, setSeriesTitle] = React.useState("");
  const [seasons, setSeasons] = React.useState<{ seasonNumber: number; title: string }[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [importing, setImporting] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      setSlug(defaultSlug);
      setSeriesTitle("");
      setSeasons([]);
      setError("");
    }
  }, [open, defaultSlug]);

  React.useEffect(() => {
    const term = slug.trim();
    if (!open || !term) {
      setSeasons([]);
      setSeriesTitle("");
      return;
    }

    setLoading(true);
    setError("");
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/anime/toonstream/seasons?id=${encodeURIComponent(term)}`);
        if (!res.ok) throw new Error("Failed to fetch seasons");
        const data = await res.json();
        setSeriesTitle(data.seriesTitle ?? "");
        setSeasons(Array.isArray(data.seasons) ? data.seasons : []);
      } catch {
        setSeriesTitle("");
        setSeasons([]);
        setError("Could not load seasons for this slug.");
      } finally {
        setLoading(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [slug, open]);

  const handleImport = async () => {
    setImporting(true);
    try {
      const res = await fetch("/api/anime/toonstream/seasons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contentId, slug: slug.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Import failed");
      onImported(data as SeasonImportResult);
      onOpenChange(false);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Import failed");
    } finally {
      setImporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add seasons via API</DialogTitle>
          <DialogDescription>
            Fetch seasons from Toonstream and add the missing ones to this title.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="toonstream-slug">Toonstream slug</Label>
            <Input
              id="toonstream-slug"
              value={slug}
              onChange={(event) => setSlug(event.target.value)}
              placeholder="series-slug"
            />
          </div>

          {loading ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2Icon className="size-4 animate-spin" />
              Searching…
            </div>
          ) : error ? (
            <p className="text-sm text-destructive">{error}</p>
          ) : seasons.length > 0 ? (
            <div>
              <p className="mb-2 text-sm font-medium">{seriesTitle || "Seasons"}</p>
              <ul className="grid gap-1 rounded-lg border p-1">
                {seasons.map((season) => {
                  const exists = existingNumbers.includes(season.seasonNumber);
                  return (
                    <li
                      key={season.seasonNumber}
                      className="flex items-center justify-between gap-2 rounded px-2 py-1.5 text-sm"
                    >
                      <span className="min-w-0 truncate">
                        Season {season.seasonNumber}
                        {season.title ? ` — ${season.title}` : ""}
                      </span>
                      {exists && (
                        <span className="shrink-0 text-xs text-muted-foreground">
                          Already exists
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No seasons found for this slug.</p>
          )}
        </div>

        <DialogFooter>
          <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleImport}
            disabled={loading || importing || seasons.length === 0}
          >
            {importing && <Loader2Icon className="size-4 animate-spin" />}
            Import
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
