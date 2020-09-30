import { Config } from '../config';
import arrayGlob from './arrayGlob';

export default async function getStoryFiles({
  storyPath,
  storyPathIgnorePatterns,
  executionPath,
}: Config) {
  const ignoreStoryFiles = await arrayGlob(storyPathIgnorePatterns, { executionPath });
  const storyFiles = await arrayGlob(storyPath, { executionPath });
  const validStoryFiles = storyFiles.filter(filePath => !ignoreStoryFiles.includes(filePath));

  if (validStoryFiles.length === 0) {
    throw new Error('no valid story files found');
  }
  return validStoryFiles;
}
