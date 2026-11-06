import { z } from "zod";
import { contentTypeEnum, statusEnum } from "@Zlo/db/schema/content";

export const contentIdSchema = z.object({
  id: z.string().uuid(),
});

export const contentInputSchema = z.object({
  title: z.string().min(1).max(255),
  slug: z.string().min(1).max(255),
  type: z.enum(contentTypeEnum.enumValues),
  description: z.string().nullable().optional(),
  poster: z.string().nullable().optional(),
  banner: z.string().nullable().optional(),
  releaseYear: z.number().int().positive().nullable().optional(),
  status: z.enum(statusEnum.enumValues).nullable().optional(),
  rating: z.number().int().min(0).max(10).nullable().optional(),
  isAdult: z.boolean().optional(),
  genreIds: z.array(z.string().uuid()).optional(),
});

export const contentUpdateSchema = contentInputSchema.partial();

export type ContentInput = z.infer<typeof contentInputSchema>;
export type ContentUpdate = z.infer<typeof contentUpdateSchema>;

export const seasonCreateSchema = z.object({
  contentId: z.string().uuid(),
  seasonNumber: z.number().int().min(1),
  title: z.string().max(255).nullable().optional(),
});

export const seasonUpdateSchema = z.object({
  seasonNumber: z.number().int().min(1).optional(),
  title: z.string().max(255).nullable().optional(),
});

export const seasonIdSchema = z.object({
  id: z.string().uuid(),
});

export const importedSeasonSchema = z.object({
  seasonNumber: z.number().int().min(1),
  title: z.string().max(255).nullable(),
});

export const seasonsImportSchema = z.object({
  contentId: z.string().uuid(),
  slug: z.string().min(1).max(255),
});

export type SeasonCreate = z.infer<typeof seasonCreateSchema>;
export type SeasonUpdate = z.infer<typeof seasonUpdateSchema>;
export type ImportedSeason = z.infer<typeof importedSeasonSchema>;
export type SeasonsImport = z.infer<typeof seasonsImportSchema>;

export const episodeCreateSchema = z.object({
  seasonId: z.string().uuid(),
  episodeNumber: z.number().int().min(1),
  title: z.string().max(255).nullable().optional(),
  description: z.string().nullable().optional(),
  duration: z.number().int().positive().nullable().optional(),
  thumbnail: z.string().nullable().optional(),
});

export const episodeUpdateSchema = z.object({
  episodeNumber: z.number().int().min(1).optional(),
  title: z.string().max(255).nullable().optional(),
  description: z.string().nullable().optional(),
  duration: z.number().int().positive().nullable().optional(),
  thumbnail: z.string().nullable().optional(),
});

export const episodeIdSchema = z.object({
  id: z.string().uuid(),
});

export const episodeBulkItemSchema = episodeCreateSchema.omit({ seasonId: true });

export const episodesBulkCreateSchema = z.object({
  seasonId: z.string().uuid(),
  episodes: z.array(episodeBulkItemSchema).min(1),
});

export const importedEpisodeSchema = z.object({
  episodeNumber: z.number().int().min(1),
  title: z.string().max(255).nullable(),
  thumbnail: z.string().nullable(),
});

export const episodesImportSchema = z.object({
  seasonId: z.string().uuid(),
  slug: z.string().min(1).max(255),
});

export type EpisodeCreate = z.infer<typeof episodeCreateSchema>;
export type EpisodeUpdate = z.infer<typeof episodeUpdateSchema>;
export type EpisodeBulkItem = z.infer<typeof episodeBulkItemSchema>;
export type EpisodesBulkCreate = z.infer<typeof episodesBulkCreateSchema>;
export type ImportedEpisode = z.infer<typeof importedEpisodeSchema>;
export type EpisodesImport = z.infer<typeof episodesImportSchema>;

export const sourceCreateSchema = z.object({
  episodeId: z.string().uuid(),
  serverName: z.string().min(1).max(100),
  url: z.string().min(1),
  language: z.string().max(50).nullable().optional(),
  quality: z.string().max(20).nullable().optional(),
  isActive: z.boolean().optional(),
});

export const sourceUpdateSchema = sourceCreateSchema.omit({ episodeId: true }).partial();

export const sourceIdSchema = z.object({
  id: z.string().uuid(),
});

export const sourceBulkItemSchema = sourceCreateSchema.omit({ episodeId: true });

export const sourcesBulkCreateSchema = z.object({
  episodeId: z.string().uuid(),
  sources: z.array(sourceBulkItemSchema).min(1),
});

export type SourceCreate = z.infer<typeof sourceCreateSchema>;
export type SourceUpdate = z.infer<typeof sourceUpdateSchema>;
export type SourceBulkItem = z.infer<typeof sourceBulkItemSchema>;
export type SourcesBulkCreate = z.infer<typeof sourcesBulkCreateSchema>;
