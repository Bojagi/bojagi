import * as path from 'path';

export function getPackageFolder(packageName: string) {
  const pathSegments = require.resolve(`${packageName}/package.json`).split(path.sep);
  pathSegments.pop();
  return path.join(...pathSegments);
}
