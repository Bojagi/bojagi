import * as webpack from 'webpack';
import { ComponentWithMetadata } from './commands/bundle';

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

export type CollectorFunctionOptions = {
  webpack: typeof webpack;
  executionPath: string;
  components: ComponentWithMetadata[];
};

export type CollectorFunction = (options: CollectorFunctionOptions) => Promise<void> | void;
