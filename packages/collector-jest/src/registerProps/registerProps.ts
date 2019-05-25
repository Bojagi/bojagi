import * as React from 'react';
import * as ReactDOMServer from 'react-dom/server';
import {
  PropType,
  createProp,
  createFunctionPropValue,
  PropValue,
  getPropTypeForValue
} from '@bojagi/cli';

const registerPropsFactory = ({ addProps }) => (
  filePath: string,
  exportName: string,
  props: Record<string, any>
) => {
  const propEntries = Object.entries(props);

  if (propEntries.length === 0) {
    return;
  }

  const serializedProps = propEntries.reduce((agg, [key, value]) => {
    let modifiedValue;

    if (key === 'children' && Array.isArray(value)) {
      modifiedValue = value.map(modifyValue);
    } else {
      modifiedValue = modifyValue(value);
    }

    return {
      ...agg,
      [key]: modifiedValue
    };
  }, {});

  addProps(filePath, exportName, serializedProps);
};

function modifyValue(value: any): PropValue {
  if (React.isValidElement(value)) {
    return createProp(
      PropType.HTML,
      ReactDOMServer.renderToStaticMarkup(value)
    );
  }

  if (Array.isArray(value)) {
    return createProp(PropType.ARRAY, value.map(modifyValue));
  }

  const propType = getPropTypeForValue(value);

  if (propType === PropType.FUNCTION) {
    if (!value.mock) {
      return createProp(PropType.UNKNOWN, {});
    }

    const getCall = () => {
      const modifiedValue = modifyValue(value.mock.results[0].value);
      if (!value.mock.calls[0]) {
        return {};
      }

      return createFunctionPropValue(
        value.mock.calls[0],
        modifiedValue.type,
        modifiedValue.value
      );
    }

    const fnProp = createProp(PropType.FUNCTION, getCall());

    if (value.mock.callPromise) {
      value.mock.callPromise.then(() => {
        fnProp.value = getCall();
      });
    }

    return fnProp;
  }

  return createProp(propType, value);
}

export default registerPropsFactory;
