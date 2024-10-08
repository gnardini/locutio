import { ApiError, createApiHandler } from '@backend/core/apiHandler';
import { syncStringsSchema } from '@backend/schemas/syncStrings';
import OrganizationsService from '@backend/services/OrganizationsService';
import { StringsService } from '@backend/services/StringsService';

export default createApiHandler({
  method: 'POST',
  schema: syncStringsSchema,
  requiresAuth: true,
  handler: async (data, { user }) => {
    const { organizationId, language } = data;

    if (!(await OrganizationsService.userOwnsOrganization(user.id, organizationId))) {
      throw new ApiError(403, 'User does not have permission to access this organization');
    }

    const organization = await OrganizationsService.getOrganizationById(organizationId);
    if (!organization) {
      throw new ApiError(404, 'Organization not found');
    }

    const files = await StringsService.fetchFiles(organizationId, language);

    for (const file of files) {
      await StringsService.fetchAndTransformStrings(user, organization, language, file);
    }

    return { success: true };
  },
});
