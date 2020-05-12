import * as React from 'react';
import { render } from 'ink';
import { StepRunnerStep } from '../containers/StepRunner';
import { StepContainer } from '../containers/StepContainer';
import { cleanupStep } from '../steps/cleanup';
import { ConfigProvider } from '../context/configContext';

import program = require('commander');

const steps: StepRunnerStep[] = [cleanupStep];
program
  .command('cleanup')
  .description('Deletes the bojagi temp folder')
  .action(args => {
    render(
      <ConfigProvider config={args}>
        <StepContainer steps={steps} />
        );
      </ConfigProvider>
    );
  });
