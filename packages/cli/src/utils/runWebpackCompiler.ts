import { Module } from '../types';
import getGitPath from './getGitPath';

export type RunWebpackCompilerOutput = {
  componentsContent: Record<string, string>;
  modules: Module[];
};

const runWebpackCompiler = ({
  compiler,
  entrypoints
}): Promise<RunWebpackCompilerOutput> =>
  new Promise((resolve, reject) => {
    compiler.run((err, output) => {
      if (err) {
        reject(err);
      }

      const componentFilePaths = Object.values(entrypoints).map(
        (ep: any) => ep.split('!')[1]
      );

      const componentModules = output.compilation.modules.filter(
        filterActualModulecomponentFilePaths(componentFilePaths)
      );

      const modules = componentModules.map(addDependencies);

      const components = Object.keys(entrypoints);
      const componentsContent = [...components, 'commons'].reduce(
        (contents, componentName) => {
          const content = compiler.outputFileSystem
            .readFileSync(`${process.cwd()}/bojagi/${componentName}.js`)
            .toString();
          contents[componentName] = content;
          return contents;
        },
        {}
      );

      resolve({
        componentsContent,
        modules
      });
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

function mapModuleToResourceAndDependencies(resource) {
  return resource.substr(process.cwd().length + 1);
}

function addDependencies(module): Module {
  const nodeModulesPath = `${process.cwd()}/node_modules/`;
  const isExternal = !!module.external;
  const isNodeModule =
    module.resource && module.resource.startsWith(nodeModulesPath);
  let packageName;
  if (isNodeModule) {
    const pathParts = module.resource
      .substring(nodeModulesPath.length)
      .split('/');
    const isOrgPackage = pathParts[0].startsWith('@');
    packageName = isOrgPackage
      ? `${pathParts[0]}/${pathParts[1]}`
      : pathParts[0];
  }
  const resource = mapModuleToResourceAndDependencies(module.resource);
  return {
    request: module.request,
    resource,
    gitPath: getGitPath(resource),
    isExternal,
    isNodeModule,
    packageName,
    dependencies: !(isNodeModule || isExternal)
      ? module.dependencies
          .filter(dep => dep.module)
          .map(dep => addDependencies({ ...dep.module, request: dep.request }))
      : undefined
  };
}

