import * as path from 'path';
import { Dependency, DependencyReference, LocalDependency } from '../../types';

export function getDependencies(
  { dependencyPackages, modules, projectGitPath, compilation, webpackMajorVersion },
  initial = {}
) {
  return modules
    .filter(module => !module.rawRequest || !module.rawRequest.includes(`?${module.resource}`))
    .reduce((acc, module) => {
      const dependency = getModuleAsDependency(module, projectGitPath);

      if (acc[dependency.id]) {
        return acc;
      }

      const subDependencies = module.dependencies
        .map(dep =>
          webpackMajorVersion > 4 ? { ...dep, module: compilation.moduleGraph.getModule(dep) } : dep
        )
        .filter(dep => dep.module)
        .filter(dep => !!dep.module.request || !!dep.module.resource)
        .filter(onlyUnique)
        .filter(ignoreDevDependencies(dependencyPackages));

      const result = {
        ...acc,
        [dependency.id]: addSubDependencies(dependency, subDependencies, projectGitPath),
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
            projectGitPath,
            compilation,
          },
          result
        ),
      };
    }, initial);
}

function onlyUnique(dep, index, self) {
  return self.findIndex(selfDep => selfDep.request === dep.request) === index;
}

function getModuleAsDependency(module, projectGitPath: string) {
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
  const fullFilePath = path.resolve(filePath);
  const gitPath = projectGitPath ? path.relative(projectGitPath, fullFilePath) : filePath;
  return {
    id: gitPath,
    isExternal: !!module.external,
    isNodeModule: false,
    filePath,
    gitPath,
  };
}

function addSubDependencies(dep, subDependencies, projectGitPath: string): Dependency {
  return {
    ...dep,
    dependencies:
      !dep.isNodeModule && subDependencies
        ? subDependencies.map(({ request, module: subModule }) => {
            return {
              request: getRequest(request),
              dependency: getModuleAsDependency(subModule, projectGitPath).id,
            };
          })
        : [],
  };
}

export function findModuleInDependencies(module, dependencies, projectGitPath: string) {
  return dependencies[getModuleAsDependency(module, projectGitPath).id];
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

export function getDependenciesForFilePath(
  modules: LocalDependency[],
  filePath: string
): DependencyReference[] {
  const module = modules.find(m => m.filePath === filePath || `./${m.filePath}` === filePath);
  return (module && module.dependencies) || [];
}
