import { StepOutput } from '../containers/StepRunner';

export function getStepOutputStories(stepOutputs: Record<string, StepOutput>) {
  return Object.values(stepOutputs).reduce((acc, stepOutput) => {
    return Array.isArray(stepOutput.stories) ? [...acc, ...stepOutput.stories] : acc;
  }, []);
}
