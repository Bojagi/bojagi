import * as path from 'path';
import { Dependency, LocalDependency } from '../../types';
import debuggers, { DebugNamespaces } from '../../debug';
import { findModuleInDependencies, getDependencies } from './dependencies';

const debug = debuggers[DebugNamespaces.COMPILE];

export type RunWebpackCompilerOutput = {
  dependencies: Dependency[];
  outputContent: Record<string, string>;
  modules: LocalDependency[];
  assets: Record<string, string[]>;
  projectGitPath?: string;
};

export const runWebpackCompiler = ({
  compiler,
  entrypoints,
  dependencyPackages,
  webpackMajorVersion,
  projectGitPath,
}): Promise<RunWebpackCompilerOutput> =>
  new Promise((resolve, reject) => {
    compiler.run((err, output) => {
      if (err) {
        debug(err);
        reject(err);
        return;
      }

      if (output.compilation.errors.length > 0) {
        debug(output.compilation.errors);
        reject(output.compilation.errors[0]);
        return;
      }

      debug('all generated files: %O', Object.keys(output.compilation.assets));

      const assets: Record<string, string[]> = Array.from(output.compilation.entrypoints.entries())
        .map(([key, val]) => [key, val.getFiles()])
        .reduce((acc, [key, val]) => ({ ...acc, [key]: val }), {});
      debug('asset list: %O', assets);

      const outputContent = Object.keys(output.compilation.assets).reduce(
        (acc, key) => ({
          ...acc,
          [key]: compiler.outputFileSystem.readFileSync(path.join(process.cwd(), 'bojagi', key)),
        }),
        {}
      );

      try {
        const componentFilePaths = Object.values(entrypoints).map((ep: any) => ep[0].split('!')[1]);

        const componentModules = Array.from(output.compilation.modules).filter(
          filterActualModulecomponentFilePaths(componentFilePaths)
        );

        const dependencies = getDependencies({
          dependencyPackages,
          webpackMajorVersion,
          compilation: output.compilation,
          modules: componentModules,
          projectGitPath,
        });

        const modules = componentModules.map(m =>
          findModuleInDependencies(m, dependencies, projectGitPath)
        );

        resolve({
          dependencies,
          outputContent,
          modules,
          assets,
        });
      } catch (execError) {
        reject(execError);
      }
    });
  });

function filterActualModulecomponentFilePaths(componentFilePaths) {
  return module => {
    if (!module.rawRequest) {
      return false;
    }

    return (
      componentFilePaths.includes(module.resource) &&
      !module.rawRequest.startsWith('component-extract-loader?')
    );
  };
}
