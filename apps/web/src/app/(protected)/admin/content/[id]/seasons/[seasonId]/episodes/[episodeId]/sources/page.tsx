"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeftIcon, LayersIcon, PlusIcon } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { toast } from "sonner";

import { SourceFormDialog, type SourceFormValues } from "@/components/content/source-form-dialog";
import { SourcesBulkDialog } from "@/components/content/sources-bulk-dialog";
import { SourcesTable } from "@/components/content/sources-table";
import type { SourceItem } from "@/components/content/types";
import type { AppRoute } from "@/lib/routes";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/utils/trpc";

export default function AdminSourcesPage() {
  const params = useParams<{ id: string; seasonId: string; episodeId: string }>();
  const { id: contentId, seasonId, episodeId } = params;
  const queryClient = useQueryClient();

  const { data: seasons } = useQuery(
    trpc.content.seasons.list.queryOptions({ id: contentId }),
  );
  const season = seasons?.find((item) => item.id === seasonId);

  const { data: episodes } = useQuery(
    trpc.content.seasons.episodes.list.queryOptions({ id: seasonId }),
  );
  const episode = episodes?.find((item) => item.id === episodeId);

  const { data: sources, isLoading } = useQuery(
    trpc.content.seasons.episodes.sources.list.queryOptions({ id: episodeId }),
  );

  const [dialogOpen, setDialogOpen] = useState(false);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [editing, setEditing] = useState<SourceItem | null>(null);

  const invalidateSources = () =>
    queryClient.invalidateQueries({
      queryKey: trpc.content.seasons.episodes.sources.list.queryKey({ id: episodeId }),
    });

  const create = useMutation(
    trpc.content.seasons.episodes.sources.create.mutationOptions({
      onSuccess: () => {
        invalidateSources();
        toast.success("Source created");
        setDialogOpen(false);
      },
      onError: (error) => toast.error(error.message),
    }),
  );

  const bulkCreate = useMutation(
    trpc.content.seasons.episodes.sources.bulkCreate.mutationOptions({
      onSuccess: (created) => {
        invalidateSources();
        toast.success(`${created.length} sources added`);
        setBulkOpen(false);
      },
      onError: (error) => toast.error(error.message),
    }),
  );

  const update = useMutation(
    trpc.content.seasons.episodes.sources.update.mutationOptions({
      onSuccess: () => {
        invalidateSources();
        toast.success("Changes saved");
        setDialogOpen(false);
      },
      onError: (error) => toast.error(error.message),
    }),
  );

  const remove = useMutation(
    trpc.content.seasons.episodes.sources.delete.mutationOptions({
      onSuccess: () => {
        invalidateSources();
        toast.success("Source deleted");
      },
      onError: (error) => toast.error(error.message),
    }),
  );

  const openCreate = () => {
    setEditing(null);
    setDialogOpen(true);
  };

  const openEdit = (item: SourceItem) => {
    setEditing(item);
    setDialogOpen(true);
  };

  const handleSubmit = (values: SourceFormValues) => {
    if (editing) {
      update.mutate({ id: editing.id, data: values });
    } else {
      create.mutate({ ...values, episodeId });
    }
  };

  const backHref = `/admin/content/${contentId}/seasons/${seasonId}/episodes`;

  return (
    <div className="flex flex-col gap-4 p-4 sm:p-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon-sm"
            nativeButton={false}
            render={<Link href={backHref as AppRoute} />}
            aria-label="Back to episodes"
          >
            <ArrowLeftIcon />
          </Button>
          <div>
            <h1 className="text-xl font-semibold">
              {episode ? `Episode ${episode.episodeNumber}` : "Sources"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {season ? `Season ${season.seasonNumber} · ` : ""}
              Manage the streaming sources for this episode.
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
            Add source
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-10 w-full" />
          ))}
        </div>
      ) : sources && sources.length > 0 ? (
        <SourcesTable
          items={sources}
          onEdit={openEdit}
          onDelete={(id) => remove.mutate({ id })}
        />
      ) : (
        <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed py-16 text-center">
          <p className="text-sm font-medium">No sources yet</p>
          <p className="text-sm text-muted-foreground">
            Add the first streaming source for this episode.
          </p>
          <Button variant="outline" className="mt-2" onClick={openCreate}>
            <PlusIcon />
            Add source
          </Button>
        </div>
      )}

      <SourceFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        source={editing}
        onSubmit={handleSubmit}
      />

      <SourcesBulkDialog
        open={bulkOpen}
        onOpenChange={setBulkOpen}
        onSubmit={(sources) => bulkCreate.mutate({ episodeId, sources })}
      />
    </div>
  );
}
