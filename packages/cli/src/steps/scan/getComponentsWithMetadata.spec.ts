import { getComponentsWithMetadata } from './getComponentsWithMetadata';

jest.mock('../../utils/getGitPath', () => ({
  default: jest.fn(path => `/git/${path}`),
}));

test('Get components with metadata', () => {
  const config = {
    executionPath: '/some/path',
  };
  const entrypointsWithMetadata = {
    file1: {
      entrypoint: 'file1',
      filePath: '/some/path/some/file.ts',
      components: [
        {
          symbol: 'sym1',
          isDefaultExport: true,
        },
        {
          symbol: 'sym2',
          isDefaultExport: false,
        },
      ],
    },
    file2: {
      entrypoint: 'file1',
      filePath: '/some/path/some/feli.ts',
      components: [
        {
          symbol: 'sym3',
          isDefaultExport: false,
        },
      ],
    },
  };
  const result = getComponentsWithMetadata(config as any, entrypointsWithMetadata);
  expect(result).toEqual([
    {
      symbol: 'sym1',
      isDefaultExport: true,
      name: 'sym1',
      exportName: 'default',
      filePath: 'some/file.ts',
      gitPath: '/git/some/file.ts',
      fileName: 'file1',
    },
    {
      symbol: 'sym2',
      isDefaultExport: false,
      exportName: 'sym2',
      name: 'sym2',
      filePath: 'some/file.ts',
      gitPath: '/git/some/file.ts',
      fileName: 'file1',
    },
    {
      symbol: 'sym3',
      isDefaultExport: false,
      exportName: 'sym3',
      name: 'sym3',
      filePath: 'some/feli.ts',
      gitPath: '/git/some/feli.ts',
      fileName: 'file2',
    },
  ]);
});
