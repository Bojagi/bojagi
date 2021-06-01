import * as pathUtils from 'path';
import composeWebpackConfig from './composeWebpackConfig';

const BASE_CONFIG_ENTRY = {
  my: 'entry',
};

const BASE_CONFIG_RESOLVE = {
  alias: {
    myResolve: 'my/special/path',
    'storybook-folder': pathUtils.resolve('configDir'),
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

const INNER_BASE_CONFIG_RULES = [
  {
    test: `${process.cwd()}/packages/cli/src/storybook/getGlobals.js`,
    use: [
      {
        loader: 'bojagi-expose-loader',
        options: {
          symbol: 'bojagiSbGlobals',
        },
      },
    ],
  },
];

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
  config: {
    webpackConfig: {
      entry: BASE_CONFIG_ENTRY,
      resolve: BASE_CONFIG_RESOLVE,
      module: BASE_CONFIG_MODULE,
      plugins: BASE_CONFIG_PLUGINS,
    },
    executionPath: '/my/project/path',
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
      expect(config.module).toEqual({
        ...BASE_CONFIG_MODULE,
        rules: [...INNER_BASE_CONFIG_RULES, ...BASE_CONFIG_MODULE.rules],
      });
      expect(config.resolveLoader.alias).toEqual({
        'component-extract-loader': `${__dirname}/componentExtractLoader`,
        'bojagi-expose-loader': `${__dirname}/exposeLoader`,
        reactDom: 'react-dom',
      });
      expect(config.output).toEqual({
        path: `${process.cwd()}/bojagi`,
        filename: '[name].js',
        publicPath: '__bojagi_public_path__/',
        globalObject: 'window',
      });

      expect(config.externals).toEqual({
        react: 'react',
        'react-dom': 'reactDom',
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
          ...INNER_BASE_CONFIG_RULES,
          ...BASE_CONFIG_MODULE.rules,
        ],
      });
    },
  },
];

testCases.forEach(testCase => {
  let getSbOptionMock;
  beforeEach(() => {
    getSbOptionMock = jest.fn(key => key);
  });

  test(`getWebpackConfig - ${testCase.name}`, () => {
    const { config, entry, decoratorPath } = testCase.input;
    const webpackConfig = composeWebpackConfig(
      config as any,
      entry,
      decoratorPath,
      getSbOptionMock
    );
    testCase.test(webpackConfig);
  });
});
