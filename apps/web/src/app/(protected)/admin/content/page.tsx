"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { ContentFormDialog } from "@/components/content/content-form-dialog";
import { ContentTable } from "@/components/content/content-table";
import type { ContentItem } from "@/components/content/types";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/utils/trpc";

export default function AdminContentPage() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery(trpc.content.list.queryOptions());

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<ContentItem | null>(null);

  const invalidateList = () =>
    queryClient.invalidateQueries({ queryKey: trpc.content.list.queryKey() });

  const create = useMutation(
    trpc.content.create.mutationOptions({
      onSuccess: () => {
        invalidateList();
        toast.success("Content created");
        setDialogOpen(false);
      },
      onError: (error) => toast.error(error.message),
    }),
  );

  const update = useMutation(
    trpc.content.update.mutationOptions({
      onSuccess: () => {
        invalidateList();
        toast.success("Changes saved");
        setDialogOpen(false);
      },
      onError: (error) => toast.error(error.message),
    }),
  );

  const remove = useMutation(
    trpc.content.delete.mutationOptions({
      onSuccess: () => {
        invalidateList();
        toast.success("Content deleted");
      },
      onError: (error) => toast.error(error.message),
    }),
  );

  const openCreate = () => {
    setEditing(null);
    setDialogOpen(true);
  };

  const openEdit = (item: ContentItem) => {
    setEditing(item);
    setDialogOpen(true);
  };

  const handleSubmit = (values: Parameters<typeof create.mutate>[0]) => {
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
          <h1 className="text-xl font-semibold">Content</h1>
          <p className="text-sm text-muted-foreground">
            Manage the anime, movie and TV catalogue.
          </p>
        </div>
        <Button onClick={openCreate}>
          <PlusIcon />
          Add content
        </Button>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-10 w-full" />
          ))}
        </div>
      ) : data && data.length > 0 ? (
        <ContentTable
          items={data}
          onEdit={openEdit}
          onDelete={(id) => remove.mutate({ id })}
        />
      ) : (
        <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed py-16 text-center">
          <p className="text-sm font-medium">No content yet</p>
          <p className="text-sm text-muted-foreground">
            Add your first title to get started.
          </p>
          <Button variant="outline" className="mt-2" onClick={openCreate}>
            <PlusIcon />
            Add content
          </Button>
        </div>
      )}

      <ContentFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        content={editing}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
