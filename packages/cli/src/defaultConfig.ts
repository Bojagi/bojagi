import { getWebpackConfigPath } from './utils/getWebpackConfig';
import { BaseConfig } from './config';

const COLLECTOR_MAIN_NAME = '@bojagi/collector-main';

export const defaultConfig: BaseConfig = {
  componentMarker: '@component',
  dir: 'src',
  webpackConfig: getWebpackConfigPath(process.cwd()),
  executionPath: process.cwd(),
  decoratorPath: '.bojagi/decorator.@(tsx|ts|jsx|js)',
  storyPath: 'src/**/*.bojagi.@(tsx|ts|jsx|js)',
  uploadApiUrl: process.env.BOJAGI_API_URL || 'https://upload.bojagi.io',
  collectors: [COLLECTOR_MAIN_NAME],
};
