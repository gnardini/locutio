import { EditableField } from '@frontend/components/app/views/EditableField';
import { LanguagesField } from '@frontend/components/app/views/LanguagesField';
import { Dropdown } from '@frontend/components/common/Dropdown';
import { useNotification } from '@frontend/context/NotificationContext';
import { useUpdateOrganizationQuery } from '@frontend/queries/organizations/useUpdateOrganizationQuery';
import { languages } from '@frontend/utils/languages';
import { Organization } from '@type/organization';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
interface Props {
  project: Organization;
}

export const ProjectConfigView: React.FC<Props> = ({ project: initialProject }) => {
  const { showNotification } = useNotification();
  const { t } = useTranslation('dashboard');
  const [project, setProject] = useState(initialProject);
  const { execute: runQuery } = useUpdateOrganizationQuery();

  const updateField = async (field: string, value: string | null) => {
    await runQuery({
      id: project.id,
      [field]: value,
    });
    setProject((p) => ({
      ...p,
      [field]: value,
    }));

    showNotification(t('updateSuccessful'));
  };

  const updateLanguages = async (languages: string[]) => {
    await runQuery({
      id: project.id,
      languages,
    });
    setProject((p) => ({
      ...p,
      languages,
    }));
    showNotification(t('languagesUpdated'));
  };

  const handleBaseLanguageChange = (selectedLanguage: { code: string; name: string }) => {
    updateField('baseLanguage', selectedLanguage.code);
  };

  return (
    <div className="max-w-[800px] flex flex-col">
      <h2 className="font-semibold mb-4">{t('projectSettings')}</h2>
      <EditableField
        label={t('inputDirectory')}
        value={project.inputFile}
        onSave={(value) => updateField('inputFile', value)}
        placeholder="public/locales/en"
      />
      <EditableField
        label={t('outputDirectory')}
        value={project.outputFile}
        onSave={(value) => updateField('outputFile', value)}
        placeholder="public/locales/%language%"
      />
      <EditableField
        label={t('mainBranch')}
        value={project.mainBranch}
        onSave={(value) => updateField('mainBranch', value)}
        placeholder={'main'}
      />
      <div className="flex flex-row items-center mb-4">
        <span className="font-medium text-gray-600 mr-2 w-[200px]">{t('baseLanguage')}:</span>
        <Dropdown
          options={languages}
          selectedOption={languages.find((lang) => lang.code === project.baseLanguage) || null}
          setSelectedOption={handleBaseLanguageChange}
          renderOption={(option) => <span>{option.name}</span>}
          placeholder={t('selectBaseLanguage')}
        />
      </div>
      <LanguagesField projectLanguages={project.languages ?? []} onSave={updateLanguages} />
    </div>
  );
};
