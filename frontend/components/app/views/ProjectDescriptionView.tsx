import { useNotification } from '@frontend/context/NotificationContext';
import { Organization } from '@type/organization';
import React, { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { FaPen } from 'react-icons/fa6';
import { Button, ButtonType } from '../../common/Button';
import { Tooltip } from '../../common/Tooltip';

interface Props {
  project: Organization;
}

export const ProjectDescriptionView: React.FC<Props> = ({ project }) => {
  const [description, setDescription] = useState(project.description ?? '');
  const [isEditing, setIsEditing] = useState(false);
  const { showNotification } = useNotification();
  const { execute: updateProject, loading } = useQuery('POST', '/api/updateProject');

  const { t } = useTranslation('dashboard');

  const updateDescription = async () => {
    await updateProject({
      id: project.id,
      description,
    });
    showNotification(t('projectDescriptionUpdated'));
    setIsEditing(false);
  };

  return (
    <div className="max-w-[800px]">
      <div className="flex items-center mb-2">
        <label className="font-semibold mr-2">{t('projectDescription')}</label>
        <Tooltip
          text={
            <Trans
              i18nKey="tooltipText"
              ns="dashboard"
              components={{
                p1: <p className="text-left" />,
                p2: <p className="mt-1 text-left" />,
              }}
            />
          }
        />
      </div>
      {isEditing ? (
        <>
          <textarea
            className="w-full mt-2 outline-gray-4 px-2 py-1 mb-2 rounded"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <div className="flex flex-row gap-2">
            <Button
              type={ButtonType.Secondary}
              onClick={() => {
                setIsEditing(false);
                setDescription(project.description ?? '');
              }}
            >
              {t('cancel')}
            </Button>
            <Button onClick={updateDescription} loading={loading}>
              Update
            </Button>
          </div>
        </>
      ) : (
        <>
          <div
            className="cursor-pointer p-2 border border-gray-300 rounded"
            onClick={() => setIsEditing(true)}
          >
            {description ? (
              description
            ) : (
              <ul className="list-disc pl-6">
                <li>{t('clickToAddDescription')}</li>
                <li>{t('descriptionHelpAI')}</li>
                <li>{t('mentionKeywords')}</li>
              </ul>
            )}
            <p className="flex flex-row items-center text-gray-500 cursor-pointer">
              {t('edit')} <FaPen className="ml-2" />
            </p>
          </div>
        </>
      )}
    </div>
  );
};
