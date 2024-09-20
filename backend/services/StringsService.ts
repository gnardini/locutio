import { Strings } from '@type/strings';
import { getDatabase } from '../db/db';

export const StringsService = {
  async updateStrings(projectId: string, language: string, fileName: string, fileContent: string) {
    const db = await getDatabase();
    await db.transaction(async (trx) => {
      await handleObject(trx, projectId, language, fileName, fileContent);
    });
  },

  async updateString(
    projectId: string,
    language: string,
    file: string,
    key: string,
    value: string,
  ) {
    const db = await getDatabase();
    await db('strings')
      .insert({
        project_id: projectId,
        language,
        file,
        key,
        value,
      })
      .onConflict(['project_id', 'language', 'file', 'key'])
      .merge();
  },

  async fetchStrings(projectId: string, language: string, file: string): Promise<Strings> {
    const db = await getDatabase();
    const rows = await db('strings').where({
      project_id: projectId,
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
  projectId: string,
  language: string,
  fileName: string,
  obj: any,
  prefix = '',
) {
  for (const key in obj) {
    if (typeof obj[key] === 'object') {
      await handleObject(trx, projectId, language, fileName, obj[key], `${prefix}${key}.`);
    } else {
      const fullKey = `${prefix}${key}`;
      const value = obj[key];

      await trx('strings')
        .insert({
          project_id: projectId,
          language,
          file: fileName,
          key: fullKey,
          value,
          updated_at: new Date(),
        })
        .onConflict(['project_id', 'language', 'file', 'key'])
        .merge();
    }
  }
}
