import * as React from 'react';
import { JSDOM } from 'jsdom';
import { StepRunnerStep, StepRunnerActionOptions } from '../../containers/StepRunner';
import { ScanStepOutput } from '../scan';
import { CompileStepOutput } from '../compile';
import { writeStoryMetadata } from '../../utils/writeFile';

export type CollectStepOutput = {};

export const collectStep: StepRunnerStep<CollectStepOutput> = {
  action,
  emoji: 'chipmunk',
  name: 'collect',
  messages: {
    running: () => 'Collect metadata',
    success: () => 'Story metadata collected',
    error: () => 'Error collecting metadata',
  },
};

type DependencyStepOutputs = {
  scan: ScanStepOutput;
  compile: CompileStepOutput;
};

async function action({ stepOutputs }: StepRunnerActionOptions<DependencyStepOutputs>) {
  const componentModules = new Map<string, Record<string, any>>();
  const { window } = new JSDOM('<body></body>');
  const internalGlobal = global as any;
  internalGlobal.window = window;
  internalGlobal.React = React;
  internalGlobal.registerComponent = (moduleName: string, moduleContent) => {
    componentModules.set(moduleName, moduleContent);
  };
  internalGlobal.document = window.document;

  stepOutputs.compile.files.forEach(file => require(file.outputFilePath));
  stepOutputs.compile.stories.forEach(s => require(s.outputFilePath));

  const storiesMetadata: Record<string, any> = stepOutputs.compile.stories.reduce(
    (acc, { fileContent, outputFilePath, ...s }) => {
      const module = componentModules.get(s.fileName);
      const metadata = module
        ? {
            title: module.default.title,
            stories: Object.entries(module)
              .filter(([exportName]) => exportName !== 'default')
              .map(([exportName, storyFn]) => ({
                exportName,
                storyName: storyFn.storyName || exportName,
              })),
          }
        : {};
      return {
        ...acc,
        [s.filePath]: metadata,
      };
    },
    {}
  );

  await Promise.all(
    Object.entries(storiesMetadata).map(([filePath, metadata]) =>
      writeStoryMetadata({ filePath, metadata })
    )
  );

  return {
    storiesMetadata,
  };
}
