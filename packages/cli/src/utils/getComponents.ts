const FILE_MARKER = /^(\s*\/\/.*?\n)*(\s*\/\/\s@component\s*\n)/;

const EXPORT_DEFAULT_REG_EXP = /export(?:\s|\n|\/\*(?:.|\n)*?\*\/)+default(?:\s|\n|\/\*(?:.|\n)*?\*\/)+(.*?)(?:;|\s|\n|\/\*(?:.|\n)*?\*\/)/;
const EXPORT_REG_EXP = /export(?:\s|\n|\/\*(?:.|\n)*?\*\/)+(?:const|var|let|class)(?:\s|\n|\/\*(?:.|\n)*?\*\/)+(.*?)(?:\s|\n|\/\*(?:.|\n)*?\*\/)/;
const EXPORT_REG_EXP_GLOBAL = new RegExp(EXPORT_REG_EXP, 'g');

const getExports = fileContent =>
  (fileContent.match(EXPORT_REG_EXP_GLOBAL) || []).map(match => match.match(EXPORT_REG_EXP)[1]);
const getDefaultExport = fileContent => (fileContent.match(EXPORT_DEFAULT_REG_EXP) || [])[1];

const buildCombinedExportData = (isDefaultExport = false) => exportSymbol => ({
  symbol: exportSymbol,
  isDefaultExport,
});

const getComponents = fileContent => {
  if (FILE_MARKER.test(fileContent)) {
    const exports = getExports(fileContent);
    const defaultExport = getDefaultExport(fileContent);

    if (exports.length === 0 && !defaultExport) {
      return undefined;
    }

    const combinedExports = exports.map(buildCombinedExportData());

    if (defaultExport) {
      combinedExports.push(buildCombinedExportData(true)(defaultExport));
    }
    return combinedExports;
  }
  return undefined;
};

export default getComponents;
