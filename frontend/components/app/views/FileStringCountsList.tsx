import React, { useState } from 'react';
import { useFileStringCountsQuery } from '@frontend/queries/strings/useFileStringCountsQuery';

interface FileStringCount {
  file: string;
  baseCount: number;
  compareCount: number;
}

interface FileStringCountsListProps {
  organizationId: string;
  language: string;
  baseLanguage: string;
}

export const FileStringCountsList: React.FC<FileStringCountsListProps> = ({
  organizationId,
  language,
  baseLanguage,
}) => {
  const { execute: executeFileCounts, loading: loadingFileCounts, error: errorFileCounts } = useFileStringCountsQuery();
  const [fileCounts, setFileCounts] = useState<FileStringCount[]>([]);

  React.useEffect(() => {
    executeFileCounts({ organizationId, language }).then((result) => {
      if (result) {
        setFileCounts(result.fileCounts);
      }
    });
  }, [organizationId, language]);

  if (loadingFileCounts) return <div>Loading file counts...</div>;
  if (errorFileCounts) return <div>Error loading file counts: {errorFileCounts}</div>;

  return (
    <div className="space-y-2">
      {fileCounts.map((fc) => {
        const progress = fc.baseCount > 0 ? (fc.compareCount / fc.baseCount) * 100 : 0;
        return (
          <div key={fc.file} className="text-sm">
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
    </div>
  );
};