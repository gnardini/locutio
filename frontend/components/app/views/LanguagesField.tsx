import { getLanguageName, languages } from '@frontend/utils/languages';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaPen } from 'react-icons/fa6';
import { Button, ButtonType } from '../../common/Button';
import { Dropdown } from '../../common/Dropdown';

interface LanguagesFieldProps {
  projectLanguages: string[];
  onSave: (languages: string[]) => Promise<void>;
}

export const LanguagesField: React.FC<LanguagesFieldProps> = ({ projectLanguages, onSave }) => {
  const { t } = useTranslation('dashboard');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [localLanguages, setLocalLanguages] = useState(projectLanguages);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640); // Assuming 640px as the breakpoint for mobile
    };

    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      await onSave(localLanguages);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save languages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageChange = (selectedLanguage: { code: string; name: string }) => {
    if (!localLanguages.includes(selectedLanguage.code)) {
      setLocalLanguages([...localLanguages, selectedLanguage.code]);
    }
  };

  const removeLanguage = (langCode: string) => {
    setLocalLanguages(localLanguages.filter((l) => l !== langCode));
  };

  const availableLanguages = languages.filter((lang) => !localLanguages.includes(lang.code));

  return (
    <div className="flex flex-col sm:flex-row mb-4">
      <span className={`font-medium text-gray-600 mb-2 sm:mb-0 sm:w-[200px] sm:mr-2 shrink-0`}>
        {t('translationLanguages')}
      </span>
      {isEditing ? (
        <div className="flex flex-col items-start w-full">
          <div className="flex flex-wrap gap-2 mb-2 w-full">
            {localLanguages.map((langCode) => (
              <div
                key={langCode}
                className="bg-secondary-background text-text-primary px-2 py-1 rounded-md flex items-center"
              >
                <span>{getLanguageName(langCode)}</span>
                <button
                  onClick={() => removeLanguage(langCode)}
                  className="ml-2 text-text-secondary hover:text-text-primary"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <Dropdown
            options={availableLanguages}
            selectedOption={null}
            setSelectedOption={handleLanguageChange}
            renderOption={(option) => <span>{option.name}</span>}
            placeholder={t('addLanguage')}
          />
          <div className="flex justify-start gap-2 w-full mt-2">
            <Button onClick={() => setIsEditing(false)} type={ButtonType.Secondary}>
              {t('cancel')}
            </Button>
            <Button onClick={handleSave} loading={loading}>
              {t('save')}
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex items-center cursor-pointer" onClick={() => setIsEditing(true)}>
          <FaPen className="mr-2" />
          <span className="flex-1">
            {projectLanguages.length > 0
              ? projectLanguages.map(getLanguageName).join(', ')
              : t('notSet')}
          </span>
        </div>
      )}
    </div>
  );
};
