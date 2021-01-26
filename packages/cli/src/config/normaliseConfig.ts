import { Config, BaseConfig } from './types';
import { CiSettings } from './getCiSettings';
import { getProjectWebpackConfig } from './getProjectWebpackConfig';

export async function normaliseConfig(
  config: CiSettings & BaseConfig,
  configFilePath: string
): Promise<Config> {
  return {
    ...config,
    storyPath: makeArray(config.storyPath),
    storyPathIgnorePatterns: makeArray(config.storyPathIgnorePatterns),
    webpackConfig: await getProjectWebpackConfig(config, configFilePath),
  };
}

function makeArray<T>(property: T | T[]): T[] {
  return Array.isArray(property) ? property : [property];
}
