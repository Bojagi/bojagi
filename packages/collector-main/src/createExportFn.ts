import { addProps, createProp, getPropTypeForValue, PropValue } from '@bojagi/collector-base';
import { getPropSetName } from './propSetNameContext';

const registerProps = addProps('bojagi-main');
export function createExportFn({ filePath, exportName }) {
  return props => {
    const propSet = propsToPropSet(props);
    registerProps(filePath, exportName, propSet, getPropSetName());
    return null;
  };
}

function propsToPropSet(props: Record<string, any>) {
  return Object.entries(props)
    .map<[string, PropValue]>(([key, value]) => [
      key,
      createProp(getPropTypeForValue(value), value),
    ])
    .reduce(
      (agg, [key, value]) => ({
        ...agg,
        [key]: value,
      }),
      {}
    );
}
