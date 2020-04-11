import * as React from 'react';
import { Box, Text, Color } from 'ink';
import { ComponentExportDescription } from '@bojagi/types';
import { Message } from '../components/Message';
import { StepRunner, StepRunnerStep } from './StepRunner';
import { scanStep, ScanStepOutput } from '../steps/scan';
import { useConfig } from '../context/configContext';
import { SuccessMessage } from '../components/SuccessMessage';

const steps: StepRunnerStep[] = [scanStep];

type FoundComponent = {
  name: string;
  filePath: string;
  components: ComponentExportDescription[];
};

export function ListContainer() {
  const config = useConfig();
  const [foundComponents, setFoundComponents] = React.useState<FoundComponent[]>();
  const handleStepSuccess = React.useCallback(
    (options: { stepOutputs: { scan: ScanStepOutput } }) => {
      console.log('options.istepOutputs.scan.entrypointsWithMetadata', options.stepOutputs.scan);

      setFoundComponents(
        Object.entries(options.stepOutputs.scan.entrypointsWithMetadata).map(
          ([name, entrypoint]) => {
            const prefixPath = `${config.executionPath}/`;
            const filePath = entrypoint.filePath.replace(new RegExp(`^${prefixPath}`), '');
            return {
              name,
              filePath,
              components: entrypoint.components,
            };
          }
        )
      );
    },
    [config.executionPath]
  );

  return (
    <Box flexDirection="column" marginTop={1}>
      <Message emoji="wave">Welcome back!</Message>
      <StepRunner steps={steps} onSuccess={handleStepSuccess} />
      {foundComponents && foundComponents.length && (
        <>
          <Box flexDirection="column" marginX={3} marginBottom={1}>
            {foundComponents.map(({ name, filePath, components }) => (
              <Box flexDirection="column" marginBottom={1}>
                <EntryPointTitle name={name} filePath={filePath} />
                <Box marginLeft={2} flexDirection="column">
                  {components.map(component => (
                    <EntrypointComponent component={component} />
                  ))}
                </Box>
              </Box>
            ))}
          </Box>
          <SuccessMessage />
        </>
      )}
    </Box>
  );
}

export type EntryPointTitleProps = {
  name: string;
  filePath: string;
};

function EntryPointTitle({ name, filePath }: EntryPointTitleProps) {
  return (
    <Box>
      <Text bold>{name}</Text> →{' '}
      <Text underline>
        <Color gray>{filePath}</Color>
      </Text>
    </Box>
  );
}

function EntrypointComponent({ component }) {
  return (
    <Box>
      <Color green>{component.symbol}</Color>
      {component.isDefaultExport && (
        <Box marginLeft={1}>
          <Color gray>(default)</Color>
        </Box>
      )}
    </Box>
  );
}
