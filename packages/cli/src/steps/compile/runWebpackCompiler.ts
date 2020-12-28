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

function getFilePath(resource = '') {
  return path.relative(process.cwd(), resource);
}

function addDependencies({
  dependencyPackages,
  existingDependencies = new Set(),
  compilation,
  webpackMajorVersion,
}) {
  return (module): Module => {
    const isExternal = !!module.external;
    const isNodeModule = checkNodeModule(module.resource);
    const packageName = isNodeModule || isExternal ? getPackageName(module) : undefined;
    const filePath = module.resource && getFilePath(module.resource);
    const isCircularImport = existingDependencies.has(filePath) && !(isNodeModule || isExternal);

    const newExistingDependencies = new Set(existingDependencies);
    newExistingDependencies.add(filePath);

    return {
      filePath,
      gitPath: getGitPath(filePath),
      isExternal,
      isNodeModule,
      packageName,
      request: getRequest(module),
      isCircularImport,
      dependencies: !(isNodeModule || isExternal || isCircularImport)
        ? module.dependencies
            .map(dep =>
              webpackMajorVersion > 4
                ? { ...dep, module: compilation.moduleGraph.getModule(dep) }
                : dep
            )
            .filter(dep => dep.module)
            .filter(dep => !!dep.module.request || !!dep.module.resource)
            .filter(ignoreDevDependencies(dependencyPackages))
            .filter(onlyUnique)
            .map(dep =>
              addDependencies({
                dependencyPackages,
                compilation,
                existingDependencies: newExistingDependencies,
                webpackMajorVersion,
              })({ ...dep.module, request: dep.request })
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

  const pathParts = module.resource.replace(/.*?node_modules\//, '').split(path.sep);
  const isOrgPackage = pathParts[0].startsWith('@');
  return isOrgPackage ? `${pathParts[0]}/${pathParts[1]}` : pathParts[0];
}
