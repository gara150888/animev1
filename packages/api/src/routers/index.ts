import { protectedProcedure, publicProcedure, router } from "../index";
import { dashboardRouter } from "./dashboard";

export const appRouter = router({
  healthCheck: publicProcedure.query(() => "OK"),
  dashboard: dashboardRouter,
  privateData: protectedProcedure.query(({ ctx }) => {
    return {
      message: "This is private",
      user: ctx.session.user,
    };
  }),
});

export type AppRouter = typeof appRouter;

export {
  dashboardRouter
};

