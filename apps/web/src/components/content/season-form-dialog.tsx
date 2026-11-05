"use client";

import * as React from "react";
import { toast } from "sonner";

import { seasonCreateSchema } from "@Zlo/zod/content";
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
import type { SeasonItem } from "./types";

export function SeasonFormDialog({
  open,
  onOpenChange,
  season,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  season: SeasonItem | null;
  onSubmit: (values: { seasonNumber: number; title: string | null }) => void;
}) {
  const [seasonNumber, setSeasonNumber] = React.useState("");
  const [title, setTitle] = React.useState("");

  React.useEffect(() => {
    if (open) {
      setSeasonNumber(season?.seasonNumber.toString() ?? "");
      setTitle(season?.title ?? "");
    }
  }, [open, season]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const result = seasonCreateSchema.safeParse({
      contentId: "00000000-0000-0000-0000-000000000000",
      seasonNumber: Number(seasonNumber),
      title: title.trim() || null,
    });

    if (!result.success) {
      toast.error(result.error.issues[0]?.message ?? "Invalid form");
      return;
    }

    onSubmit({ seasonNumber: result.data.seasonNumber, title: result.data.title ?? null });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{season ? "Edit season" : "Add season"}</DialogTitle>
          <DialogDescription>
            {season ? "Update the season details." : "Add a season to this title."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="season-number">Season number</Label>
            <Input
              id="season-number"
              type="number"
              min={1}
              required
              value={seasonNumber}
              onChange={(event) => setSeasonNumber(event.target.value)}
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="season-title">Title</Label>
            <Input
              id="season-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="e.g. Season 1"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{season ? "Save changes" : "Create"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
