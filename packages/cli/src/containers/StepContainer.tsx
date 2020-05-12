import * as React from 'react';
import { Box } from 'ink';
import { Message } from '../components/Message';
import { StepRunner, StepRunnerStep, OnSuccessOptions } from './StepRunner';
import { Config } from '../config';
import { ErrorMessage } from '../components/ErrorMessage';
import { SuccessMessage } from '../components/SuccessMessage';
import { ValidationError } from '../errors';
import { useConfig } from '../context/configContext';

export type StepContainerProps = {
  steps: StepRunnerStep[];
  validator?: (config: Config) => void;
};

export function StepContainer({ steps, validator }: StepContainerProps) {
  const config = useConfig();
  const [validationError, setValidationError] = React.useState<ValidationError>();
  const [validationDone, setValidationDone] = React.useState(false);
  const [runtime, setRuntime] = React.useState(0);

  React.useEffect(() => {
    if (validator) {
      try {
        validator(config);
      } catch (err) {
        setValidationError(err);
      }
    }
    setValidationDone(true);
  }, [validator, config]);

  const handleSucccess = React.useCallback(({ runtimeInSeconds }: OnSuccessOptions) => {
    setRuntime(runtimeInSeconds);
  }, []);

  if (!validationDone) {
    return null;
  }

  if (validationError) {
    return (
      <Box flexDirection="column" marginTop={1}>
        <ErrorMessage error={validationError} />
      </Box>
    );
  }

  return (
    <>
      <Box flexDirection="column" marginTop={1}>
        <Message emoji="wave">Welcome back!</Message>
        <StepRunner steps={steps} onSuccess={handleSucccess} />
      </Box>
      {runtime > 0 && <SuccessMessage runtime={runtime} />}
    </>
  );
}
