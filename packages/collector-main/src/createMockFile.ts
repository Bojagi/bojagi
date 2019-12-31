type Component = {
  symbol: string;
  exportName: string;
  isDefaultExport: boolean;
  filePath: string;
  gitPath: string;
};

export function createMockFileContent(components: Component[]) {
  const groupedComponents = components.reduce<Record<string, Component[]>>((agg, component) => {
    const fileComponents = agg[component.filePath] || [];
    fileComponents.push(component);
    return {
      ...agg,
      [component.filePath]: fileComponents,
    };
  }, {});

  return Object.entries(groupedComponents).map(([path, componentList]) => [
    path,
    componentList.reduce(
      (agg, exp) => `${agg}\n${stringifyExport(exp)}`,
      `import {createExportFn} from '@bojagi/collector-main';\n`
    ),
  ]);
}

function stringifyExport(component: Component) {
  const prefix = component.isDefaultExport
    ? 'export default'
    : `export const ${component.symbol} =`;
  return `${prefix} createExportFn(${JSON.stringify(component)})`;
}
