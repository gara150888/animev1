import { pgTable, uuid, primaryKey } from "drizzle-orm/pg-core";
import { content } from "./content";
import { genres } from "./genres";

export const contentGenres = pgTable("content_genres", {
  contentId: uuid("content_id")
    .references(() => content.id, { onDelete: "cascade" })
    .notNull(),
  genreId: uuid("genre_id")
    .references(() => genres.id, { onDelete: "cascade" })
    .notNull(),
},
  (table) => [
    primaryKey({ columns: [table.contentId, table.genreId] }),
  ]
);
