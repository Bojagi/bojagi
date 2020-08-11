export type Framework = {
  name: 'react';
  version: string;
};

export type BojagiNamespace = {
  name: string;
  framework: Framework;
};

export type BojagiManifest = {
  version: '2';
  namespaces: BojagiNamespace[];
};

export function buildManifest(dependencies: Record<string, string>): BojagiManifest {
  return {
    version: '2',
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
