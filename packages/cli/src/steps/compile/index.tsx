import MemoryFS from 'memory-fs';
import { StoryFileWithMetadata, FileContent, OutputFileContent, Module } from '../../types';
import { StepRunnerStep, StepRunnerActionOptions } from '../../containers/StepRunner';
import { runWebpackCompiler } from './runWebpackCompiler';
import { ScanStepOutput } from '../scan';
import { writeSharedFile, writeStories } from '../../utils/writeFile';
import { getWebpackConfig } from '../../utils/getWebpackConfig';

import webpack = require('webpack');

const outputFS = new MemoryFS();

export type CompileStepOutput = {
  files: OutputFileContent<FileContent>[];
  stories: OutputFileContent<StoryFileWithMetadata>[];
};

const FILES = ['commons'];

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
  const { entrypoints, webpackConfig } = await getWebpackConfig({
    config,
    storyFiles,
  });

  const compiler = webpack(webpackConfig);
  compiler.outputFileSystem = outputFS;

  const dependencyPackages = getPackageJsonDependencies(config.executionPath);

  const { outputContent, modules } = await runWebpackCompiler({
    compiler,
    entrypoints,
    dependencyPackages,
  });

  const filesWithMetadata = await Promise.all(
    FILES.filter(name => outputContent[name]).map(async name => {
      const fileContent = outputContent[name];
      const outputFilePath = await writeSharedFile(namespace, name, fileContent);
      return {
        name,
        namespace,
        fileContent,
        outputFilePath,
      };
    })
  );

  const storyFileWithMetadata: StoryFileWithMetadata[] = storyFiles.map(sf => ({
    dependencies: getDependenciesForFilePath(modules, sf.filePath),
    fileName: sf.fileName,
    gitPath: sf.gitPath,
    name: sf.name,
    namespace,
    filePath: sf.filePath,
    fileContent: outputContent[sf.fileName],
  }));

  const storyFileWithOutputFilePath = await Promise.all(
    storyFileWithMetadata.map(async sf => {
      const outputFilePath = await writeStories(namespace, sf);
      return {
        ...sf,
        outputFilePath,
      };
    })
  );

  return {
    files: filesWithMetadata,
    stories: storyFileWithOutputFilePath,
  };
}

function getPackageJsonDependencies(executionPath: string) {
  try {
    const { dependencies } = require(`${executionPath}/package.json`);
    return Object.keys(dependencies);
  } catch {
    throw new Error('Can not read dependencies in package.json');
  }
}

function getDependenciesForFilePath(modules: Module[], filePath: string): Module[] {
  const module = modules.find(m => m.filePath === filePath);
  return (module && module.dependencies) || [];
}
