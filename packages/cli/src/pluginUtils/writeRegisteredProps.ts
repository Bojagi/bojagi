import { Component } from '../types';
import { writeProps } from './writeProps';

export type WriteRegisteredPropsFactoryDeps = {
  propsRegistry: Map<string, Component>;
};

const writeRegisteredPropsFactory = ({
  propsRegistry
}: WriteRegisteredPropsFactoryDeps) => () => {
  const components = Array.from(propsRegistry.values());

  components.forEach(({ exportName, filePath, props }) => {
    writeProps({ exportName, filePath, props });
  });
};

export default writeRegisteredPropsFactory;
