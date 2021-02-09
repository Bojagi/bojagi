import { StepOutput } from '../containers/StepRunner';

export function getStepOutputFiles(stepOutputs: Record<string, StepOutput>) {
  return Object.values(stepOutputs).reduce((acc, stepOutput) => {
    return Array.isArray(stepOutput.files) ? [...acc, ...stepOutput.files] : acc;
  }, []);
}
