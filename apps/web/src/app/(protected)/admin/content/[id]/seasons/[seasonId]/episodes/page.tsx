"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeftIcon, LayersIcon, PlusIcon } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { toast } from "sonner";

import { EpisodeFormDialog, type EpisodeFormValues } from "@/components/content/episode-form-dialog";
import { EpisodesBulkDialog } from "@/components/content/episodes-bulk-dialog";
import { EpisodesTable } from "@/components/content/episodes-table";
import type { EpisodeItem } from "@/components/content/types";
import type { AppRoute } from "@/lib/routes";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/utils/trpc";

export default function AdminEpisodesPage() {
  const params = useParams<{ id: string; seasonId: string }>();
  const { id: contentId, seasonId } = params;
  const queryClient = useQueryClient();

  const { data: seasons } = useQuery(
    trpc.content.seasons.list.queryOptions({ id: contentId }),
  );
  const season = seasons?.find((item) => item.id === seasonId);

  const { data: episodes, isLoading } = useQuery(
    trpc.content.seasons.episodes.list.queryOptions({ id: seasonId }),
  );

  const [dialogOpen, setDialogOpen] = useState(false);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [editing, setEditing] = useState<EpisodeItem | null>(null);

  const invalidateEpisodes = () =>
    queryClient.invalidateQueries({
      queryKey: trpc.content.seasons.episodes.list.queryKey({ id: seasonId }),
    });

  const create = useMutation(
    trpc.content.seasons.episodes.create.mutationOptions({
      onSuccess: () => {
        invalidateEpisodes();
        toast.success("Episode created");
        setDialogOpen(false);
      },
      onError: (error) => toast.error(error.message),
    }),
  );

  const update = useMutation(
    trpc.content.seasons.episodes.update.mutationOptions({
      onSuccess: () => {
        invalidateEpisodes();
        toast.success("Changes saved");
        setDialogOpen(false);
      },
      onError: (error) => toast.error(error.message),
    }),
  );

  const remove = useMutation(
    trpc.content.seasons.episodes.delete.mutationOptions({
      onSuccess: () => {
        invalidateEpisodes();
        toast.success("Episode deleted");
      },
      onError: (error) => toast.error(error.message),
    }),
  );

  const bulkCreate = useMutation(
    trpc.content.seasons.episodes.bulkCreate.mutationOptions({
      onSuccess: (created) => {
        invalidateEpisodes();
        toast.success(`${created.length} episodes added`);
        setBulkOpen(false);
      },
      onError: (error) => toast.error(error.message),
    }),
  );

  const openCreate = () => {
    setEditing(null);
    setDialogOpen(true);
  };

  const openEdit = (item: EpisodeItem) => {
    setEditing(item);
    setDialogOpen(true);
  };

  const handleSubmit = (values: EpisodeFormValues) => {
    if (editing) {
      update.mutate({ id: editing.id, data: values });
    } else {
      create.mutate({ ...values, seasonId });
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 sm:p-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon-sm"
            nativeButton={false}
            render={<Link href={`/admin/content/${contentId}/seasons` as AppRoute} />}
            aria-label="Back to seasons"
          >
            <ArrowLeftIcon />
          </Button>
          <div>
            <h1 className="text-xl font-semibold">
              {season ? `Season ${season.seasonNumber}` : "Episodes"}
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage the episodes for this season.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setBulkOpen(true)}>
            <LayersIcon />
            Bulk add
          </Button>
          <Button onClick={openCreate}>
            <PlusIcon />
            Add episode
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-10 w-full" />
          ))}
        </div>
      ) : episodes && episodes.length > 0 ? (
        <EpisodesTable
          items={episodes}
          onEdit={openEdit}
          onDelete={(id) => remove.mutate({ id })}
        />
      ) : (
        <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed py-16 text-center">
          <p className="text-sm font-medium">No episodes yet</p>
          <p className="text-sm text-muted-foreground">
            Add the first episode for this season.
          </p>
          <Button variant="outline" className="mt-2" onClick={openCreate}>
            <PlusIcon />
            Add episode
          </Button>
        </div>
      )}

      <EpisodeFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        episode={editing}
        onSubmit={handleSubmit}
      />

      <EpisodesBulkDialog
        open={bulkOpen}
        onOpenChange={setBulkOpen}
        onSubmit={(episodes) => bulkCreate.mutate({ seasonId, episodes })}
      />
    </div>
  );
}
