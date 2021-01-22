import * as path from 'path';

export function getDependencyVersion(dependencyName: string, searchPath: string, req = require) {
  try {
    const resolvedPath = req.resolve(`${dependencyName}/package.json`, {
      paths: getAllParentFolders(searchPath),
    });
    return req(resolvedPath).version;
  } catch {
    return undefined;
  }
}

function getAllParentFolders(fullPath: string) {
  const segments = fullPath.split(path.sep).filter(item => item);
  return segments.map((_, i, arr) => path.sep + path.join(...arr.slice(0, i + 1))).reverse();
}
