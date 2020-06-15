import * as fs from 'fs';
import { defaultConfig } from './defaultConfig';
import getCiSettingsFactory from './getCiSettings';
import { normaliseConfig } from './normaliseConfig';

import { getGitSettings } from './getGitSettings';
import { loadConfigFile } from './loadConfigFile';
import { Config, BaseConfig } from './types';

export * from './types';

const { PWD } = process.env;
export const CONFIG_FILE_PRIO = [
  {
    path: `${PWD}/.bojagirc.js`,
    fn: loadJsConfig,
  },
  {
    path: `${PWD}/.bojagirc.json`,
    fn: loadJsonConfig,
  },
  {
    path: `${PWD}/.bojagirc`,
    fn: loadJsonConfig,
  },
];

const getCiSettings = getCiSettingsFactory(process.env);

export const getConfig: (customConfig: Partial<BaseConfig>) => Promise<Config> = async (
  customConfig = {}
) => {
  console.log('XXXXXXXXXX');

  const configFile = loadConfigFile({ configFilePrio: CONFIG_FILE_PRIO, fs });
  console.log('get me', defaultConfig);

  return normaliseConfig({
    ...(await getGitSettings(configFile.executionPath || defaultConfig.executionPath)),
    ...defaultConfig,
    ...configFile,
    ...getCiSettings(),
    ...customConfig,
  });
};

function loadJsConfig(path) {
  return require(path);
}

function loadJsonConfig(path) {
  return JSON.parse(fs.readFileSync(path).toString());
}
