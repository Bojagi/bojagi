import { EntrypointWithMetadata } from '@bojagi/types';
import getGitPath from '../../utils/getGitPath';
import { Config } from '../../config';
import { ScannedComponent } from './types';

export function getComponentsWithMetadata(
  config: Config,
  entrypointsWithMetadata: Record<string, EntrypointWithMetadata>
): ScannedComponent[] {
  return Object.entries(entrypointsWithMetadata)
    .map(([fileName, entrypoint]) => {
      const prefixPath = `${config.executionPath}/`;
      const filePath = entrypoint.filePath.replace(new RegExp(`^${prefixPath}`), '');
      const gitPath = getGitPath(filePath) as string;

      return entrypoint.components.map(({ symbol, isDefaultExport }) => ({
        symbol,
        isDefaultExport,
        filePath,
        fileName,
        gitPath,
        exportName: isDefaultExport ? 'default' : symbol,
        name: symbol,
      }));
    })
    .reduce((acc, item) => [...acc, ...item], []);
}
