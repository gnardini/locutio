import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaPen } from 'react-icons/fa6';
import { Button, ButtonType } from '../../common/Button';

interface EditableFieldProps {
  label: string;
  value: string | null;
  onSave: (value: string) => Promise<void>;
  placeholder?: string;
}

export const EditableField: React.FC<EditableFieldProps> = ({
  label,
  value,
  onSave,
  placeholder,
}) => {
  const { t } = useTranslation('dashboard');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [localValue, setLocalValue] = useState(value || '');

  const handleSave = async () => {
    setLoading(true);
    try {
      await onSave(localValue);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setLocalValue(value || '');
  };

  return (
    <div
      className={`flex ${
        isEditing ? 'flex-col' : 'flex-row items-center'
      } sm:flex-row sm:items-center mb-4`}
    >
      <span
        className={`font-medium text-gray-600 ${
          isEditing ? 'w-full mb-2' : 'mr-2'
        } sm:w-[200px] sm:mb-0 shrink-0`}
      >
        {label}:
      </span>
      {isEditing ? (
        <div className="flex flex-col sm:flex-row sm:items-center flex-1">
          <input
            className="border rounded px-2 py-1 mb-2 sm:mb-0 sm:mr-2 flex-1"
            value={localValue}
            onChange={(e) => setLocalValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSave();
              }
            }}
            placeholder={placeholder}
          />
          <div className="flex justify-start">
            <Button onClick={handleCancel} type={ButtonType.Secondary} className="mr-2">
              {t('cancel')}
            </Button>
            <Button onClick={handleSave} loading={loading}>
              {t('save')}
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex items-center cursor-pointer flex-1" onClick={() => setIsEditing(true)}>
          <FaPen className="mr-2" />
          <span className="flex-1">{value || t('notSet')}</span>
        </div>
      )}
    </div>
  );
};
