export type Module = {
  request?: any;
  filePath?: string;
  gitPath?: string;
  isExternal: boolean;
  isNodeModule: boolean;
  packageName?: string;
  dependencies?: Module[];
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
  fileName: string;
};

export type StoryFileWithMetadata = File & {
  fileName: string;
  filePath: string;
  gitPath: string;
  dependencies: Module[];
  files: string[];
};
