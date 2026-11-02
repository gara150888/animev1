import { db } from "@Zlo/db";
import * as schema from "@Zlo/db/schema/index";
import { desc } from "drizzle-orm";

// ============================================================
// Users
// ============================================================

export async function listUsers() {
  return db.query.user.findMany({
    orderBy: [desc(schema.user.createdAt)],
    with: {
      sessions: true,
      accounts: true,
    },
  });
}
