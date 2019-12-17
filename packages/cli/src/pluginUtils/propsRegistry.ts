import { creatFilePropsKey, createFilePropList } from './createFilePropList';

export const propsRegistry = new Map();

export type AddPropsFn = (
  filePath: string,
  exportName: string,
  propSet: Record<string, any>
) => void;

export const addProps = (generatorName: string): AddPropsFn => (filePath, exportName, propSet) => {
  const key = creatFilePropsKey(filePath, exportName);
  const entry = propsRegistry.get(key) || createFilePropList(filePath, exportName);

  entry.props.push({ propSet, createdBy: generatorName });

  propsRegistry.set(key, entry);
};
