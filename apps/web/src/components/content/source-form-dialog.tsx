"use client";

import * as React from "react";
import { toast } from "sonner";

import { sourceCreateSchema } from "@Zlo/zod/content";
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
import type { SourceItem } from "./types";

export type SourceFormValues = {
  serverName: string;
  url: string;
  language: string | null;
  quality: string | null;
  isActive: boolean;
};

export function SourceFormDialog({
  open,
  onOpenChange,
  source,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  source: SourceItem | null;
  onSubmit: (values: SourceFormValues) => void;
}) {
  const [serverName, setServerName] = React.useState("");
  const [url, setUrl] = React.useState("");
  const [language, setLanguage] = React.useState("");
  const [quality, setQuality] = React.useState("");
  const [isActive, setIsActive] = React.useState(true);

  React.useEffect(() => {
    if (open) {
      setServerName(source?.serverName ?? "");
      setUrl(source?.url ?? "");
      setLanguage(source?.language ?? "");
      setQuality(source?.quality ?? "");
      setIsActive(source?.isActive ?? true);
    }
  }, [open, source]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const result = sourceCreateSchema.safeParse({
      episodeId: "00000000-0000-0000-0000-000000000000",
      serverName: serverName.trim(),
      url: url.trim(),
      language: language.trim() || null,
      quality: quality.trim() || null,
      isActive,
    });

    if (!result.success) {
      toast.error(result.error.issues[0]?.message ?? "Invalid form");
      return;
    }

    onSubmit({
      serverName: result.data.serverName,
      url: result.data.url,
      language: result.data.language ?? null,
      quality: result.data.quality ?? null,
      isActive: result.data.isActive ?? true,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{source ? "Edit source" : "Add source"}</DialogTitle>
          <DialogDescription>
            {source ? "Update the source details." : "Add a streaming source for this episode."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="server-name">Server name</Label>
              <Input
                id="server-name"
                required
                value={serverName}
                onChange={(event) => setServerName(event.target.value)}
                placeholder="e.g. VidCloud"
              />
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="source-quality">Quality</Label>
              <Input
                id="source-quality"
                value={quality}
                onChange={(event) => setQuality(event.target.value)}
                placeholder="e.g. 1080p"
              />
            </div>
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="source-url">URL</Label>
            <Input
              id="source-url"
              type="url"
              required
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              placeholder="https://…"
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="source-language">Language</Label>
            <Input
              id="source-language"
              value={language}
              onChange={(event) => setLanguage(event.target.value)}
              placeholder="e.g. English"
            />
          </div>

          <Label className="flex items-center gap-2">
            <Checkbox
              checked={isActive}
              onCheckedChange={(checked) => setIsActive(checked === true)}
            />
            Active
          </Label>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{source ? "Save changes" : "Create"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
