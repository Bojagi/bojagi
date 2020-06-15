import { isFunction } from 'util';
import { ComponentWithMetadata } from '@bojagi/types';
import {
  getComponents,
  CollectorFunction,
  propsRegistry,
  writeRegisteredProps,
} from '@bojagi/collector-base';
import { StepRunnerStep, StepRunnerActionOptions } from '../../containers/StepRunner';
import { CollectorTuple } from '../../config';
import { createComponentFolder } from '../../utils/writeFile';
import { ScanStepOutput } from '../scan';
import { NonVerboseError } from '../../errors';
import getStoryFiles from '../../utils/getStoryFiles';

import webpack = require('webpack');

export type Collector = {
  fn: CollectorFunction;
  name: string;
  packageName: string;
};

export type CollectStepOutput = {};

export const collectStep: StepRunnerStep<CollectStepOutput> = {
  action,
  emoji: 'chipmunk',
  name: 'collect',
  messages: {
    running: () => 'Running Collectors',
    success: () => 'Collectors successfully run',
    error: () => 'Error running collectors',
  },
};

type DependencyStepOutputs = {
  scan: ScanStepOutput;
};

async function action({ config, stepOutputs }: StepRunnerActionOptions<DependencyStepOutputs>) {
  const { executionPath } = config;
  const collectors = config.collectors.map(mapCollectorConfigToCollector);
  const projectWebpackConfig = require(config.webpackConfig);

  const hasScanOutput = !!stepOutputs.scan;

  let components: ComponentWithMetadata[];
  try {
    components = hasScanOutput ? stepOutputs.scan.components : getComponents();
  } catch {
    throw new NonVerboseError(
      'Could not get components. Have you ran the scan command beforehand?'
    );
  }

  const storyFiles = await getStoryFiles(config);

  if (!config.dryRun) {
    await Promise.all(
      components.map(({ filePath, symbol, isDefaultExport }) =>
        createComponentFolder({
          exportName: isDefaultExport ? 'default' : symbol,
          filePath,
        })
      )
    );
  }

  await collectors.reduce(
    (promise, collector) =>
      promise.then(() => {
        return collector.fn({
          webpack,
          components,
          executionPath,
          storyFiles,
          projectWebpackConfig,
        });
      }),
    Promise.resolve()
  );

  if (!config.dryRun) {
    await writeRegisteredProps();
  }
  return {
    componentProps: Array.from(propsRegistry.values()),
  };
}

function mapCollectorConfigToCollector(collectorConfig: string | CollectorTuple): Collector {
  const packageName = Array.isArray(collectorConfig) ? collectorConfig[0] : collectorConfig;
  const collectorExports = require(packageName);
  const fn = collectorExports.collector;
  if (!isFunction(fn)) {
    throw new Error(`Collector "${packageName}" does not export a function as default export.`);
  }
  const collectorMetadata = collectorExports.default || collectorExports;
  const name = collectorMetadata.name || packageName;
  return {
    fn,
    packageName,
    name,
  };
}
