import { makeGet, makePost } from '@backend/makeQuery';

export const BranchService = {
  async checkBranchExists(accessToken: string, repo: string, branch: string): Promise<boolean> {
    try {
      const { data: response } = await makeGet(
        `https://api.github.com/repos/${repo}/branches/${branch}`,
        accessToken,
      );
      return response.message !== 'Branch not found';
    } catch (error: any) {
      if (error.status === 404) {
        return false;
      }
      throw error;
    }
  },

  async createBranch(accessToken: string, repo: string, branch: string): Promise<void> {
    try {
      const { data: repoData } = await makeGet(`https://api.github.com/repos/${repo}`, accessToken);
      const defaultBranch = repoData.default_branch;

      const { data: branchData } = await makeGet(
        `https://api.github.com/repos/${repo}/git/refs/heads/${defaultBranch}`,
        accessToken,
      );
      const sha = branchData.object.sha;

      await makePost(
        `https://api.github.com/repos/${repo}/git/refs`,
        { ref: `refs/heads/${branch}`, sha },
        accessToken,
      );
    } catch (error: any) {
      console.error('Error creating branch:', error);
      throw new Error(`Failed to create branch: ${error.message}`);
    }
  },
};
