import withDefaultArguments from './withDefaultArguments';
import defaultConfig from '../defaultConfig';

test('add default arguments when there are no arguments added', () => {
  const action = ({ componentMarker, dir, executionPath, webpackConfig }) => {
    expect(componentMarker).toBe(defaultConfig.componentMarker);
    expect(dir).toBe(defaultConfig.dir);
    expect(executionPath).toBe(process.cwd());
    expect(webpackConfig).toBe(undefined);
  };
  withDefaultArguments(action)({});
});

test('add only default argument when argument is not set', () => {
  const action = ({ componentMarker, markerPrefix, dir }) => {
    expect(componentMarker).toBe(defaultConfig.componentMarker);
    expect(dir).toBe('dist');
  };
  withDefaultArguments(action)({
    dir: 'dist'
  });
});
