import { protectedProcedure, router } from "../index";

export const dashboardRouter = router({
  getDashboardSummary: protectedProcedure.query(async ({ ctx }) => {
    const user = ctx.session.user;
    return user;
  }),
});
