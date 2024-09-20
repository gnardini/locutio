import { ApiError, createApiHandler } from '@backend/core/apiHandler';
import { updateStringSchema } from '@backend/schemas/updateString';
import { GitHubService } from '@backend/services/GitHubService';
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

    await GitHubService.updateProjectSource(
      user,
      org,
      language,
      file,
      JSON.stringify(await StringsService.fetchStrings(organizationId, language, file), null, 2),
    );

    return { success: true };
  },
});

export default handler;
