import * as MemoryFS from 'memory-fs';
import * as webpack from 'webpack';
import { EntrypointWithMetadata, File, FileContent } from '@bojagi/types';
import * as pathUtils from 'path';
import getComponentsOfFolder from '../utils/getComponentsOfFolder';
import getWebpackConfig from '../utils/getWebpackConfig';
import getEntrypointsFromComponents from '../utils/getEntrypointsFromComponents';
import runWebpackCompiler from '../utils/runWebpackCompiler';
import withDefaultArguments from '../utils/withDefaultArguments';
import { BaseOptions } from '../baseCmd';
import createComponentsWithMetadata from '../utils/createComponentsWithMetadata';
import withSteps from '../utils/withSteps';
import withHelloGoodbye from '../utils/withHelloGoodbye';
import { getComponentCountText } from '../renderers/componentList';
import { writeComponent, writeSharedFile, writeJson, cleanTempFolder } from '../utils/writeFile';
import glob from '../utils/glob';

const outputFS = new MemoryFS();

require('util.promisify').shim();

export interface BundleCommandOptions extends BaseOptions {
  componentMarker: string;
  dir: string;
  steps: any;
  webpackConfig: string;
  executionPath: string;
  decoratorPath: string;
}

const FILES = ['commons', 'bojagiDecorator'];

export const bundleAction = ({
  dir,
  steps,
  webpackConfig,
  executionPath,
  decoratorPath,
}: BundleCommandOptions) => {
  const projectWebpackConfig = require(webpackConfig);
  const entryFolder = `${executionPath}/${dir}`;

  const dependencyPackages = getPackageJsonDependencies(executionPath);
  const componentExtractStep = steps
    .advance('Figuring out what components to extract', 'mag')
    .start();
  return getComponentsOfFolder(entryFolder)
    .then(getEntrypointsFromComponents)
    .then(async (entrypointsWithMetadata: Record<string, EntrypointWithMetadata>) => {
      const fileCount = Object.entries(entrypointsWithMetadata).length;
      if (fileCount === 0) {
        componentExtractStep.error('No components found', 'shrug');
        throw new Error('No components found! Have you marked them correctly?');
      }

      const componentCount = Object.values(entrypointsWithMetadata).reduce(
        (prev, current) => prev + current.components.length,
        0
      );

      componentExtractStep.success(getComponentCountText(componentCount, fileCount));

      const decoratorFiles = await glob(decoratorPath, { cwd: executionPath });
      const decoratorFileArray = decoratorFiles.length > 0 ? [
        pathUtils.resolve(executionPath, decoratorFiles[0])
      ] : [];

      const entrypoints = Object.entries(entrypointsWithMetadata).reduce(
        (prev, [key, ep]) => ({
          ...prev,
          [key]: [ep.entrypoint, ...decoratorFileArray],
        }),
        {}
      );

      const config = getWebpackConfig(
        entrypoints,
        projectWebpackConfig.resolve,
        projectWebpackConfig.module,
        executionPath,
        decoratorFileArray[0],
      );

      const compiler = webpack(config);
      compiler.outputFileSystem = outputFS;

      const compileSteps = steps.advance('Compiling components', 'factory').start();
      const { componentsContent, modules } = await runWebpackCompiler({
        compiler,
        entrypoints,
        dependencyPackages,
      });
      compileSteps.success('Components compiled', 'factory');

      const componentsWithMetadata = createComponentsWithMetadata(
        entrypointsWithMetadata,
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

      await fileContent.map(async file => {
        await writeSharedFile(file);
      });
      await componentsWithMetadata.map(async ({ exportName, filePath, fileContent: fc }) => {
        await writeComponent({ exportName, filePath, fileContent: fc });
      });

      await writeJson('files', files);
      await writeJson('components', componentsMetadata);

      return {
        files,
        components: componentsWithMetadata,
      };
    });
};

const bundle = program => {
  program
    .command('bundle')
    .option('-d, --dir [dir]', 'The root folder to search components in')
    .option(
      '--webpack-config [path]',
      'Path to the webpack config file, defaults to webpack.config.js'
    )
    .description('bundles your marked components (does not upload to Bojagi)')
    .action(withSteps(2)(withHelloGoodbye(withDefaultArguments(bundleAction))));
};

export default bundle;

function getPackageJsonDependencies(executionPath) {
  try {
    const { dependencies } = require(`${executionPath}/package.json`);
    return Object.keys(dependencies);
  } catch {
    throw new Error('Can not read dependencies in package.json');
  }
}
