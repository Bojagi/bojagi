import * as webpackTypes from 'webpack';
import { getMocksPath, getOutputPath } from './pathFactories';

export type GetWebpackConfigOptions = {
  executionPath: string;
  entry: string[];
  webpack: typeof webpackTypes;
  componentPaths: string[];
  projectWebpackConfig: webpackTypes.Configuration;
};

function buildProjectWebpackConfig(projectWebpackConfig) {
  return typeof projectWebpackConfig === 'function'
    ? projectWebpackConfig({ env: 'production' }, {}) // TODO read from args etc
    : projectWebpackConfig;
}
export const getWebpackConfig = ({
  executionPath,
  entry,
  webpack,
  componentPaths,
  projectWebpackConfig,
}) => {
  const processedWebpackConfig = buildProjectWebpackConfig(projectWebpackConfig);
  return {
    entry,
    output: {
      path: getOutputPath(executionPath),
      filename: '[name].js',
      libraryTarget: 'umd',
    },
    resolve: processedWebpackConfig.resolve,
    module: {
      rules: processedWebpackConfig.module.rules,
    },
    externals: {
      '@bojagi/collector-main': '@bojagi/collector-main',
      react: 'react',
    },
    mode: 'development',
    plugins: [
      ...componentPaths.map(
        path =>
          new webpack.NormalModuleReplacementPlugin(
            new RegExp(path.replace(/\./g, '\\.').replace(/\//g, '\\/')),
            getMocksPath(executionPath, path.replace(/\//g, '__'))
          )
      ),
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify('production'),
        },
      }),
    ],
  };
};
