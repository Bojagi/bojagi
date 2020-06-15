import * as fileSystem from 'fs';
import { ConfigFilePrio, BaseConfig } from './types';

export type LoadConfigFileOptions = {
  configFilePrio: ConfigFilePrio[];
  fs: typeof fileSystem;
};

export function loadConfigFile({ configFilePrio, fs }: LoadConfigFileOptions): Partial<BaseConfig> {
  const foundConfigFile = configFilePrio.find(fc => fs.existsSync(fc.path));
  if (foundConfigFile) {
    return foundConfigFile.fn(foundConfigFile.path);
  }
  return {};
}
