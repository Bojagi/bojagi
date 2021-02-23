import { requireFromPaths, softRequireResolve } from '../utils/requireUtils';
import { StorybookFramework } from './types';

const frameworkToPackageMap = {
  [StorybookFramework.REACT]: '@storybook/react',
};

const frameworkToLoadOptionsMap = {
  [StorybookFramework.REACT]: [
    '@storybook/react/dist/server/options',
    '@storybook/react/dist/cjs/server/options',
  ],
};

export function getStorybookLoadOptions() {
  const foundSbFramework = Object.keys(StorybookFramework).find(
    storybookFrameworkIsInstalled
  ) as StorybookFramework;

  if (!foundSbFramework) {
    return undefined;
  }

  return getStorybookFrameworkLoadOptions(foundSbFramework);
}

export function getStorybookFrameworkLoadOptions(framework: StorybookFramework) {
  const possibleImports = frameworkToLoadOptionsMap[framework];

  return requireFromPaths<any>(possibleImports).default;
}

export function getStorybookFramework(): StorybookFramework | undefined {
  const sbFrameworkKey = Object.keys(StorybookFramework).find(storybookFrameworkIsInstalled);
  if (sbFrameworkKey) {
    return StorybookFramework[sbFrameworkKey];
  }
  return undefined;
}

export function storybookIsInstalled(): boolean {
  return !!getStorybookFramework();
}

export function storybookFrameworkIsInstalled(framework: StorybookFramework): boolean {
  if (softRequireResolve(frameworkToPackageMap[framework])) {
    return true;
  }
  return false;
}

export function getStorybookVersion(framework: StorybookFramework): string {
  return require(`${frameworkToPackageMap[framework]}/package.json`).version;
}
