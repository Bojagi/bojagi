import * as pathUtils from 'path';
import { CiSettings } from './getCiSettings';
import { BaseConfig } from './types';
import { NonVerboseError } from '../errors';
import { softRequireResolve } from '../utils/softRequireResolve';
import { getStorybookProjectWebpackConfig } from '../storybook';

import webpack = require('webpack');

const WEBPACK_SOURCES: ((
  config: CiSettings & BaseConfig,
  configFilePath: string
) => Promise<webpack.Configuration | void>)[] = [
  // CUSTOM,
  async (config, configFilePath) => {
    if (config.webpackConfig) {
      return loadConfigFromPath(resolveWebpackConfig(configFilePath, config.webpackConfig));
    }
    return undefined;
  },
  // STORYBOOK,
  getStorybookProjectWebpackConfig,
  // CREATE_REACT_APP,
  async (config, configFilePath) => {
    const createReactWebpackConfigPath = softRequireResolve(
      'react-scripts/config/webpack.config.js'
    );
    if (createReactWebpackConfigPath) {
      return loadConfigFromPath(createReactWebpackConfigPath);
    }
    return undefined;
  },
  // PROJECT_ROOT,
  async (config, configFilePath) => {
    const createReactWebpackConfigPath = softRequireResolve(
      pathUtils.join(process.cwd(), 'webpack.config.js')
    );
    if (createReactWebpackConfigPath) {
      return loadConfigFromPath(createReactWebpackConfigPath);
    }
    return undefined;
  },
];

export async function getProjectWebpackConfig(
  config: CiSettings & BaseConfig,
  configFilePath: string
): Promise<webpack.Configuration> {
  const result = await WEBPACK_SOURCES.reduce(async (projectConfig, currentConfigBuilder) => {
    if (await projectConfig) {
      return projectConfig;
    }
    return currentConfigBuilder(config, configFilePath);
  }, Promise.resolve(undefined));

  if (!result) {
    throw new NonVerboseError(
      'Missing webpack configuration. Please specify the webpack configuration file location: https://bojagi.io/docs/cliConfigFile/#webpackconfig'
    );
  }
  return result;
}

function resolveWebpackConfig(configFilePath: string, webpackConfigPath: string): string {
  try {
    return require.resolve(pathUtils.resolve(configFilePath, webpackConfigPath));
  } catch {
    throw new NonVerboseError(
      'No webpack file found. Please specify the webpack configuration file location: https://bojagi.io/docs/cliConfigFile/#webpackconfig'
    );
  }
}

async function loadConfigFromPath(webpackConfigPath) {
  const projectWebpackConfig = require(webpackConfigPath);

  return typeof projectWebpackConfig === 'function'
    ? projectWebpackConfig('development') // TODO read from args etc
    : projectWebpackConfig;
}
