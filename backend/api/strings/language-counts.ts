import { ApiError, createApiHandler } from '@backend/core/apiHandler';
import { getLanguageStringCountsSchema } from '@backend/schemas/stringCounts';
import OrganizationsService from '@backend/services/OrganizationsService';
import { StringsService } from '@backend/services/StringsService';

export default createApiHandler({
  method: 'GET',
  schema: getLanguageStringCountsSchema,
  requiresAuth: true,
  handler: async (data, { user }) => {
    if (!(await OrganizationsService.userOwnsOrganization(user.id, data.organizationId))) {
      throw new ApiError(403, 'User does not have permission to access this organization');
    }
    const languageCounts = await StringsService.getLanguageStringCounts(data.organizationId);
    return { languageCounts };
  },
});
