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
