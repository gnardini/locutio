import { useQuery } from '@frontend/queries/useQuery';
import { getLatestCommitSchema } from '@backend/schemas/getLatestCommit';
import { z } from 'zod';

type GetLatestCommitInput = z.infer<typeof getLatestCommitSchema.input>;
type GetLatestCommitOutput = z.infer<typeof getLatestCommitSchema.output>;

export function useGetLatestCommitQuery() {
  return useQuery<GetLatestCommitInput, GetLatestCommitOutput>(
    'GET',
    '/api/organizations/latest-commit',
    getLatestCommitSchema
  );
}