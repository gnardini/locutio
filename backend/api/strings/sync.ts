import { ApiError, createApiHandler } from '@backend/core/apiHandler';
import { syncStringsSchema } from '@backend/schemas/syncStrings';
import { GitHubService } from '@backend/services/GitHubService';
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
    console.log({ files });

    for (const file of files) {
      const strings = await StringsService.fetchStrings(organizationId, language, file);
      await GitHubService.updateProjectSource(
        user,
        organization,
        language,
        file,
        JSON.stringify(strings, null, 2),
      );
    }

    return { success: true };
  },
});
