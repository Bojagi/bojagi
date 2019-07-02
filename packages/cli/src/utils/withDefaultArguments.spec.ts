import withDefaultArguments from './withDefaultArguments';
import defaultConfig from '../defaultConfig';

test('add default arguments when there are no arguments added', () => {
  const action = ({
    marker,
    markerPrefix,
    dir,
    executionPath,
    webpackConfig
  }) => {
    expect(marker).toBe(defaultConfig.marker);
    expect(markerPrefix).toBe(defaultConfig.markerPrefix);
    expect(dir).toBe(defaultConfig.dir);
    expect(executionPath).toBe(process.cwd());
    expect(webpackConfig).toBe(undefined);
  };
  withDefaultArguments(action)({});
});

test('add only default argument when argument is not set', () => {
  const action = ({ marker, markerPrefix, dir }) => {
    expect(marker).toBe(defaultConfig.marker);
    expect(markerPrefix).toBe('&');
    expect(dir).toBe('dist');
  };
  withDefaultArguments(action)({
    markerPrefix: '&',
    dir: 'dist'
  });
});
