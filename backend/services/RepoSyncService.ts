import { ApiError } from '@backend/core/apiHandler';
import { UsersService } from '@backend/services/UsersService';
import { Organization } from '@type/organization';
import { User } from '@type/user';
import { makeGet } from '../makeQuery';
import { GitHubService } from './GitHubService';
import { StringsService } from './StringsService';

export const RepoSyncService = {
  async setupRepo(user: User, organization: Organization) {
    if (!organization.inputFile || !organization.outputFile || !organization.baseLanguage) {
      throw new ApiError(400, 'Organization is not configured correctly');
    }
    const githubAccessToken = await UsersService.getUserGitHubAccessToken(user.id);
    if (!githubAccessToken) {
      throw new ApiError(400, 'User does not have a GitHub access token');
    }
    const latestCommit = await GitHubService.getLatestCommit(user, organization, githubAccessToken);

    await processLanguage(
      user,
      organization,
      organization.baseLanguage,
      organization.inputFile,
      latestCommit,
      githubAccessToken,
    );

    for (const language of organization.languages) {
      if (language !== organization.baseLanguage) {
        const outputFile = organization.outputFile.replace('%language%', language);
        await processLanguage(
          user,
          organization,
          language,
          outputFile,
          latestCommit,
          githubAccessToken,
        );
      }
    }

    return latestCommit;
  },

  async updateRepo(user: User, organization: Organization) {
    const githubAccessToken = await UsersService.getUserGitHubAccessToken(user.id);
    if (!githubAccessToken) {
      throw new ApiError(400, 'User has no GitHub access token. Please setup the repo first.');
    }
    if (!organization.lastCommit) {
      throw new ApiError(400, 'Project has no last commit. Please setup the repo first.');
    }
    if (!organization.inputFile || !organization.outputFile || !organization.baseLanguage) {
      throw new ApiError(400, 'Organization is not configured correctly');
    }

    const latestCommit = await GitHubService.getLatestCommit(user, organization, githubAccessToken);
    const changedFiles = await GitHubService.getChangedFilesSinceCommit(
      user,
      organization,
      organization.lastCommit,
      latestCommit,
      githubAccessToken,
    );

    const inputFiles = changedFiles.filter(
      (file) => organization.inputFile && file.name.startsWith(organization.inputFile),
    );

    for (const file of inputFiles) {
      const fileContent = await GitHubService.readProjectFile(
        user,
        organization,
        file.name,
        latestCommit,
      );
      const content = JSON.parse(Buffer.from(fileContent.content, 'base64').toString());
      await StringsService.updateStrings(
        organization.id,
        organization.baseLanguage,
        file.name,
        content,
      );
    }

    return latestCommit;
  },
};

async function processLanguage(
  user: User,
  project: Organization,
  language: string,
  filePath: string,
  commit: string,
  githubAccessToken: string,
) {
  const fileDescriptions = await GitHubService.readProjectSource(user, project, filePath, commit);

  const files = await Promise.all(
    fileDescriptions.map((file) => makeGet(file.downloadUrl, githubAccessToken)),
  );

  for (let i = 0; i < files.length; i++) {
    await StringsService.updateStrings(
      project.id,
      language,
      fileDescriptions[i].name,
      files[i].data,
    );
  }
}
