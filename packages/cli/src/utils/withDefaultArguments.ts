import config from '../config';
import getCiSettingsFactory from './getCiSettings';

const getCiSettings = getCiSettingsFactory(process.env);

const withDefaultArguments = action => args => {
  const defaultedArgs = Object.assign({}, getCiSettings(), config, args);
  return action(defaultedArgs);
};

export default withDefaultArguments;
