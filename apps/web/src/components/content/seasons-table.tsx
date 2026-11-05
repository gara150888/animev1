"use client";

import { ClapperboardIcon, PencilIcon, Trash2Icon } from "lucide-react";
import Link from "next/link";

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
import type { SeasonItem } from "./types";

export function SeasonsTable({
  items,
  onEdit,
  onDelete,
}: {
  items: SeasonItem[];
  onEdit: (item: SeasonItem) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-32">Season</TableHead>
          <TableHead>Title</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow key={item.id}>
            <TableCell className="font-medium">{item.seasonNumber}</TableCell>
            <TableCell>{item.title ?? <span className="text-muted-foreground">—</span>}</TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-1">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  nativeButton={false}
                  aria-label={`Manage episodes for season ${item.seasonNumber}`}
                  render={<Link href={`/admin/content/${item.contentId}/seasons/${item.id}/episodes` as AppRoute} />}
                >
                  <ClapperboardIcon />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Edit season ${item.seasonNumber}`}
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
                        aria-label={`Delete season ${item.seasonNumber}`}
                      />
                    }
                  >
                    <Trash2Icon />
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete season {item.seasonNumber}?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This permanently removes the season and its episodes.
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
