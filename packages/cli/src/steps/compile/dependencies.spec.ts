import { getDependencies } from './dependencies';
import { compilationDependencies, webpackCompilationOutput } from './__test__/compilationOutput';
import getGitPath from '../../utils/getGitPath';

jest.mock('../../utils/getGitPath');

(getGitPath as any).mockImplementation(resource => `gitpath/${resource}`);

describe.each([[4], [5]])('Webpack version %s', webpackMajorVersion => {
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
          modules: webpackCompilationOutput().modules,
          webpackMajorVersion,
        })
      ).toEqual(compilationDependencies());
    });
  });
});
