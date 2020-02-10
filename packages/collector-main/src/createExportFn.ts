import * as React from 'react';
import {
  createProp,
  PropType,
  getPropTypeForValue,
  PropValue,
  createFunctionPropValue,
} from '@bojagi/collector-base';
import { getPropSetName, getPropSetKey, getStoryPath } from './propSetNameContext';

export function createExportFnFactory(registerProps) {
  return ({ filePath, exportName }) => props => {
    const propSet = propsToPropSet(props);
    registerProps({
      filePath,
      exportName,
      propSet,
      name: getPropSetName(),
      propSetType: 'js',
      storyPath: getStoryPath(),
      storySymbol: getPropSetKey(),
    });
    return null;
  };
}

function propsToPropSet(props: Record<string, any>) {
  return Object.entries(props)
    .map<[string, PropValue]>(([key, value]) => {
      if (React.isValidElement(value)) {
        // TODO: This is just temporary, There should be a new react component type that includes information
        // about the passed component
        return [key, createProp(PropType.UNKNOWN, {})];
      }

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
