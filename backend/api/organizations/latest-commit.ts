import { ApiError, createApiHandler } from '@backend/core/apiHandler';
import { GitHubService } from '@backend/services/GitHubService';
import OrganizationsService from '@backend/services/OrganizationsService';
import { getLatestCommitSchema } from '@backend/schemas/getLatestCommit';

export default createApiHandler({
  method: 'GET',
  schema: getLatestCommitSchema,
  requiresAuth: true,
  handler: async ({ organizationId }, { user }) => {
    const orgs = await OrganizationsService.getOrganizationsForUser(user.id);
    const organization = orgs.find((p) => p.id === organizationId);
    if (!organization) {
      throw new ApiError(404, 'Organization not found');
    }

    const latestCommitSha = await GitHubService.getLatestCommit(user, organization);
    return { latestCommitSha };
  },
});