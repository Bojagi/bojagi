import * as React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Component } from '@bojagi/types';
import { ComponentFile } from '../types';

export type InjectComponentMocksDeps = {
  executionPath: string;
  registerProps(filePath: string, exportName: string, props: Record<string, any>): void;
  componentsAvailable: () => boolean;
  getComponents: () => Component[];
  jest: {
    requireActual(filePath: string): Function;
    setMock(filePath: string, mock: Record<string, Function>): void;
  };
  extendedJestFn: Function;
};

const injectComponentMocksFactory = ({
  executionPath,
  registerProps,
  componentsAvailable,
  getComponents,
  jest,
  extendedJestFn,
}: InjectComponentMocksDeps) => () => {
  if (!componentsAvailable()) {
    return;
  }

  const components = getComponents();

  const componentFiles: ComponentFile[] = Array.from(
    components
      .reduce((agg, { filePath, ...component }) => {
        const entry = agg.get(filePath) || {
          filePath,
          exportNames: [],
        };
        entry.exportNames.push(component.exportName);
        agg.set(filePath, entry);

        return agg;
      }, new Map<string, ComponentFile>())
      .values()
  );

  componentFiles.forEach(file => {
    const fullFilePath = `${executionPath}/${file.filePath}`;
    const original = jest.requireActual(fullFilePath);
    const createExportFunction = (exportName: string) =>
      function(props: any, context: any) {
        const enhancedProps = Object.entries(props).reduce(
          (agg, [key, value]) => ({
            ...agg,
            [key]:
              typeof value === 'function'
                ? extendedJestFn((...args: any[]) => value(...args))
                : value,
          }),
          {}
        );
        const output = original[exportName](enhancedProps, context);

        if (React.isValidElement(output)) {
          registerProps(file.filePath, exportName, enhancedProps);
        }

        return output;
      };
    const mock = file.exportNames.reduce(
      (agg: Record<string, any>, exportName) => ({
        ...agg,
        [exportName]: createExportFunction(exportName),
      }),
      {
        __esModule: true,
      }
    );
    jest.setMock(fullFilePath, mock);
  });
};

export default injectComponentMocksFactory;
