import defaultConfig from '../defaultConfig';
import getCiSettingsFactory from './getCiSettings';

const getCiSettings = getCiSettingsFactory(process.env);

const withDefaultArguments = action => args => {
  const defaultedArgs = Object.assign({}, getCiSettings(), defaultConfig, args);
  return action(defaultedArgs);
};

export default withDefaultArguments;
