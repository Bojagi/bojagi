import { getComponents, componentsAvailable } from '@bojagi/collector-base';
import injectComponentMocksFactory from './injectComponentMocks';
import registerProps from '../registerProps';
import { executionPath } from '../constants';
import extendedJestFn from '../extendedJestFn';

export default injectComponentMocksFactory({
  executionPath,
  registerProps,
  jest,
  extendedJestFn,
  getComponents,
  componentsAvailable,
});
