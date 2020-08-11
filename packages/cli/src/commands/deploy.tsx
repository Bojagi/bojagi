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

const steps: StepRunnerStep[] = [
  validateStep,
  cleanupStep,
  scanStep,
  compileStep,
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
    .option('--webpackConfig [path]', 'Path to the webpack config file')
    .option('-c, --commit [commit]', 'The commit to upload the components for')
    .action(args => {
      render(
        <ConfigProvider config={args}>
          <StepContainer steps={steps} validator={uploadValidator} />
        </ConfigProvider>
      );
    });
}
