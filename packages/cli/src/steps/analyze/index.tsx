import { StepRunnerStep, StepRunnerActionOptions } from '../../containers/StepRunner';
import { ScanStepOutput } from '../scan';
import { CompileStepOutput } from '../compile';
import { getStoriesMetadata } from './getStoriesMetadata';
import { setupFakeBrowserEnvironment } from './setupFakeBrowserEnvironment';

export type StoryItem = {
  exportName: string;
  storyName: string;
};

export type StoryCollectionMetadata = {
  title: string;
  fileName: string;
  storyItems: StoryItem[];
};

export type AnalyzeStepOutput = {
  storiesMetadata: Record<string, StoryCollectionMetadata>;
};

export const analyzeStep: StepRunnerStep<AnalyzeStepOutput> = {
  action,
  emoji: 'eyes',
  name: 'analyze',
  messages: {
    running: () => 'Analyze stories and components',
    success: () => 'Story metadata analyzed',
    error: () => 'Error analyzing story metadata',
  },
};

type DependencyStepOutputs = {
  scan: ScanStepOutput;
  compile: CompileStepOutput;
};

async function action({ stepOutputs }: StepRunnerActionOptions<DependencyStepOutputs>) {
  const componentModules = setupFakeBrowserEnvironment(global);

  stepOutputs.compile.files.forEach(file => require(file.fullOutputFilePath));
  stepOutputs.compile.stories.forEach(s => require(s.fullOutputFilePath));

  const storiesMetadata = getStoriesMetadata(stepOutputs.compile.stories, componentModules);

  return {
    storiesMetadata,
  };
}
