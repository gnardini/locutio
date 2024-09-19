// https://vike.dev/data
import { authenticateUser } from '@backend/core/auth';
import { UsersService } from '@backend/services/UsersService';
import { Organization } from '@type/organization';
import { MembershipType, User } from '@type/user';
import { redirect } from 'vike/abort';
import type { PageContextServer } from 'vike/types';

export type AppData = {
  user: User;
  organizations: Organization[];
  activeOrg: Organization;
  membershipType: MembershipType;
};

export default async function data(context: PageContextServer): Promise<AppData> {
  const user = await authenticateUser(context.headers?.cookie ?? '', (key, value) =>
    // @ts-ignore
    context.response.setHeader(key, value),
  );
  if (!user) {
    throw redirect('/');
  }
  const orgId = context.urlParsed.search.org_id;
  const { organizations, activeOrg, membershipType } = await UsersService.getOrganizationsAndActive(
    user,
    orgId,
  );
  if (organizations.length === 0) {
    throw redirect('/settings');
  }

  // const repos = await GitHubService.getRepositories(user)

  return { user, organizations, activeOrg, membershipType };
}
