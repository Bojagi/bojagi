/* eslint-disable max-classes-per-file */
import { Module, ComponentWithMetadata } from '@bojagi/types';
import { ScannedComponent } from '../scan';

export class EntrypointError extends Error {}
export class FilePathError extends Error {}

export default function createComponentsWithMetadata(
  scanComponents: ScannedComponent[],
  compilerOutput: Record<string, string>,
  modules: Module[]
): ComponentWithMetadata[] {
  return scanComponents.map(scannedComponent => {
    const fileContent = compilerOutput[scannedComponent.fileName];

    const matchingModule = modules.find(module => module.filePath === scannedComponent.filePath);
    const dependencies = matchingModule && matchingModule.dependencies;
    return {
      ...scannedComponent,
      fileContent,
      dependencies,
    };
  });
}
