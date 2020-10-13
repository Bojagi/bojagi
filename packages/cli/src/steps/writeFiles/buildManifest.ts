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
  namespaces: BojagiNamespace[];
};

export function buildManifest(dependencies: Record<string, string>): BojagiManifest {
  return {
    version: MANIFEST_VERSION,
    namespaces: [
      {
        name: 'default',
        framework: {
          name: 'react',
          version: dependencies.react,
        },
      },
    ],
  };
}
