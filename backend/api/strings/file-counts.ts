import { ApiError, createApiHandler } from '@backend/core/apiHandler';
import { getFileStringCountsSchema } from '@backend/schemas/stringCounts';
import { StringsService } from '@backend/services/StringsService';
import OrganizationsService from '@backend/services/OrganizationsService';

export default createApiHandler({
  method: 'GET',
  schema: getFileStringCountsSchema,
  requiresAuth: true,
  handler: async (data, { user }) => {
    if (!(await OrganizationsService.userOwnsOrganization(user.id, data.organizationId))) {
      throw new ApiError(403, 'User does not have permission to access this organization');
    }
    const org = await OrganizationsService.getOrganizationById(data.organizationId);
    if (!org?.baseLanguage) {
      throw new ApiError(400, 'Organization does not have a base language set');
    }
    const fileCounts = await StringsService.getFileStringCounts(
      data.organizationId,
      org.baseLanguage,
      data.language,
    );
    return { fileCounts };
  },
});
