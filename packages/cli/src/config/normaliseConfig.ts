import { Config } from './types';

export function normaliseConfig(config): Config {
  return {
    ...config,
    storyPath: Array.isArray(config.storyPath) ? config.storyPath : [config.storyPath],
  };
}
