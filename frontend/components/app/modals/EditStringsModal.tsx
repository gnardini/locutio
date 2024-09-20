import React, { useState, useEffect } from 'react';
import { Modal } from '@frontend/components/common/Modal';
import { useFetchStringsQuery } from '@frontend/queries/strings/useFetchStringsQuery';

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
  const [baseStrings, setBaseStrings] = useState<Record<string, string>>({});
  const [strings, setStrings] = useState<Record<string, string>>({});

  useEffect(() => {
    if (visible) {
      fetchStrings({ organizationId, language, file }).then((result) => {
        if (result) {
          setBaseStrings(result.baseStrings);
          setStrings(result.strings);
        }
      });
    }
  }, [visible, organizationId, language, file]);

  const handleStringChange = (key: string, value: string) => {
    setStrings((prev) => ({ ...prev, [key]: value }));
  };

  if (loading) return <Modal visible={visible} closeModal={closeModal}>Loading...</Modal>;
  if (error) return <Modal visible={visible} closeModal={closeModal}>Error: {error}</Modal>;

  return (
    <Modal visible={visible} closeModal={closeModal}>
      <h2 className="text-xl font-semibold mb-4">Edit Strings: {file}</h2>
      <div className="max-h-[60vh] overflow-y-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left">Key</th>
              <th className="text-left">{baseLanguage}</th>
              <th className="text-left">{language}</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(baseStrings).map(([key, baseValue]) => (
              <tr key={key} className="border-b border-gray-700">
                <td className="py-2 pr-4">{key}</td>
                <td className="py-2 pr-4">{baseValue}</td>
                <td className="py-2">
                  <textarea
                    value={strings[key] || ''}
                    onChange={(e) => handleStringChange(key, e.target.value)}
                    className="w-full p-1 text-sm"
                    rows={2}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Modal>
  );
};

export default EditStringsModal;