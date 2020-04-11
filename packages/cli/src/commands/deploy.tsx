import * as React from 'react';
import { render } from 'ink';
import { StepContainer } from '../containers/StepContainer';
import { StepRunnerStep } from '../containers/StepRunner';
import { scanStep } from '../steps/scan';
import { compileStep } from '../steps/compile';
import { collectStep } from '../steps/collect';
import { createComponentsStep } from '../steps/createComponents';
import { uploadComponentsStep } from '../steps/uploadComponents';
import { uploadValidator } from '../validators/uploadValidator';

import program = require('commander');

const steps: StepRunnerStep[] = [
  scanStep,
  compileStep,
  collectStep,
  createComponentsStep,
  uploadComponentsStep,
];

program
  .command('deploy')
  .description('bundles and uploads your marked components to Bojagi')
  .option('-d, --dir [dir]', 'The root folder to search components in')
  .option(
    '--webpack-config [path]',
    'Path to the webpack config file, defaults to webpack.config.js'
  )
  .option('-c, --commit [commit]', 'The commit to upload the components for')
  .action(args => {
    render(<StepContainer steps={steps} commandArgs={args} validator={uploadValidator} />);
  });
