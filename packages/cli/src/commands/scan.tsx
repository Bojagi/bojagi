import * as React from 'react';
import { render } from 'ink';
import { StepRunnerStep } from '../containers/StepRunner';
import { scanStep } from '../steps/scan';
import { StepContainer } from '../containers/StepContainer';
import { cleanupStep } from '../steps/cleanup';
import { ConfigProvider } from '../config/configContext';

import program = require('commander');

const steps: StepRunnerStep[] = [cleanupStep, scanStep];
program
  .command('scan')
  .option('-d, --dir [dir]', 'The root folder to search components in')
  .option(
    '--webpack-config [path]',
    'Path to the webpack config file, defaults to webpack.config.js'
  )
  .description('Scans for components')
  .action(args => {
    render(
      <ConfigProvider config={args}>
        <StepContainer steps={steps} />
      </ConfigProvider>
    );
  });
