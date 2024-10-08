import { z } from 'zod';

export const translateSchema = {
  input: z.object({
    organizationId: z.string(),
    language: z.string(),
    file: z.string(),
  }),
  output: z.object({
    success: z.boolean(),
  }),
};