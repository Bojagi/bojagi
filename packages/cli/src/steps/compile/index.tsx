import * as pathUtils from 'path';
import MemoryFS from 'memory-fs';
import { File, FileContent, ComponentWithMetadata } from '@bojagi/types';
import { StepRunnerStep, StepRunnerActionOptions } from '../../containers/StepRunner';
import runWebpackCompiler from './runWebpackCompiler';
import glob from '../../utils/glob';
import getWebpackConfig from '../../utils/getWebpackConfig';
import createComponentsWithMetadata from './createComponentsWithMetadata';
import { ScanStepOutput } from '../scan';
import { cleanTempFolder, writeSharedFile, writeComponent, writeJson } from '../../utils/writeFile';

import webpack = require('webpack');

const outputFS = new MemoryFS();

export type CompileStepOutput = {
  files: File[];
  components: ComponentWithMetadata[];
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
  stepOutputs,
}: StepRunnerActionOptions<DependencyStepOutputs>): Promise<CompileStepOutput> {
  const decoratorFiles = await glob(config.decoratorPath, { cwd: config.executionPath });
  const storyFiles = await glob(config.storyPath, { cwd: config.executionPath });
  const decoratorFileArray =
    decoratorFiles.length > 0 ? [pathUtils.resolve(config.executionPath, decoratorFiles[0])] : [];
  const storyFileArray = storyFiles.map(sf => pathUtils.resolve(config.executionPath, sf));

  const entrypoints = Object.entries(stepOutputs.scan.entrypointsWithMetadata).reduce(
    (prev, [key, ep]) => ({
      ...prev,
      [key]: [ep.entrypoint, ...decoratorFileArray, ...storyFileArray],
    }),
    {}
  );

  const projectWebpackConfig = require(config.webpackConfig);
  const webpackConfig = getWebpackConfig(
    entrypoints,
    projectWebpackConfig.resolve,
    projectWebpackConfig.module,
    config.executionPath,
    decoratorFileArray[0],
    storyFileArray
  );

  const compiler = webpack(webpackConfig);
  compiler.outputFileSystem = outputFS;

  const dependencyPackages = getPackageJsonDependencies(config.executionPath);

  const { componentsContent, modules } = await runWebpackCompiler({
    compiler,
    entrypoints,
    dependencyPackages,
  });

  const componentsWithMetadata = createComponentsWithMetadata(
    stepOutputs.scan.entrypointsWithMetadata,
    componentsContent,
    modules
  );
  const componentsMetadata = componentsWithMetadata.map(
    ({ fileContent, ...componentMetadata }) => componentMetadata
  );
  const files: File[] = FILES.map(name => ({
    name,
  }));

  const fileContent: FileContent[] = FILES.map(name => ({
    name,
    fileContent: componentsContent[name],
  }));

  await cleanTempFolder();

  await Promise.all(
    fileContent.map(async file => {
      await writeSharedFile(file);
    })
  );
  await Promise.all(
    componentsWithMetadata.map(async ({ exportName, filePath, fileContent: fc }) => {
      await writeComponent({ exportName, filePath, fileContent: fc });
    })
  );

  await writeJson('files', files);
  await writeJson('components', componentsMetadata);

  return {
    files,
    components: componentsWithMetadata,
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
