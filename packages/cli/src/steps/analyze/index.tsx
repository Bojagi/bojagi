import { StepRunnerStep, StepRunnerActionOptions, StepOutput } from '../../containers/StepRunner';
import { ScanStepOutput } from '../scan';
import { CompileStepOutput } from '../compile';
import { getStoriesMetadata } from './getStoriesMetadata';
import { setupFakeBrowserEnvironment } from './setupFakeBrowserEnvironment';
import { getStepOutputStories } from '../../utils/getOutputStories';

export type StoryItem = {
  exportName: string;
  storyName: string;
};

export type StoryCollectionMetadata = {
  title: string;
  fileName: string;
  storyItems: StoryItem[];
};

export type AnalyzeStepOutput = StepOutput & {
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

const JS_REGEXP = /.+?\.js$/;

type DependencyStepOutputs = {
  scan: ScanStepOutput;
  compile: CompileStepOutput;
};

async function action({ stepOutputs }: StepRunnerActionOptions<DependencyStepOutputs>) {
  const { componentModules, cleanup } = setupFakeBrowserEnvironment(global);

  getStepOutputStories(stepOutputs).forEach(s =>
    s.files.forEach(fileName => {
      const foundFile = stepOutputs.compile.files
        .filter(file => JS_REGEXP.test(file.name))
        .find(file => file.name === fileName);
      if (foundFile) {
        require(foundFile.fullOutputFilePath);
      }
    })
  );

  const storiesMetadata = getStoriesMetadata(stepOutputs.compile.stories, componentModules);

  cleanup();

  return {
    storiesMetadata,
  };
}
