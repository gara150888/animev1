"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { GenreFormDialog } from "@/components/content/genre-form-dialog";
import { GenresTable } from "@/components/content/genres-table";
import type { GenreItem } from "@/components/content/types";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/utils/trpc";

export default function AdminGenresPage() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery(trpc.content.genres.list.queryOptions());

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<GenreItem | null>(null);

  const invalidateList = () =>
    queryClient.invalidateQueries({ queryKey: trpc.content.genres.list.queryKey() });

  const create = useMutation(
    trpc.content.genres.create.mutationOptions({
      onSuccess: () => {
        invalidateList();
        toast.success("Genre created");
        setDialogOpen(false);
      },
      onError: (error) => toast.error(error.message),
    }),
  );

  const update = useMutation(
    trpc.content.genres.update.mutationOptions({
      onSuccess: () => {
        invalidateList();
        toast.success("Changes saved");
        setDialogOpen(false);
      },
      onError: (error) => toast.error(error.message),
    }),
  );

  const remove = useMutation(
    trpc.content.genres.delete.mutationOptions({
      onSuccess: () => {
        invalidateList();
        toast.success("Genre deleted");
      },
      onError: (error) => toast.error(error.message),
    }),
  );

  const openCreate = () => {
    setEditing(null);
    setDialogOpen(true);
  };

  const openEdit = (item: GenreItem) => {
    setEditing(item);
    setDialogOpen(true);
  };

  const handleSubmit = (values: { name: string; slug: string }) => {
    if (editing) {
      update.mutate({ id: editing.id, data: values });
    } else {
      create.mutate(values);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 sm:p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold">Genres</h1>
          <p className="text-sm text-muted-foreground">
            Manage the genres used across the catalogue.
          </p>
        </div>
        <Button onClick={openCreate}>
          <PlusIcon />
          Add genre
        </Button>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-10 w-full" />
          ))}
        </div>
      ) : data && data.length > 0 ? (
        <GenresTable
          items={data}
          onEdit={openEdit}
          onDelete={(id) => remove.mutate({ id })}
        />
      ) : (
        <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed py-16 text-center">
          <p className="text-sm font-medium">No genres yet</p>
          <p className="text-sm text-muted-foreground">
            Add your first genre to get started.
          </p>
          <Button variant="outline" className="mt-2" onClick={openCreate}>
            <PlusIcon />
            Add genre
          </Button>
        </div>
      )}

      <GenreFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        genre={editing}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
