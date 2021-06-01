import { StepRunnerStep, StepRunnerActionOptions, StepOutput } from '../../containers/StepRunner';
import { ScanStepOutput } from '../scan';
import { CompileStepOutput } from '../compile';
import { getStoriesMetadata } from './getStoriesMetadata';
import { setupFakeBrowserEnvironment } from './setupFakeBrowserEnvironment';
import { getStepOutputStories } from '../../utils/getOutputStories';
import { getStepOutputFiles } from '../../utils/getOutputFiles';

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

  const stories = getStepOutputStories(stepOutputs);

  stories.forEach(s =>
    (s.files || []).forEach(fileName => {
      const foundFile = getStepOutputFiles(stepOutputs)
        .filter(file => JS_REGEXP.test(file.name))
        .find(file => file.name === fileName);
      if (foundFile) {
        require(foundFile.fullOutputFilePath);
      }
    })
  );

  const storiesMetadata = getStoriesMetadata(stories, componentModules);

  cleanup();

  return {
    storiesMetadata,
  };
}
