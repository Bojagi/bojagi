import * as webpack from 'webpack';
import * as fs from 'fs';
import * as pathUtils from 'path';

const getWebpackConfig = (
  entry: webpack.Entry,
  resolve: object,
  module: webpack.Module,
  executionPath: string,
  decoratorFile?: string
): webpack.Configuration => {
  const rules = [...module.rules];
  if (decoratorFile) {
    // Needs to be prepended because otherwise the babel loader wouldn't have run before
    rules.unshift({
      test: pathUtils.resolve(executionPath, decoratorFile),
      use: [
        {
          loader: `expose-loader`,
          options: 'bojagiDecorator',
        },
      ],
    });
  }

  return {
    entry,
    output: {
      path: `${process.cwd()}/bojagi`,
      filename: '[name].js',
      jsonpFunction: 'bojagiComponents',
    },
    resolveLoader: {
      alias: {
        'component-extract-loader': `${__dirname}/componentExtractLoader`,
        'expose-loader': pathUtils.resolve(__dirname, './exposeLoader'),
      },
    },
    resolve,
    module: {
      ...module,
      rules,
    },
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
  };
};

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
