import { Button } from '@frontend/components/common/Button';
import { useNotification } from '@frontend/context/NotificationContext';
import { useSyncStringsQuery } from '@frontend/queries/strings/useSyncStringsQuery';
import React from 'react';

interface SyncFileStringsButtonProps {
  organizationId: string;
  language: string;
}

export const SyncFileStringsButton: React.FC<SyncFileStringsButtonProps> = ({
  organizationId,
  language,
}) => {
  const { execute: syncStrings, loading } = useSyncStringsQuery();
  const { showNotification } = useNotification();

  const handleSync = async () => {
    try {
      await syncStrings({ organizationId, language });
      showNotification('Strings synced successfully', 'success');
    } catch (error) {
      showNotification('Failed to sync strings', 'error');
    }
  };

  return (
    <Button onClick={handleSync} disabled={loading} className='px-3 py-1 mb-4 text-sm'>
      {loading ? 'Syncing...' : 'Sync to GitHub'}
    </Button>
  );
};
