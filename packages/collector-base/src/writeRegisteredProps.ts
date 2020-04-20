import { writeProps } from './writeProps';
import { ComponentPropsInfo } from './propsRegistry';

export type WriteRegisteredPropsFactoryDeps = {
  propsRegistry: Map<string, ComponentPropsInfo>;
};

const writeRegisteredPropsFactory = ({ propsRegistry }: WriteRegisteredPropsFactoryDeps) => () => {
  const components = Array.from(propsRegistry.values());

  return Promise.all(
    components.map(({ exportName, filePath, props }) => writeProps({ exportName, filePath, props }))
  );
};

export default writeRegisteredPropsFactory;
