import * as path from 'path';
import * as fs from 'fs';

export function getDependencyVersion(folderPath: string, dependencyName: string, fileSystem = fs) {
  if (folderPath === '/') {
    return undefined;
  }

  const packagePath = path.join(folderPath, 'package.json');
  if (fileSystem.existsSync(packagePath)) {
    const packageContent = JSON.parse(
      fileSystem.readFileSync(path.resolve(folderPath, 'package.json')).toString()
    );
    const dependencyVersion =
      packageContent.dependencies && packageContent.dependencies[dependencyName];
    if (dependencyVersion) {
      return dependencyVersion;
    }
  }

  return getDependencyVersion(path.resolve(folderPath, '..'), dependencyName, fileSystem);
}
