import * as webpack from 'webpack';
import * as fs from 'fs';

const getWebpackConfig = (entry: object, resolve: object, module: object) => ({
  entry,
  output: {
    path: `${process.cwd()}/bojagi`,
    filename: '[name].js',
    jsonpFunction: 'bojagiComponents'
  },
  resolveLoader: {
    alias: {
      'component-extract-loader': `${__dirname}/exposeLoader`
    }
  },
  resolve,
  module,
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM'
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'commons',
      minChunks: module =>
        Object.keys(entry).reduce(
          (bool, ep) =>
            bool && !!module.resource && !module.resource.includes(ep),
          true
        )
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin()
  ]
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
    returnIfExists(
      `${executionPath}/node_modules/react-scripts/config/webpack.config.js`,
      () => {
        return undefined
      }
    )
  );
}
