"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeftIcon, PlusIcon } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { SeasonFormDialog } from "@/components/content/season-form-dialog";
import { SeasonsTable } from "@/components/content/seasons-table";
import type { SeasonItem } from "@/components/content/types";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/utils/trpc";

export default function AdminSeasonsPage() {
  const params = useParams<{ id: string }>();
  const contentId = params.id;
  const queryClient = useQueryClient();

  const { data: contentItem } = useQuery(trpc.content.get.queryOptions({ id: contentId }));
  const { data: seasons, isLoading } = useQuery(
    trpc.content.seasons.list.queryOptions({ id: contentId }),
  );

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<SeasonItem | null>(null);

  const invalidateSeasons = () =>
    queryClient.invalidateQueries({ queryKey: trpc.content.seasons.list.queryKey({ id: contentId }) });

  const create = useMutation(
    trpc.content.seasons.create.mutationOptions({
      onSuccess: () => {
        invalidateSeasons();
        toast.success("Season created");
        setDialogOpen(false);
      },
      onError: (error) => toast.error(error.message),
    }),
  );

  const update = useMutation(
    trpc.content.seasons.update.mutationOptions({
      onSuccess: () => {
        invalidateSeasons();
        toast.success("Changes saved");
        setDialogOpen(false);
      },
      onError: (error) => toast.error(error.message),
    }),
  );

  const remove = useMutation(
    trpc.content.seasons.delete.mutationOptions({
      onSuccess: () => {
        invalidateSeasons();
        toast.success("Season deleted");
      },
      onError: (error) => toast.error(error.message),
    }),
  );

  const openCreate = () => {
    setEditing(null);
    setDialogOpen(true);
  };

  const openEdit = (item: SeasonItem) => {
    setEditing(item);
    setDialogOpen(true);
  };

  const handleSubmit = (values: { seasonNumber: number; title: string | null }) => {
    if (editing) {
      update.mutate({ id: editing.id, data: values });
    } else {
      create.mutate({ ...values, contentId });
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 sm:p-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon-sm" nativeButton={false} render={<Link href="/admin/content" />} aria-label="Back to content">
            <ArrowLeftIcon />
          </Button>
          <div>
            <h1 className="text-xl font-semibold">{contentItem?.title ?? "Seasons"}</h1>
            <p className="text-sm text-muted-foreground">
              Manage the seasons for this title.
            </p>
          </div>
        </div>
        <Button onClick={openCreate}>
          <PlusIcon />
          Add season
        </Button>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-10 w-full" />
          ))}
        </div>
      ) : seasons && seasons.length > 0 ? (
        <SeasonsTable
          items={seasons}
          onEdit={openEdit}
          onDelete={(id) => remove.mutate({ id })}
        />
      ) : (
        <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed py-16 text-center">
          <p className="text-sm font-medium">No seasons yet</p>
          <p className="text-sm text-muted-foreground">
            Add the first season for this title.
          </p>
          <Button variant="outline" className="mt-2" onClick={openCreate}>
            <PlusIcon />
            Add season
          </Button>
        </div>
      )}

      <SeasonFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        season={editing}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
