"use client";

import { Link2Icon, PencilIcon, Trash2Icon } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

import type { AppRoute } from "@/lib/routes";
import { Button } from "@/components/ui/button";
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
}: {
  items: EpisodeItem[];
  onEdit: (item: EpisodeItem) => void;
  onDelete: (id: string) => void;
}) {
  const params = useParams<{ id: string; seasonId: string }>();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Thumbnail</TableHead>
          <TableHead className="w-32">Episode</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Duration</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow key={item.id}>
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
  );
}
