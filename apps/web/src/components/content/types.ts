import type { inferProcedureOutput } from "@trpc/server";
import type { AppRouter } from "@Zlo/api/routers/index";

type ServerContentItem = inferProcedureOutput<AppRouter["content"]["list"]>[number];

export type ContentItem = Omit<ServerContentItem, "createdAt" | "updatedAt">;

export type SeasonItem = inferProcedureOutput<AppRouter["content"]["seasons"]["list"]>[number];

export type GenreItem = inferProcedureOutput<AppRouter["content"]["genres"]["list"]>[number];

type ServerEpisodeItem = inferProcedureOutput<
  AppRouter["content"]["seasons"]["episodes"]["list"]
>[number];

export type EpisodeItem = Omit<ServerEpisodeItem, "createdAt">;

export type SourceItem = inferProcedureOutput<
  AppRouter["content"]["seasons"]["episodes"]["sources"]["list"]
>[number];

export type SeasonImportPreview = {
  seriesTitle: string;
  seasons: { seasonNumber: number; title: string }[];
};

export type SeasonImportResult = {
  seriesTitle: string;
  created: SeasonItem[];
  skipped: number;
};

export type EpisodeImportPreview = {
  seriesTitle: string;
  episodes: { episodeNumber: number; title: string; thumbnail: string | null; url: string }[];
};

export type EpisodeImportResult = {
  seriesTitle: string;
  created: EpisodeItem[];
  skipped: number;
};

export type AnimeSearchResult = {
  title: string;
  slug: string;
  type: string;
  description: string | null;
  poster: string | null;
  banner: string | null;
  releaseYear: number | null;
  status: string | null;
  rating: number | null;
  isAdult: boolean;
};

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
