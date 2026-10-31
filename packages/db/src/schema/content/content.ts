import { pgTable, uuid, varchar, text, integer, boolean, timestamp, index } from "drizzle-orm/pg-core";
import { contentTypeEnum, statusEnum } from "./enums";

export const content = pgTable("content", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).unique().notNull(),
  type: contentTypeEnum("type").notNull(),
  description: text("description"),
  poster: text("poster"),
  banner: text("banner"),
  releaseYear: integer("release_year"),
  status: statusEnum("status"),
  rating: integer("rating"),
  isAdult: boolean("is_adult").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
},
  (table) => [
    index("content_type_idx").on(table.type),
    index("content_slug_idx").on(table.slug),
  ]
);
