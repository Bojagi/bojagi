import { getWebpackConfigPath } from '../utils/composeWebpackConfig';
import { BaseConfig } from './types';

export const defaultConfig: BaseConfig = {
  webpackConfig: getWebpackConfigPath(process.cwd()),
  executionPath: process.cwd(),
  dryRun: false,
  namespace: 'default',
  decoratorPath: '.bojagi/decorator.@(tsx|ts|jsx|js)',
  storyPath: ['src/**/*.stories.@(tsx|ts|jsx|js)', 'src/**/*.bojagi.@(tsx|ts|jsx|js)'],
  storyPathIgnorePatterns: [],
  uploadApiUrl: process.env.BOJAGI_API_URL || 'https://upload.bojagi.io',
  previewPort: 5002,
  previewDownloadUrl:
    process.env.BOJAGI_PREVIEW_DOWNLOAD_URL ||
    'https://dev-bojagi-local-dev-releases.s3.amazonaws.com',
};
