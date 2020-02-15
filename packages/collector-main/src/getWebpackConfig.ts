import * as webpack from 'webpack';
import { getMocksPath, getOutputPath } from './pathFactories';

export type GetWebpackConfigOptions = {
  executionPath: string;
  entry: string[];
  webpack: typeof webpack;
  componentPaths: string[];
  projectWebpackConfig: webpack.Configuration;
};

export const getWebpackConfig = ({ executionPath, entry, webpack, componentPaths, projectWebpackConfig }) => ({
  entry,
  output: {
    path: getOutputPath(executionPath),
    filename: '[name].js',
    libraryTarget: 'umd',
  },
  resolve: projectWebpackConfig.resolve,
  module: {
    rules: projectWebpackConfig.module.rules,
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
});
