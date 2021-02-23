/* eslint-disable camelcase */
import webpack from 'webpack';
import * as semver from 'semver';
import { getStorybookFramework, getStorybookVersion } from '../storybookUtils';
import { getV_6_1_X_StorybookProjectWebpackConfig } from './v6.1.x';
import { getV_6_2_X_StorybookProjectWebpackConfig } from './v6.2.x';

export async function getStorybookProjectWebpackConfig(): Promise<webpack.Configuration | void> {
  const framework = getStorybookFramework();
  if (framework) {
    const version = getStorybookVersion(framework);
    if (semver.gte(version, '6.2.0')) {
      return getV_6_2_X_StorybookProjectWebpackConfig(framework);
    }
    return getV_6_1_X_StorybookProjectWebpackConfig(framework);
  }
  return undefined;
}
