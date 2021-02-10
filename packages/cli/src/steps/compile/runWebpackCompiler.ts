import * as path from 'path';
import { Module } from '../../types';
import debuggers, { DebugNamespaces } from '../../debug';
import { addDependencies } from './dependencies';

const debug = debuggers[DebugNamespaces.COMPILE];

export type RunWebpackCompilerOutput = {
  outputContent: Record<string, string>;
  modules: Module[];
  assets: Record<string, string[]>;
};

export const runWebpackCompiler = ({
  compiler,
  entrypoints,
  dependencyPackages,
  webpackMajorVersion,
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

        // const moduleDependencies = getDependencies({
        //   dependencyPackages,
        //   compilation: output.compilation,
        //   webpackMajorVersion,
        //   modules: componentModules,
        // })

        const modules = componentModules.map(
          addDependencies({
            dependencyPackages,
            compilation: output.compilation,
            webpackMajorVersion,
          })
        );

        resolve({
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
