import { StepOutput } from '../containers/StepRunner';

export function getStepOutputDependencies(stepOutputs: Record<string, StepOutput>) {
  return Object.values(stepOutputs).reduce((acc, stepOutput) => {
    return stepOutput.dependencies ? { ...acc, ...stepOutput.dependencies } : acc;
  }, {});
}
