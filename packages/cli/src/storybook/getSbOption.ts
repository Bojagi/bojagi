export function getSbOption<T>(key: string, fallback?: T) {
  try {
    const loadOptions = require('@storybook/react/dist/server/options').default;

    const { getProdCli } = require('@storybook/core/dist/server/cli');
    const cliOptions = getProdCli(loadOptions.packageJson);

    return loadOptions[key] || cliOptions[key] || fallback;
  } catch {
    return undefined;
  }
}
