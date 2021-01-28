import { softRequireResolve } from '../utils/softRequireResolve';
import { StorybookFramework } from './types';

const frameworkToPackageMap = {
  [StorybookFramework.REACT]: '@storybook/react',
};

export function storybookIsInstalled(framework: StorybookFramework): boolean {
  if (softRequireResolve(frameworkToPackageMap[framework])) {
    return true;
  }
  return false;
}

export function getStorybookVersion(framework: StorybookFramework): string {
  return require(`${frameworkToPackageMap[framework]}/package.json`).version;
}
