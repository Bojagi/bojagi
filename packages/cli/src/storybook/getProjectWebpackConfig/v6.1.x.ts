import * as path from 'path';
import { getStorybookFrameworkLoadOptions } from '../storybookUtils';
import { replaceWebpackRules } from '../../utils/replaceWebpackRules';
import { getSbOption, getSbCliOptions } from '../getSbOption';
import { getPackageFolder } from '../../utils/getPackageFolder';
import { replaceDefaultMediaLoader } from './replaceLoaders';
import { StorybookFramework } from '../types';

import webpack = require('webpack');

async function getWebpackConfig(loadOptions) {
  // we have to load all those libs dynamically as they are all optional
  // eslint-disable-next-line import/no-extraneous-dependencies
  const loadConfig = require('@storybook/core/dist/server/config').default;
  const cliOptions = getSbCliOptions();

  const webpackConfig = await loadConfig({
    ...loadOptions,
    ...cliOptions,
    configType: 'PRODUCTION',
    outputDir: getOutputDir(getSbOption('outputDir', './storybook-static')),
    configDir: getSbOption('configDir', './.storybook'),
    ignorePreview: !!cliOptions.previewUrl,
    docsMode: !!cliOptions.docs,
    corePresets: [require.resolve('@storybook/core/dist/server/preview/preview-preset.js')],
    overridePresets: [
      require.resolve('@storybook/core/dist/server/preview/custom-webpack-preset.js'),
    ],
  });

  // Add node_modules of SB core in case resolvers are placed there by npm/yarn
  webpackConfig.resolveLoader = webpackConfig.resolveLoader || {};
  const corePackagePath = getPackageFolder('@storybook/core');
  webpackConfig.resolveLoader.modules = webpackConfig.resolveLoader?.modules || ['node_modules'];
  webpackConfig.resolveLoader.modules.push(path.join(corePackagePath, 'node_modules'));

  return replaceWebpackRules(webpackConfig, replaceDefaultMediaLoader);
}

// eslint-disable-next-line camelcase
export async function getV_6_1_X_StorybookProjectWebpackConfig(
  framework: StorybookFramework
): Promise<webpack.Configuration | void> {
  const loadConfig = getStorybookFrameworkLoadOptions(framework);

  return getWebpackConfig(loadConfig);
}

function getOutputDir(givenOutputDir) {
  return path.isAbsolute(givenOutputDir)
    ? givenOutputDir
    : path.join(process.cwd(), givenOutputDir);
}
