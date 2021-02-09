import * as path from 'path';
import * as fs from 'fs';

import { BaseConfig } from '../config';
import { getSbOption } from './getSbOption';
import { storybookIsInstalled } from './storybookUtils';
import { ValidationError } from '../errors';

export function getConfigFromStorybook(): Partial<BaseConfig> {
  if (!storybookIsInstalled()) {
    return {};
  }

  const configDir = getSbOption('configDir', './.storybook');
  const configFile = path.resolve(configDir, 'main.js');

  if (!fs.existsSync(configFile)) {
    // some older storybook setups dont use a config file
    // TODO throw unsupported storybook version
    throw new ValidationError(getErrorMsg(configFile));
  }

  const sbConfig = require(configFile);

  const storyPath = sbConfig.stories.map(p => p.replace(/^\.\.\//, ''));

  return {
    storyPath,
  };
}

function getErrorMsg(configFilePath) {
  return `No storybook main.js file found. 
  ${configFilePath} is missing.
If you are using an old storybook configuration without a main.js file you must upgrade first.`;
}
