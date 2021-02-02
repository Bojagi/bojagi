import { getStorybookLoadOptions } from './storybookUtils';

export function getSbOption<T>(key: string, fallback?: T) {
  const loadOptions = getStorybookLoadOptions();
  if (loadOptions) {
    const { getProdCli } = require('@storybook/core/dist/server/cli');
    const cliOptions = getProdCli(loadOptions.packageJson);

    return loadOptions[key] || cliOptions[key] || fallback;
  }
  return undefined;
}
