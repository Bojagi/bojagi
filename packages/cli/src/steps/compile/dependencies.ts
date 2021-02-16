import * as path from 'path';
import { Dependency } from '../../types';
import getGitPath from '../../utils/getGitPath';

export function getDependencies(
  { dependencyPackages, modules, webpackMajorVersion },
  initial = {}
) {
  return modules
    .filter(module => !module.rawRequest || !module.rawRequest.includes(`?${module.resource}`))
    .reduce((acc, module) => {
      const dependency = getModuleAsDependency(module);

      if (acc[dependency.id]) {
        return acc;
      }

      const subDependencies = module.dependencies
        .filter(dep => dep.module)
        .filter(dep => !!dep.module.request || !!dep.module.resource)
        .filter(onlyUnique)
        .filter(ignoreDevDependencies(dependencyPackages));

      const result = {
        ...acc,
        [dependency.id]: addSubDependencies(dependency, subDependencies),
      };

      if (!module.dependencies?.length) {
        return result;
      }

      return {
        ...result,
        ...getDependencies(
          {
            dependencyPackages,
            modules: subDependencies.map(dep => dep.module),
            webpackMajorVersion,
          },
          result
        ),
      };
    }, initial);
}

function onlyUnique(dep, index, self) {
  return self.findIndex(selfDep => selfDep.request === dep.request) === index;
}

function getModuleAsDependency(module) {
  const isExternal = !!module.external;
  const isNodeModule = checkNodeModule(module.resource);

  if (isNodeModule) {
    const packageName = getPackageName(module);
    return {
      id: packageName,
      isExternal,
      isNodeModule,
      packageName,
    };
  }

  if (isExternal) {
    return {
      id: module.request,
      isExternal,
      isNodeModule,
      packageName: module.request,
    };
  }

  const filePath = getFilePath(module.resource);
  const gitPath = getGitPath(filePath);
  return {
    id: gitPath || filePath,
    isExternal: !!module.external,
    isNodeModule: false,
    filePath,
    gitPath,
  };
}

function addSubDependencies(dep, subDependencies): Dependency {
  return {
    ...dep,
    dependencies:
      !dep.isNodeModule && subDependencies
        ? subDependencies.map(({ request, module: subModule }) => {
            return {
              request: getRequest(request),
              dependency: getModuleAsDependency(subModule).id,
            };
          })
        : [],
  };
}

export function findModuleInDependencies(module, dependencies) {
  return dependencies[getModuleAsDependency(module).id];
}

function getFilePath(resource = '') {
  return path.relative(process.cwd(), resource);
}

function getRequest(request) {
  if (request) {
    const requestSplit = request.split('!');
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

function getPackageName(module: any) {
  const pathParts = module.resource.replace(/.*?node_modules\//, '').split(path.sep);
  const isOrgPackage = pathParts[0].startsWith('@');
  return isOrgPackage ? `${pathParts[0]}/${pathParts[1]}` : pathParts[0];
}

function checkNodeModule(resource) {
  return !!resource && resource.includes('node_modules');
}
