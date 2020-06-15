import simpleGit = require('simple-git/promise');
export async function getGitSettings(executionPath: string) {
  try {
    const git = simpleGit(executionPath);
    const result = await git.log();
    return {
      commit: result.latest.hash,
    };
  } catch {
    return {};
  }
}
