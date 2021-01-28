export function softRequireResolve(pathName) {
  try {
    return require.resolve(pathName);
  } catch {
    return undefined;
  }
}
