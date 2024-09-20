import { useFileStringCountsQuery } from '@frontend/queries/strings/useFileStringCountsQuery';
import React, { useEffect, useState } from 'react';
import EditStringsModal from '../modals/EditStringsModal';
import { FileProgressRow } from './FileProgressRow';

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
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const loadFileCounts = async () => {
    const result = await executeFileCounts({ organizationId, language });
    if (result) {
      setFileCounts(result.fileCounts);
      const totalTranslatedCount = result.fileCounts.reduce((sum, fc) => sum + fc.compareCount, 0);
      onLanguageCountUpdate(language, totalTranslatedCount);
    }
  };

  useEffect(() => {
    loadFileCounts();
  }, [organizationId, language]);

  const handleFileClick = (file: string) => {
    setSelectedFile(file);
  };

  const handleTranslate = async (file: string) => {
    await loadFileCounts();
  };

  const updateFileCount = (file: string, translatedCount: number, totalCount: number) => {
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
  };

  if (errorFileCounts) return <div>Error loading file counts: {errorFileCounts}</div>;

  return (
    <div className="space-y-2">
      {fileCounts.map((fc) => (
        <FileProgressRow
          key={fc.file}
          file={fc.file}
          baseCount={fc.baseCount}
          compareCount={fc.compareCount}
          organizationId={organizationId}
          language={language}
          onTranslate={handleTranslate}
          onFileClick={handleFileClick}
        />
      ))}
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