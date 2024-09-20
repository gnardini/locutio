import { useQuery } from '../useQuery';
import { syncOrganizationSchema } from '@backend/schemas/organizationSync';

type SyncInput = {
  id: string;
};

type SyncOutput = {
  ok: boolean;
};

export function useSyncQuery() {
  return useQuery<SyncInput, SyncOutput>('POST', '/api/organizations/sync', syncOrganizationSchema);
}
