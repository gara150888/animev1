import { adminProcedure, router } from "../index";
import { db } from "@Zlo/db";

export const adminRouter = router({

  isAdmin: adminProcedure.query(async () => {
    return true;
  }),

  // ===== Users =====
  users: adminProcedure.query(async () => {
    return db.query.user.findMany();
  }),

});

export type AdminRouter = typeof adminRouter;
