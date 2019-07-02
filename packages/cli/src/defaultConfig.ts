import { getWebpackConfigPath } from './utils/getWebpackConfig';

const defaultConfig = {
  marker: 'component',
  markerPrefix: '@',
  dir: 'src',
  webpackConfig: getWebpackConfigPath(process.cwd()),
  executionPath: process.cwd()
};

export default defaultConfig;
