import { execSync } from 'child_process';

export default function getGitPath(filePath) {
  if (filePath) {
    try {
      const result = execSync(`git ls-files --full-name ${filePath}`, {
        env: process.env,
        cwd: process.cwd(),
      })
        .toString()
        .replace('\n', '');
      return result || undefined;
    } catch (e) {
      return undefined;
    }
  }
  return undefined;
}
