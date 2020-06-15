import * as fs from 'fs';
import { defaultConfig } from './defaultConfig';
import getCiSettingsFactory from './getCiSettings';
import { normaliseConfig } from './normaliseConfig';

import { getGitSettings } from './getGitSettings';
import { loadConfigFile } from './loadConfigFile';
import { Config } from './types';

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

export const getConfig: () => Promise<Config> = async () => {
  const configFile = loadConfigFile({ configFilePrio: CONFIG_FILE_PRIO, fs });
  return normaliseConfig({
    ...(await getGitSettings(configFile.executionPath || defaultConfig.executionPath)),
    ...defaultConfig,
    ...configFile,
    ...getCiSettings(),
  });
};

function loadJsConfig(path) {
  return require(path);
}

function loadJsonConfig(path) {
  return JSON.parse(fs.readFileSync(path).toString());
}
