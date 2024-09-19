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

export const updateOrganizationSchema = {
  input: z.object({
    id: z.string().uuid(),
    name: z.string().optional(),
    description: z.string().optional(),
    baseLanguage: z.string().optional(),
    inputFile: z.string().optional(),
    outputFile: z.string().optional(),
    languages: z.array(z.string()).optional(),
    mainBranch: z.string().optional(),
    lastCommit: z.string().optional(),
  }),
  output: z.object({}),
};
