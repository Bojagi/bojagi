import * as webpack from 'webpack';
import { isFunction } from 'util';
import { getComponents, CollectorFunction } from '@bojagi/collector-base';
import { ComponentWithMetadata } from '@bojagi/types';
import { BaseOptions } from '../baseCmd';
import withSteps from '../utils/withSteps';
import withHelloGoodbye from '../utils/withHelloGoodbye';
import withDefaultArguments from '../utils/withDefaultArguments';
import { CollectorTuple } from '../config';

const STEP_TEXT = ' Running Collectors';
const COLLECTOR_MAIN_NAME = '@bojagi/collector-main';
export type Collector = {
  fn: CollectorFunction;
  name: string;
  packageName: string;
};

export interface RunCollectorsCommandOptions extends BaseOptions {
  collectors: string[];
  steps: any;
  executionPath: string;
}

export const runCollectorsAction = async ({
  steps,
  executionPath,
  collectors: connectorConfig,
}: RunCollectorsCommandOptions) => {
  const collectors = connectorConfig.map(mapCollectorConfigToCollector);
  if (!collectors.find(collector => collector.name === COLLECTOR_MAIN_NAME)) {
    collectors.unshift(mapCollectorConfigToCollector(COLLECTOR_MAIN_NAME));
  }

  const components: ComponentWithMetadata[] = getComponents();

  const collectorsStep = steps.advance(STEP_TEXT, 'chipmunk').start();

  await collectors.reduce(
    (promise, collector) =>
      promise.then(() => {
        collectorsStep.update(`${STEP_TEXT}: ${collector.name}`);
        return collector.fn({
          webpack,
          components,
          executionPath,
        });
      }),
    Promise.resolve()
  );

  collectorsStep.success(' Collectors successfully run');
};

const runCollectors = program => {
  program
    .command('runCollectors')
    .option(
      '--webpack-config [path]',
      'Path to the webpack config file, defaults to webpack.config.js'
    )
    .description('Runs all the registered collectors')
    .action(withSteps(1)(withHelloGoodbye(withDefaultArguments(runCollectorsAction))));
};

export default runCollectors;

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