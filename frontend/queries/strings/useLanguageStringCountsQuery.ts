import { useQuery } from '../useQuery';
import { getLanguageStringCountsSchema } from '@backend/schemas/stringCounts';

export function useLanguageStringCountsQuery() {
  return useQuery(
    'GET',
    '/api/strings/language-counts',
    getLanguageStringCountsSchema
  );
}