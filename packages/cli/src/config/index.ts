import * as fs from 'fs';
import * as pathUtils from 'path';
import { defaultConfig } from './defaultConfig';
import getCiSettingsFactory from './getCiSettings';
import { normaliseConfig } from './normaliseConfig';

import { getGitSettings } from './getGitSettings';
import { loadConfigFile } from './loadConfigFile';
import { Config, BaseConfig } from './types';

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

export const getConfig: (customConfig: Partial<BaseConfig>) => Promise<Config> = async (
  customConfig = {}
) => {
  const { configFile, configFileDirectory } = loadConfigFile({
    configFilePrio: CONFIG_FILE_PRIO,
    fs,
  });
  return normaliseConfig(
    {
      ...(await getGitSettings(configFile.executionPath || defaultConfig.executionPath)),
      ...defaultConfig,
      ...configFile,
      ...getCiSettings(),
      ...customConfig,
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
