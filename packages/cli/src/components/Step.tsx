import * as React from 'react';
import { Color, Box } from 'ink';
import Spinner from 'ink-spinner';
import { Emoji, EmojiCode } from './Emoji';

export enum StepState {
  PENDING,
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
  hideStepCount?: boolean;
};

export function Step({
  stepNumber,
  maxSteps,
  children,
  emoji,
  state = StepState.PENDING,
  hideStepCount = false,
}: StepProps) {
  if (state === StepState.PENDING) {
    return null;
  }

  return (
    <Box marginBottom={1}>
      <Box marginRight={1}>
        <StepStateComponent state={state} />
      </Box>
      <Emoji code={emoji} marginRight={1} />
      <Box>{children}</Box>
      {!hideStepCount && maxSteps !== 1 && (
        <Box marginLeft={1}>
          <Color grey>
            ({stepNumber}
            {maxSteps && <>/{maxSteps}</>})
          </Color>
        </Box>
      )}
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
