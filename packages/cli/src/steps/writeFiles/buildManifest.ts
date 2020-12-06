import * as path from 'path';
import { MANIFEST_VERSION } from '../../constants';

export type Framework = {
  name: 'react';
  version: string;
};

export type BojagiNamespace = {
  name: string;
  framework: Framework;
};

export type BojagiManifest = {
  version: '3';
  pathSeparator: string;
  namespaces: BojagiNamespace[];
};

export function buildManifest(reactVersion: string): BojagiManifest {
  return {
    version: MANIFEST_VERSION,
    pathSeparator: path.sep,
    namespaces: [
      {
        name: 'default',
        framework: {
          name: 'react',
          version: reactVersion,
        },
      },
    ],
  };
}
