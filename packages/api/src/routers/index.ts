import { protectedProcedure, publicProcedure, router } from "../index";
import { HomeRouter } from "./home";
import { adminRouter, type AdminRouter } from "./admin";

export const appRouter = router({
  healthCheck: publicProcedure.query(() => "OK"),
  home: HomeRouter,
  admin: adminRouter,
  privateData: protectedProcedure.query(({ ctx }) => {
    return {
      message: "This is private",
      user: ctx.session.user,
    };
  }),
});

export type AppRouter = typeof appRouter;

export {
  HomeRouter,
};
export type { AdminRouter };

