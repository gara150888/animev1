import { desc, eq } from "drizzle-orm";
import { db } from "@Zlo/db";
import * as schema from "@Zlo/db/schema/index";
import type { ContentInput, ContentUpdate } from "@Zlo/zod/content";

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
