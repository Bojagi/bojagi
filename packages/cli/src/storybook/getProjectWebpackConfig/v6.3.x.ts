import * as path from 'path';
import { getStorybookFrameworkLoadOptions } from '../storybookUtils';
import { replaceWebpackRules } from '../../utils/replaceWebpackRules';
import { getSbOption, getSbCliOptions } from '../getSbOption';
import { getPackageFolder } from '../../utils/getPackageFolder';
import { replaceDefaultMediaLoader } from './replaceLoaders';
import { StorybookFramework } from '../types';
import { BaseConfig } from '../../config';

import webpack = require('webpack');

// reverse engineered from @storybook/core-server/dist/cjs/build-static.js
async function getWebpackConfig(loadOptions, config: BaseConfig) {
  // we have to load all those libs dynamically as they are all optional
  const {
    getPreviewBuilder,
    // eslint-disable-next-line import/no-extraneous-dependencies
  } = require('@storybook/core-server/dist/cjs/utils/get-preview-builder');
  const {
    getManagerBuilder,
    // eslint-disable-next-line import/no-extraneous-dependencies
  } = require('@storybook/core-server/dist/cjs/utils/get-manager-builder');
  // eslint-disable-next-line import/no-extraneous-dependencies
  const { loadAllPresets } = require('@storybook/core-common');
  const cliOptions = getSbCliOptions();
  const configDir = getSbOption('configDir', config.storybookConfig);

  const previewBuilder = await getPreviewBuilder(configDir);
  const managerBuilder = await getManagerBuilder(configDir);

  const coreOptions = {
    ...loadOptions,
    ...cliOptions,
    configType: 'PRODUCTION',
    outputDir: getOutputDir(getSbOption('outputDir', './storybook-static')),
    configDir,
    ignorePreview: !!cliOptions.previewUrl,
    docsMode: !!cliOptions.docs,
  };

  const presets = await loadAllPresets({
    ...coreOptions,
    corePresets: [
      require.resolve('@storybook/core-server/dist/cjs/presets/common-preset'),
      ...managerBuilder.corePresets,
      ...previewBuilder.corePresets,
      require.resolve('@storybook/core-server/dist/cjs/presets/babel-cache-preset'),
    ],
    overridePresets: previewBuilder.overridePresets,
  });

  const fullOptions = {
    ...coreOptions,
    presets,
  };

  const webpackConfig = await previewBuilder.getConfig(fullOptions);

  // Add node_modules of SB core in case resolvers are placed there by npm/yarn
  webpackConfig.resolveLoader = webpackConfig.resolveLoader || {};
  const corePackagePath = getPackageFolder('@storybook/core-server');
  webpackConfig.resolveLoader.modules = webpackConfig.resolveLoader?.modules || ['node_modules'];
  webpackConfig.resolveLoader.modules.push(path.join(corePackagePath, 'node_modules'));

  return replaceWebpackRules(webpackConfig, replaceDefaultMediaLoader);
}

// eslint-disable-next-line camelcase
export async function getV_6_3_X_StorybookProjectWebpackConfig(
  framework: StorybookFramework,
  config: BaseConfig
): Promise<webpack.Configuration | void> {
  const loadConfig = getStorybookFrameworkLoadOptions(framework);

  return getWebpackConfig(loadConfig, config);
}

function getOutputDir(givenOutputDir) {
  return path.isAbsolute(givenOutputDir)
    ? givenOutputDir
    : path.join(process.cwd(), givenOutputDir);
}
