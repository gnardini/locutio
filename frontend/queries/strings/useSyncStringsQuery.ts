import { syncStringsSchema } from '@backend/schemas/syncStrings';
import { useQuery } from '@frontend/queries/useQuery';

type SyncStringsInput = {
  organizationId: string;
  language: string;
};

type SyncStringsOutput = {
  success: boolean;
};

export const useSyncStringsQuery = () => {
  return useQuery<SyncStringsInput, SyncStringsOutput>(
    'POST',
    '/api/strings/sync',
    syncStringsSchema,
  );
};
