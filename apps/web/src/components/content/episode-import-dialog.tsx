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
import type { EpisodeImportPreview, EpisodeImportResult } from "./types";

type PreviewEpisode = EpisodeImportPreview["episodes"][number];

export function EpisodeImportDialog({
  open,
  onOpenChange,
  seasonId,
  defaultSlug,
  seasonNumber,
  existingNumbers,
  onImported,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  seasonId: string;
  defaultSlug: string;
  seasonNumber: number;
  existingNumbers: number[];
  onImported: (result: EpisodeImportResult) => void;
}) {
  const [slug, setSlug] = React.useState("");
  const [episodes, setEpisodes] = React.useState<PreviewEpisode[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [importing, setImporting] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      setSlug(defaultSlug);
      setEpisodes([]);
      setError("");
    }
  }, [open, defaultSlug]);

  React.useEffect(() => {
    const term = slug.trim();
    if (!open || !term) {
      setEpisodes([]);
      return;
    }

    setLoading(true);
    setError("");
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/anime/toonstream/episodes?id=${encodeURIComponent(term)}&season=${seasonNumber}`,
        );
        if (!res.ok) throw new Error("Failed to fetch episodes");
        const data = await res.json();
        setEpisodes(Array.isArray(data.episodes) ? data.episodes : []);
      } catch {
        setEpisodes([]);
        setError("Could not load episodes for this slug.");
      } finally {
        setLoading(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [slug, open, seasonNumber]);

  const handleImport = async () => {
    setImporting(true);
    try {
      const res = await fetch("/api/anime/toonstream/episodes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ seasonId, slug: slug.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Import failed");
      onImported(data as EpisodeImportResult);
      onOpenChange(false);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Import failed");
    } finally {
      setImporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add episodes via API</DialogTitle>
          <DialogDescription>
            Fetch season {seasonNumber} episodes from Toonstream and add the missing ones.
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
          ) : episodes.length > 0 ? (
            <ul className="grid max-h-72 gap-1 overflow-y-auto rounded-lg border p-1">
              {episodes.map((episode) => {
                const exists = existingNumbers.includes(episode.episodeNumber);
                return (
                  <li
                    key={episode.episodeNumber}
                    className="flex items-center gap-2 rounded px-2 py-1.5 text-sm"
                  >
                    {episode.thumbnail ? (
                      <img
                        src={episode.thumbnail}
                        alt=""
                        className="h-10 w-16 shrink-0 rounded-sm border border-border object-cover"
                      />
                    ) : (
                      <div className="h-10 w-16 shrink-0 rounded-sm border border-dashed" />
                    )}
                    <span className="min-w-0 flex-1 truncate">
                      Episode {episode.episodeNumber}
                      {episode.title ? ` — ${episode.title}` : ""}
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
          ) : (
            <p className="text-sm text-muted-foreground">
              No episodes found for this slug and season.
            </p>
          )}
        </div>

        <DialogFooter>
          <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleImport}
            disabled={loading || importing || episodes.length === 0}
          >
            {importing && <Loader2Icon className="size-4 animate-spin" />}
            Import
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
