import { z } from 'zod';

export const createOrganizationSchema = {
  input: z.object({
    name: z.string().min(1).max(255),
    description: z.string(),
    baseLanguage: z.string(),
    githubRepo: z.string(),
  }),
  output: z.object({
    organization: z.object({
      id: z.string(),
      name: z.string(),
      created_at: z.string(),
      updated_at: z.string(),
    }),
  }),
};
