import getWebpackConfig from './getWebpackConfig';

const basicInput = {
  entry: {
    Abc: 'src/abc.js',
    Xyz: 'src/xyz.js',
  },
  resolve: {
    my: 'resolve config',
  },
  module: {
    my: 'module config',
  },
};

const testCases = [
  {
    name: 'basic config',
    input: basicInput,
    test: config => {
      expect(config.entry).toEqual({
        Abc: 'src/abc.js',
        Xyz: 'src/xyz.js',
      });
      expect(config.resolve).toEqual({
        my: 'resolve config',
      });
      expect(config.module).toEqual({
        my: 'module config',
      });
      expect(config.resolveLoader.alias).toEqual({
        'component-extract-loader': `${__dirname}/exposeLoader`,
      });
      expect(config.output).toEqual({
        path: `${process.cwd()}/bojagi`,
        filename: '[name].js',
        jsonpFunction: 'bojagiComponents',
      });

      expect(config.externals).toEqual({
        react: 'React',
        'react-dom': 'ReactDOM',
      });

      // Plugins
      expect(config.plugins[0].definitions).toEqual({
        'process.env': { NODE_ENV: '"production"' },
      });
    },
  },
];

testCases.forEach(testCase => {
  test(`getWebpackConfig - ${testCase.name}`, () => {
    const { entry, resolve, module } = testCase.input;
    const config = getWebpackConfig(entry, resolve, module as any);
    testCase.test(config);
  });
});
