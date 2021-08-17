import { StepRunnerStep, StepRunnerActionOptions, StepOutput } from '../../containers/StepRunner';
import { ScanStepOutput } from '../scan';
import { CompileStepOutput } from '../compile';
import { getStoriesMetadata } from './getStoriesMetadata';
import { setupFakeBrowserEnvironment } from './setupFakeBrowserEnvironment';
import { getStepOutputStories } from '../../utils/getOutputStories';
import { getStepOutputFiles } from '../../utils/getOutputFiles';
import debuggers, { DebugNamespaces } from '../../debug';

const debug = debuggers[DebugNamespaces.ANALYZE];

export interface StoryItem {
  exportName: string;
  storyName: string;
}

export type StoryLayout = 'padded' | 'centered' | 'fullscreen';

export interface BojagiParameters {
  layout?: StoryLayout;
  figmaUrl?: string;
}

export interface StoryCollectionMetadata {
  title: string;
  fileName: string;
  parameters?: BojagiParameters;
  storyItems: StoryItem[];
}

export interface AnalyzeStepOutput extends StepOutput {
  storiesMetadata: Record<string, StoryCollectionMetadata>;
}

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
        try {
          // some modules have problems being required, but in most cases analysis still works
          // so we ignore errors and hope for the best
          require(foundFile.fullOutputFilePath);
        } catch (e) {
          debug('error importing file %s', foundFile.name);
          debug('error %s %O', e.message, e.stack);
        }
      }
    })
  );

  const storiesMetadata = getStoriesMetadata(stories, componentModules);

  cleanup();

  return {
    storiesMetadata,
  };
}
