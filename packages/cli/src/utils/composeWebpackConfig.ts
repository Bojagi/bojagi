import * as webpack from 'webpack';
import * as fs from 'fs';
import * as pathUtils from 'path';
import { merge } from 'webpack-merge';

const composeWebpackConfig = (
  baseConfig: webpack.Configuration,
  entry: webpack.Entry,
  executionPath: string,
  decoratorFile: string | undefined
): webpack.Configuration => {
  const { entry: baseEntry, ...baseConfigWithoutEntry } = baseConfig;
  return merge(
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
    baseConfigWithoutEntry,
    {
      entry,
      output: {
        path: `${process.cwd()}/bojagi`,
        filename: '[name].js',
        jsonpFunction: 'bojagiComponents',
        publicPath: '/uploads/files',
      },
      resolveLoader: {
        alias: {
          'component-extract-loader': `${__dirname}/componentExtractLoader`,
          'bojagi-expose-loader': pathUtils.resolve(__dirname, './exposeLoader'),
        },
      },
      externals: {
        react: 'React',
        'react-dom': 'ReactDOM',
      },
      optimization: {
        minimize: true,
        concatenateModules: false,
        splitChunks: {
          cacheGroups: {
            commons: {
              chunks: 'all',
              name: 'commons',
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
          pathUtils.join(executionPath, 'node_modules/@bojagi/cli/fakeStorybookAddons.js')
        ),
      ],
    }
  );
};

export default composeWebpackConfig;

function returnIfExists(path, continueFunction) {
  try {
    fs.accessSync(path, fs.constants.R_OK);
    return path;
  } catch (e) {
    return continueFunction();
  }
}

export function getWebpackConfigPath(executionPath) {
  return returnIfExists(`${executionPath}/webpack.config.js`, () =>
    returnIfExists(`${executionPath}/node_modules/react-scripts/config/webpack.config.js`, () => {
      return undefined;
    })
  );
}
