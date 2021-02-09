import * as React from 'react';
import { Box } from 'ink';
import * as fileSystem from 'fs';
import { Steps } from '../components/Steps';
import { Step, StepState } from '../components/Step';
import { EmojiCode } from '../components/Emoji';
import { Config } from '../config';
import { useConfig } from '../config/configContext';
import { ErrorMessage } from '../components/ErrorMessage';
import { FileContent, OutputFileContent, StoryFileWithMetadata } from '../types';

export type StepOutput = {
  files?: OutputFileContent<FileContent>[];
  stories?: StoryFileWithMetadata[];
  error?: any;
};

export type StepMessages<O extends StepOutput> = {
  running: () => React.ReactNode;
  success: (stepOutput: O) => React.ReactNode;
  error: (stepOutput: { error: Error }) => React.ReactNode;
};

export type StepRunnerActionOptions<
  S extends Record<string, StepOutput> = Record<string, StepOutput>
> = {
  config: Config;
  fs: typeof fileSystem;
  stepOutputs: S;
};

export type StepRunnerStep<O extends StepOutput = StepOutput> = {
  name: string;
  emoji: EmojiCode;
  messages: StepMessages<O>;
  action: (options: StepRunnerActionOptions) => Promise<O>;
};

type StepStatusReducerAction = {
  step: number;
  state: StepState;
};

function stepStatusReducer(state: StepState[], action: StepStatusReducerAction) {
  const newState = [...state];
  newState[action.step] = action.state;
  return newState;
}

type StepOutputReducerAction = {
  stepName: string;
  output: StepOutput;
};

function stepOutputReducer(state: Record<string, StepOutput>, action: StepOutputReducerAction) {
  return {
    ...state,
    [action.stepName]: action.output,
  };
}

export type OnSuccessOptions<O = any> = {
  stepOutputs: O;
  startTime: Date;
  endTime: Date;
  runtimeInSeconds: number;
};

export type StepRunnerProps<O = any> = {
  steps: StepRunnerStep[];
  onSuccess?: (options: OnSuccessOptions<O>) => void;
  hideStepCount?: boolean;
  fs?: typeof fileSystem;
};

export function StepRunner({
  fs = fileSystem,
  steps,
  onSuccess,
  hideStepCount = false,
}: StepRunnerProps) {
  const config = useConfig();
  const [currentStep, setCurrentStep] = React.useState<number>(0);
  const [stepStatuses, setStepStatus] = React.useReducer(stepStatusReducer, []);
  const [stepOutputs, setStepOutput] = React.useReducer(stepOutputReducer, {});

  const [error, setError] = React.useState<Error>();
  const [done, setDone] = React.useState(false);
  const [startTime, setStartTime] = React.useState<Date>();
  const [endTime, setEndTime] = React.useState<Date>();

  React.useEffect(() => {
    setStartTime(new Date());
  }, []);

  const runCurrentStep = React.useCallback(async () => {
    setStepStatus({ step: currentStep, state: StepState.RUNNING });

    try {
      const output = await steps[currentStep].action({
        config,
        stepOutputs,
        fs,
      });
      setStepOutput({
        stepName: steps[currentStep].name,
        output,
      });
      setStepStatus({ step: currentStep, state: StepState.SUCCESS });
      setCurrentStep(currentStep + 1);
    } catch (err) {
      setStepStatus({ step: currentStep, state: StepState.FAILED });
      setStepOutput({
        stepName: steps[currentStep].name,
        output: { error: err },
      });
      setError(err);
      process.exitCode = 1;
    }
  }, [config, currentStep, fs, steps, stepOutputs]);

  React.useEffect(() => {
    // If current step has passed passed last step OR step is already started OR on error
    // -> don't start step
    if (currentStep === steps.length || stepStatuses[currentStep] || error) return;
    runCurrentStep();
  }, [steps, error, currentStep, stepStatuses, runCurrentStep]);

  React.useEffect(() => {
    if (currentStep === steps.length && !done) {
      setDone(true);
      const now = new Date();
      setEndTime(now);
      if (onSuccess && startTime) {
        const runtimeInSeconds = getDifference(startTime, now);
        onSuccess({
          stepOutputs,
          startTime,
          endTime: now,
          runtimeInSeconds,
        });
      }
    }
  }, [steps, done, currentStep, stepOutputs, onSuccess, startTime, endTime]);

  return (
    <>
      <Steps>
        {steps.map((step, i) => (
          <Step
            key={step.name}
            name={step.name}
            emoji={step.emoji}
            state={stepStatuses[i]}
            hideStepCount={hideStepCount}
          >
            {getStepMessage(step, stepStatuses[i], stepOutputs[step.name])}
          </Step>
        ))}
      </Steps>
      {error && (
        <Box flexDirection="column">
          <ErrorMessage error={error} />
        </Box>
      )}
    </>
  );
}

function getDifference(startTime: Date, endTime: Date) {
  const result = Math.abs(endTime.getTime() - startTime.getTime());
  return Math.round(result / 10) / 100;
}

function getStepMessage(step: StepRunnerStep, stepStatus: StepState, stepOutput: StepOutput) {
  switch (stepStatus) {
    case StepState.RUNNING:
      return step.messages.running();
    case StepState.SUCCESS:
      return step.messages.success(stepOutput);
    case StepState.FAILED:
      return step.messages.error((stepOutput as any) || {});
    default:
      return null;
  }
}
