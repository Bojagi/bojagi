import * as fs from 'fs';
import * as pathUtils from 'path';
import { defaultConfig } from './defaultConfig';
import getCiSettingsFactory from './getCiSettings';
import { normaliseConfig } from './normaliseConfig';

import { getGitSettings } from './getGitSettings';
import { loadConfigFile } from './loadConfigFile';
import { Config, BaseConfig, ProvisionalConfig, CustomConfig } from './types';
import { getConfigFromStorybook } from '../storybook/getConfigFromStorybook';

export * from './types';

export const CONFIG_FILE_PRIO = [
  {
    path: pathUtils.join(process.cwd(), '.bojagirc.js'),
    fn: loadJsConfig,
  },
  {
    path: pathUtils.join(process.cwd(), '.bojagirc.json'),
    fn: loadJsonConfig,
  },
  {
    path: pathUtils.join(process.cwd(), '.bojagirc'),
    fn: loadJsonConfig,
  },
];

const getCiSettings = getCiSettingsFactory(process.env);

export const getConfig: (customConfig: Partial<CustomConfig>) => Promise<Config> = async (
  customConfig = {}
) => {
  const { configFile, configFileDirectory } = loadConfigFile({
    configFilePrio: CONFIG_FILE_PRIO,
    fs,
  });

  const provisionalConfig: ProvisionalConfig = {
    ...(await getGitSettings(configFile.executionPath || defaultConfig.executionPath)),
    ...defaultConfig,
    ...getConfigFromStorybook(defaultConfig, configFile, customConfig),
    ...configFile,
  };

  const transformedCustomConfig = ({
    ...customConfig,
  } as unknown) as BaseConfig;

  if (customConfig.staticDir) {
    transformedCustomConfig.staticDir = customConfig.staticDir.split(',');
  }

  return normaliseConfig(
    {
      ...provisionalConfig,
      ...getCiSettings(provisionalConfig),
      ...transformedCustomConfig,
    },
    configFileDirectory
  );
};

function loadJsConfig(path) {
  return require(path);
}

function loadJsonConfig(path) {
  return JSON.parse(fs.readFileSync(path).toString());
}
