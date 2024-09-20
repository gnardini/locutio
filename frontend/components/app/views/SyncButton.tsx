import { Button } from '@frontend/components/common/Button';
import { useNotification } from '@frontend/context/NotificationContext';
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
  const { execute: getLatestCommit, loading: loadingLatestCommit } = useQuery<{
    latestCommitSha: string;
  }>('GET', '/api/getLatestCommit');
  const { showNotification } = useNotification();
  const [latestCommitSha, setLatestCommitSha] = useState<string | null>(null);
  const [latestSyncedCommitSha, setLatestSyncedCommitSha] = useState<string | null>(
    organization.lastCommit,
  );

  useEffect(() => {
    const fetchLatestCommit = async () => {
      try {
        const { latestCommitSha } = await getLatestCommit({ projectId: organization.id });
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
          <p className="text-sm text-gray-600 mb-2">{t('initialSetupPending')}</p>
          <Button onClick={syncProject} loading={loading} className="w-fit">
            {t('setup')}
          </Button>
        </>
      ) : loadingLatestCommit ? (
        <p className="text-sm text-gray-600">{t('loading')}</p>
      ) : latestSyncedCommitSha === latestCommitSha ? (
        <p className="text-sm text-green-600">{t('projectUpToDate')}</p>
      ) : (
        <>
          <p className="text-sm text-gray-600 mb-2">{t('updatePending')}</p>
          <Button onClick={syncProject} loading={loading} className="w-fit">
            {t('syncUp')}
          </Button>
        </>
      )}
    </div>
  );
};
