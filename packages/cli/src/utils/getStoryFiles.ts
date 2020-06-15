import { Config } from '../config';
import arrayGlob from './arrayGlob';

export default async function getStoryFiles({
  storyPath,
  storyPathIgnorePatterns,
  executionPath,
}: Config) {
  const ignoreStoryFiles = await arrayGlob(storyPathIgnorePatterns, { executionPath });
  const storyFiles = await arrayGlob(storyPath, { executionPath });
  return storyFiles.filter(filePath => !ignoreStoryFiles.includes(filePath));
}
