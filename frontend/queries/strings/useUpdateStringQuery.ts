import { useQuery } from '../useQuery';
import { updateStringSchema } from '@backend/schemas/updateString';

export function useUpdateStringQuery() {
  return useQuery('POST', '/api/strings/update', updateStringSchema);
}