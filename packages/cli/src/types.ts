export type Module = {
  request?: any;
  filePath?: string;
  gitPath?: string;
  isExternal: boolean;
  isNodeModule: boolean;
  isCircularImport: boolean;
  packageName?: string;
  dependencies?: Module[];
};

export type ForeignDependency = {
  id: string;
  isExternal: boolean;
  isNodeModule: true;
  packageName: string;
  dependencies: DependencyReference[];
};

export type LocalDependency = {
  id: string;
  filePath: string;
  gitPath?: string;
  isExternal: boolean;
  isNodeModule: false;
  dependencies: DependencyReference[];
};

export type Dependency = ForeignDependency | LocalDependency;

export type DependencyReference = {
  request?: string;
  dependency: string;
};

export type StoryWithMetadata = {
  entrypoint: string;
  name: string;
  filePath: string;
  fileName: string;
  gitPath: string;
};

export type File = {
  name: string;
  namespace: string;
};

export type OutputFileContent<T> = T & {
  outputFilePath: string;
  fullOutputFilePath: string;
};

export type FileContent = {
  fileContent: string;
  namespace: string;
  outputFilePath: string;
  name: string;
};

export type StoryFileWithMetadata = File & {
  fileName: string;
  filePath: string;
  gitPath: string;
  files: string[];
  dependencies: DependencyReference[];
};
