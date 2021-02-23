import debuggers, { DebugNamespaces } from '../debug';

const debug = debuggers[DebugNamespaces.REQUIRE];

export function softRequireResolve(pathName) {
  try {
    return require.resolve(pathName);
  } catch {
    return undefined;
  }
}

export function requireFromPaths<T>(paths: Array<string>): T {
  for (let i = 0; i < paths.length; i += 1) {
    try {
      return require(paths[i]);
    } catch (e) {
      debug(`not found under ${paths[i]}`);
    }
  }
  throw new Error(`module not found - ${paths.join(',')}`);
}

export function resolveFromPaths(paths: Array<string>): string {
  for (let i = 0; i < paths.length; i += 1) {
    try {
      return require.resolve(paths[i]);
    } catch (e) {
      debug(`not found under ${paths[i]}`);
    }
  }
  throw new Error(`module not found - ${paths.join(',')}`);
}
