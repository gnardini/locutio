import { z } from 'zod';

export const syncOrganizationSchema = {
  input: z.object({
    id: z.string(),
  }),
  output: z.object({
    ok: z.boolean(),
  }),
};