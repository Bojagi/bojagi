import * as React from 'react';
import { render } from 'ink';
import { StepRunnerStep } from '../containers/StepRunner';
import { scanStep } from '../steps/scan';
import { StepContainer } from '../containers/StepContainer';
import { cleanupStep } from '../steps/cleanup';
import { ConfigProvider } from '../config/configContext';

export default function scan(program) {
  const steps: StepRunnerStep[] = [cleanupStep, scanStep];
  program
    .command('scan')
    .option('--storyPath [pathPattern]', 'path pattern to search for stories in')
    .description('Scans for components')
    .action(args => {
      render(
        <ConfigProvider config={args}>
          <StepContainer steps={steps} />
        </ConfigProvider>
      );
    });
}
