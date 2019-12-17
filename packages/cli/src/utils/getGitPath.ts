import { execSync } from 'child_process';

export default function getGitPath(filePath) {
  if (filePath) {
    const result = execSync(`git ls-files --full-name ${filePath}`, {
      env: process.env,
      cwd: process.cwd(),
    })
      .toString()
      .replace('\n', '');
    return result || undefined;
  }
  return undefined;
}
