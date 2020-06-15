import * as React from 'react';
import { Box, Color, Text } from 'ink';
import { Message } from '../../components/Message';
import { useWebpackDevServer } from './useWebpackDevServer';
import { useConfig } from '../../config/configContext';
import { scanStep } from '../../steps/scan';
import { StepRunnerStep, StepRunner } from '../StepRunner';
import { collectStep } from '../../steps/collect';
import { downloadPreviewClientStep } from '../../steps/downloadPreviewClient';
import { DevServerMessage } from './DevServerMessage';

import BorderBox = require('ink-box');

export type PreviewContainerProps = {};

const steps: StepRunnerStep[] = [scanStep, collectStep, downloadPreviewClientStep];

export function PreviewContainer() {
  const config = useConfig();
  const [entrypointsWithMetadata, setEntrypointsWithMetadata] = React.useState();
  const [foundComponents, setFoundComponents] = React.useState();
  const [componentProps, setComponentProps] = React.useState();

  const { devServer, established, ready, errors } = useWebpackDevServer({
    config,
    entrypointsWithMetadata,
    componentProps,
  });

  const handleStepSucccess = React.useCallback(({ stepOutputs }) => {
    setEntrypointsWithMetadata(stepOutputs.scan.entrypointsWithMetadata);
    setFoundComponents(stepOutputs.scan.components);
    setComponentProps(stepOutputs.collect.componentProps);
  }, []);

  return (
    <Box flexDirection="column" marginTop={1}>
      <Message emoji="wave">Welcome back!</Message>
      <StepRunner steps={steps} onSuccess={handleStepSucccess} hideStepCount />
      <DevServerMessage
        foundComponents={foundComponents}
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
