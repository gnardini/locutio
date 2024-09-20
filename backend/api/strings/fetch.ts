import { ApiError, createApiHandler } from '@backend/core/apiHandler';
import { fetchStringsSchema } from '@backend/schemas/fetchStrings';
import OrganizationsService from '@backend/services/OrganizationsService';
import { StringsService } from '@backend/services/StringsService';

export default createApiHandler({
  method: 'GET',
  schema: fetchStringsSchema,
  requiresAuth: true,
  handler: async (data, { user }) => {
    if (!(await OrganizationsService.userOwnsOrganization(user.id, data.organizationId))) {
      throw new ApiError(403, 'User does not have permission to access this organization');
    }
    const org = await OrganizationsService.getOrganizationById(data.organizationId);
    if (!org?.baseLanguage) {
      throw new ApiError(400, 'Organization does not have a base language set');
    }
    const [baseStrings, strings] = await Promise.all([
      StringsService.fetchStrings(data.organizationId, org.baseLanguage, data.file),
      StringsService.fetchStrings(data.organizationId, data.language, data.file),
    ]);

    return { baseStrings, strings };
  },
});
