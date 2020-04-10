import * as React from 'react';
import { render } from 'ink';
import { StepContainer } from '../containers/StepContainer';
import { StepRunnerStep } from '../containers/StepRunner';
import { collectStep } from '../steps/collect';

const steps: StepRunnerStep[] = [collectStep];

import program = require('commander');

program
  .command('runCollectors')
  .option(
    '--webpack-config [path]',
    'Path to the webpack config file, defaults to webpack.config.js'
  )
  .description('Runs all the registered collectors')
  .action(args => {
    render(<StepContainer steps={steps} commandArgs={args} />);
  });
