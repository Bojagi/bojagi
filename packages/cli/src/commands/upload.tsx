import * as React from 'react';
import { render } from 'ink';
import { StepRunnerStep } from '../containers/StepRunner';
import { StepContainer } from '../containers/StepContainer';
import { createComponentsStep } from '../steps/createComponents';
import { uploadComponentsStep } from '../steps/uploadComponents';
import { uploadValidator } from '../validators/uploadValidator';
import { ConfigProvider } from '../config/configContext';

import program = require('commander');

const steps: StepRunnerStep[] = [createComponentsStep, uploadComponentsStep];

program
  .command('upload')
  .description('uploads your marked components to Bojagi (no bundling)')
  .option('-c, --commit [commit]', 'The commit to upload the components for')
  .action(args => {
    render(
      <ConfigProvider config={args}>
        <StepContainer steps={steps} validator={uploadValidator} />
      </ConfigProvider>
    );
  });
