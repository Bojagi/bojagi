import * as React from 'react';
import { Box, Text, Color } from 'ink';

import { Message } from '../components/Message';
import { SuccessMessage } from '../components/SuccessMessage';
import { useComponentScan } from '../utils/useComponentScan';

export function ListContainer() {
  const { getCurrentMessage } = useComponentScan();
  const components: any = [];

  const groupedComponentsByFile: Record<string, any> = !components
    ? {}
    : components.reduce(
        (acc, component) => ({
          ...acc,
          [component.fileName]: acc[component.fileName]
            ? [...acc[component.fileName], component]
            : [component],
        }),
        {}
      );

  return (
    <Box flexDirection="column" marginTop={1}>
      <Message emoji="wave">Welcome back!</Message>
      {getCurrentMessage()}
      {components && components.length && (
        <>
          <Box flexDirection="column" marginX={3} marginBottom={1}>
            {Object.entries(groupedComponentsByFile).map(([fileName, componentsOfFile]) => (
              <Box key={fileName} flexDirection="column" marginBottom={1}>
                <EntryPointTitle name={fileName} filePath={componentsOfFile[0].filePath} />
                <Box marginLeft={2} flexDirection="column">
                  {componentsOfFile.map(component => (
                    <EntrypointComponent key={component.symbol} component={component} />
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
