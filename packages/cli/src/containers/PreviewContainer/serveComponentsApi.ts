import { SetupApiOptions } from './setupApi';

export function serveComponentsApi({
  entrypointsWithMetadata,
  config,
  componentProps,
}: SetupApiOptions) {
  return {
    files: [
      {
        url: `http://localhost:${config.previewPort}/commons.js`,
      },
    ],
    components: Object.values(entrypointsWithMetadata)
      .map(ep =>
        ep.components.map(({ symbol, isDefaultExport }) => {
          const componentPath = ep.filePath.replace(config.executionPath, '').substr(1);
          const componentExportName = isDefaultExport ? 'default' : symbol;
          const foundComponentProps = componentProps.find(
            cp => cp.filePath === componentPath && cp.exportName === componentExportName
          );
          const props = (foundComponentProps ? foundComponentProps.props : []).map(prop => ({
            ...prop,
            propSet: JSON.stringify(prop.propSet),
          }));
          return {
            url: `http://localhost:${config.previewPort}/${symbol}.js`,
            id: symbol,
            exportName: isDefaultExport ? 'default' : symbol,
            symbol,
            props,
          };
        })
      )
      // Flatten
      .reduce((agg, item) => [...agg, ...item], []),
  };
}
