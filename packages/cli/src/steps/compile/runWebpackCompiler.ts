import * as path from 'path';
import { Module } from '../../types';
import getGitPath from '../../utils/getGitPath';
import debuggers, { DebugNamespaces } from '../../debug';

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
}): Promise<RunWebpackCompilerOutput> =>
  new Promise((resolve, reject) => {
    compiler.run((err, output) => {
      if (err) {
        debug(err);
        reject(err);
      }

      if (output.compilation.errors.length > 0) {
        debug(output.compilation.errors);
        reject(output.compilation.errors[0]);
      }

      debug('all generated files: %O', Object.keys(output.compilation.assets));

      const assets: Record<string, string[]> = Array.from(output.compilation.entrypoints.entries())
        .map(([key, val]) => [key, val.getFiles()])
        .reduce((acc, [key, val]) => ({ ...acc, [key]: val }), {});
      debug('asset list: %O', assets);

      const outputContent = Object.entries(output.compilation.assets).reduce(
        (acc, [key, val]) => ({
          ...acc,
          [key]: (val as any).source(),
        }),
        {}
      );

      const flatAssets = Object.values(assets)
        .flat()
        .filter((item, i, arr) => arr.indexOf(item) === i);
      debug('all (flattened) asset list: %O', flatAssets);

      try {
        const componentFilePaths = Object.values(entrypoints).map((ep: any) => ep[0].split('!')[1]);

        const componentModules = output.compilation.modules.filter(
          filterActualModulecomponentFilePaths(componentFilePaths)
        );

        const modules = componentModules.map(addDependencies(dependencyPackages));

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

function getFilePath(resource = '') {
  return path.relative(process.cwd(), resource);
}

function addDependencies(dependencyPackages) {
  return (module): Module => {
    const isExternal = !!module.external;
    const isNodeModule = checkNodeModule(module.resource);
    const packageName = isNodeModule || isExternal ? getPackageName(module) : undefined;
    const filePath = module.resource && getFilePath(module.resource);

    return {
      filePath,
      gitPath: getGitPath(filePath),
      isExternal,
      isNodeModule,
      packageName,
      request: getRequest(module),
      dependencies: !(isNodeModule || isExternal)
        ? module.dependencies
            .filter(dep => dep.module)
            .filter(ignoreDevDependencies(dependencyPackages))
            .filter(onlyUnique)
            .map(dep =>
              addDependencies(dependencyPackages)({ ...dep.module, request: dep.request })
            )
        : undefined,
    };
  };
}

function getRequest(module) {
  if (module.request) {
    const requestSplit = module.request.split('!');
    return requestSplit[requestSplit.length - 1];
  }

  return undefined;
}

function checkNodeModule(resource) {
  return !!resource && resource.includes('node_modules');
}

function ignoreDevDependencies(dependencyPackages) {
  return dep =>
    // Module is part of project (no node_modules)
    !checkNodeModule(dep.module.resource) ||
    // Module is part of package.json "dependencies"
    dependencyPackages.find(depName => dep.request.startsWith(depName));
}

function onlyUnique(dep, index, self) {
  return self.findIndex(selfDep => selfDep.request === dep.request) === index;
}

function getPackageName(module: any) {
  if (module.external) {
    return module.request;
  }

  const pathParts = module.resource.replace(/.*?node_modules\//, '').split('/');
  const isOrgPackage = pathParts[0].startsWith('@');
  return isOrgPackage ? `${pathParts[0]}/${pathParts[1]}` : pathParts[0];
}
