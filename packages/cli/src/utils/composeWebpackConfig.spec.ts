import composeWebpackConfig from './composeWebpackConfig';

const BASE_CONFIG_ENTRY = {
  my: 'entry',
};

const BASE_CONFIG_RESOLVE = {
  alias: {
    myResolve: 'my/special/path',
  },
};

const BASE_CONFIG_MODULE = {
  my: 'module config',
  rules: [
    {
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      use: 'my-rule',
    },
  ],
};

const BASE_CONFIG_PLUGINS = [
  {
    my: 'plugin',
    apply: () => {},
  },
];

const BASE_ENTRY = {
  Abc: 'src/abc.bojagi.js',
  Efg: 'src/efg.bojagi.js',
};

const BASE_INPUT = {
  baseConfig: {
    entry: BASE_CONFIG_ENTRY,
    resolve: BASE_CONFIG_RESOLVE,
    module: BASE_CONFIG_MODULE,
    plugins: BASE_CONFIG_PLUGINS,
  },
  entry: BASE_ENTRY,
  decoratorPath: undefined,
};

const testCases = [
  {
    name: 'basic config',
    input: BASE_INPUT,
    test: config => {
      expect(config.entry).toEqual(BASE_ENTRY);
      expect(config.resolve).toEqual(BASE_CONFIG_RESOLVE);
      expect(config.module).toEqual(BASE_CONFIG_MODULE);
      expect(config.resolveLoader.alias).toEqual({
        'component-extract-loader': `${__dirname}/componentExtractLoader`,
        'bojagi-expose-loader': `${__dirname}/exposeLoader`,
      });
      expect(config.output).toEqual({
        path: `${process.cwd()}/bojagi`,
        filename: '[name].js',
        jsonpFunction: 'bojagiComponents',
        publicPath: '/uploads/files',
      });

      expect(config.externals).toEqual({
        react: 'React',
        'react-dom': 'ReactDOM',
      });

      // Plugins
      expect(config.plugins[1].definitions).toEqual({
        'process.env': { NODE_ENV: '"production"' },
      });
    },
  },
  {
    name: 'with decoratorPath',
    input: { ...BASE_INPUT, decoratorPath: '/my/decorator/path.jsx' },
    test: config => {
      expect(config.module).toEqual({
        my: 'module config',
        rules: [
          {
            test: '/my/decorator/path.jsx',
            use: [
              {
                loader: 'bojagi-expose-loader',
                options: {
                  symbol: 'bojagiDecorator',
                },
              },
            ],
          },
          ...BASE_CONFIG_MODULE.rules,
        ],
      });
    },
  },
];

testCases.forEach(testCase => {
  test(`getWebpackConfig - ${testCase.name}`, () => {
    const { baseConfig, entry, decoratorPath } = testCase.input;
    const config = composeWebpackConfig(baseConfig, entry, '/my/project/path', decoratorPath);
    testCase.test(config);
  });
});
