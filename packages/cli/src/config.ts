import * as fs from 'fs';
import defaultConfig from './defaultConfig';

const { PWD } = process.env;
const CONFIG_FILE_PRIO = [
  {
    path: `${PWD}/.bojagirc.js`,
    fn: loadJsConfig
  },
  {
    path: `${PWD}/.bojagirc.json`,
    fn: loadJsonConfig
  },
  {
    path: `${PWD}/.bojagirc`,
    fn: loadJsonConfig
  }
];

export type Config = {
  componentMarker: string;
  dir: string;
  webpackConfig: string;
  executionPath: string;
  uploadApiUrl: string;
};

const config: Config = {
  ...defaultConfig,
  ...loadConfigFile()
};

export default config;

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
