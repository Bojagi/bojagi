import { execSync } from 'child_process';

export default function getGitPath(projectPath) {
  return execSync(`git ls-files --full-name ${projectPath}`, {
    env: process.env,
    cwd: process.cwd()
  }).toString();
}
