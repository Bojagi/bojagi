import * as React from 'react';
import { Color } from 'ink';
import * as path from 'path';
import { StoryWithMetadata } from '../../types';
import { StepRunnerStep, StepRunnerActionOptions } from '../../containers/StepRunner';
import getEntrypointsFromFiles from './getExtendedStorybookFiles';
import getStoryFiles from '../../utils/getStoryFiles';

export type ScanStepOutput = {
  storyFiles: StoryWithMetadata[];
  storyFileCount: number;
  dependencies: Record<string, string>;
};

export const scanStep: StepRunnerStep<ScanStepOutput> = {
  action,
  emoji: 'mag',
  name: 'scan',
  messages: {
    running: () => 'Searching for stories',
    success: ({ storyFileCount }) => (
      <>
        We found <Color green>{storyFileCount}</Color> story files
      </>
    ),
    error: () => 'No stories found',
  },
};

async function action({ config }: StepRunnerActionOptions): Promise<ScanStepOutput> {
  const storyFiles = await getStoryFiles(config);
  const extendedStoryFiles = getEntrypointsFromFiles(config, storyFiles);
  const packageJson = require(path.join(config.executionPath, 'package.json'));

  return {
    storyFiles: extendedStoryFiles,
    storyFileCount: storyFiles.length,
    dependencies: packageJson.dependencies || {},
  };
}
