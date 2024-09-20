import { ApiError, createApiHandler } from '@backend/core/apiHandler';
import { initDatabase } from '@backend/db/db';
import OrganizationsService from '@backend/services/OrganizationsService';
import { RepoSyncService } from '@backend/services/RepoSyncService';
import { syncOrganizationSchema } from '@backend/schemas/organizationSync';

export default createApiHandler({
  method: 'POST',
  schema: syncOrganizationSchema,
  requiresAuth: true,
  handler: async (data, { user }) => {
    await initDatabase();

    const orgs = await OrganizationsService.getOrganizationsForUser(user.id);
    const organization = orgs.find((p) => p.id === data.id);
    if (!organization) {
      throw new ApiError(404, 'Organization not found');
    }

    let latestCommit;
    if (!organization.lastCommit) {
      latestCommit = await RepoSyncService.setupRepo(user, organization);
    } else {
      latestCommit = await RepoSyncService.updateRepo(user, organization);
    }

    await OrganizationsService.updateOrganization(organization.id, { lastCommit: latestCommit });

    return { ok: true };
  },
});