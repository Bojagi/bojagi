import * as webpack from 'webpack';
import * as pathUtils from 'path';
import { merge } from 'webpack-merge';
import { Config } from '../config';

const BLACKLISTED_PLUGINS = ['ManifestPlugin'];

const composeWebpackConfig = (
  config: Config,
  entry: webpack.Entry,
  decoratorFile: string | undefined,
  getSbOption: <T>(key: string, fallbackValue: T) => T,
  publicPath: string = '__bojagi_public_path__/'
): webpack.Configuration => {
  const { entry: baseEntry, plugins, ...baseConfigWithoutEntry } = config.webpackConfig;
  const filteredPlugins = plugins?.filter(
    plugin => !BLACKLISTED_PLUGINS.includes(plugin.constructor?.name)
  );

  return merge(
    // Bojagi decorator
    {
      module: {
        rules: decoratorFile
          ? [
              {
                test: pathUtils.resolve(config.executionPath, decoratorFile),
                use: [
                  {
                    loader: `bojagi-expose-loader`,
                    options: {
                      symbol: 'bojagiDecorator',
                    },
                  },
                ],
              },
            ]
          : [],
      },
    },
    // Get Globals
    {
      module: {
        rules: [
          {
            test: pathUtils.resolve(__dirname, '../storybook/getGlobals.js'),
            use: [
              {
                loader: `bojagi-expose-loader`,
                options: {
                  symbol: 'bojagiSbGlobals',
                },
              },
            ],
          },
          {
            test: pathUtils.resolve(__dirname, '../storybook/getParameters.js'),
            use: [
              {
                loader: `bojagi-expose-loader`,
                options: {
                  symbol: 'bojagiSbParameters',
                },
              },
            ],
          },
        ],
      },
    },
    {
      ...baseConfigWithoutEntry,
      plugins: filteredPlugins,
    },
    {
      entry,
      output: {
        path: pathUtils.join(process.cwd(), 'bojagi'),
        filename: '[name].js',
        publicPath,
        globalObject: 'window',
      },
      resolve: {
        alias: {
          'storybook-folder': pathUtils.resolve(
            getSbOption('configDir', config.storybookConfig) || ''
          ),
        },
      },
      resolveLoader: {
        alias: {
          'component-extract-loader': pathUtils.resolve(__dirname, 'componentExtractLoader'),
          'bojagi-expose-loader': pathUtils.resolve(__dirname, 'exposeLoader'),
          reactDom: 'react-dom',
        },
      },
      externals: {
        react: 'react',
        'react-dom': 'reactDom',
      },
      optimization: {
        minimize: true,
        concatenateModules: false,
        splitChunks: {
          cacheGroups: {
            vendors: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
            },
          },
        },
      },
      plugins: [
        new webpack.NormalModuleReplacementPlugin(
          /@storybook\/addons$/,
          require.resolve('@bojagi/cli/fakeStorybookAddons.js')
        ),
        new webpack.NormalModuleReplacementPlugin(
          /@storybook\/react$/,
          require.resolve('@bojagi/cli/fakeStorybookReact.js')
        ),
      ],
    }
  );
};

export default composeWebpackConfig;
