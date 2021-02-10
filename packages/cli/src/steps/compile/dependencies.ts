import * as path from 'path';
import { Module } from '../../types';
import getGitPath from '../../utils/getGitPath';
import debuggers, { DebugNamespaces } from '../../debug';

const debug = debuggers[DebugNamespaces.COMPILE];
const memorizedDependencies = new Map<string, Module>();

export function clearDependencyMemory() {
  memorizedDependencies.clear();
}

const memorizeDependency = (module: Module) => {
  if (module.filePath) {
    memorizedDependencies.set(module.filePath, module);
  }
  return module;
};

export function addDependencies({
  dependencyPackages,
  existingDependencies = new Set(),
  compilation,
  webpackMajorVersion,
}) {
  return (module): Module => {
    const filePath = module.resource && getFilePath(module.resource);
    const request = getRequest(module);
    if (memorizedDependencies.has(filePath)) {
      debug('reuse memorized dependency: %s', filePath);
      const memorizedModule = memorizedDependencies.get(filePath) as Module;
      return {
        ...memorizedModule,
        request,
      };
    }

    const isExternal = !!module.external;
    const isNodeModule = checkNodeModule(module.resource);
    const packageName = isNodeModule || isExternal ? getPackageName(module) : undefined;
    const isCircularImport = existingDependencies.has(filePath) && !(isNodeModule || isExternal);

    const newExistingDependencies = new Set(existingDependencies);
    newExistingDependencies.add(filePath);

    debug('resolve package: %s', filePath);

    return memorizeDependency({
      filePath,
      gitPath: getGitPath(filePath),
      isExternal,
      isNodeModule,
      packageName,
      request,
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
    });
  };
}

function getFilePath(resource = '') {
  return path.relative(process.cwd(), resource);
}

function getRequest(module) {
  if (module.request) {
    const requestSplit = module.request.split('!');
    return requestSplit[requestSplit.length - 1];
  }

  return undefined;
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

function checkNodeModule(resource) {
  return !!resource && resource.includes('node_modules');
}
