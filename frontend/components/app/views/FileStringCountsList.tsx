
import { useFileStringCountsQuery } from '@frontend/queries/strings/useFileStringCountsQuery';
import React, { useEffect, useState, useCallback } from 'react';
import EditStringsModal from '../modals/EditStringsModal';

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

  if (loadingFileCounts) return <div>Loading file counts...</div>;
  if (errorFileCounts) return <div>Error loading file counts: {errorFileCounts}</div>;

  const handleFileClick = (file: string) => {
    setSelectedFile(file);
  };

  return (
    <div className="space-y-2">
      {fileCounts.map((fc) => {
        const progress = fc.baseCount > 0 ? (fc.compareCount / fc.baseCount) * 100 : 0;
        return (
          <div
            key={fc.file}
            className="text-sm cursor-pointer"
            onClick={() => handleFileClick(fc.file)}
          >
            <div className="flex justify-between mb-1">
              <span>{fc.file}</span>
              <span>
                {fc.compareCount}/{fc.baseCount} strings ({progress.toFixed(1)}%)
              </span>
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
