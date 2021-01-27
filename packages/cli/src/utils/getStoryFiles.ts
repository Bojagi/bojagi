import { Config } from '../config';
import { NonVerboseError } from '../errors';
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
    throw new NonVerboseError(
      'no valid story files found. Please specify the storyPath: https://bojagi.io/docs/cliConfigFile/#storypath'
    );
  }
  return validStoryFiles;
}
