export function getDependencyVersion(dependencyName: string, req = require) {
  try {
    return req(`${dependencyName}/package.json`).version;
  } catch {
    return undefined;
  }
}
