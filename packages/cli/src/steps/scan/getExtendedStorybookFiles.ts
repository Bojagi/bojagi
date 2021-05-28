import * as path from 'path';
import { StoryWithMetadata } from '../../types';
import { Config } from '../../config';

const getEntrypointsFromFiles = (
  config: Config,
  files: string[],
  gitPathPrefix?: string
): StoryWithMetadata[] =>
  files
    .map<StoryWithMetadata>(filePath => {
      // Regexp to find out file name
      const matchResult = filePath.match(/.+\/([^/]+)\..+?$/);

      // Ignore files where filename could not be found
      if (!matchResult) {
        return undefined as any;
      }

      const fullFilePath = path.resolve(filePath);
      const gitPath = gitPathPrefix && path.relative(gitPathPrefix, fullFilePath);
      const absoluteFilePath = path.resolve(config.executionPath, filePath);

      const fileName = matchResult[1];
      return {
        name: filePath.replace(/\//g, '__'),
        filePath,
        gitPath: gitPath || filePath,
        fileName,
        entrypoint: `component-extract-loader?${fileName}!${absoluteFilePath}`,
      };
    })
    // Filter out undefined results
    .filter(i => !!i);

export default getEntrypointsFromFiles;
