import * as path from 'path';
import { Config, BaseConfig } from './types';
import { CiSettings } from './getCiSettings';
import { NonVerboseError } from '../errors';

export function normaliseConfig(config: CiSettings & BaseConfig, configFilePath: string): Config {
  return {
    ...config,
    storyPath: makeArray(config.storyPath),
    storyPathIgnorePatterns: makeArray(config.storyPathIgnorePatterns),
    webpackConfig: resolveWebpackConfig(configFilePath, config.webpackConfig),
  };
}

function makeArray<T>(property: T | T[]): T[] {
  return Array.isArray(property) ? property : [property];
}

function resolveWebpackConfig(configFilePath: string, webpackConfigPath: string): string {
  try {
    return path.resolve(configFilePath, webpackConfigPath);
  } catch {
    throw new NonVerboseError(
      'No webpack file found. Please specify the webpack configuration file location: https://bojagi.io/docs/cliConfigFile/#webpackconfig'
    );
  }
}
