const FILE_MARKER = /^(\s*\/\/.*?\n)*(\s*\/\/\s@component\s*\n)/;

const COMMENT_REGEXP = /\/\*(?:.|\n|\r)*?\*\/|(?:\/\/.*)/g;
const EXPORT_DEFAULT_REG_EXP = /export(?:\s|\n|\r)+default(?:\s|\n|\r)+(?:function(?:\s|\n|\r)+){0,1}(.*?)(?:;|\s|\n|\r|=|\()/;
const EXPORT_REG_EXP = /export(?:\s|\n|\r)+(?:const|var|let|class|function)(?:\s|\n)+(.*?)(?:\s|\n|\r)/;
const EXPORT_REG_EXP_GLOBAL = new RegExp(EXPORT_REG_EXP, 'g');

const getExports = fileContent =>
  (fileContent.match(EXPORT_REG_EXP_GLOBAL) || []).map(match => match.match(EXPORT_REG_EXP)[1]);
const getDefaultExport = fileContent => {
  const defaultExportSymbol = (fileContent.match(EXPORT_DEFAULT_REG_EXP) || [])[1];
  if (defaultExportSymbol === '') {
    return 'default';
  }

  return defaultExportSymbol;
};

const buildCombinedExportData = (isDefaultExport = false) => exportSymbol => ({
  symbol: exportSymbol,
  isDefaultExport,
});

const getComponents = fileContent => {
  if (FILE_MARKER.test(fileContent)) {
    const fileContentWithoutComments = fileContent.replace(COMMENT_REGEXP, '');
    const exports = getExports(fileContentWithoutComments);
    const defaultExport = getDefaultExport(fileContentWithoutComments);

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
