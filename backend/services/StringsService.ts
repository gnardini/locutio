import { Organization } from '@type/organization';
import { FileStringCount, LanguageStringCount, Strings } from '@type/strings';
import { User } from '@type/user';
import { db, getDatabase } from '../db/db';
import { parseNumber } from './dbHelpers';
import { GitHubService } from './GitHubService';

export const StringsService = {
  async updateStrings(
    organizationId: string,
    language: string,
    fileName: string,
    fileContent: string,
  ) {
    const db = await getDatabase();
    await db.transaction(async (trx) => {
      await handleObject(trx, organizationId, language, fileName, fileContent);
    });
  },

  async updateString(
    organizationId: string,
    language: string,
    file: string,
    key: string,
    value: string,
  ) {
    await db('strings')
      .insert({
        organization_id: organizationId,
        language,
        file,
        key,
        value,
        updated_at: new Date(),
      })
      .onConflict(['organization_id', 'language', 'file', 'key'])
      .merge();
  },

  async fetchFiles(organizationId: string, language: string): Promise<string[]> {
    const files = await db('strings')
      .where({
        organization_id: organizationId,
        language,
      })
      .groupBy('file')
      .pluck('file');
    return files;
  },

  async fetchStrings(organizationId: string, language: string, file: string): Promise<Strings> {
    const rows = await db('strings').where({
      organization_id: organizationId,
      language,
      file,
    });

    return rows.reduce((result, row) => {
      result[row.key] = row.value;
      return result;
    }, {});
  },

  async getLanguageStringCounts(organizationId: string): Promise<LanguageStringCount[]> {
    const db = await getDatabase();
    const rows = await db.raw(
      `SELECT language, COUNT(*) as count
FROM strings 
WHERE organization_id = ?
GROUP BY language`,
      [organizationId],
    );

    return rows.rows.map((row: any) => ({
      language: row.language,
      count: parseNumber(row.count),
    }));
  },

  async getFileStringCounts(
    organizationId: string,
    baseLanguage: string,
    compareLanguage: string,
  ): Promise<FileStringCount[]> {
    const db = await getDatabase();
    const rows = await db.raw(
      `
SELECT 
  base.file,
  COUNT(DISTINCT base.key) as baseCount,
  COUNT(DISTINCT compare.key) as compareCount
FROM 
  strings base
LEFT JOIN 
  strings compare ON base.file = compare.file 
    AND base.key = compare.key 
    AND compare.language = ? 
    AND compare.organization_id = ?
WHERE 
  base.organization_id = ? 
  AND base.language = ?
GROUP BY 
  base.file
    `,
      [compareLanguage, organizationId, organizationId, baseLanguage],
    );

    return rows.rows.map((row: any) => ({
      file: row.file,
      baseCount: parseNumber(row.basecount),
      compareCount: parseNumber(row.comparecount),
    }));
  },

  async fetchAndTransformStrings(
    user: User,
    organization: Organization,
    language: string,
    file: string,
  ): Promise<void> {
    const strings = await this.fetchStrings(organization.id, language, file);
    const transformedStrings = transformDotNotationToNested(strings);

    await GitHubService.updateProjectSource(
      user,
      organization,
      language,
      file,
      JSON.stringify(transformedStrings, null, 2),
    );
  },
};

function transformDotNotationToNested(obj: Strings): any {
  const result: any = {};
  for (const key in obj) {
    const keys = key.split('.');
    let current = result;
    for (let i = 0; i < keys.length; i++) {
      if (i === keys.length - 1) {
        current[keys[i]] = obj[key];
      } else {
        current[keys[i]] = current[keys[i]] || {};
        current = current[keys[i]];
      }
    }
  }
  return result;
}

async function handleObject(
  trx: any,
  organizationId: string,
  language: string,
  fileName: string,
  obj: any,
  prefix = '',
) {
  for (const key in obj) {
    if (typeof obj[key] === 'object') {
      await handleObject(trx, organizationId, language, fileName, obj[key], `${prefix}${key}.`);
    } else {
      const fullKey = `${prefix}${key}`;
      const value = obj[key];

      await trx('strings')
        .insert({
          organization_id: organizationId,
          language,
          file: fileName,
          key: fullKey,
          value,
          updated_at: new Date(),
        })
        .onConflict(['organization_id', 'language', 'file', 'key'])
        .merge();
    }
  }
}
