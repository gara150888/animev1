"use client";

import * as React from "react";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { sourceBulkItemSchema, type SourceBulkItem } from "@Zlo/zod/content";

export function SourcesBulkDialog({
  open,
  onOpenChange,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (sources: SourceBulkItem[]) => void;
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
      toast.error("Invalid JSON. Paste an array of sources.");
      return;
    }

    const result = sourceBulkItemSchema.array().safeParse(parsed);
    if (!result.success) {
      toast.error(result.error.issues[0]?.message ?? "Invalid source data");
      return;
    }

    onSubmit(result.data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Bulk add sources</DialogTitle>
          <DialogDescription>
            Paste a JSON array of sources. Each item needs a{" "}
            <code className="rounded bg-muted px-1">serverName</code> and{" "}
            <code className="rounded bg-muted px-1">url</code>; language, quality
            and isActive are optional.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="sources-json">Sources JSON</Label>
            <Textarea
              id="sources-json"
              value={value}
              onChange={(event) => setValue(event.target.value)}
              placeholder='[{ "serverName": "VidCloud", "url": "https://…", "quality": "1080p" }]'
              className="h-64 font-mono text-xs"
              spellCheck={false}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Add sources</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
