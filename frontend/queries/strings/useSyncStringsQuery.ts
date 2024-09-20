import { useQuery } from '@frontend/queries/useQuery';
import { syncStringsSchema } from '@backend/schemas/syncStrings';

type SyncStringsInput = {
  organizationId: string;
  language: string;
  file: string;
};

type SyncStringsOutput = {
  success: boolean;
};

export const useSyncStringsQuery = () => {
  return useQuery<SyncStringsInput, SyncStringsOutput>(
    'POST',
    '/api/strings/sync',
    syncStringsSchema
  );
};