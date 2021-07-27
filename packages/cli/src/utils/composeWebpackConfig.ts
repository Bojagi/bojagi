import * as webpack from 'webpack';
import * as pathUtils from 'path';
import * as semver from 'semver';
import { merge } from 'webpack-merge';
import { Config } from '../config';

const webpackVersion = require('webpack/package.json').version;

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
        minimize: !process.env.DEBUG,
        concatenateModules: false,
        ...(semver.satisfies(semver.coerce(webpackVersion), '>=5.0.0')
          ? {
              innerGraph: false, // to prevent undefined requires in chunks
            }
          : {}),
        moduleIds: process.env.DEBUG ? 'named' : 'natural', // easier read in debug mode
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
        new webpack.optimize.LimitChunkCountPlugin({
          // if set to more, innerGraph does nothing and this issue reoccurs:
          // https://github.com/webpack/webpack/issues/11770#issuecomment-717048094
          maxChunks: 2,
        }),
      ],
    } as any
  );
};

export default composeWebpackConfig;
