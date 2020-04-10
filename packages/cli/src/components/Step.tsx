import * as React from 'react';
import { Color, Box } from 'ink';
import Spinner from 'ink-spinner';
import { Emoji, EmojiCode } from './Emoji';

export enum StepState {
  NOT_STARTED,
  RUNNING,
  SUCCESS,
  FAILED,
}

export type StepProps = {
  stepNumber?: number;
  maxSteps?: number;
  name: string;
  emoji: EmojiCode;
  state?: StepState;
  children: React.ReactNode;
};

export function Step({
  stepNumber,
  maxSteps,
  children,
  emoji,
  state = StepState.NOT_STARTED,
}: StepProps) {
  if (state === StepState.NOT_STARTED) {
    return null;
  }

  return (
    <Box margin={0}>
      <Box marginRight={1}>
        <StepStateComponent state={state} />
      </Box>
      {maxSteps !== 1 && (
        <Box marginRight={1}>
          <Color grey>
            [{stepNumber}
            {maxSteps && <>/{maxSteps}</>}]
          </Color>
        </Box>
      )}
      <Emoji code={emoji} marginRight={1} />
      <Box>{children}</Box>
    </Box>
  );
}

function StepStateComponent({ state }: { state: StepState }) {
  switch (state) {
    case StepState.RUNNING:
      return (
        <Box width={1}>
          <Spinner type="dots3" />
        </Box>
      );
    case StepState.SUCCESS:
    case StepState.FAILED:
    default:
      return <Box width={1}></Box>;
  }
}
