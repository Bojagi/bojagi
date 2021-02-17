import * as React from 'react';
import { Text } from 'ink';
import * as path from 'path';
import { StoryWithMetadata } from '../../types';
import { StepRunnerStep, StepRunnerActionOptions, StepOutput } from '../../containers/StepRunner';
import getEntrypointsFromFiles from './getExtendedStorybookFiles';
import getStoryFiles from '../../utils/getStoryFiles';
import { NonVerboseError } from '../../errors';
import { getDependencyVersion } from '../../utils/getDependencyVersion';
import getGitPath from '../../utils/getGitPath';

export type ScanStepOutput = StepOutput & {
  storyFiles: StoryWithMetadata[];
  storyFileCount: number;
  packageDependencies: Record<string, string>;
  reactVersion: string;
  projectGitPath?: string;
};

export const scanStep: StepRunnerStep<ScanStepOutput> = {
  action,
  emoji: 'mag',
  name: 'scan',
  messages: {
    running: () => 'Searching for stories',
    success: ({ storyFileCount }) => (
      <>
        We found <Text color="green">{storyFileCount}</Text> story files
      </>
    ),
    error: () => 'No stories found',
  },
};

async function action({ config }: StepRunnerActionOptions): Promise<ScanStepOutput> {
  const fullPackagePath = path.join(config.executionPath, 'package.json');
  const packageGitPath = getGitPath(fullPackagePath);
  const projectGitPath =
    packageGitPath && fullPackagePath.replace(new RegExp(`${packageGitPath}$`), '');

  const storyFiles = await getStoryFiles(config);
  const extendedStoryFiles = getEntrypointsFromFiles(config, storyFiles, projectGitPath);
  const packageJson = require(fullPackagePath);

  const reactVersion = getDependencyVersion('react', config.executionPath);

  if (!reactVersion) {
    throw new NonVerboseError('React was not found in package.json but is needed for Bojagi');
  }

  if (storyFiles.length === 0) {
    throw new NonVerboseError(
      'No stories found. Could they be in a different directory? They can be configured: \n https://bojagi.io/docs/cliConfigFile/#storypath'
    );
  }

  return {
    projectGitPath,
    storyFiles: extendedStoryFiles,
    storyFileCount: storyFiles.length,
    packageDependencies: packageJson.dependencies || {},
    reactVersion,
  };
}
