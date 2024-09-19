import { db } from '@backend/db/db';
import { toISOString } from '@backend/services/dbHelpers';
import { DiscordService } from '@backend/services/DiscordService';
import OrganizationMembersService from '@backend/services/OrganizationMembersService';
import OrganizationsService from '@backend/services/OrganizationsService';
import { Organization } from '@type/organization';
import { MembershipType, User } from '@type/user';
import { uuidv7 } from 'uuidv7';

export const transformUser = (user: any): User => ({
  id: user.id,
  email: user.email,
  active_org: user.active_org,
  created_at: toISOString(user.created_at),
  updated_at: toISOString(user.updated_at),
  last_access: user.last_access ? toISOString(user.last_access) : null,
});

export const UsersService = {
  async createOrUpdateUser(
    email: string,
    gitHubLogin: string,
    gitHubId: number,
    accessToken: string,
  ) {
    const user = await db('users').where({ email }).first();
    if (user) {
      const [updatedUser] = await db('users')
        .where({ email })
        .update({ github_login: gitHubLogin, github_access_token: accessToken })
        .returning('*');
      return transformUser(updatedUser);
    } else {
      const userByGhLogin = await db('users').where({ github_login: gitHubLogin }).first();
      if (userByGhLogin) {
        const [updatedUser] = await db('users')
          .where({ github_login: gitHubLogin })
          .update({ github_access_token: accessToken, email })
          .returning('*');
        return transformUser(updatedUser);
      } else {
        const [newUser] = await db('users')
          .insert({
            id: uuidv7(),
            email,
            github_id: gitHubId,
            github_login: gitHubLogin,
            github_access_token: accessToken,
          })
          .returning('*');
        await DiscordService.sendNewWaitlistMember(`New user: ${email}`);
        return transformUser(newUser);
      }
    }
  },

  async updateActiveOrg(user: User, orgId: string): Promise<User> {
    const [updatedUser] = await db('users')
      .where('id', user.id)
      .update({ active_org: orgId })
      .returning('*');
    return transformUser(updatedUser);
  },

  async getOrganizationsAndActive(
    user: User,
    queryOrgId?: string,
  ): Promise<{
    organizations: Organization[];
    activeOrg: Organization;
    membershipType: MembershipType;
  }> {
    const organizations = await OrganizationsService.getOrganizationsForUser(user.id);

    const activeOrg =
      organizations.find((org) => org.id === queryOrgId) ??
      organizations.find((org) => org.id === user.active_org) ??
      organizations[0];

    if (activeOrg && activeOrg.id !== user.active_org) {
      await this.updateActiveOrg(user, activeOrg.id);
    }

    const membershipType = activeOrg
      ? await OrganizationMembersService.getMembershipType(activeOrg.id, user.id)
      : 'guest';

    return { organizations, activeOrg, membershipType };
  },

  async getOrCreateUserByEmail(email: string): Promise<{ user: User; created: boolean }> {
    let user = await db('users').where('email', email).first();
    const created = !user;

    if (!user) {
      [user] = await db('users').insert({ email }).returning('*');
    }

    return { user: transformUser(user), created };
  },
};
