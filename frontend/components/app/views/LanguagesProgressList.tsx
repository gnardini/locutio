import { useLanguageStringCountsQuery } from '@frontend/queries/strings/useLanguageStringCountsQuery';
import { Organization } from '@type/organization';
import React, { useEffect } from 'react';

interface LanguagesProgressListProps {
  organization: Organization;
}

export const LanguagesProgressList: React.FC<LanguagesProgressListProps> = ({ organization }) => {
  const { execute, loading, error } = useLanguageStringCountsQuery();
  const [languageCounts, setLanguageCounts] = React.useState<{ language: string; count: number }[]>(
    [],
  );

  useEffect(() => {
    execute({ organizationId: organization.id }).then((result) => {
      if (result) {
        setLanguageCounts(result.languageCounts);
      }
    });
  }, [organization.id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

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
        return (
          <div key={lc.language} className="mb-4 hover:bg-secondary-background rounded-lg p-2">
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
        );
      })}
    </div>
  );
};
