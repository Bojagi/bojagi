import * as React from 'react';
import { render } from 'ink';
import { StepRunnerStep } from '../containers/StepRunner';
import { StepContainer } from '../containers/StepContainer';
import { createStoriesStep } from '../steps/createStories';
import { uploadStep } from '../steps/upload';
import { uploadValidator } from '../validators/uploadValidator';
import { ConfigProvider } from '../config/configContext';

const steps: StepRunnerStep[] = [createStoriesStep, uploadStep];

export default function upload(program) {
  program
    .command('upload')
    .description('uploads your marked components to Bojagi (you need to run bundle command before)')
    .option('-c, --commit [commit]', 'The commit to upload the components for')
    .action(args => {
      render(
        <ConfigProvider config={args}>
          <StepContainer steps={steps} validator={uploadValidator} />
        </ConfigProvider>
      );
    });
}
