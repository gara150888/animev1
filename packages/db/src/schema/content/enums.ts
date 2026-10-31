import { pgEnum } from "drizzle-orm/pg-core";

export const contentTypeEnum = pgEnum("content_type", [
  "ANIME",
  "MOVIE",
  "TV_SHOW",
]);

export const statusEnum = pgEnum("content_status", [
  "ONGOING",
  "COMPLETED",
  "UPCOMING",
]);
