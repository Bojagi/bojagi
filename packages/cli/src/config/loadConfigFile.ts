import * as fileSystem from 'fs';
import * as path from 'path';
import { ConfigFilePrio, BaseConfig } from './types';

export type LoadConfigFileOptions = {
  configFilePrio: ConfigFilePrio[];
  fs: typeof fileSystem;
};

export type LoadConfigFile = {
  configFile: Partial<BaseConfig>;
  configFilePath?: string;
  configFileDirectory: string;
};

export function loadConfigFile({ configFilePrio, fs }: LoadConfigFileOptions): LoadConfigFile {
  const foundConfigFile = configFilePrio.find(fc => fs.existsSync(fc.path));
  if (foundConfigFile) {
    return {
      configFile: foundConfigFile.fn(foundConfigFile.path),
      configFilePath: foundConfigFile.path,
      configFileDirectory: path.dirname(foundConfigFile.path),
    };
  }
  return {
    configFile: {},
    configFileDirectory: process.cwd(),
  };
}
