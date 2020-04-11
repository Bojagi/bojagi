import { Module } from '@bojagi/types';
import * as path from 'path';
import getGitPath from '../../utils/getGitPath';

export type RunWebpackCompilerOutput = {
  componentsContent: Record<string, string>;
  modules: Module[];
};

const runWebpackCompiler = ({
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

        const modules = componentModules.map(addDependencies(dependencyPackages));

        const components = Object.keys(entrypoints);
        const componentsContent = [...components, 'commons'].reduce((contents, componentName) => {
          const content = compiler.outputFileSystem
            .readFileSync(`${process.cwd()}/bojagi/${componentName}.js`)
            .toString();
          // eslint-disable-next-line no-param-reassign
          contents[componentName] = content;
          return contents;
        }, {});

        resolve({
          componentsContent,
          modules,
        });
      } catch (execError) {
        reject(execError);
      }
    });
  });

export default runWebpackCompiler;

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
    const nodeModulesPath = `${process.cwd()}/node_modules/`;
    const isExternal = !!module.external;
    const isNodeModule = checkNodeModule(module.resource, nodeModulesPath);
    const packageName = isNodeModule ? getPackageName(module.resource, nodeModulesPath) : undefined;
    const filePath = module.resource && getFilePath(module.resource);

    return {
      request: module.request,
      filePath,
      gitPath: getGitPath(filePath),
      isExternal,
      isNodeModule,
      packageName,
      dependencies: !(isNodeModule || isExternal)
        ? module.dependencies
            .filter(dep => dep.module)
            .filter(ignoreDevDependencies(nodeModulesPath, dependencyPackages))
            .filter(onlyUnique)
            .map(dep =>
              addDependencies(dependencyPackages)({ ...dep.module, request: dep.request })
            )
        : undefined,
    };
  };
}

function checkNodeModule(resource, nodeModulesPath) {
  return resource && resource.startsWith(nodeModulesPath);
}

function ignoreDevDependencies(nodeModulesPath, dependencyPackages) {
  return dep =>
    // Module is part of project (no node_modules)
    !checkNodeModule(dep.module.resource, nodeModulesPath) ||
    // Module is part of package.json "dependencies"
    dependencyPackages.find(depName => dep.request.startsWith(depName));
}

function onlyUnique(dep, index, self) {
  return self.findIndex(selfDep => selfDep.request === dep.request) === index;
}

function getPackageName(resource: string, nodeModulesPath: string) {
  const pathParts = resource.substring(nodeModulesPath.length).split('/');
  const isOrgPackage = pathParts[0].startsWith('@');
  return isOrgPackage ? `${pathParts[0]}/${pathParts[1]}` : pathParts[0];
}
