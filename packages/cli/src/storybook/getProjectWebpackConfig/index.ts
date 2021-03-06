/* eslint-disable camelcase */
import webpack from 'webpack';
import * as semver from 'semver';
import { getStorybookFramework, getStorybookVersion } from '../storybookUtils';
import { getV_6_1_X_StorybookProjectWebpackConfig } from './v6.1.x';
import { getV_6_2_X_StorybookProjectWebpackConfig } from './v6.2.x';
import debuggers, { DebugNamespaces } from '../../debug';

const debug = debuggers[DebugNamespaces.STORYBOOK];

export async function getStorybookProjectWebpackConfig(): Promise<webpack.Configuration | void> {
  const framework = getStorybookFramework();
  if (framework) {
    debug(`storybook framework detected: ${framework}`);
    const version = getStorybookVersion(framework);
    debug(`storybook version: ${version}`);
    if (semver.gte(semver.coerce(version), '6.2.0')) {
      debug('version greater than 6.2.0, using V_6_2_X configuration');
      return getV_6_2_X_StorybookProjectWebpackConfig(framework);
    }
    debug('version below 6.2.0, using V_6_1_X configuration');
    return getV_6_1_X_StorybookProjectWebpackConfig(framework);
  }
  return undefined;
}
