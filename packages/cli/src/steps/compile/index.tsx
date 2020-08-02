import MemoryFS from 'memory-fs';
import { File, StoryFileWithMetadata, FileContent } from '@bojagi/types';
import { StepRunnerStep, StepRunnerActionOptions } from '../../containers/StepRunner';
import { runWebpackCompiler } from './runWebpackCompiler';
// import createComponentsWithMetadata from './createComponentsWithMetadata';
import { ScanStepOutput } from '../scan';
// import { writeSharedFile, writeComponent, writeJson } from '../../utils/writeFile';
import { writeSharedFile, writeJson } from '../../utils/writeFile';
import { getWebpackConfig } from '../../utils/getWebpackConfig';

import webpack = require('webpack');

const outputFS = new MemoryFS();

export type CompileStepOutput = {
  files: File[];
  stories: StoryFileWithMetadata[];
};

const FILES = ['commons'];

export const compileStep: StepRunnerStep<CompileStepOutput> = {
  action,
  emoji: 'factory',
  name: 'compile',
  messages: {
    running: () => 'Compiling components',
    success: () => 'Components compiled',
    error: () => 'Error during compilation',
  },
};

type DependencyStepOutputs = {
  scan: ScanStepOutput;
};

async function action({
  config,
  stepOutputs: {
    scan: { storyFiles },
  },
}: StepRunnerActionOptions<DependencyStepOutputs>): Promise<CompileStepOutput> {
  const { entrypoints, webpackConfig } = await getWebpackConfig({
    config,
    storyFiles,
  });

  const compiler = webpack(webpackConfig);
  compiler.outputFileSystem = outputFS;

  const dependencyPackages = getPackageJsonDependencies(config.executionPath);

  const { outputContent } = await runWebpackCompiler({
    compiler,
    entrypoints,
    dependencyPackages,
  });

  const storiesWithoutEntrypoint = storyFiles.map(({ entrypoint, ...sf }) => sf);

  const files: File[] = FILES.map(name => ({
    name,
  }));

  const fileContent: FileContent[] = FILES.map(name => ({
    name,
    fileContent: fileContent[name],
  }));

  await Promise.all(fileContent.map(writeSharedFile));

  await Promise.all(
    fileContent.map(async ({ exportName, filePath, fileContent: fc }) => {
      await writeComponent({ exportName, filePath, fileContent: fc });
    })
  );

  await writeJson('files', files);
  await writeJson('stories', storiesWithoutEntrypoint);

  return {
    files: FILES.map(name => ({
      name,
    })),
    stories: storiesWithoutEntrypoint,
  };

  // const   = createComponentsWithMetadata(
  //   scanComponents,
  //   componentsContent,
  //   modules
  // );
  // const componentsMetadata = componentsWithMetadata.map(
  //   ({ fileContent, ...componentMetadata }) => componentMetadata
  // );
  // const files: File[] = FILES.map(name => ({
  //   name,
  // }));

  // const fileContent: FileContent[] = FILES.map(name => ({
  //   name,
  //   fileContent: componentsContent[name],
  // }));

  // await Promise.all(
  //   fileContent.map(async file => {
  //     await writeSharedFile(file);
  //   })
  // );
  // await Promise.all(
  //   componentsWithMetadata.map(async ({ exportName, filePath, fileContent: fc }) => {
  //     await writeComponent({ exportName, filePath, fileContent: fc });
  //   })
  // );

  // await writeJson('files', files);
  // await writeJson('components', componentsMetadata);

  // return {
  //   files,
  //   components: componentsWithMetadata,
  // };
}

function getPackageJsonDependencies(executionPath: string) {
  try {
    const { dependencies } = require(`${executionPath}/package.json`);
    return Object.keys(dependencies);
  } catch {
    throw new Error('Can not read dependencies in package.json');
  }
}
