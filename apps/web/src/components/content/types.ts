import type { inferProcedureOutput } from "@trpc/server";
import type { AppRouter } from "@Zlo/api/routers/index";

type ServerContentItem = inferProcedureOutput<AppRouter["content"]["list"]>[number];

export type ContentItem = Omit<ServerContentItem, "createdAt" | "updatedAt">;

export const contentTypeLabel: Record<ContentItem["type"], string> = {
  ANIME: "Anime",
  MOVIE: "Movie",
  TV_SHOW: "TV Show",
};

export const contentStatusLabel: Record<NonNullable<ContentItem["status"]>, string> = {
  ONGOING: "Ongoing",
  COMPLETED: "Completed",
  UPCOMING: "Upcoming",
};
