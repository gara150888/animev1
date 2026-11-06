"use client";

import * as React from "react";
import { toast } from "sonner";

import { genreInputSchema } from "@Zlo/zod/content";
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
import type { GenreItem } from "./types";

export function GenreFormDialog({
  open,
  onOpenChange,
  genre,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  genre: GenreItem | null;
  onSubmit: (values: { name: string; slug: string }) => void;
}) {
  const [name, setName] = React.useState("");
  const [slug, setSlug] = React.useState("");

  React.useEffect(() => {
    if (open) {
      setName(genre?.name ?? "");
      setSlug(genre?.slug ?? "");
    }
  }, [open, genre]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const result = genreInputSchema.safeParse({
      name: name.trim(),
      slug: slug.trim(),
    });

    if (!result.success) {
      toast.error(result.error.issues[0]?.message ?? "Invalid form");
      return;
    }

    onSubmit(result.data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{genre ? "Edit genre" : "Add genre"}</DialogTitle>
          <DialogDescription>
            {genre ? "Update the genre details." : "Add a new genre to the catalogue."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="genre-name">Name</Label>
            <Input
              id="genre-name"
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g. Action"
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="genre-slug">Slug</Label>
            <Input
              id="genre-slug"
              required
              value={slug}
              onChange={(event) => setSlug(event.target.value)}
              placeholder="action"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{genre ? "Save changes" : "Create"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
