import { z } from 'zod';

export const getLanguageStringCountsSchema = {
  input: z.object({
    organizationId: z.string().uuid(),
  }),
  output: z.object({
    languageCounts: z.array(
      z.object({
        language: z.string(),
        count: z.number(),
      })
    ),
  }),
};

export const getFileStringCountsSchema = {
  input: z.object({
    organizationId: z.string().uuid(),
    language: z.string(),
  }),
  output: z.object({
    fileCounts: z.array(
      z.object({
        file: z.string(),
        baseCount: z.number(),
        compareCount: z.number(),
      })
    ),
  }),
};