import { useQuery } from '../useQuery';
import { translateSchema } from '@backend/schemas/translate';

export function useTranslateQuery() {
  return useQuery('POST', '/api/strings/translate', translateSchema);
}