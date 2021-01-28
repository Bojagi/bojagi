import webpack = require('webpack');

export function replaceWebpackRules(
  webpackConfig: webpack.Configuration,
  cb: (rules: webpack.RuleSetRule[]) => webpack.RuleSetRule[]
): webpack.Configuration {
  if (webpackConfig.module?.rules) {
    return {
      ...webpackConfig,
      module: {
        ...webpackConfig.module,
        rules: cb(webpackConfig.module?.rules),
      },
    };
  }
  return webpackConfig;
}
