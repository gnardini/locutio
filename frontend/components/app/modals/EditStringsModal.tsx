
import { Button, ButtonType } from '@frontend/components/common/Button';
import { Loader } from '@frontend/components/common/Loader';
import { Modal } from '@frontend/components/common/Modal';
import { useFetchStringsQuery } from '@frontend/queries/strings/useFetchStringsQuery';
import { useTranslateQuery } from '@frontend/queries/strings/useTranslateQuery';
import React, { useEffect, useState, useCallback } from 'react';
import FileStringTranslationRow from '../views/FileStringTranslationRow';

interface EditStringsModalProps {
  visible: boolean;
  closeModal: () => void;
  organizationId: string;
  language: string;
  baseLanguage: string;
  file: string;
  onStringsUpdated: (file: string, translatedCount: number, totalCount: number) => void;
}

const EditStringsModal: React.FC<EditStringsModalProps> = ({
  visible,
  closeModal,
  organizationId,
  language,
  baseLanguage,
  file,
  onStringsUpdated,
}) => {
  const { execute: fetchStrings, loading, error } = useFetchStringsQuery();
  const { execute: translate, loading: translating, error: translateError } = useTranslateQuery();
  const [baseStrings, setBaseStrings] = useState<Record<string, string>>({});
  const [strings, setStrings] = useState<Record<string, string>>({});

  const loadStrings = () => {
    fetchStrings({ organizationId, language, file }).then((result) => {
      if (result) {
        setBaseStrings(result.baseStrings);
        setStrings(result.strings);
        const translatedCount = Object.values(result.strings).filter(value => value.length > 0).length;
        const totalCount = Object.keys(result.baseStrings).length;
        onStringsUpdated(file, translatedCount, totalCount);
      }
    });
  };

  useEffect(() => {
    if (visible) {
      loadStrings();
    }
  }, [visible, organizationId, language, file]);

  const handleTranslate = async () => {
    try {
      const result = await translate({ organizationId, language, file });
      if (result && result.success) {
        loadStrings();
      }
    } catch (err) {
      console.error('Translation failed:', err);
    }
  };

  const handleUpdateString = useCallback((key: string, value: string) => {
    setStrings((prevStrings) => {
      const newStrings = {
        ...prevStrings,
        [key]: value,
      };
      const translatedCount = Object.values(newStrings).filter(str => str.length > 0).length;
      const totalCount = Object.keys(baseStrings).length;
      onStringsUpdated(file, translatedCount, totalCount);
      return newStrings;
    });
  }, [baseStrings, file, onStringsUpdated]);

  if (error || translateError)
    return (
      <Modal visible={visible} closeModal={closeModal}>
        Error: {error || translateError}
      </Modal>
    );

  return (
    <Modal
      visible={visible}
      closeModal={closeModal}
      className="max-w-[90%] md:max-w-[1000px] max-h-[90%] p-3 md:p-8"
    >
      <h2 className="text-xl font-semibold mb-4">Edit Strings: {file}</h2>
      <div className="mb-4">
        <Button
          type={ButtonType.Primary}
          onClick={handleTranslate}
          disabled={translating}
          className="w-fit px-4 py-2"
        >
          {translating ? 'Translating...' : 'Translate'}
        </Button>
      </div>
      {(loading || translating) && <Loader className="mx-auto" />}
      {Object.entries(baseStrings).length > 0 && (
        <div className="max-h-[60vh] overflow-y-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left w-1/3">Key</th>
                <th className="text-left w-2/3">Translations</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(baseStrings).map(([key, baseValue]) => (
                <FileStringTranslationRow
                  key={key}
                  organizationId={organizationId}
                  language={language}
                  file={file}
                  baseLanguage={baseLanguage}
                  stringKey={key}
                  baseValue={baseValue}
                  initialValue={strings[key] || ''}
                  onUpdateString={handleUpdateString}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Modal>
  );
};

export default EditStringsModal;
