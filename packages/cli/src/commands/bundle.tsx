import * as React from 'react';
import { render } from 'ink';
import { StepRunnerStep } from '../containers/StepRunner';
import { scanStep } from '../steps/scan';
import { compileStep } from '../steps/compile';
import { StepContainer } from '../containers/StepContainer';
import { cleanupStep } from '../steps/cleanup';
import { ConfigProvider } from '../config/configContext';

import program = require('commander');

const steps: StepRunnerStep[] = [cleanupStep, scanStep, compileStep];
program
  .command('bundle')
  .option('-d, --dir [dir]', 'The root folder to search components in')
  .option(
    '--webpack-config [path]',
    'Path to the webpack config file, defaults to webpack.config.js'
  )
  .description('bundles your marked components (does NOT upload to Bojagi)')
  .action(args => {
    render(
      <ConfigProvider config={args}>
        <StepContainer steps={steps} />
      </ConfigProvider>
    );
  });
