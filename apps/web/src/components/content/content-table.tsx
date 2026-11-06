"use client";

import { ListVideoIcon, PencilIcon, Trash2Icon } from "lucide-react";
import Link from "next/link";

import type { AppRoute } from "@/lib/routes";
import { Badge } from "@/components/ui/badge";
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
import { contentStatusLabel, contentTypeLabel, type ContentItem } from "./types";

export function ContentTable({
  items,
  onEdit,
  onDelete,
}: {
  items: ContentItem[];
  onEdit: (item: ContentItem) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Poster</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Year</TableHead>
          <TableHead>Rating</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow key={item.id}>
            <TableCell>
              {item.poster ? (
                <img
                  src={item.poster}
                  alt=""
                  className="h-12 w-12 rounded-sm border border-border object-cover"
                />
              ) : (
                <div className="h-12 w-12 rounded-sm border border-dashed" />
              )}
            </TableCell>
            <TableCell className="font-medium">{item.title}</TableCell>
            <TableCell>
              <Badge variant="outline">{contentTypeLabel[item.type]}</Badge>
            </TableCell>
            <TableCell>
              {item.status ? (
                <Badge variant="secondary">{contentStatusLabel[item.status]}</Badge>
              ) : (
                <span className="text-muted-foreground">—</span>
              )}
            </TableCell>
            <TableCell>{item.releaseYear ?? "—"}</TableCell>
            <TableCell>{item.rating ?? "—"}</TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-1">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  nativeButton={false}
                  aria-label={`Manage seasons for ${item.title}`}
                  render={<Link href={`/admin/content/${item.id}/seasons` as AppRoute} />}
                >
                  <ListVideoIcon />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Edit ${item.title}`}
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
                        aria-label={`Delete ${item.title}`}
                      />
                    }
                  >
                    <Trash2Icon />
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete “{item.title}”?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This permanently removes the content and everything linked to it.
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
