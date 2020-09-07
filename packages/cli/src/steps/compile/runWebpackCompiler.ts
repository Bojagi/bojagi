import * as path from 'path';
import { Module } from '../../types';
import getGitPath from '../../utils/getGitPath';

export type RunWebpackCompilerOutput = {
  outputContent: Record<string, string>;
  modules: Module[];
};

export const runWebpackCompiler = ({
  compiler,
  entrypoints,
  dependencyPackages,
}): Promise<RunWebpackCompilerOutput> =>
  new Promise((resolve, reject) => {
    compiler.run((err, output) => {
      if (err) {
        reject(err);
      }

      if (output.compilation.errors.length > 0) {
        reject(output.compilation.errors[0]);
      }

      try {
        const componentFilePaths = Object.values(entrypoints).map((ep: any) => ep[0].split('!')[1]);

        const componentModules = output.compilation.modules.filter(
          filterActualModulecomponentFilePaths(componentFilePaths)
        );

        const modules = componentModules
          // Filter out components without dependencies (somehow double in webpack output)
          // .filter(cm => cm.dependencies[0].module)
          // Map first dependency, because webpack module has self dependency somehow
          // .map(cm => ({ ...cm.dependencies[0].module, request: cm.dependencies[0].request }))
          .map(addDependencies(dependencyPackages));

        const entrypointNames = Object.keys(entrypoints);

        const outputContent = [...entrypointNames, 'commons'].reduce((contents, fileName) => {
          const filePath = `${process.cwd()}/bojagi/${fileName}.js`;

          if (compiler.outputFileSystem.existsSync(filePath)) {
            const content = compiler.outputFileSystem.readFileSync(filePath).toString();
            // eslint-disable-next-line no-param-reassign
            contents[fileName] = content;
          }
          return contents;
        }, {});

        resolve({
          outputContent,
          modules,
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
