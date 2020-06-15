import * as React from 'react';
import { Color } from 'ink';
import { EntrypointWithMetadata } from '@bojagi/types';
import getComponentsOfFolder from './getComponentsOfFolder';
import getEntrypointsFromComponents from './getEntrypointsFromComponents';
import { StepRunnerStep, StepRunnerActionOptions } from '../../containers/StepRunner';
import { writeJson } from '../../utils/writeFile';
import { getComponentsWithMetadata } from './getComponentsWithMetadata';
import { ScannedComponent } from './types';

export type ScanStepOutput = {
  entrypointsWithMetadata: Record<string, EntrypointWithMetadata>;
  components: ScannedComponent[];
  componentCount: number;
  fileCount: number;
};

export const scanStep: StepRunnerStep<ScanStepOutput> = {
  action,
  emoji: 'mag',
  name: 'scan',
  messages: {
    running: () => 'Searching for components',
    success: ({ componentCount, fileCount }) => (
      <>
        We found <Color green>{componentCount}</Color> components in{' '}
        <Color yellow>{fileCount}</Color> files
      </>
    ),
    error: () => 'No components found',
  },
};

function action({ config }: StepRunnerActionOptions) {
  const entryFolder = `${config.executionPath}/${config.dir}`;
  return getComponentsOfFolder(config.componentMarker, entryFolder, [])
    .then(getEntrypointsFromComponents)
    .then(async (entrypointsWithMetadata: Record<string, EntrypointWithMetadata>) => {
      const fileCount = Object.entries(entrypointsWithMetadata).length;
      if (fileCount === 0) {
        throw new Error('No components found! Have you marked them correctly?');
      }

      const componentCount = Object.values(entrypointsWithMetadata).reduce(
        (prev, current) => prev + current.components.length,
        0
      );

      const components = getComponentsWithMetadata(config, entrypointsWithMetadata);

      if (!config.dryRun) {
        await writeJson('components', components);
      }

      return {
        entrypointsWithMetadata,
        componentCount,
        fileCount,
        components,
      };
    });
}
