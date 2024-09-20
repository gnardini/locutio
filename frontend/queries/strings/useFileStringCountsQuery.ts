import { useQuery } from '../useQuery';
import { getFileStringCountsSchema } from '@backend/schemas/stringCounts';

export function useFileStringCountsQuery() {
  return useQuery(
    'GET',
    '/api/strings/file-counts',
    getFileStringCountsSchema
  );
}