import { StepOutput } from '../containers/StepRunner';
import { FileContent, OutputFileContent } from '../types';

export function getStepOutputFiles(
  stepOutputs: Record<string, StepOutput>
): OutputFileContent<FileContent>[] {
  return Object.values(stepOutputs).reduce((acc, stepOutput) => {
    return Array.isArray(stepOutput.files) ? [...acc, ...stepOutput.files] : [...acc];
  }, []);
}
