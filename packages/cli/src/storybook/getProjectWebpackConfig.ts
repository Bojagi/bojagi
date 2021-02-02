import { getStorybookLoadConfig } from './storybookUtils';
import { replaceWebpackRules } from '../utils/replaceWebpackRules';
import { getSbOption } from './getSbOption';

import webpack = require('webpack');

const path = require('path');

async function getWebpackConfig(loadOptions) {
  // we have to load all those libs dynamically as they are all optional
  const loadConfig = require('@storybook/core/dist/server/config').default;
  const { getProdCli } = require('@storybook/core/dist/server/cli');

  const cliOptions = getProdCli(loadOptions.packageJson);
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

  return replaceWebpackRules(webpackConfig, replaceDefaultMediaLoader);
}

export async function getStorybookProjectWebpackConfig(): Promise<webpack.Configuration | void> {
  /** @TODO (maybe) we need to have sep routines for different versions but lets not get ahead of ourselves */
  const loadConfig = getStorybookLoadConfig();
  if (loadConfig) {
    return getWebpackConfig(loadConfig);
  }

  return undefined;
}

function getOutputDir(givenOutputDir) {
  return path.isAbsolute(givenOutputDir)
    ? givenOutputDir
    : path.join(process.cwd(), givenOutputDir);
}

function replaceDefaultMediaLoader(rules: webpack.RuleSetRule[]): webpack.RuleSetRule[] {
  const defaultAssertLoaderIndex = rules.findIndex(
    rule =>
      rule.loader?.toString().includes('file-loader') &&
      rule.test?.toString().includes('svg|ico|jpg|jpeg|png|apng|gif')
  );

  // if we find storybooks default asset loader we make sure to use the url loader instead
  if (defaultAssertLoaderIndex >= 0) {
    const ruleCopy = { ...rules[defaultAssertLoaderIndex] };

    const newRules = [...rules];
    newRules.splice(defaultAssertLoaderIndex, 1, {
      ...ruleCopy,
      loader: 'url-loader', // we bundle all small assets into the js
      options: { limit: 10000, name: 'static/media/[name].[hash:8].[ext]', esModule: false },
    });
    return newRules;
  }
  return rules;
}
