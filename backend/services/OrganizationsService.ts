import { db } from '@backend/db/db';
import { toISOString } from '@backend/services/dbHelpers';
import { Organization } from '@type/organization';
import { uuidv7 } from 'uuidv7';

const transformOrganization = (org: any): Organization => ({
  id: org.id,
  name: org.name,
  created_at: toISOString(org.created_at),
  updated_at: toISOString(org.updated_at),
});

const OrganizationsService = {
  createOrganization: async (
    userId: string,
    data: { name: string; description: string; baseLanguage: string; githubRepo: string },
  ): Promise<Organization> => {
    const [organization] = await db('organizations')
      .insert({
        id: uuidv7(),
        name: data.name,
        description: data.description,
        github_repo: data.githubRepo,
        languages: [],
        base_language: data.baseLanguage,
        input_file: null,
        output_file: null,
        main_branch: null,
        last_commit: null,
      })
      .returning('*');

    await db('user_organizations').insert({
      id: uuidv7(),
      user_id: userId,
      organization_id: organization.id,
      membership_type: 'owner',
    });

    return transformOrganization(organization);
  },

  getOrganizationsForUser: async (userId: string): Promise<Organization[]> => {
    const organizations = await db('organizations')
      .select(`organizations.*`)
      .join('user_organizations', `organizations.id`, `user_organizations.organization_id`)
      .where(`user_organizations.user_id`, userId);

    return organizations.map(transformOrganization);
  },

  userOwnsOrganization: async (
    userId: string,
    organizationId: string,
    adminOnly: boolean = false,
  ): Promise<boolean> => {
    const result = await db('user_organizations')
      .whereIn('membership_type', adminOnly ? ['owner', 'admin'] : ['owner', 'admin', 'member'])
      .andWhere({
        user_id: userId,
        organization_id: organizationId,
      })
      .first();

    return !!result;
  },

  getOrganizationById: async (organizationId: string): Promise<Organization | null> => {
    const organization = await db('organizations').where('id', organizationId).first();

    if (!organization) {
      return null;
    }

    return transformOrganization(organization);
  },

  getOrganizationByName: async (domain: string): Promise<Organization | null> => {
    const organization = await db('organizations').where('name', domain).first();

    if (!organization) {
      return null;
    }

    return transformOrganization(organization);
  },
};

export default OrganizationsService;
