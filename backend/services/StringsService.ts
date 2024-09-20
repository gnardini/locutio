import { Strings, LanguageStringCount, FileStringCount } from '@type/strings';
import { getDatabase } from '../db/db';
import { parseNumber } from './dbHelpers';

export const StringsService = {
  async updateStrings(
    organizationId: string,
    language: string,
    fileName: string,
    fileContent: string,
  ) {
    console.log('update', language, fileName);
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
    const db = await getDatabase();
    await db('strings')
      .insert({
        organization_id: organizationId,
        language,
        file,
        key,
        value,
      })
      .onConflict(['organization_id', 'language', 'file', 'key'])
      .merge();
  },

  async fetchStrings(organizationId: string, language: string, file: string): Promise<Strings> {
    const db = await getDatabase();
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
};

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
