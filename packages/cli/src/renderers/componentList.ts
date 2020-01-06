import chalk from 'chalk';
import { EntrypointWithMetadata } from '@bojagi/types';
import { indentation } from '../utils/terminalUtils';

export default function renderComponentList(
  entrypointsWithMetadata: Record<string, EntrypointWithMetadata>,
  fileCount: number
) {
  const componentCount = Object.values(entrypointsWithMetadata).reduce(
    (prev, current) => prev + current.components.length,
    0
  );

  console.info(indentation(getComponentCountText(componentCount, fileCount)));
  const prefixPath = `${process.cwd()}/`;
  Object.entries(entrypointsWithMetadata).forEach(([name, entrypoint]) => {
    const filePath = entrypoint.filePath.replace(new RegExp(`^${prefixPath}`), '');
    const filePathRender = chalk.gray(filePath);
    const nameRender = chalk.bold(name);
    console.info(indentation(`${nameRender} → ${filePathRender}`));
    entrypoint.components.forEach(component => {
      const symbolRender = chalk.green.bold(component.symbol);
      const isDefaultExportRender = component.isDefaultExport ? chalk.gray.italic(`(default)`) : '';
      console.info(indentation(indentation(`${symbolRender} ${isDefaultExportRender}`)));
    });
  });
}

export function getComponentCountText(componentCount: number, fileCount: number) {
  const componentCountRender = chalk.green.bold(componentCount.toString());
  const fileCountRender = chalk.yellow.bold(fileCount.toString());
  return `We extracted ${componentCountRender} components from ${fileCountRender} files:`;
}
