import { CiSettings } from './getCiSettings';

import webpack = require('webpack');

export type BaseConfig = {
  dryRun: boolean;
  namespace: 'default';
  webpackConfig?: string;
  executionPath: string;
  decoratorPath: string;
  uploadApiUrl: string;
  storyPath: string | string[];
  storyPathIgnorePatterns: string | string[];
  previewPort: number;
  previewNoOpen: boolean;
  previewDownloadUrl: string;
};

export type Config = CiSettings &
  Omit<BaseConfig, 'webpackConfig' | 'storyPath' | 'storyPathIgnorePatterns'> & {
    storyPath: string[];
    storyPathIgnorePatterns: string[];
    webpackConfig: webpack.Configuration;
  };

export type ConfigFilePrio = {
  path: string;
  fn: (path: string) => Partial<BaseConfig>;
};
