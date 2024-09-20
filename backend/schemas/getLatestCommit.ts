import { z } from 'zod';

export const getLatestCommitSchema = {
  input: z.object({
    organizationId: z.string(),
  }),
  output: z.object({
    latestCommitSha: z.string(),
  }),
};