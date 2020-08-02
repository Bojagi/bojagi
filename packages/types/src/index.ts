export type Component = {
  filePath: string;
  gitPath: string;
  exportName: string;
  props: Record<string, any>[];
};

export type Module = {
  request: string;
  filePath?: string;
  gitPath?: string;
  isExternal: boolean;
  isNodeModule: boolean;
  packageName?: string;
  dependencies?: Module[];
};

export type ComponentExportDescription = {
  symbol: string;
  isDefaultExport: boolean;
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
};

export type OutputFileContent<T> = T & {
  outputFilePath: string;
};

export type FileContent = {
  fileContent: string;
  name: string;
};

export type ComponentContent = {
  folder: string;
  fileContent: string;
};

export type StoryFileWithMetadata = File & {
  fileContent: string;
  fileName: string;
  filePath: string;
  gitPath: string;
};
