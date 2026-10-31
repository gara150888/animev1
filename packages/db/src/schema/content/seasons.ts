import { pgTable, uuid, integer, varchar } from "drizzle-orm/pg-core";
import { content } from "./content";

export const seasons = pgTable("seasons", {
  id: uuid("id").defaultRandom().primaryKey(),

  contentId: uuid("content_id")
    .references(() => content.id, { onDelete: "cascade" })
    .notNull(),

  seasonNumber: integer("season_number").notNull(),
  title: varchar("title", { length: 255 }),
});
