import { useFileStringCountsQuery } from '@frontend/queries/strings/useFileStringCountsQuery';
import { useTranslateQuery } from '@frontend/queries/strings/useTranslateQuery';
import React, { useEffect, useState, useCallback } from 'react';
import EditStringsModal from '../modals/EditStringsModal';
import { Button, ButtonType } from '@frontend/components/common/Button';

interface FileStringCount {
  file: string;
  baseCount: number;
  compareCount: number;
}

interface FileStringCountsListProps {
  organizationId: string;
  language: string;
  baseLanguage: string;
  onLanguageCountUpdate: (language: string, translatedCount: number) => void;
}

export const FileStringCountsList: React.FC<FileStringCountsListProps> = ({
  organizationId,
  language,
  baseLanguage,
  onLanguageCountUpdate,
}) => {
  const {
    execute: executeFileCounts,
    loading: loadingFileCounts,
    error: errorFileCounts,
  } = useFileStringCountsQuery();
  const { execute: executeTranslate, loading: loadingTranslate } = useTranslateQuery();
  const [fileCounts, setFileCounts] = useState<FileStringCount[]>([]);

  const updateFileCount = useCallback((file: string, translatedCount: number, totalCount: number) => {
    setFileCounts(prevCounts => {
      const newCounts = prevCounts.map(fc => 
        fc.file === file 
          ? { ...fc, compareCount: translatedCount, baseCount: totalCount }
          : fc
      );
      const totalTranslatedCount = newCounts.reduce((sum, fc) => sum + fc.compareCount, 0);
      onLanguageCountUpdate(language, totalTranslatedCount);
      return newCounts;
    });
  }, [language, onLanguageCountUpdate]);

  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  useEffect(() => {
    executeFileCounts({ organizationId, language }).then((result) => {
      if (result) {
        setFileCounts(result.fileCounts);
        const totalTranslatedCount = result.fileCounts.reduce((sum, fc) => sum + fc.compareCount, 0);
        onLanguageCountUpdate(language, totalTranslatedCount);
      }
    });
  }, [organizationId, language, onLanguageCountUpdate]);

  const handleFileClick = (file: string) => {
    setSelectedFile(file);
  };

  const handleTranslate = async (file: string) => {
    try {
      const result = await executeTranslate({ organizationId, language, file });
      if (result && result.success) {
        const updatedCounts = await executeFileCounts({ organizationId, language });
        if (updatedCounts) {
          setFileCounts(updatedCounts.fileCounts);
          const totalTranslatedCount = updatedCounts.fileCounts.reduce((sum, fc) => sum + fc.compareCount, 0);
          onLanguageCountUpdate(language, totalTranslatedCount);
        }
      }
    } catch (err) {
      console.error('Translation failed:', err);
    }
  };

  // if (loadingFileCounts) return <div>Loading file counts...</div>;
  if (errorFileCounts) return <div>Error loading file counts: {errorFileCounts}</div>;

  return (
    <div className="space-y-2">
      {fileCounts.map((fc) => {
        const progress = fc.baseCount > 0 ? (fc.compareCount / fc.baseCount) * 100 : 0;
        return (
          <div
            key={fc.file}
            className="text-sm"
          >
            <div className="flex justify-between mb-1 items-center">
              <span className="cursor-pointer" onClick={() => handleFileClick(fc.file)}>{fc.file}</span>
              <div className="flex items-center space-x-2">
                <Button
                  type={ButtonType.Secondary}
                  onClick={() => handleTranslate(fc.file)}
                  disabled={loadingTranslate}
                  className="py-1 px-2 text-xs"
                >
                  Translate
                </Button>
                <span>
                  {fc.compareCount}/{fc.baseCount} strings ({progress.toFixed(1)}%)
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
      })}
      {selectedFile && (
        <EditStringsModal
          visible={!!selectedFile}
          closeModal={() => setSelectedFile(null)}
          organizationId={organizationId}
          language={language}
          baseLanguage={baseLanguage}
          file={selectedFile}
          onStringsUpdated={updateFileCount}
        />
      )}
    </div>
  );
};