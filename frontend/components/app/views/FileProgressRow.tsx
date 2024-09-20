import React from 'react';
import { Button, ButtonType } from '@frontend/components/common/Button';
import { useTranslateQuery } from '@frontend/queries/strings/useTranslateQuery';

interface FileProgressRowProps {
  file: string;
  baseCount: number;
  compareCount: number;
  organizationId: string;
  language: string;
  onTranslate: (file: string) => Promise<void>;
  onFileClick: (file: string) => void;
}

export const FileProgressRow: React.FC<FileProgressRowProps> = ({
  file,
  baseCount,
  compareCount,
  organizationId,
  language,
  onTranslate,
  onFileClick,
}) => {
  const { execute: executeTranslate, loading: loadingTranslate } = useTranslateQuery();

  const progress = baseCount > 0 ? (compareCount / baseCount) * 100 : 0;

  const handleTranslate = async () => {
    try {
      const result = await executeTranslate({ organizationId, language, file });
      if (result && result.success) {
        await onTranslate(file);
      }
    } catch (err) {
      console.error('Translation failed:', err);
    }
  };

  return (
    <div className="text-sm">
      <div className="flex justify-between mb-1 items-center">
        <span className="cursor-pointer" onClick={() => onFileClick(file)}>{file}</span>
        <div className="flex items-center space-x-2">
          <Button
            type={ButtonType.Secondary}
            onClick={handleTranslate}
            disabled={loadingTranslate}
            className="py-1 px-2 text-xs"
          >
            Translate
          </Button>
          <span>
            {compareCount}/{baseCount} strings ({progress.toFixed(1)}%)
          </span>
        </div>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-1.5">
        <div
          className="bg-secondary-accent h-1.5 rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};