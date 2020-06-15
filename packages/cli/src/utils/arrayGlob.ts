import glob from './glob';

export default async function arrayGlob(
  patterns: string[],
  { executionPath }: { executionPath: string }
) {
  return (
    await Promise.all(patterns.map(storyPath => glob(storyPath, { cwd: executionPath })))
  ).flat();
}
