import * as webpack from 'webpack';
import * as fs from 'fs';

const getWebpackConfig = (
  entry: webpack.Entry,
  resolve: object,
  module: webpack.Module
): webpack.Configuration => ({
  entry,
  output: {
    path: `${process.cwd()}/bojagi`,
    filename: '[name].js',
    jsonpFunction: 'bojagiComponents',
  },
  resolveLoader: {
    alias: {
      'component-extract-loader': `${__dirname}/exposeLoader`,
    },
  },
  resolve,
  module,
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM',
  },
  optimization: {
    minimize: true,
    splitChunks: {
      cacheGroups: {
        commons: {
          chunks: 'all',
          name: 'commons',
          test: m =>
            Object.keys(entry).reduce(
              (bool, ep) => bool && !!m.resource && !m.resource.includes(ep),
              true
            ),
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
  ],
});

export default getWebpackConfig;

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
