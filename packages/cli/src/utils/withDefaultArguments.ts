import defaultConfig from '../defaultConfig';
import { getWebpackConfigPath } from './getWebpackConfig';

const withDefaultArguments = action => args => {
  const defaultedArgs = Object.assign({}, defaultConfig, args, {
    webpackConfig:
      args.webpackConfig || getWebpackConfigPath(defaultConfig.executionPath)
  });
  return action(defaultedArgs);
};

export default withDefaultArguments;
