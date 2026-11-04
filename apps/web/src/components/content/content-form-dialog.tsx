"use client";

import * as React from "react";
import { toast } from "sonner";

import { contentInputSchema } from "@Zlo/zod/content";
import { Checkbox } from "@/components/ui/checkbox";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { contentStatusLabel, contentTypeLabel, type ContentItem } from "./types";

type FormState = {
  title: string;
  slug: string;
  type: ContentItem["type"];
  description: string;
  poster: string;
  banner: string;
  releaseYear: string;
  status: string;
  rating: string;
  isAdult: boolean;
};

const emptyForm: FormState = {
  title: "",
  slug: "",
  type: "ANIME",
  description: "",
  poster: "",
  banner: "",
  releaseYear: "",
  status: "",
  rating: "",
  isAdult: false,
};

function toForm(item: ContentItem): FormState {
  return {
    title: item.title,
    slug: item.slug,
    type: item.type,
    description: item.description ?? "",
    poster: item.poster ?? "",
    banner: item.banner ?? "",
    releaseYear: item.releaseYear?.toString() ?? "",
    status: item.status ?? "",
    rating: item.rating?.toString() ?? "",
    isAdult: item.isAdult ?? false,
  };
}

export function ContentFormDialog({
  open,
  onOpenChange,
  content,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  content: ContentItem | null;
  onSubmit: (values: ReturnType<typeof contentInputSchema.parse>) => void;
}) {
  const [form, setForm] = React.useState<FormState>(emptyForm);

  React.useEffect(() => {
    if (open) setForm(content ? toForm(content) : emptyForm);
  }, [open, content]);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((current) => ({ ...current, [key]: value }));

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const result = contentInputSchema.safeParse({
      title: form.title.trim(),
      slug: form.slug.trim(),
      type: form.type,
      description: form.description.trim() || null,
      poster: form.poster.trim() || null,
      banner: form.banner.trim() || null,
      releaseYear: form.releaseYear === "" ? null : Number(form.releaseYear),
      status: form.status === "" ? null : (form.status as ContentItem["status"]),
      rating: form.rating === "" ? null : Number(form.rating),
      isAdult: form.isAdult,
    });

    if (!result.success) {
      toast.error(result.error.issues[0]?.message ?? "Invalid form");
      return;
    }

    onSubmit(result.data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{content ? "Edit content" : "Add content"}</DialogTitle>
          <DialogDescription>
            {content ? "Update the details for this title." : "Add a new title to the catalogue."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              required
              value={form.title}
              onChange={(event) => set("title", event.target.value)}
              placeholder="e.g. One Piece"
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              required
              value={form.slug}
              onChange={(event) => set("slug", event.target.value)}
              placeholder="one-piece"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label>Type</Label>
              <Select
                value={form.type}
                onValueChange={(value) => set("type", value as ContentItem["type"])}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(contentTypeLabel) as ContentItem["type"][]).map((type) => (
                    <SelectItem key={type} value={type}>
                      {contentTypeLabel[type]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-1.5">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(value) => set("status", value ?? "")}>
                <SelectTrigger>
                  <SelectValue placeholder="None" />
                </SelectTrigger>
                <SelectContent>
                  {(
                    Object.keys(contentStatusLabel) as NonNullable<ContentItem["status"]>[]
                  ).map((status) => (
                    <SelectItem key={status} value={status}>
                      {contentStatusLabel[status]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="release-year">Release year</Label>
              <Input
                id="release-year"
                type="number"
                min={1850}
                max={2100}
                value={form.releaseYear}
                onChange={(event) => set("releaseYear", event.target.value)}
              />
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="rating">Rating (0–10)</Label>
              <Input
                id="rating"
                type="number"
                min={0}
                max={10}
                step={1}
                value={form.rating}
                onChange={(event) => set("rating", event.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="description">Description</Label>
            <Textarea
              className="h-40"
              id="description"
              value={form.description}
              onChange={(event) => set("description", event.target.value)}
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="poster">Poster URL</Label>
            <Input
              id="poster"
              type="url"
              value={form.poster}
              onChange={(event) => set("poster", event.target.value)}
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="banner">Banner URL</Label>
            <Input
              id="banner"
              type="url"
              value={form.banner}
              onChange={(event) => set("banner", event.target.value)}
            />
          </div>

          <Label className="flex items-center gap-2">
            <Checkbox
              checked={form.isAdult}
              onCheckedChange={(checked) => set("isAdult", checked === true)}
            />
            Adult content
          </Label>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{content ? "Save changes" : "Create"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
