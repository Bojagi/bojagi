import * as React from 'react';
import { render } from 'ink';
import { StepRunnerStep } from '../containers/StepRunner';
import { StepContainer } from '../containers/StepContainer';
import { createStoriesStep } from '../steps/createStories';
import { uploadStep } from '../steps/upload';
import { uploadValidator } from '../validators/uploadValidator';
import { ConfigProvider } from '../config/configContext';
import { validateStep } from '../steps/validate';
import { readJson } from '../utils/writeFile';

const steps: StepRunnerStep[] = [validateStep, createStoriesStep, uploadStep];

export default function upload(program) {
  program
    .command('upload')
    .description('uploads your marked components to Bojagi (you need to run bundle command before)')
    .option('-c, --commit [commit]', 'The commit to upload the components for')
    .action(async args => {
      const configJson = (await readJson('config')) || {};
      render(
        <ConfigProvider config={{ ...configJson, ...args }}>
          <StepContainer steps={steps} validator={uploadValidator} />
        </ConfigProvider>
      );
    });
}
