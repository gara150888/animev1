import { contentIdSchema, contentInputSchema, contentUpdateSchema } from "@Zlo/zod/content";
import { adminProcedure, router } from "../../index";
import {
  createContent,
  deleteContent,
  getContentById,
  listContent,
  updateContent,
} from "../../server/services/content";

export const contentRouter = router({
  list: adminProcedure
    .query(() => listContent()),
  get: adminProcedure
    .input(contentIdSchema)
    .query(({ input }) => getContentById(input.id)),
  create: adminProcedure
    .input(contentInputSchema)
    .mutation(({ input }) => createContent(input)),
  update: adminProcedure
    .input(contentIdSchema.extend({ data: contentUpdateSchema }))
    .mutation(({ input }) => updateContent(input.id, input.data)),
  delete: adminProcedure
    .input(contentIdSchema)
    .mutation(({ input }) => deleteContent(input.id)),
});

export type ContentRouter = typeof contentRouter;
