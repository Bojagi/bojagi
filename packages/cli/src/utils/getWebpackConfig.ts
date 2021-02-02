import { StoryWithMetadata } from '../types';
import composeWebpackConfig from './composeWebpackConfig';
import { Config } from '../config';
import { getSbOption } from '../storybook/getSbOption';
import { getDecoratorFile } from './getDecoratorFile';

import webpack = require('webpack');

export type GetWebpackConfigOptions = {
  config: Config;
  storyFiles: StoryWithMetadata[];
  publicPath?: string;
};

export type GetWebpackConfigOutput = {
  entrypoints: Record<string, string>;
  webpackConfig: webpack.Configuration;
};

export async function getWebpackConfig({
  config,
  storyFiles,
  publicPath,
}: GetWebpackConfigOptions): Promise<GetWebpackConfigOutput> {
  const decoratorFile = await getDecoratorFile(config);

  const entrypoints = storyFiles.reduce(
    (prev, storyFile) => ({
      ...prev,
      [storyFile.fileName]: [storyFile.entrypoint, ...(decoratorFile ? [decoratorFile] : [])],
    }),
    {}
  );

  const webpackConfig = composeWebpackConfig(
    config.webpackConfig,
    entrypoints,
    config.executionPath,
    decoratorFile,
    getSbOption,
    publicPath
  );

  return {
    entrypoints,
    webpackConfig,
  };
}
