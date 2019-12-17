import { getWebpackConfigPath } from './utils/getWebpackConfig';
import { Config } from './config';

const defaultConfig: Config = {
  componentMarker: '@component',
  dir: 'src',
  webpackConfig: getWebpackConfigPath(process.cwd()),
  executionPath: process.cwd(),
  uploadApiUrl: process.env.BOJAGI_API_URL || 'https://upload.bojagi.io'
};

export default defaultConfig;
