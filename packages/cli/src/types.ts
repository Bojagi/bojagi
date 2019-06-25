export type Component = {
  filePath: string;
  exportName: string;
  props: Record<string, any>[];
};

export type Module = {
  request: string;
  resource: string;
  gitPath: string;
  isExternal: boolean;
  isNodeModule: boolean;
  packageName?: string;
  dependencies?: Module[];
};
