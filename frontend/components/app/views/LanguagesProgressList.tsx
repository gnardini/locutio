import { useLanguageStringCountsQuery } from '@frontend/queries/strings/useLanguageStringCountsQuery';
import { Organization } from '@type/organization';
import React, { useEffect, useState, useCallback } from 'react';
import { FileStringCountsList } from './FileStringCountsList';

interface LanguagesProgressListProps {
  organization: Organization;
}

export const LanguagesProgressList: React.FC<LanguagesProgressListProps> = ({ organization }) => {
  const {
    execute: executeLanguageCounts,
    loading: loadingLanguageCounts,
    error: errorLanguageCounts,
  } = useLanguageStringCountsQuery();
  const [languageCounts, setLanguageCounts] = useState<{ language: string; count: number }[]>([]);
  const [expandedLanguage, setExpandedLanguage] = useState<string | null>(null);

  useEffect(() => {
    executeLanguageCounts({ organizationId: organization.id }).then((result) => {
      if (result) {
        setLanguageCounts(result.languageCounts);
      }
    });
  }, [organization.id]);

  const handleLanguageClick = (language: string) => {
    setExpandedLanguage(expandedLanguage === language ? null : language);
  };

  const handleFileCountUpdate = useCallback((language: string, translatedCount: number) => {
    setLanguageCounts((prevCounts) =>
      prevCounts.map((lc) => (lc.language === language ? { ...lc, count: translatedCount } : lc)),
    );
  }, []);

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
                <FileStringCountsList
                  organizationId={organization.id}
                  language={lc.language}
                  baseLanguage={baseLanguage}
                  onLanguageCountUpdate={handleFileCountUpdate}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
