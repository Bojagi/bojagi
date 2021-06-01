import * as React from 'react';
import { render } from 'ink';
import { StepContainer } from '../containers/StepContainer';
import { StepRunnerStep } from '../containers/StepRunner';
import { scanStep } from '../steps/scan';
import { compileStep } from '../steps/compile';
import { analyzeStep } from '../steps/analyze';
import { createStoriesStep } from '../steps/createStories';
import { uploadStep } from '../steps/upload';
import { uploadValidator } from '../validators/uploadValidator';
import { cleanupStep } from '../steps/cleanup';
import { ConfigProvider } from '../config/configContext';
import { writeFilesStep } from '../steps/writeFiles';
import { validateStep } from '../steps/validate';
import { storybookStep } from '../steps/storybook';

const steps: StepRunnerStep[] = [
  validateStep,
  cleanupStep,
  scanStep,
  compileStep,
  storybookStep,
  analyzeStep,
  writeFilesStep,
  createStoriesStep,
  uploadStep,
];

export default function deploy(program) {
  program
    .command('deploy')
    .description('bundles and uploads your marked components to Bojagi')
    .option('--storyPath [pathPattern]', 'path pattern to search for stories in')
    .option('-s, --staticDir [paths]', 'path(s) to copy static files from')
    .option('--webpackConfig [path]', 'Path to the webpack config file')
    .option('--storybookConfig [path]', 'Path to the storybook config folder')
    .option('-c, --commit [commit]', 'The commit to upload the components for')
    .action(args => {
      render(
        <ConfigProvider config={args}>
          <StepContainer steps={steps} validator={uploadValidator} />
        </ConfigProvider>
      );
    });
}
