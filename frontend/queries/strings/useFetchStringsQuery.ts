import { useQuery } from '../useQuery';
import { fetchStringsSchema } from '@backend/schemas/fetchStrings';

export function useFetchStringsQuery() {
  return useQuery('GET', '/api/strings/fetch', fetchStringsSchema);
}