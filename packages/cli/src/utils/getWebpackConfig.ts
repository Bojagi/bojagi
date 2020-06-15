import * as pathUtils from 'path';
import { EntrypointWithMetadata } from '@bojagi/types';
import composeWebpackConfig from './composeWebpackConfig';
import glob from './glob';
import { Config } from '../config';
import getStoryFiles from './getStoryFiles';

import webpack = require('webpack');

export type GetWebpackConfigOptions = {
  config: Config;
  entrypointsWithMetadata: Record<string, EntrypointWithMetadata>;
};

export type GetWebpackConfigOutput = {
  entrypoints: Record<string, string>;
  webpackConfig: webpack.Configuration;
};

export async function getWebpackConfig({
  config,
  entrypointsWithMetadata,
}: GetWebpackConfigOptions): Promise<GetWebpackConfigOutput> {
  const projectWebpackConfig = require(config.webpackConfig);
  const decoratorFiles = await glob(config.decoratorPath, { cwd: config.executionPath });
  const decoratorFileArray =
    decoratorFiles.length > 0 ? [pathUtils.resolve(config.executionPath, decoratorFiles[0])] : [];
  console.log('config', config);

  const storyFiles = await getStoryFiles(config);
  const storyFileArray = storyFiles.map(sf => pathUtils.resolve(config.executionPath, sf));
  const entrypoints = Object.entries(entrypointsWithMetadata).reduce(
    (prev, [key, ep]) => ({
      ...prev,
      [key]: [ep.entrypoint, ...decoratorFileArray, ...storyFileArray],
    }),
    {}
  );

  const webpackConfig = composeWebpackConfig(
    entrypoints,
    projectWebpackConfig.resolve,
    projectWebpackConfig.module,
    config.executionPath,
    decoratorFileArray[0],
    storyFileArray
  );

  return {
    entrypoints,
    webpackConfig,
  };
}
