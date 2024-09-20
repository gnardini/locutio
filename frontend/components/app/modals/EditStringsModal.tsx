import { Button, ButtonType } from '@frontend/components/common/Button';
import { Loader } from '@frontend/components/common/Loader';
import { Modal } from '@frontend/components/common/Modal';
import { useFetchStringsQuery } from '@frontend/queries/strings/useFetchStringsQuery';
import { useTranslateQuery } from '@frontend/queries/strings/useTranslateQuery';
import { languages } from '@frontend/utils/languages';
import React, { useEffect, useState } from 'react';

interface EditStringsModalProps {
  visible: boolean;
  closeModal: () => void;
  organizationId: string;
  language: string;
  baseLanguage: string;
  file: string;
}

const EditStringsModal: React.FC<EditStringsModalProps> = ({
  visible,
  closeModal,
  organizationId,
  language,
  baseLanguage,
  file,
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
      }
    });
  };

  useEffect(() => {
    if (visible) {
      loadStrings();
    }
  }, [visible, organizationId, language, file]);

  const handleStringChange = (key: string, value: string) => {
    setStrings((prev) => ({ ...prev, [key]: value }));
  };

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

  if (error || translateError)
    return (
      <Modal visible={visible} closeModal={closeModal}>
        Error: {error || translateError}
      </Modal>
    );

  const fullBaseLanguage =
    languages.find((lang) => lang.code === baseLanguage)?.name ?? baseLanguage;
  const fullLanguage = languages.find((lang) => lang.code === language)?.name ?? language;

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
                <tr key={key} className="border-b border-tertiary-background">
                  <td className="py-2 pr-4 align-top">{key}</td>
                  <td className="py-2">
                    <div className="mb-2">
                      <span className="text-gray-400 text-sm font-semibold">
                        {fullBaseLanguage}:
                      </span>
                      <p className="text-sm">{baseValue}</p>
                    </div>
                    <div>
                      <span className="text-gray-400 text-sm font-semibold">{fullLanguage}:</span>
                      <textarea
                        value={strings[key] || ''}
                        onChange={(e) => handleStringChange(key, e.target.value)}
                        className="w-full bg-tertiary-background p-1 text-sm mt-1"
                        rows={3}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Modal>
  );
};

export default EditStringsModal;
