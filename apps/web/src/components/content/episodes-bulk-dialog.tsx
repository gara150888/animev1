"use client";

import * as React from "react";
import { toast } from "sonner";

import { episodeBulkItemSchema, type EpisodeBulkItem } from "@Zlo/zod/content";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function EpisodesBulkDialog({
  open,
  onOpenChange,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (episodes: EpisodeBulkItem[]) => void;
}) {
  const [value, setValue] = React.useState("");

  React.useEffect(() => {
    if (open) setValue("");
  }, [open]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    let parsed: unknown;
    try {
      parsed = JSON.parse(value);
    } catch {
      toast.error("Invalid JSON. Paste an array of episodes.");
      return;
    }

    const result = episodeBulkItemSchema.array().safeParse(parsed);
    if (!result.success) {
      toast.error(result.error.issues[0]?.message ?? "Invalid episode data");
      return;
    }

    onSubmit(result.data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Bulk add episodes</DialogTitle>
          <DialogDescription>
            Paste a JSON array of episodes. Each item needs an{" "}
            <code className="rounded bg-muted px-1">episodeNumber</code>; title,
            description, duration and thumbnail are optional.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="episodes-json">Episodes JSON</Label>
            <Textarea
              id="episodes-json"
              value={value}
              onChange={(event) => setValue(event.target.value)}
              placeholder='[{ "episodeNumber": 1, "title": "S 1 | E 1", "thumbnail": "https://..." }]'
              className="min-h-64 font-mono text-xs"
              spellCheck={false}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Add episodes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
