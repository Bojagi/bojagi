import * as fs from 'fs';
import { defaultConfig } from './defaultConfig';
import getCiSettingsFactory, { CiSettings } from './utils/getCiSettings';

import simpleGit = require('simple-git/promise');

const { PWD } = process.env;
const CONFIG_FILE_PRIO = [
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

export type CollectorTuple = [string, Record<string, any>];

export type BaseConfig = {
  componentMarker: string;
  dir: string;
  dryRun: boolean;
  webpackConfig: string;
  executionPath: string;
  decoratorPath: string;
  storyPath: string;
  uploadApiUrl: string;
  previewPort: number;
  previewDownloadUrl: string;
  collectors: (string | CollectorTuple)[];
};

export type Config = CiSettings & BaseConfig;

const getCiSettings = getCiSettingsFactory(process.env);

export const getConfig: () => Promise<Config> = async () => {
  const configFile = loadConfigFile();
  return {
    ...(await getGitSettings(configFile.executionPath || defaultConfig.executionPath)),
    ...defaultConfig,
    ...configFile,
    ...getCiSettings(),
  };
};

async function getGitSettings(executionPath: string) {
  try {
    const git = simpleGit(executionPath);
    const result = await git.log();
    return {
      commit: result.latest.hash,
    };
  } catch {
    return {};
  }
}

function loadConfigFile() {
  const foundConfigFile = CONFIG_FILE_PRIO.find(fc => fs.existsSync(fc.path));
  if (foundConfigFile) {
    return foundConfigFile.fn(foundConfigFile.path);
  }
  return {};
}

function loadJsConfig(path) {
  return require(path);
}

function loadJsonConfig(path) {
  return JSON.parse(fs.readFileSync(path).toString());
}
