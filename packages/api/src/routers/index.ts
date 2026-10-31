import { protectedProcedure, publicProcedure, router } from "../index";
import { HomeRouter } from "./home";

export const appRouter = router({
  healthCheck: publicProcedure.query(() => "OK"),
  home: HomeRouter,
  privateData: protectedProcedure.query(({ ctx }) => {
    return {
      message: "This is private",
      user: ctx.session.user,
    };
  }),
});

export type AppRouter = typeof appRouter;

export {
  HomeRouter
};

