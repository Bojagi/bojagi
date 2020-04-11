import * as React from 'react';
import { Box } from 'ink';
import { StepProps } from './Step';

export type StepsProps = {
  children: React.ReactElement<StepProps>[];
};

export function Steps({ children }: StepsProps) {
  const [innerChildren, setInnerChildren] = React.useState<React.ReactElement<StepProps>[]>([]);
  React.useEffect(() => {
    setInnerChildren(
      children.map((child, i) =>
        React.cloneElement(child, {
          stepNumber: i + 1,
          maxSteps: children.length,
          ...child.props,
          key: child.props.name,
        })
      )
    );
  }, [children, setInnerChildren]);
  return (
    <Box flexDirection="column" marginX={1} marginBottom={1}>
      {innerChildren}
    </Box>
  );
}
