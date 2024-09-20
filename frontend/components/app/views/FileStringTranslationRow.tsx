import { Button, ButtonType } from '@frontend/components/common/Button';
import { useUpdateStringQuery } from '@frontend/queries/strings/useUpdateStringQuery';
import { languages } from '@frontend/utils/languages';
import React, { useState } from 'react';

interface FileStringTranslationRowProps {
  organizationId: string;
  language: string;
  file: string;
  baseLanguage: string;
  stringKey: string;
  baseValue: string;
  initialValue: string;
}

const FileStringTranslationRow: React.FC<FileStringTranslationRowProps> = ({
  organizationId,
  language,
  file,
  baseLanguage,
  stringKey,
  baseValue,
  initialValue,
}) => {
  const [value, setValue] = useState(initialValue);
  const [isModified, setIsModified] = useState(false);
  const { execute: updateString, loading: isSaving } = useUpdateStringQuery();

  const handleChange = (newValue: string) => {
    setValue(newValue);
    setIsModified(newValue !== initialValue);
  };

  const handleReset = () => {
    setValue(initialValue);
    setIsModified(false);
  };

  const handleSave = async () => {
    try {
      const result = await updateString({
        organizationId,
        language,
        file,
        key: stringKey,
        value,
      });
      if (result && result.success) {
        setIsModified(false);
      }
    } catch (err) {
      console.error('Failed to update string:', err);
    }
  };

  const fullBaseLanguage =
    languages.find((lang) => lang.code === baseLanguage)?.name ?? baseLanguage;
  const fullLanguage = languages.find((lang) => lang.code === language)?.name ?? language;

  return (
    <tr className="border-b border-tertiary-background">
      <td className="py-2 pr-4 align-top">{stringKey}</td>
      <td className="py-2">
        <div className="mb-2">
          <span className="text-gray-400 text-sm font-semibold">{fullBaseLanguage}:</span>
          <p className="text-sm">{baseValue}</p>
        </div>
        <div>
          <span className="text-gray-400 text-sm font-semibold">{fullLanguage}:</span>
          <textarea
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            className="w-full bg-tertiary-background p-1 text-sm mt-1"
            rows={3}
          />
          {isModified && (
            <div className="mt-2 flex space-x-2">
              <Button
                type={ButtonType.Secondary}
                onClick={handleReset}
                className="text-sm px-2 py-1"
              >
                Reset
              </Button>
              <Button
                type={ButtonType.Primary}
                onClick={handleSave}
                disabled={isSaving}
                className="text-sm px-2 py-1"
              >
                {isSaving ? 'Saving...' : 'Save'}
              </Button>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
};

export default FileStringTranslationRow;
