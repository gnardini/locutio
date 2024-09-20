import { ApiError, createApiHandler } from '@backend/core/apiHandler';
import { syncStringsSchema } from '@backend/schemas/syncStrings';
import OrganizationsService from '@backend/services/OrganizationsService';
import { StringsService } from '@backend/services/StringsService';
import { GitHubService } from '@backend/services/GitHubService';

export default createApiHandler({
  method: 'POST',
  schema: syncStringsSchema,
  requiresAuth: true,
  handler: async (data, { user }) => {
    const { organizationId, language, file } = data;

    if (!(await OrganizationsService.userOwnsOrganization(user.id, organizationId))) {
      throw new ApiError(403, 'User does not have permission to access this organization');
    }

    const organization = await OrganizationsService.getOrganizationById(organizationId);
    if (!organization) {
      throw new ApiError(404, 'Organization not found');
    }

    const strings = await StringsService.fetchStrings(organizationId, language, file);
    
    await GitHubService.updateProjectSource(
      user,
      organization,
      language,
      file,
      JSON.stringify(strings, null, 2),
    );

    return { success: true };
  },
});