import { ApiError, createApiHandler } from '@backend/core/apiHandler';
import { updateOrganizationSchema } from '@backend/schemas/organization';
import OrganizationsService from '@backend/services/OrganizationsService';

export default createApiHandler({
  method: 'POST',
  schema: updateOrganizationSchema,
  requiresAuth: true,
  handler: async (data, { user }) => {
    const { id, ...updateData } = data;
    if (!(await OrganizationsService.userOwnsOrganization(user.id, id, true))) {
      throw new ApiError(401, 'User does not have permission to update this organization');
    }
    await OrganizationsService.updateOrganization(id, updateData);
    return {};
  },
});
