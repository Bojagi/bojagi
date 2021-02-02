import * as webpack from 'webpack';
import * as pathUtils from 'path';
import { mergeWithCustomize, unique } from 'webpack-merge';

const BLACKLISTED_PLUGINS = ['ManifestPlugin'];

const composeWebpackConfig = (
  baseConfig: webpack.Configuration,
  entry: webpack.Entry,
  executionPath: string,
  decoratorFile: string | undefined,
  getSbOption: <T>(key: string, fallbackValue: T) => T,
  publicPath: string = '__bojagi_public_path__/'
): webpack.Configuration => {
  const { entry: baseEntry, plugins, ...baseConfigWithoutEntry } = baseConfig;
  const filteredPlugins = plugins?.filter(
    plugin => !BLACKLISTED_PLUGINS.includes(plugin.constructor?.name)
  );

  return mergeWithCustomize({
    customizeArray: unique(
      'plugins',
      ['DefinePlugin'],
      plugin => plugin.constructor && plugin.constructor.name
    ),
  })(
    // Bojagi decorator
    {
      module: {
        rules: decoratorFile
          ? [
              {
                test: pathUtils.resolve(executionPath, decoratorFile),
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
          'storybook-folder': pathUtils.resolve(getSbOption('configDir', './.storybook') || ''),
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
        new webpack.DefinePlugin({
          'process.env': {
            NODE_ENV: JSON.stringify('production'),
          },
        }),
        new webpack.NormalModuleReplacementPlugin(
          /@storybook\/addons/,
          require.resolve('@bojagi/cli/fakeStorybookAddons.js')
        ),
        new webpack.NormalModuleReplacementPlugin(
          /@storybook\/react/,
          require.resolve('@bojagi/cli/fakeStorybookReact.js')
        ),
      ],
    }
  );
};

export default composeWebpackConfig;
