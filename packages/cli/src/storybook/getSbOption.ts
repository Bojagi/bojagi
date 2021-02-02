import { getStorybookLoadOptions } from './storybookUtils';

export function getSbCliOptions() {
  /** @TODO support and map storybook cli options like config-dir etc */
  return {
    previewUrl: null, // map to --storybook-preview-url
    docs: null, // map to --storybook-docs
  };
}

export function getSbOption<T>(key: string, fallback?: T) {
  const loadOptions = getStorybookLoadOptions();
  if (loadOptions) {
    const cliOptions = getSbCliOptions();

    return loadOptions[key] || cliOptions[key] || fallback;
  }
  return undefined;
}
