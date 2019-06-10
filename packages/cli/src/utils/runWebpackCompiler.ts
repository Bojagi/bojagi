import { Module } from '../types';

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

      const modules = componentModules.map(mapModuleToResourceAndDependencies);

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

function mapModuleToResourceAndDependencies(module) {
  return {
    resource: module.resource.substr(process.cwd().length + 1),
    dependencies: getDependencies(module)
  };
}

function getDependencies(module): Module[] {
  return module.dependencies
    .filter(dep => dep.module)
    .map(dep => {
      const nodeModulesPath = `${process.cwd()}/node_modules/`;
      const isExternal = !!dep.module.external;
      const isNodeModule =
        dep.module.resource && dep.module.resource.startsWith(nodeModulesPath);
      let packageName;
      if (isNodeModule) {
        const pathParts = dep.module.resource
          .substring(nodeModulesPath.length)
          .split('/');
        const isOrgPackage = pathParts[0].startsWith('@');
        packageName = isOrgPackage
          ? `${pathParts[0]}/${pathParts[1]}`
          : pathParts[0];
      }
      return {
        request: dep.request,
        resource: dep.module.resource,
        isExternal,
        isNodeModule,
        packageName,
        dependencies: !(isNodeModule || isExternal)
          ? getDependencies(dep.module)
          : undefined
      };
    });
}
