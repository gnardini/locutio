// https://vike.dev/data
import { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } from '@backend/config';
import { createUserAuthToken } from '@backend/core/auth';
import { makePost } from '@backend/makeQuery';
import { GitHubService } from '@backend/services/GitHubService';
import { UsersService } from '@backend/services/UsersService';
import { User } from '@type/user';
import { redirect } from 'vike/abort';
import type { PageContextServer } from 'vike/types';

export type LandingData = {
  user: User | null;
};

export default async function data(context: PageContextServer): Promise<LandingData> {
  const { code } = context.urlParsed.search;
  const { response } = await makePost(`https://github.com/login/oauth/access_token`, {
    code,
    client_id: GITHUB_CLIENT_ID,
    client_secret: GITHUB_CLIENT_SECRET,
  });
  if (!response.access_token) {
    console.error('No access token', response);
    throw redirect('/?error=no_access_token');
  }
  const gitHubUser = await GitHubService.getUser(response.access_token);

  const user = await UsersService.createOrUpdateUser(
    gitHubUser.email,
    gitHubUser.login,
    gitHubUser.id,
    response.access_token,
  );

  const token = createUserAuthToken(user.id);
  // @ts-ignore
  context.response.setHeader(
    'Set-Cookie',
    `token=${token}; HttpOnly; Path=/; Max-Age=${30 * 24 * 60 * 60}; SameSite=Strict; Secure`,
  );

  throw redirect('/app');
}
