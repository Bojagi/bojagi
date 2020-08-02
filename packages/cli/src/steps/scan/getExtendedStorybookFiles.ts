import { StoryWithMetadata } from '@bojagi/types';
import * as path from 'path';
import getGitPath from '../../utils/getGitPath';
import { Config } from '../../config';

const getEntrypointsFromFiles = (config: Config, files: string[]): StoryWithMetadata[] =>
  files
    .map<StoryWithMetadata>(filePath => {
      // Regexp to find out file name
      const matchResult = filePath.match(/.+\/([^/]+)\..+?$/);

      // Ignore files where filename could not be found
      if (!matchResult) {
        return undefined as any;
      }

      const gitPath = getGitPath(filePath) as string;
      const absoluteFilePath = path.resolve(config.executionPath, filePath);

      const fileName = matchResult[1];
      return {
        name: fileName,
        filePath,
        gitPath,
        fileName,
        entrypoint: `component-extract-loader?${fileName}!${absoluteFilePath}`,
      };
    })
    // Filter out undefined results
    .filter(i => !!i);

export default getEntrypointsFromFiles;
