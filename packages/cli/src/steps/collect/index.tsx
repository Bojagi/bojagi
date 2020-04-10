import { isFunction } from 'util';
import { ComponentWithMetadata } from '@bojagi/types';
import { getComponents, CollectorFunction } from '@bojagi/collector-base';
import { StepRunnerStep, StepRunnerActionOptions } from '../../containers/StepRunner';
import glob from '../../utils/glob';
import { CollectorTuple } from '../../config';

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

async function action({ config }: StepRunnerActionOptions) {
  const { executionPath } = config;
  const collectors = config.collectors.map(mapCollectorConfigToCollector);
  const projectWebpackConfig = require(config.webpackConfig);

  const components: ComponentWithMetadata[] = getComponents();

  const storyFiles = await glob(config.storyPath, { cwd: executionPath });

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

  return {};
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
