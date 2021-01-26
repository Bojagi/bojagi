import { storybookIsInstalled } from './storybookUtils';
import { StorybookFramework } from './types';

import webpack = require('webpack');
const path = require('path');

async function getWebpackConfig(loadOptions) {
  // we have to load all those libs dynamically as they are all optional
  const loadConfig = require('@storybook/core/dist/server/config').default;
  const { getProdCli } = require('@storybook/core/dist/server/cli');

  const cliOptions = getProdCli(loadOptions.packageJson);
  return loadConfig({
    ...loadOptions,
    ...cliOptions,
    configType: 'PRODUCTION',
    outputDir: getOutputDir(loadOptions.outputDir || cliOptions.outputDir || './storybook-static'),
    configDir: loadOptions.configDir || cliOptions.configDir || './.storybook',
    ignorePreview: !!cliOptions.previewUrl,
    docsMode: !!cliOptions.docs,
    corePresets: [require.resolve('@storybook/core/dist/server/preview/preview-preset.js')],
    overridePresets: [
      require.resolve('@storybook/core/dist/server/preview/custom-webpack-preset.js'),
    ],
  });
  /** @TODO filter storybook based caches and rules */
}

async function getStorybookReactWebpackConfig() {
  return getWebpackConfig(require('@storybook/react/dist/server/options').default);
}

function getOutputDir(givenOutputDir) {
  return path.isAbsolute(givenOutputDir)
    ? givenOutputDir
    : path.join(process.cwd(), givenOutputDir);
}

export async function getStorybookProjectWebpackConfig(): Promise<webpack.Configuration | void> {
  if (storybookIsInstalled(StorybookFramework.REACT)) {
    /** @TODO (maybe) we need to have sep routines for different versions but lets not get ahead of ourselves */
    return getStorybookReactWebpackConfig();
  }

  return undefined;
}
