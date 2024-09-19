import { ApiError } from '@backend/core/apiHandler';
import { makeGet, makePost } from '@backend/makeQuery';
import { makeQuery } from '@frontend/queries/useQuery';
import { GitHubFile, GitHubRepo } from '@type/github';
import { Organization } from '@type/organization';
import { User } from '@type/user';
import jwt from 'jsonwebtoken';
import { BranchService } from './BranchService';
import { UsersService } from '@backend/services/UsersService';
import { GITHUB_CLIENT_ID } from '@backend/config';
import fs from 'fs';
import path from 'path';

const BRANCH_NAME = 'locutio';

export const GitHubService = {
  async getUser(accessToken: string) {
    const { data: gitHubUser } = await makeGet('https://api.github.com/user', accessToken);
    return gitHubUser;
  },

  // async getLatestCommit(user: User, org: Organization): Promise<string> {
  //   if (!user.githubAccessToken) {
  //     throw new Error("User doesn't have an active token");
  //   }
  //   const { data } = await makeGet(
  //     `https://api.github.com/repos/${org.githubRepo}/commits?per_page=1`,
  //     user.githubAccessToken,
  //   );
  //   return data[0].sha;
  // },

  // async getChangedFilesSinceCommit(
  //   user: User,
  //   org: Organization,
  //   commitSha: string,
  //   latestCommitSha: string = 'HEAD',
  // ): Promise<GitHubFile[]> {
  //   if (!user.githubAccessToken) {
  //     throw new Error("User doesn't have an active token");
  //   }
  //   const { data } = await makeGet(
  //     `https://api.github.com/repos/${org.githubRepo}/compare/${commitSha}...${latestCommitSha}`,
  //     user.githubAccessToken,
  //   );
  //   return data.files.map((file: any) => ({
  //     name: file.filename,
  //     downloadUrl: file.raw_url,
  //     sha: file.sha,
  //   }));
  // },

  async getRepositories(user: User): Promise<GitHubRepo[]> {
    const githubToken = await UsersService.getUserGitHubAccessToken(user.id);
    if (!githubToken) {
      throw new Error("User doesn't have an active token");
    }

    const fetchPage = async (
      url: string,
    ): Promise<{ repos: GitHubRepo[]; nextUrl: string | null }> => {
      const response = await makeGet(url, githubToken);
      const repos = (response.data as any[]).map(
        (repo: any): GitHubRepo => ({
          name: repo.full_name,
          logo: repo.owner.avatar_url,
        }),
      );
      console.log(repos);

      const linkHeader = response.headers.get('Link');
      const nextUrl = linkHeader
        ? linkHeader
            .split(',')
            .find((part: any) => part.includes('rel="next"'))
            ?.match(/<(.*)>/)?.[1] || null
        : null;

      return { repos, nextUrl };
    };

    let allRepos: GitHubRepo[] = [];
    let nextUrl: string | null = 'https://api.github.com/user/repos?visibility=all&per_page=100';

    while (nextUrl) {
      const { repos, nextUrl: newNextUrl } = await fetchPage(nextUrl);
      allRepos = [...allRepos, ...repos];
      nextUrl = newNextUrl;
    }

    return allRepos;
  },

  // async readProjectSource(
  //   user: User,
  //   org: Organization,
  //   path: string,
  //   sha?: string,
  // ): Promise<GitHubFile[]> {
  //   if (!user.githubAccessToken) {
  //     throw new Error("User doesn't have an active token");
  //   }
  //   const url = `https://api.github.com/repos/${org.githubRepo}/contents/${path}${
  //     sha ? `?ref=${sha}` : ''
  //   }`;
  //   const { data: files } = await makeGet(url, user.githubAccessToken);
  //   return files.map((file: any) => ({
  //     name: file.name,
  //     downloadUrl: file.download_url,
  //     sha: file.sha,
  //   }));
  // },

  // async readProjectFile(user: User, org: Organization, fileName: string, branch?: string) {
  //   if (!user.githubAccessToken) {
  //     throw new Error("User doesn't have an active token");
  //   }
  //   try {
  //     const { data: file } = await makeGet(
  //       `https://api.github.com/repos/${org.githubRepo}/contents/${fileName}${
  //         branch ? `?ref=${branch}` : ''
  //       }`,
  //       user.githubAccessToken,
  //     );
  //     return file;
  //   } catch (error) {
  //     return null;
  //   }
  // },

  // async updateProjectSource(
  //   user: User,
  //   org: Organization,
  //   language: string,
  //   fileName: string,
  //   content: string,
  // ) {
  //   if (!user.githubAccessToken) {
  //     throw new Error("User doesn't have an active token");
  //   }
  //   const filePath = `${org.outputFile?.replace('%language%', language)}/${fileName}`;

  //   const branchExists = await BranchService.checkBranchExists(
  //     user.githubAccessToken,
  //     org.githubRepo,
  //     BRANCH_NAME,
  //   );
  //   if (!branchExists) {
  //     await BranchService.createBranch(user.githubAccessToken, org.githubRepo, BRANCH_NAME);
  //   }

  //   let existingFile;
  //   try {
  //     existingFile = await this.readProjectFile(user, project, filePath, BRANCH_NAME);
  //   } catch (error) {
  //     // File doesn't exist, which is fine
  //   }

  //   const updateBody: any = {
  //     message: 'Update translations',
  //     content: Buffer.from(content).toString('base64'),
  //     branch: BRANCH_NAME,
  //   };

  //   if (existingFile && existingFile.sha) {
  //     updateBody.sha = existingFile.sha;
  //   }

  //   const response = await makeQuery({
  //     authToken: user.githubAccessToken,
  //     baseUrl: '',
  //     url: `https://api.github.com/repos/${org.githubRepo}/contents/${filePath}`,
  //     method: 'PUT',
  //     body: updateBody,
  //   });

  //   if (response.status >= 400) {
  //     console.error('Error updating file:', response);
  //     throw new ApiError(response.status, 'Error pushing updated translations to GitHub');
  //   }
  // },

  // async getInstallationToken(userId: string) {
  //   let privateKey;
  //   try {
  //     const privateKeyPath = path.join(__dirname, '..', '..', '.private-key.pem');
  //     privateKey = fs.readFileSync(privateKeyPath, 'utf8');
  //   } catch (error) {
  //     console.error('Error reading private key:', error);
  //     throw new ApiError(500, 'Error reading GitHub private key');
  //   }

  //   const payload = {
  //     iat: Math.floor(Date.now() / 1000),
  //     exp: Math.floor(Date.now() / 1000) + 600,
  //     iss: 975992, // github app id
  //   };

  //   const token = jwt.sign(payload, privateKey, { algorithm: 'RS256' });

  //   const githubAccessToken = await UsersService.getUserGitHubAccessToken(userId);

  //   await makeGet('https://api.github.com/app/installations', githubAccessToken);

  //   const response = await fetch(
  //     `https://api.github.com/app/installations/INSTALLATION_ID/access_tokens`,
  //     {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         Accept: 'application/vnd.github+json',
  //         Authorization: `Bearer ${token}`,
  //         'User-Agent': 'Locutio',
  //       },
  //     },
  //   );

  //   const responseData = await response.json();

  //   const installationAccessToken = responseData.token;
  //   return token;
  // },
};
