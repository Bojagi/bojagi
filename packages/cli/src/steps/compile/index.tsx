import MemoryFS from 'memory-fs';
import * as path from 'path';
import { StoryFileWithMetadata, FileContent, OutputFileContent } from '../../types';
import { StepRunnerStep, StepRunnerActionOptions, StepOutput } from '../../containers/StepRunner';
import { runWebpackCompiler } from './runWebpackCompiler';
import { ScanStepOutput } from '../scan';
import { writeBojagiFile } from '../../utils/writeFile';
import { getWebpackConfig } from '../../utils/getWebpackConfig';
import debuggers, { DebugNamespaces } from '../../debug';
import { NonVerboseError } from '../../errors';
import { getDependenciesForFilePath } from './dependencies';

import webpack = require('webpack');

const MAX_STORY_LIMIT = 200;
const MAX_FILE_LIMIT = 600;

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
    scan: { storyFiles, projectGitPath },
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

  const { outputContent, modules, assets, dependencies } = await runWebpackCompiler({
    compiler,
    entrypoints,
    dependencyPackages,
    webpackMajorVersion,
    projectGitPath,
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

  checkLimit('files', MAX_FILE_LIMIT, filesWithMetadata);
  checkLimit('stories', MAX_STORY_LIMIT, storyFileWithMetadata);

  return {
    files: filesWithMetadata,
    stories: storyFileWithMetadata,
    dependencies,
  };
}

function getPackageJsonDependencies(executionPath: string) {
  try {
    const { dependencies = {} } = require(path.join(executionPath, 'package.json'));
    return Object.keys(dependencies);
  } catch {
    throw new Error('Can not read dependencies in package.json');
  }
}

function checkLimit(kind: string, limit: number, arr: any[]) {
  debug(`${kind} count: ${arr.length}`);
  if (arr.length > limit) {
    throw new NonVerboseError(`Too many ${kind} (${arr.length}), maximum allowed: ${limit}`);
  }
}
