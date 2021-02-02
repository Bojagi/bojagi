import { softRequireResolve } from '../utils/softRequireResolve';
import { StorybookFramework } from './types';

const frameworkToPackageMap = {
  [StorybookFramework.REACT]: '@storybook/react',
};

const frameworkToLoadOptionsMap = {
  [StorybookFramework.REACT]: '@storybook/react/dist/server/options',
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
  return require(frameworkToLoadOptionsMap[framework]).default;
}

export function storybookIsInstalled(): boolean {
  return !!Object.keys(StorybookFramework).find(storybookFrameworkIsInstalled);
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
