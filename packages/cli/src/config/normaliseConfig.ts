import { Config, BaseConfig } from './types';
import { CiSettings } from './getCiSettings';

export function normaliseConfig(config: CiSettings & BaseConfig): Config {
  console.log('normalise', {
    ...config,
    storyPath: makeArray(config.storyPath),
    storyPathIgnorePatterns: makeArray(config.storyPathIgnorePatterns),
  });

  return {
    ...config,
    storyPath: makeArray(config.storyPath),
    storyPathIgnorePatterns: makeArray(config.storyPathIgnorePatterns),
  };
}

function makeArray<T>(property: T | T[]): T[] {
  return Array.isArray(property) ? property : [property];
}
