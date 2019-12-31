export const getWebpackConfig = ({ executionPath, entry, webpack, componentPaths }) => ({
  entry,
  output: {
    path: `${executionPath}/.bojagi/tmp/collector/main/output`,
    filename: '[name].js',
    libraryTarget: 'umd',
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
      },
    ],
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
          new RegExp(path.replace(/\./g, '.').replace(/\//g, '/')),
          `${executionPath}/.bojagi/tmp/collector/main/mocks/${path.replace(/\//g, '__')}`
        )
    ),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
  ],
});
