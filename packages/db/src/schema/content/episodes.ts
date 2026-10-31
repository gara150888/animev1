import { pgTable, uuid, integer, varchar, text, timestamp } from "drizzle-orm/pg-core";
import { seasons } from "./seasons";

export const episodes = pgTable("episodes", {
  id: uuid("id").defaultRandom().primaryKey(),
  seasonId: uuid("season_id")
    .references(() => seasons.id, { onDelete: "cascade" })
    .notNull(),
  episodeNumber: integer("episode_number").notNull(),
  title: varchar("title", { length: 255 }),
  description: text("description"),
  duration: integer("duration"),
  thumbnail: text("thumbnail"),
  createdAt: timestamp("created_at").defaultNow(),
});
