import { EntrypointWithMetadata } from '../commands/bundle';

export class EntrypointError extends Error {}
export class FilePathError extends Error {}

export default function createComponentsWithMetadata(
  entrypointsWithMetadata: Record<string, EntrypointWithMetadata>,
  compilerOutput: Record<string, string>
) {
  return Object.entries(entrypointsWithMetadata).reduce((prev, [key, ep]) => {
    const fileContent = compilerOutput[key];
    if (!/^.+?\?.+?\!.+?$/.test(ep.entrypoint)) {
      throw new EntrypointError('Entrypoint does not follow right syntax');
    }

    const fullFilePath = ep.entrypoint.split('!')[1];
    const prefixPath = `${process.cwd()}/`;
    if (!fullFilePath.startsWith(prefixPath)) {
      throw new FilePathError('File does not start with correct path');
    }
    const filePath = fullFilePath.replace(new RegExp(`^${prefixPath}`), '');
    const components = ep.components.map(({ symbol, isDefaultExport }) => ({
      fileContent,
      symbol,
      isDefaultExport,
      filePath,
      exportName: isDefaultExport ? 'default' : symbol,
      name: symbol
    }));
    return [...prev, ...components];
  }, []);
}
