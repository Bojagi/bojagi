import * as React from 'react';
import { Box } from 'ink';
import { StepProps } from './Step';

export type StepsProps = {
  children: React.ReactElement<StepProps>[];
};

export function Steps({ children }: StepsProps) {
  const stepChildren = React.useMemo(() => children.map(mapChild), [children]);

  return (
    <Box flexDirection="column" marginX={1}>
      {stepChildren}
    </Box>
  );
}

function mapChild(
  child: React.ReactElement<StepProps>,
  i: number,
  children: React.ReactElement<StepProps>[]
) {
  return React.cloneElement(child, {
    stepNumber: i + 1,
    maxSteps: children.length,
    ...child.props,
    key: child.props.name,
  });
}
