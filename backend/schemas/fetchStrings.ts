import { z } from 'zod';

export const fetchStringsSchema = {
  input: z.object({
    organizationId: z.string().uuid(),
    language: z.string(),
    file: z.string(),
  }),
  output: z.object({
    baseStrings: z.record(z.string(), z.string()),
    strings: z.record(z.string(), z.string()),
  }),
};