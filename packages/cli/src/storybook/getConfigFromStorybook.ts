import * as path from 'path';
import { BaseConfig } from '../config';
import { getSbOption } from './getSbOption';
import { storybookIsInstalled } from './storybookUtils';

export function getConfigFromStorybook(): Partial<BaseConfig> {
  if (!storybookIsInstalled()) {
    return {};
  }

  const configDir = getSbOption('configDir', './.storybook');
  const sbConfig = require(path.resolve(configDir, 'main.js'));

  const storyPath = sbConfig.stories.map(p => p.replace(/^\.\.\//, ''));

  return {
    storyPath,
  };
}
