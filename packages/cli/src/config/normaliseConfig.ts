import * as path from 'path';
import { Config, BaseConfig } from './types';
import { CiSettings } from './getCiSettings';

export function normaliseConfig(config: CiSettings & BaseConfig, configFilePath: string): Config {
  return {
    ...config,
    storyPath: makeArray(config.storyPath),
    storyPathIgnorePatterns: makeArray(config.storyPathIgnorePatterns),
    webpackConfig: path.resolve(configFilePath, config.webpackConfig),
  };
}

function makeArray<T>(property: T | T[]): T[] {
  return Array.isArray(property) ? property : [property];
}
