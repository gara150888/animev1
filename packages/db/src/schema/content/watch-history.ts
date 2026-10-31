import { pgTable, uuid, integer, boolean, timestamp, index } from "drizzle-orm/pg-core";
import { users } from "./users";
import { content } from "./content";
import { episodes } from "./episodes";

export const watchHistory = pgTable("watch_history", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  episodeId: uuid("episode_id")
    .references(() => episodes.id, { onDelete: "cascade" }),
  contentId: uuid("content_id")
    .references(() => content.id, { onDelete: "cascade" }),
  progress: integer("progress").default(0),
  completed: boolean("completed").default(false),
  watchedAt: timestamp("watched_at").defaultNow(),
},
  (table) => [
    index("watch_history_user_idx").on(table.userId),
  ]
);
