import { ComponentExportDescription } from '@bojagi/types';

export type ScannedComponent = ComponentExportDescription & {
  fileName: string;
  name: string;
  filePath: string;
  exportName: string;
  gitPath: string;
};
