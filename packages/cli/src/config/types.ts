import { CiSettings } from './getCiSettings';

export type BaseConfig = {
  dryRun: boolean;
  namespace: 'default';
  webpackConfig: string;
  executionPath: string;
  decoratorPath: string;
  uploadApiUrl: string;
  storyPath: string | string[];
  storyPathIgnorePatterns: string | string[];
  previewPort: number;
  previewDownloadUrl: string;
};

export type Config = CiSettings &
  Omit<BaseConfig, 'storyPath' | 'storyPathIgnorePatterns'> & {
    storyPath: string[];
    storyPathIgnorePatterns: string[];
  };

export type ConfigFilePrio = {
  path: string;
  fn: (path: string) => Partial<BaseConfig>;
};
