import { createMockFileContent } from './createMockFile';

test('create multiple components', () => {
  const components = [
    {
      symbol: 'a',
      exportName: 'a',
      isDefaultExport: false,
      filePath: 'some/file/path.js',
      gitPath: 'some/file/path.js',
    },
    {
      symbol: 'b',
      exportName: 'b',
      isDefaultExport: false,
      filePath: 'some/file/path.js',
      gitPath: 'some/file/path.js',
    },
    {
      symbol: 'x',
      exportName: 'default',
      isDefaultExport: true,
      filePath: 'some/file/other.js',
      gitPath: 'some/file/other.js',
    },
  ];
  const output = createMockFileContent(components);
  expect(output).toEqual([
    [
      'some/file/path.js',
      `import {createExportFn} from '@bojagi/collector-main';

export const a = createExportFn(${JSON.stringify(components[0])});
export const b = createExportFn(${JSON.stringify(components[1])});`,
    ],
    [
      'some/file/other.js',
      `import {createExportFn} from '@bojagi/collector-main';

export default createExportFn(${JSON.stringify(components[2])});`,
    ],
  ]);
});
