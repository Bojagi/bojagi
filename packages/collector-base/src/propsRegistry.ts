import { creatFilePropsKey, createFilePropList } from './createFilePropList';

export const propsRegistry = new Map();

export type PropSetType = 'json' | 'js';

export type AddPropsFnOptions = {
  filePath: string;
  exportName: string;
  propSet: Record<string, any>;
  propSetType?: PropSetType;
  storySymbol?: string;
  storyPath?: string;
  name?: string;
};

export type AddPropsFn = (options: AddPropsFnOptions) => void;

export const addProps = (generatorName: string): AddPropsFn => ({
  filePath,
  exportName,
  propSet,
  name,
  propSetType = 'json',
  storyPath,
  storySymbol,
}) => {
  const key = creatFilePropsKey(filePath, exportName);
  const entry = propsRegistry.get(key) || createFilePropList(filePath, exportName);

  entry.props.push({ propSet, createdBy: generatorName, name, propSetType, storyPath, storySymbol });

  propsRegistry.set(key, entry);
};
