import { getDependencies, getDependenciesForFilePath } from './dependencies';
import { compilationDependencies, webpackCompilationOutput } from './__test__/compilationOutput';

describe.each([
  [4, webpackCompilationOutput(4).modules, webpackCompilationOutput(4).moduleGraph.getModule],
  [5, webpackCompilationOutput(5).modules, webpackCompilationOutput(5).moduleGraph.getModule],
])('Webpack version %s', (_webpackMajorVersion, modules, getModule) => {
  describe('getDependencies', () => {
    test('get a map of all dependencies used', () => {
      expect(
        getDependencies({
          dependencyPackages: [
            'react',
            '@material-ui/icons',
            'styled-components',
            'foreignNodeModules',
          ],
          getModule,
          modules,
          projectGitPath: `${process.cwd()}`,
        })
      ).toEqual(compilationDependencies());
    });
  });
});

describe('getDependenciesForFilePath', () => {
  let modules;

  beforeEach(() => {
    modules = [
      {
        filePath: 'unimportantFile',
        dependencies: ['a', 'b'],
      },
      {
        filePath: './prefixedFile',
        dependencies: ['c', 'd'],
      },
      {
        filePath: 'nonPrefixedFile',
        dependencies: ['e', 'f'],
      },
    ];
  });

  test('find module with leading "./"', () => {
    const result = getDependenciesForFilePath(modules, './prefixedFile');
    expect(result).toEqual(['c', 'd']);
  });
  test('find module without leading "./"', () => {
    const result = getDependenciesForFilePath(modules, './nonPrefixedFile');
    expect(result).toEqual(['e', 'f']);
  });
  test('return empty array if module was not found', () => {
    const result = getDependenciesForFilePath(modules, './otherFile');
    expect(result).toEqual([]);
  });
});
