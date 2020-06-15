import { CiSettings } from './getCiSettings';

export type CollectorTuple = [string, Record<string, any>];

export type BaseConfig = {
  componentMarker: string;
  dir: string;
  dryRun: boolean;
  webpackConfig: string;
  executionPath: string;
  decoratorPath: string;
  uploadApiUrl: string;
  storyPath: string | string[];
  storyPathIgnorePatterns: string | string[];
  previewPort: number;
  previewDownloadUrl: string;
  collectors: (string | CollectorTuple)[];
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