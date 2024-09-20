import { Strings } from '@type/strings';
import { getDatabase } from '../db/db';

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

      // const keys = row.key.split(".");
      // let current = result;
      // for (let i = 0; i < keys.length; i++) {
      //   const key = keys[i];
      //   if (i === keys.length - 1) {
      //     current[key] = row.value;
      //   } else {
      //     current[key] = current[key] || {};
      //     current = current[key];
      //   }
      // }

      return result;
    }, {});
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
