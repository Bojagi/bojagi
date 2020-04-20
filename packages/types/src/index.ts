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

export type EntrypointWithMetadata = {
  entrypoint: string;
  filePath: string;
  components: ComponentExportDescription[];
};

export type File = {
  name: string;
};

export type FileContent = {
  name: string;
  fileContent: string;
};

export type ComponentContent = {
  folder: string;
  fileContent: string;
};

export type ComponentWithMetadata = File & {
  fileContent: string;
  symbol: string;
  isDefaultExport: boolean;
  filePath: string;
  exportName: string;
  gitPath: string;
};
