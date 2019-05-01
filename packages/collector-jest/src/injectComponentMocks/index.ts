import injectComponentMocksFactory from './injectComponentMocks';
import registerProps from '../registerProps';
import { executionPath } from '../constants';
import extendedJestFn from '../extendedJestFn';
import { getComponents, componentsAvailable } from '@bojagi/cli';

export default injectComponentMocksFactory({
  executionPath,
  registerProps,
  jest,
  extendedJestFn,
  getComponents,
  componentsAvailable
});
