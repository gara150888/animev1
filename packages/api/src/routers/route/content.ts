import {
  contentIdSchema,
  contentInputSchema,
  contentUpdateSchema,
  episodeCreateSchema,
  episodeIdSchema,
  episodeUpdateSchema,
  episodesBulkCreateSchema,
  episodesBulkDeleteSchema,
  genreIdSchema,
  genreInputSchema,
  genreUpdateSchema,
  seasonCreateSchema,
  seasonIdSchema,
  seasonUpdateSchema,
  sourceCreateSchema,
  sourceIdSchema,
  sourcesBulkCreateSchema,
  sourceUpdateSchema,
} from "@Zlo/zod/content";
import { adminProcedure, router } from "../../index";
import {
  createContent,
  createEpisode,
  createEpisodesBulk,
  createGenre,
  createSeason,
  createSource,
  createSourcesBulk,
  deleteContent,
  deleteEpisode,
  deleteEpisodesBulk,
  deleteGenre,
  deleteSeason,
  deleteSource,
  getContentById,
  listContent,
  listEpisodesBySeason,
  listGenres,
  listSeasonsByContent,
  listSourcesByEpisode,
  updateContent,
  updateEpisode,
  updateGenre,
  updateSeason,
  updateSource,
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

  genres: router({
    list: adminProcedure.query(() => listGenres()),

    create: adminProcedure.input(genreInputSchema).mutation(({ input }) => createGenre(input)),

    update: adminProcedure
      .input(genreIdSchema.extend({ data: genreUpdateSchema }))
      .mutation(({ input }) => updateGenre(input.id, input.data)),

    delete: adminProcedure.input(genreIdSchema).mutation(({ input }) => deleteGenre(input.id)),
  }),

  seasons: router({
    list: adminProcedure
      .input(contentIdSchema)
      .query(({ input }) => listSeasonsByContent(input.id)),

    create: adminProcedure.input(seasonCreateSchema).mutation(({ input }) => createSeason(input)),

    update: adminProcedure
      .input(seasonIdSchema.extend({ data: seasonUpdateSchema }))
      .mutation(({ input }) => updateSeason(input.id, input.data)),

    delete: adminProcedure.input(seasonIdSchema).mutation(({ input }) => deleteSeason(input.id)),

    episodes: router({
      list: adminProcedure
        .input(seasonIdSchema)
        .query(({ input }) => listEpisodesBySeason(input.id)),

      create: adminProcedure.input(episodeCreateSchema).mutation(({ input }) => createEpisode(input)),

      bulkCreate: adminProcedure
        .input(episodesBulkCreateSchema)
        .mutation(({ input }) => createEpisodesBulk(input)),

      update: adminProcedure
        .input(episodeIdSchema.extend({ data: episodeUpdateSchema }))
        .mutation(({ input }) => updateEpisode(input.id, input.data)),

      delete: adminProcedure.input(episodeIdSchema).mutation(({ input }) => deleteEpisode(input.id)),

      bulkDelete: adminProcedure
        .input(episodesBulkDeleteSchema)
        .mutation(({ input }) => deleteEpisodesBulk(input.ids)),

      sources: router({
        list: adminProcedure
          .input(episodeIdSchema)
          .query(({ input }) => listSourcesByEpisode(input.id)),

        create: adminProcedure.input(sourceCreateSchema).mutation(({ input }) => createSource(input)),

        bulkCreate: adminProcedure
          .input(sourcesBulkCreateSchema)
          .mutation(({ input }) => createSourcesBulk(input)),

        update: adminProcedure
          .input(sourceIdSchema.extend({ data: sourceUpdateSchema }))
          .mutation(({ input }) => updateSource(input.id, input.data)),

        delete: adminProcedure.input(sourceIdSchema).mutation(({ input }) => deleteSource(input.id)),
      }),
    }),
  }),
});

export type ContentRouter = typeof contentRouter;
