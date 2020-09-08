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

import BorderBox = require('ink-box');

export type PreviewContainerProps = {};

const steps: StepRunnerStep[] = [scanStep, compileStep, analyzeStep, downloadPreviewClientStep];

export function PreviewContainer() {
  const config = useConfig();
  const [storiesMetadata, setStoriesMetadata] = React.useState();
  const [storyFiles, setStoryFiles] = React.useState();

  const { devServer, established, ready, errors } = useWebpackDevServer({
    config,
    storyFiles,
    storiesMetadata,
  });

  const handleStepSucccess = React.useCallback(({ stepOutputs }) => {
    setStoriesMetadata(stepOutputs.analyze.storiesMetadata);
    setStoryFiles(stepOutputs.scan.storyFiles);
  }, []);

  return (
    <Box flexDirection="column" marginTop={1}>
      <Message emoji="wave">Welcome back!</Message>
      <StepRunner steps={steps} onSuccess={handleStepSucccess} hideStepCount />
      <DevServerMessage
        storyFiles={storyFiles}
        devServer={devServer}
        established={established}
        ready={ready}
        errors={errors}
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
