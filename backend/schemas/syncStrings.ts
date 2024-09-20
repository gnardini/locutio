import { z } from 'zod';

export const syncStringsSchema = {
  input: z.object({
    organizationId: z.string(),
    language: z.string(),
  }),
  output: z.object({
    success: z.boolean(),
  }),
};
