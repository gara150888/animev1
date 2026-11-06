import { desc, eq } from "drizzle-orm";
import { db } from "@Zlo/db";
import * as schema from "@Zlo/db/schema/index";
import type {
  ContentInput,
  ContentUpdate,
  EpisodeCreate,
  EpisodeUpdate,
  EpisodesBulkCreate,
  ImportedEpisode,
  ImportedSeason,
  SeasonCreate,
  SeasonUpdate,
  SourceCreate,
  SourcesBulkCreate,
  SourceUpdate,
} from "@Zlo/zod/content";

// ============================================================
// Content
// ============================================================

export async function listContent() {
  return db.query.content.findMany({
    orderBy: [desc(schema.content.createdAt)],
  });
}

export async function getContentById(id: string) {
  const [row] = await db
    .select()
    .from(schema.content)
    .where(eq(schema.content.id, id))
    .limit(1);

  if (!row) return null;

  const genres = await db
    .select({ genreId: schema.contentGenres.genreId })
    .from(schema.contentGenres)
    .where(eq(schema.contentGenres.contentId, id));

  return { ...row, genreIds: genres.map((g) => g.genreId) };
}

export async function createContent(input: ContentInput) {
  const { genreIds, ...contentData } = input;

  const [created] = await db.insert(schema.content).values(contentData).returning();

  if (!created) throw new Error("Failed to create content");

  if (genreIds?.length) {
    await db.insert(schema.contentGenres).values(
      genreIds.map((genreId) => ({ contentId: created.id, genreId })),
    );
  }

  return created;
}

export async function updateContent(id: string, input: ContentUpdate) {
  const { genreIds, ...contentData } = input;

  const [updated] = await db
    .update(schema.content)
    .set(contentData)
    .where(eq(schema.content.id, id))
    .returning();

  if (!updated) return null;

  if (genreIds) {
    await db.delete(schema.contentGenres).where(eq(schema.contentGenres.contentId, id));

    if (genreIds.length) {
      await db.insert(schema.contentGenres)
        .values(genreIds.map((genreId) => ({ contentId: id, genreId })));
    }
  }

  return updated;
}

export async function deleteContent(id: string) {
  const [deleted] = await db
    .delete(schema.content)
    .where(eq(schema.content.id, id))
    .returning();

  return deleted ?? null;
}

// ============================================================
// Seasons
// ============================================================

export async function listSeasonsByContent(contentId: string) {
  return db
    .select()
    .from(schema.seasons)
    .where(eq(schema.seasons.contentId, contentId))
    .orderBy(schema.seasons.seasonNumber);
}

export async function createSeason(input: SeasonCreate) {
  const [created] = await db.insert(schema.seasons).values(input).returning();

  if (!created) throw new Error("Failed to create season");

  return created;
}

export async function importSeasons(contentId: string, seasons: ImportedSeason[]) {
  const existing = await db
    .select({ seasonNumber: schema.seasons.seasonNumber })
    .from(schema.seasons)
    .where(eq(schema.seasons.contentId, contentId));

  const existingNumbers = new Set(existing.map((row) => row.seasonNumber));
  const rows = seasons.filter((season) => !existingNumbers.has(season.seasonNumber));

  if (!rows.length) return [];

  return db
    .insert(schema.seasons)
    .values(rows.map((season) => ({ contentId, ...season })))
    .returning();
}

export async function updateSeason(id: string, input: SeasonUpdate) {
  const [updated] = await db
    .update(schema.seasons)
    .set(input)
    .where(eq(schema.seasons.id, id))
    .returning();

  return updated ?? null;
}

export async function deleteSeason(id: string) {
  const [deleted] = await db
    .delete(schema.seasons)
    .where(eq(schema.seasons.id, id))
    .returning();

  return deleted ?? null;
}

// ============================================================
// Episodes
// ============================================================

export async function getSeasonById(id: string) {
  const [row] = await db
    .select()
    .from(schema.seasons)
    .where(eq(schema.seasons.id, id))
    .limit(1);

  return row ?? null;
}

export async function importEpisodes(seasonId: string, episodes: ImportedEpisode[]) {
  const existing = await db
    .select({ episodeNumber: schema.episodes.episodeNumber })
    .from(schema.episodes)
    .where(eq(schema.episodes.seasonId, seasonId));

  const existingNumbers = new Set(existing.map((row) => row.episodeNumber));
  const rows = episodes.filter((episode) => !existingNumbers.has(episode.episodeNumber));

  if (!rows.length) return [];

  return db
    .insert(schema.episodes)
    .values(rows.map((episode) => ({ seasonId, ...episode })))
    .returning();
}

export async function listEpisodesBySeason(seasonId: string) {
  return db
    .select()
    .from(schema.episodes)
    .where(eq(schema.episodes.seasonId, seasonId))
    .orderBy(schema.episodes.episodeNumber);
}

export async function createEpisode(input: EpisodeCreate) {
  const [created] = await db.insert(schema.episodes).values(input).returning();

  if (!created) throw new Error("Failed to create episode");

  return created;
}

export async function createEpisodesBulk(input: EpisodesBulkCreate) {
  const rows = input.episodes.map((episode) => ({
    seasonId: input.seasonId,
    ...episode,
  }));

  const created = await db.insert(schema.episodes).values(rows).returning();

  return created;
}

export async function updateEpisode(id: string, input: EpisodeUpdate) {
  const [updated] = await db
    .update(schema.episodes)
    .set(input)
    .where(eq(schema.episodes.id, id))
    .returning();

  return updated ?? null;
}

export async function deleteEpisode(id: string) {
  const [deleted] = await db
    .delete(schema.episodes)
    .where(eq(schema.episodes.id, id))
    .returning();

  return deleted ?? null;
}

// ============================================================
// Sources
// ============================================================

export async function listSourcesByEpisode(episodeId: string) {
  return db
    .select()
    .from(schema.sources)
    .where(eq(schema.sources.episodeId, episodeId))
    .orderBy(schema.sources.serverName);
}

export async function createSource(input: SourceCreate) {
  const [created] = await db.insert(schema.sources).values(input).returning();

  if (!created) throw new Error("Failed to create source");

  return created;
}

export async function createSourcesBulk(input: SourcesBulkCreate) {
  const rows = input.sources.map((source) => ({
    episodeId: input.episodeId,
    ...source,
  }));

  const created = await db.insert(schema.sources).values(rows).returning();

  return created;
}

export async function updateSource(id: string, input: SourceUpdate) {
  const [updated] = await db
    .update(schema.sources)
    .set(input)
    .where(eq(schema.sources.id, id))
    .returning();

  return updated ?? null;
}

export async function deleteSource(id: string) {
  const [deleted] = await db
    .delete(schema.sources)
    .where(eq(schema.sources.id, id))
    .returning();

  return deleted ?? null;
}
