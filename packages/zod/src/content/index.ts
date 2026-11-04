import { z } from "zod";
import { contentTypeEnum, statusEnum } from "@Zlo/db/schema/content";

export const contentIdSchema = z.object({
  id: z.string().uuid(),
});

export const contentInputSchema = z.object({
  title: z.string().min(1).max(255),
  slug: z.string().min(1).max(255),
  type: z.enum(contentTypeEnum.enumValues),
  description: z.string().nullable().optional(),
  poster: z.string().nullable().optional(),
  banner: z.string().nullable().optional(),
  releaseYear: z.number().int().positive().nullable().optional(),
  status: z.enum(statusEnum.enumValues).nullable().optional(),
  rating: z.number().int().min(0).max(10).nullable().optional(),
  isAdult: z.boolean().optional(),
  genreIds: z.array(z.string().uuid()).optional(),
});

export const contentUpdateSchema = contentInputSchema.partial();

export type ContentInput = z.infer<typeof contentInputSchema>;
export type ContentUpdate = z.infer<typeof contentUpdateSchema>;
