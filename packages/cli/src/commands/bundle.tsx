import * as React from 'react';
import { render } from 'ink';
import { StepRunnerStep } from '../containers/StepRunner';
import { scanStep } from '../steps/scan';
import { compileStep } from '../steps/compile';
import { StepContainer } from '../containers/StepContainer';
import { cleanupStep } from '../steps/cleanup';
import { ConfigProvider } from '../config/configContext';
import { analyzeStep } from '../steps/analyze';
import { writeFilesStep } from '../steps/writeFiles';
import { storybookStep } from '../steps/storybook';

export default function bundle(program) {
  const steps: StepRunnerStep[] = [
    cleanupStep,
    scanStep,
    compileStep,
    storybookStep,
    analyzeStep,
    writeFilesStep,
  ];
  program
    .command('bundle')
    .option('--storyPath [pathPattern]', 'path pattern to search for stories in')
    .option('-s, --staticDir [paths]', 'path(s) to copy static files from')
    .option('--webpackConfig [path]', 'Path to the webpack config file')
    .option('--storybookConfig [path]', 'Path to the storybook config folder')
    .description('bundles your marked components (does NOT upload to Bojagi)')
    .action(args => {
      render(
        <ConfigProvider config={args}>
          <StepContainer steps={steps} />
        </ConfigProvider>
      );
    });
}
