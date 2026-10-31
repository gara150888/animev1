import { adminProcedure, protectedProcedure, router } from "../index";

export const HomeRouter = router({
  getHomeSummary: protectedProcedure.query(async ({ ctx }) => {
    const user = ctx.session.user;
    return user;
  }),
  isAdmin: adminProcedure.query(({ }) => {
    return true;
  }),
});
