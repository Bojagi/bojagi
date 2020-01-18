import { getWebpackConfigPath } from './utils/getWebpackConfig';
import { Config } from './config';

const COLLECTOR_MAIN_NAME = '@bojagi/collector-main';

const defaultConfig: Config = {
  componentMarker: '@component',
  dir: 'src',
  webpackConfig: getWebpackConfigPath(process.cwd()),
  executionPath: process.cwd(),
  uploadApiUrl: process.env.BOJAGI_API_URL || 'https://upload.bojagi.io',
  collectors: [COLLECTOR_MAIN_NAME],
};

export default defaultConfig;
