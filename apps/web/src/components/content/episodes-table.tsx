"use client";

import { useMemo, useState } from "react";
import { Link2Icon, PencilIcon, Trash2Icon } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

import type { AppRoute } from "@/lib/routes";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { EpisodeItem } from "./types";

export function EpisodesTable({
  items,
  onEdit,
  onDelete,
  onBulkDelete,
}: {
  items: EpisodeItem[];
  onEdit: (item: EpisodeItem) => void;
  onDelete: (id: string) => void;
  onBulkDelete: (ids: string[]) => void;
}) {
  const params = useParams<{ id: string; seasonId: string }>();
  const [selected, setSelected] = useState<Set<string>>(() => new Set());

  const allSelected = items.length > 0 && selected.size === items.length;

  const toggleAll = (checked: boolean) => {
    setSelected(checked ? new Set(items.map((item) => item.id)) : new Set());
  };

  const toggleOne = (id: string, checked: boolean) => {
    setSelected((current) => {
      const next = new Set(current);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const handleBulkDelete = () => {
    onBulkDelete([...selected]);
    setSelected(new Set());
  };

  const deleteIds = useMemo(() => [...selected], [selected]);
  const deleteLabel = deleteIds.length === 1 ? "1 episode" : `${deleteIds.length} episodes`;

  return (
    <div className="flex flex-col gap-2">
      {selected.size > 0 && (
        <div className="flex items-center justify-between gap-2 rounded-lg border bg-muted/40 px-3 py-2">
          <p className="text-sm text-muted-foreground">
            {selected.size} selected
          </p>
          <AlertDialog>
            <AlertDialogTrigger
              render={
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive"
                />
              }
            >
              <Trash2Icon />
              Delete selected
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete {deleteLabel}?</AlertDialogTitle>
                <AlertDialogDescription>
                  This permanently removes the selected episodes and their sources.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleBulkDelete}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10">
              <Checkbox
                aria-label="Select all episodes"
                checked={allSelected}
                onCheckedChange={(checked) => toggleAll(checked === true)}
              />
            </TableHead>
            <TableHead>Thumbnail</TableHead>
            <TableHead className="w-32">Episode</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id} data-selected={selected.has(item.id) || undefined}>
              <TableCell>
                <Checkbox
                  aria-label={`Select episode ${item.episodeNumber}`}
                  checked={selected.has(item.id)}
                  onCheckedChange={(checked) => toggleOne(item.id, checked === true)}
                />
              </TableCell>
              <TableCell>
                {item.thumbnail ? (
                  <img
                    src={item.thumbnail}
                    alt=""
                    className="h-10 w-16 rounded-sm border border-border object-cover"
                  />
                ) : (
                  <div className="h-10 w-16 rounded-sm border border-dashed" />
                )}
              </TableCell>
              <TableCell className="font-medium">{item.episodeNumber}</TableCell>
              <TableCell>{item.title ?? <span className="text-muted-foreground">—</span>}</TableCell>
              <TableCell>
                {item.duration ? (
                  <span>{item.duration} min</span>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    nativeButton={false}
                    aria-label={`Manage sources for episode ${item.episodeNumber}`}
                    render={
                      <Link
                        href={`/admin/content/${params.id}/seasons/${params.seasonId}/episodes/${item.id}/sources` as AppRoute}
                      />
                    }
                  >
                    <Link2Icon />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Edit episode ${item.episodeNumber}`}
                    onClick={() => onEdit(item)}
                  >
                    <PencilIcon />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger
                      render={
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="text-destructive"
                          aria-label={`Delete episode ${item.episodeNumber}`}
                        />
                      }
                    >
                      <Trash2Icon />
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete episode {item.episodeNumber}?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This permanently removes the episode.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => onDelete(item.id)}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
