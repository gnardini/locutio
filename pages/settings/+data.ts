// https://vike.dev/data
import { authenticateUser } from '@backend/core/auth';
import { UsersService } from '@backend/services/UsersService';
import { GitHubRepo } from '@type/github';
import { Organization } from '@type/organization';
import { User } from '@type/user';
import { redirect } from 'vike/abort';
import type { PageContextServer } from 'vike/types';

export type SettingsData = {
  user: User;
  organizations: Organization[];
  activeOrg: Organization;
  repos: GitHubRepo[];
};

export default async function data(context: PageContextServer): Promise<SettingsData> {
  const user = await authenticateUser(context.headers?.cookie ?? '', (key, value) =>
    // @ts-ignore
    context.response.setHeader(key, value),
  );
  if (!user) {
    throw redirect('/');
  }

  const orgId = context.urlParsed.search.org_id;
  const { organizations, activeOrg } = await UsersService.getOrganizationsAndActive(user, orgId);

  return { user, organizations, activeOrg, repos: [] };
}
