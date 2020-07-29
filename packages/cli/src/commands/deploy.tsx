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
import { cleanupStep } from '../steps/cleanup';
import { ConfigProvider } from '../config/configContext';

const steps: StepRunnerStep[] = [
  cleanupStep,
  scanStep,
  compileStep,
  collectStep,
  createComponentsStep,
  uploadComponentsStep,
];

export default function deploy(program) {
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
      render(
        <ConfigProvider config={args}>
          <StepContainer steps={steps} validator={uploadValidator} />
        </ConfigProvider>
      );
    });
}
