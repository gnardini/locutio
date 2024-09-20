import { ApiError, createApiHandler } from '@backend/core/apiHandler';
import { updateStringSchema } from '@backend/schemas/updateString';
import OrganizationsService from '@backend/services/OrganizationsService';
import { StringsService } from '@backend/services/StringsService';

const handler = createApiHandler({
  method: 'POST',
  schema: updateStringSchema,
  requiresAuth: true,
  handler: async (data, { user }) => {
    const { organizationId, language, file, key, value } = data;
    if (!(await OrganizationsService.userOwnsOrganization(user.id, data.organizationId))) {
      throw new ApiError(403, 'User does not have permission to access this organization');
    }
    const org = await OrganizationsService.getOrganizationById(data.organizationId);
    if (!org) {
      throw new ApiError(404, 'Organization does not exist');
    }

    await StringsService.updateString(organizationId, language, file, key, value);

    await StringsService.fetchAndTransformStrings(user, org, language, file);

    return { success: true };
  },
});

export default handler;
