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
    rules: [],
  },
  decoratorPath: undefined,
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
        rules: [],
      });
      expect(config.resolveLoader.alias).toEqual({
        'component-extract-loader': `${__dirname}/componentExtractLoader`,
        'expose-loader': `${__dirname}/exposeLoader`,
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
  {
    name: 'with decoratorPath',
    input: { ...basicInput, decoratorPath: '/my/decorator/path.jsx' },
    test: config => {
      expect(config.module).toEqual({
        my: 'module config',
        rules: [{
          test: '/my/decorator/path.jsx',
          use: [{
            loader: 'expose-loader',
            options: 'bojagiDecorator',
          }],
        }],
      });
    },
  },
  {
    name: 'with decoratorPath and existing rules (prepend decorator rule)',
    input: { 
      ...basicInput,
      module: {
        my: 'module config',
        rules: [{ existing: 'rule' }],
      },
      decoratorPath: '/my/decorator/path.jsx'
    },
    test: config => {
      expect(config.module).toEqual({
        my: 'module config',
        rules: [
          {
            test: '/my/decorator/path.jsx',
            use: [{
              loader: 'expose-loader',
              options: 'bojagiDecorator',
            }],
          },
          { existing: 'rule' },
        ],
      });
    },
  },
];

testCases.forEach(testCase => {
  test(`getWebpackConfig - ${testCase.name}`, () => {
    const { entry, resolve, module, decoratorPath } = testCase.input;
    const config = getWebpackConfig(entry, resolve, module as any, '/my/project/path', decoratorPath);
    testCase.test(config);
  });
});
