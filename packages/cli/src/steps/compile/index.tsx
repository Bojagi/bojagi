import MemoryFS from 'memory-fs';
import * as path from 'path';
import { StoryFileWithMetadata, FileContent, OutputFileContent, Module } from '../../types';
import { StepRunnerStep, StepRunnerActionOptions, StepOutput } from '../../containers/StepRunner';
import { runWebpackCompiler } from './runWebpackCompiler';
import { ScanStepOutput } from '../scan';
import { writeBojagiFile } from '../../utils/writeFile';
import { getWebpackConfig } from '../../utils/getWebpackConfig';
import debuggers, { DebugNamespaces } from '../../debug';

import webpack = require('webpack');

const debug = debuggers[DebugNamespaces.COMPILE];

const outputFS = new MemoryFS();

export type CompileStepOutput = StepOutput & {
  files: OutputFileContent<FileContent>[];
  stories: StoryFileWithMetadata[];
};

export const compileStep: StepRunnerStep<CompileStepOutput> = {
  action,
  emoji: 'factory',
  name: 'compile',
  messages: {
    running: () => 'Compiling stories and components',
    success: () => 'Stories and components compiled',
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
  const { namespace } = config;
  const webpackMajorVersion = Number(webpack.version?.split('.')[0]);
  const { entrypoints, webpackConfig } = await getWebpackConfig({
    config,
    storyFiles,
  });

  debug('entry points: %O', entrypoints);
  debug('webpack config: %O', webpackConfig);
  debug('webpack rules: %O', webpackConfig.module?.rules);

  const compiler = webpack(webpackConfig);
  compiler.outputFileSystem = outputFS;

  const dependencyPackages = getPackageJsonDependencies(config.executionPath);

  const { outputContent, modules, assets } = await runWebpackCompiler({
    compiler,
    entrypoints,
    dependencyPackages,
    webpackMajorVersion,
  });

  const filesWithMetadata = await Promise.all(
    Object.entries(outputContent).map(async ([fileName, fileContent]) => {
      const { outputFilePath, fullOutputFilePath } = await writeBojagiFile({
        namespace,
        fileName,
        fileContent,
        folder: 'files',
      });
      return {
        name: fileName,
        namespace,
        fileContent,
        outputFilePath,
        fullOutputFilePath,
      };
    })
  );

  const storyFileWithMetadata: Omit<StoryFileWithMetadata, 'outputFilePath'>[] = storyFiles.map(
    sf => ({
      dependencies: getDependenciesForFilePath(modules, sf.filePath),
      fileName: sf.fileName,
      gitPath: sf.gitPath,
      name: sf.name,
      namespace,
      filePath: sf.filePath,
      files: assets[sf.fileName],
    })
  );

  return {
    files: [...filesWithMetadata],
    stories: storyFileWithMetadata,
  } as any;
}

function getPackageJsonDependencies(executionPath: string) {
  try {
    const { dependencies = {} } = require(path.join(executionPath, 'package.json'));
    return Object.keys(dependencies);
  } catch {
    throw new Error('Can not read dependencies in package.json');
  }
}

function getDependenciesForFilePath(modules: Module[], filePath: string): Module[] {
  const module = modules.find(m => m.filePath === filePath);
  return (module && module.dependencies) || [];
}
