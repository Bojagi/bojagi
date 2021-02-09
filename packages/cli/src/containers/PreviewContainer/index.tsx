import * as React from 'react';
import { Box, Color, Text } from 'ink';
import { Message } from '../../components/Message';
import { useWebpackDevServer } from './useWebpackDevServer';
import { useConfig } from '../../config/configContext';
import { scanStep } from '../../steps/scan';
import { StepRunnerStep, StepRunner } from '../StepRunner';
import { analyzeStep } from '../../steps/analyze';
import { downloadPreviewClientStep } from '../../steps/downloadPreviewClient';
import { DevServerMessage } from './DevServerMessage';
import { compileStep } from '../../steps/compile';
import { storybookStep } from '../../steps/storybook';
import { getStepOutputFiles } from '../../utils/getOutputFiles';
import { FileContent, OutputFileContent } from '../../types';

import BorderBox = require('ink-box');

export type PreviewContainerProps = {};

const steps: StepRunnerStep[] = [
  scanStep,
  compileStep,
  storybookStep,
  analyzeStep,
  downloadPreviewClientStep,
];

export function PreviewContainer() {
  const config = useConfig();
  const [storiesMetadata, setStoriesMetadata] = React.useState();
  const [storyFiles, setStoryFiles] = React.useState();
  const [files, setFiles] = React.useState<OutputFileContent<FileContent>[]>();

  const { devServer, established, ready, errors, setupError } = useWebpackDevServer({
    config,
    files,
    storyFiles,
    storiesMetadata,
  });

  const handleStepSuccess = React.useCallback(({ stepOutputs }) => {
    setStoriesMetadata(stepOutputs.analyze.storiesMetadata);
    setStoryFiles(stepOutputs.scan.storyFiles);
    setFiles(getStepOutputFiles(stepOutputs));
  }, []);

  return (
    <Box flexDirection="column" marginTop={1}>
      <Message emoji="wave">Welcome back!</Message>
      <StepRunner steps={steps} onSuccess={handleStepSuccess} hideStepCount />
      <DevServerMessage
        storyFiles={storyFiles}
        devServer={devServer}
        established={established}
        ready={ready}
        errors={errors}
        setupError={setupError}
      />
      {devServer && (
        <BorderBox
          borderStyle="round"
          borderColor="grey"
          padding={1}
          margin={{ left: 3, right: 3, bottom: 1 }}
        >
          Preview Server <Color green>running</Color> on{' '}
          <Color cyan>
            <Text underline>http://localhost:{config.previewPort}</Text>
          </Color>
        </BorderBox>
      )}
    </Box>
  );
}
