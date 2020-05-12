import { getWebpackConfigPath } from './utils/composeWebpackConfig';
import { BaseConfig } from './config';

const COLLECTOR_MAIN_NAME = '@bojagi/collector-main';

export const defaultConfig: BaseConfig = {
  componentMarker: '@bojagi',
  dir: 'src',
  webpackConfig: getWebpackConfigPath(process.cwd()),
  executionPath: process.cwd(),
  dryRun: false,
  decoratorPath: '.bojagi/decorator.@(tsx|ts|jsx|js)',
  storyPath: 'src/**/*.bojagi.@(tsx|ts|jsx|js)',
  uploadApiUrl: process.env.BOJAGI_API_URL || 'https://upload.bojagi.io',
  previewPort: 5002,
  previewDownloadUrl:
    process.env.BOJAGI_PREVIEW_DOWNLOAD_URL ||
    'https://dev-bojagi-local-dev-releases.s3.amazonaws.com',
  collectors: [COLLECTOR_MAIN_NAME],
};
