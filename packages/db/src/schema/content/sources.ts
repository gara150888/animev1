import { pgTable, uuid, varchar, text, boolean } from "drizzle-orm/pg-core";
import { content } from "./content";
import { episodes } from "./episodes";

export const sources = pgTable("sources", {
  id: uuid("id").defaultRandom().primaryKey(),
  contentId: uuid("content_id")
    .references(() => content.id, { onDelete: "cascade" }),
  episodeId: uuid("episode_id")
    .references(() => episodes.id, { onDelete: "cascade" }),
  serverName: varchar("server_name", { length: 100 }).notNull(),
  url: text("url").notNull(),
  language: varchar("language", { length: 50 }),
  quality: varchar("quality", { length: 20 }),
  isActive: boolean("is_active").default(true),
});
