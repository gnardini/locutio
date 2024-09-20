import { useLanguageStringCountsQuery } from '@frontend/queries/strings/useLanguageStringCountsQuery';
import { useFileStringCountsQuery } from '@frontend/queries/strings/useFileStringCountsQuery';
import { Organization } from '@type/organization';
import React, { useEffect, useState } from 'react';

interface LanguagesProgressListProps {
  organization: Organization;
}

interface FileStringCount {
  file: string;
  baseCount: number;
  compareCount: number;
}

export const LanguagesProgressList: React.FC<LanguagesProgressListProps> = ({ organization }) => {
  const { execute: executeLanguageCounts, loading: loadingLanguageCounts, error: errorLanguageCounts } = useLanguageStringCountsQuery();
  const { execute: executeFileCounts, loading: loadingFileCounts, error: errorFileCounts } = useFileStringCountsQuery();
  const [languageCounts, setLanguageCounts] = useState<{ language: string; count: number }[]>([]);
  const [expandedLanguage, setExpandedLanguage] = useState<string | null>(null);
  const [fileCounts, setFileCounts] = useState<FileStringCount[]>([]);

  useEffect(() => {
    executeLanguageCounts({ organizationId: organization.id }).then((result) => {
      if (result) {
        setLanguageCounts(result.languageCounts);
      }
    });
  }, [organization.id]);

  const handleLanguageClick = async (language: string) => {
    if (expandedLanguage === language) {
      setExpandedLanguage(null);
      setFileCounts([]);
    } else {
      setExpandedLanguage(language);
      const result = await executeFileCounts({ organizationId: organization.id, language });
      if (result) {
        setFileCounts(result.fileCounts);
      }
    }
  };

  if (loadingLanguageCounts) return <div>Loading...</div>;
  if (errorLanguageCounts) return <div>Error: {errorLanguageCounts}</div>;

  const baseLanguage = organization.baseLanguage || '';
  const baseCount = languageCounts.find((lc) => lc.language === baseLanguage)?.count || 0;

  const sortedLanguageCounts = [
    ...languageCounts.filter((lc) => lc.language === baseLanguage),
    ...languageCounts.filter((lc) => lc.language !== baseLanguage),
  ];

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-4">Language Progress</h2>
      {sortedLanguageCounts.map((lc) => {
        const progress = baseCount > 0 ? (lc.count / baseCount) * 100 : 0;
        const isExpanded = expandedLanguage === lc.language;
        return (
          <div key={lc.language} className="mb-4">
            <div
              className="hover:bg-secondary-background rounded-lg p-2 cursor-pointer"
              onClick={() => handleLanguageClick(lc.language)}
            >
              <div className="flex justify-between mb-1">
                <span>{lc.language}</span>
                <span>
                  {lc.count}/{baseCount} strings ({progress.toFixed(1)}%)
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div
                  className="bg-primary-accent h-2.5 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
            {isExpanded && (
              <div className="mt-2 pl-4">
                {loadingFileCounts ? (
                  <div>Loading file counts...</div>
                ) : errorFileCounts ? (
                  <div>Error loading file counts: {errorFileCounts}</div>
                ) : (
                  <FileStringCountsList fileCounts={fileCounts} baseLanguage={baseLanguage} />
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

const FileStringCountsList: React.FC<{ fileCounts: FileStringCount[]; baseLanguage: string }> = ({
  fileCounts,
  baseLanguage,
}) => {
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