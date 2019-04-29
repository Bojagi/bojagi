import defaultConfig from '../defaultConfig';

const withDefaultArguments = action => args => {
  const defaultedArgs = Object.assign({}, defaultConfig, args);
  return action(defaultedArgs);
};

export default withDefaultArguments;
