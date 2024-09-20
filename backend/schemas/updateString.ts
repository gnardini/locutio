import { z } from 'zod';

export const updateStringSchema = {
  input: z.object({
    organizationId: z.string(),
    language: z.string(),
    file: z.string(),
    key: z.string(),
    value: z.string(),
  }),
  output: z.object({
    success: z.boolean(),
  }),
};