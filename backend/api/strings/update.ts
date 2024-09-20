import { createApiHandler } from '@backend/core/apiHandler';
import { StringsService } from '@backend/services/StringsService';
import { updateStringSchema } from '@backend/schemas/updateString';

const handler = createApiHandler({
  method: 'POST',
  schema: updateStringSchema,
  requiresAuth: true,
  handler: async (data, { user }) => {
    const { organizationId, language, file, key, value } = data;

    await StringsService.updateString(organizationId, language, file, key, value);

    return { success: true };
  },
});

export default handler;