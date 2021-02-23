import webpack from 'webpack';

export function replaceDefaultMediaLoader(rules: webpack.RuleSetRule[]): webpack.RuleSetRule[] {
  const defaultAssertLoaderIndex = rules.findIndex(
    rule =>
      rule.loader?.toString().includes('file-loader') &&
      rule.test?.toString().includes('svg|ico|jpg|jpeg|png|apng|gif')
  );

  // if we find storybooks default asset loader we make sure to use the url loader instead
  if (defaultAssertLoaderIndex >= 0) {
    const ruleCopy = { ...rules[defaultAssertLoaderIndex] };

    const newRules = [...rules];
    newRules.splice(defaultAssertLoaderIndex, 1, {
      ...ruleCopy,
      loader: 'url-loader', // we bundle all small assets into the js
      options: { limit: 10000, name: 'static/media/[name].[hash:8].[ext]', esModule: false },
    });
    return newRules;
  }
  return rules;
}
