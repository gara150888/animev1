import { pgTable, uuid, timestamp, primaryKey } from "drizzle-orm/pg-core";
import { users } from "./users";
import { content } from "./content";

export const watchlist = pgTable("watchlist", {
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  contentId: uuid("content_id")
    .references(() => content.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: timestamp("created_at").defaultNow(),
},
  (table) => [
    primaryKey({ columns: [table.userId, table.contentId] }),
  ]
);
