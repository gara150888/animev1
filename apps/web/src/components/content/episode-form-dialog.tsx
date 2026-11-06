"use client";

import * as React from "react";
import { toast } from "sonner";

import { episodeCreateSchema } from "@Zlo/zod/content";
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
import { Textarea } from "@/components/ui/textarea";
import type { EpisodeItem } from "./types";

export type EpisodeFormValues = {
  episodeNumber: number;
  title: string | null;
  description: string | null;
  duration: number | null;
  thumbnail: string | null;
};

export function EpisodeFormDialog({
  open,
  onOpenChange,
  episode,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  episode: EpisodeItem | null;
  onSubmit: (values: EpisodeFormValues) => void;
}) {
  const [episodeNumber, setEpisodeNumber] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [duration, setDuration] = React.useState("");
  const [thumbnail, setThumbnail] = React.useState("");

  React.useEffect(() => {
    if (open) {
      setEpisodeNumber(episode?.episodeNumber.toString() ?? "");
      setTitle(episode?.title ?? "");
      setDescription(episode?.description ?? "");
      setDuration(episode?.duration?.toString() ?? "");
      setThumbnail(episode?.thumbnail ?? "");
    }
  }, [open, episode]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const result = episodeCreateSchema.safeParse({
      seasonId: "00000000-0000-0000-0000-000000000000",
      episodeNumber: Number(episodeNumber),
      title: title.trim() || null,
      description: description.trim() || null,
      duration: duration === "" ? null : Number(duration),
      thumbnail: thumbnail.trim() || null,
    });

    if (!result.success) {
      toast.error(result.error.issues[0]?.message ?? "Invalid form");
      return;
    }

    onSubmit({
      episodeNumber: result.data.episodeNumber,
      title: result.data.title ?? null,
      description: result.data.description ?? null,
      duration: result.data.duration ?? null,
      thumbnail: result.data.thumbnail ?? null,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{episode ? "Edit episode" : "Add episode"}</DialogTitle>
          <DialogDescription>
            {episode ? "Update the episode details." : "Add an episode to this season."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="episode-number">Episode number</Label>
              <Input
                id="episode-number"
                type="number"
                min={1}
                required
                value={episodeNumber}
                onChange={(event) => setEpisodeNumber(event.target.value)}
              />
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="episode-duration">Duration (minutes)</Label>
              <Input
                id="episode-duration"
                type="number"
                min={1}
                value={duration}
                onChange={(event) => setDuration(event.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="episode-title">Title</Label>
            <Input
              id="episode-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="e.g. The Journey Begins"
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="episode-description">Description</Label>
            <Textarea
              id="episode-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="episode-thumbnail">Thumbnail URL</Label>
            <Input
              id="episode-thumbnail"
              type="url"
              value={thumbnail}
              onChange={(event) => setThumbnail(event.target.value)}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{episode ? "Save changes" : "Create"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
