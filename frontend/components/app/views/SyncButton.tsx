import { Button } from '@frontend/components/common/Button';
import { useNotification } from '@frontend/context/NotificationContext';
import { useGetLatestCommitQuery } from '@frontend/queries/organizations/useGetLatestCommitQuery';
import { useSyncQuery } from '@frontend/queries/organizations/useSyncQuery';
import { Organization } from '@type/organization';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  organization: Organization;
}

export const SyncButton: React.FC<Props> = ({ organization }) => {
  const { t } = useTranslation('sync');
  const { execute: runQuery, loading } = useSyncQuery();
  const { execute: getLatestCommit, loading: loadingLatestCommit } = useGetLatestCommitQuery();
  const { showNotification } = useNotification();
  const [latestCommitSha, setLatestCommitSha] = useState<string | null>(null);
  const [latestSyncedCommitSha, setLatestSyncedCommitSha] = useState<string | null>(
    organization.lastCommit,
  );

  useEffect(() => {
    const fetchLatestCommit = async () => {
      try {
        const { latestCommitSha } = await getLatestCommit({ organizationId: organization.id });
        setLatestCommitSha(latestCommitSha);
      } catch (error) {
        console.error('Failed to fetch latest commit:', error);
        showNotification(t('fetchLatestCommitError'), 'error');
      }
    };

    fetchLatestCommit();
  }, [organization.id]);

  const syncProject = async () => {
    try {
      await runQuery({
        id: organization.id,
      });

      showNotification(t('projectSyncedSuccess'), 'success');
      setLatestSyncedCommitSha(latestCommitSha);
    } catch (error) {
      showNotification(t('syncProjectError'), 'error');
    }
  };

  return (
    <div className="mt-4">
      {latestSyncedCommitSha === null ? (
        <>
          <Button onClick={syncProject} loading={loading}>
            {t('setup')}
          </Button>
          <p className="text-sm text-gray-600 mt-1">{t('initialSetupPending')}</p>
        </>
      ) : loadingLatestCommit ? (
        <p className="text-sm text-gray-600">{t('loading')}</p>
      ) : latestSyncedCommitSha === latestCommitSha ? (
        <p className="text-sm text-green-600">{t('projectUpToDate')}</p>
      ) : (
        <>
          <p className="text-sm text-gray-600 mb-2">{t('updatePending')}</p>
          <Button onClick={syncProject} loading={loading}>
            {t('syncUp')}
          </Button>
        </>
      )}
    </div>
  );
};
