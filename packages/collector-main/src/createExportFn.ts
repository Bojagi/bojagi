import {
  createProp,
  getPropTypeForValue,
  PropValue,
  createFunctionPropValue,
} from '@bojagi/collector-base';
import { getPropSetName } from './propSetNameContext';

export function createExportFnFactory(registerProps) {
  return ({ filePath, exportName }) => props => {
    const propSet = propsToPropSet(props);
    registerProps(filePath, exportName, propSet, getPropSetName());
    return null;
  };
}

function propsToPropSet(props: Record<string, any>) {
  return Object.entries(props)
    .map<[string, PropValue]>(([key, value]) => {
      const internalValue =
        typeof value === 'function'
          ? createFunctionPropValue([], getPropTypeForValue(undefined), undefined)
          : value;
      return [key, createProp(getPropTypeForValue(value), internalValue)];
    })
    .reduce(
      (agg, [key, value]) => ({
        ...agg,
        [key]: value,
      }),
      {}
    );
}
