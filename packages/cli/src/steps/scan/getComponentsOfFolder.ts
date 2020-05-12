import * as fs from 'fs';
import * as util from 'util';
import getComponents from './getComponents';

const readDir = util.promisify(fs.readdir);
const readFile = util.promisify(fs.readFile);
const stat = util.promisify(fs.stat);
const FILE_REGEXP = /(.+)?\.(j|t)sx?$/;

interface FileWithInformation {
  filePath: string;
  stats: any;
}

const getComponentsOfFile = (componentMarker: string, filePath: string) =>
  readFile(filePath)
    .then(fileContent => getComponents(componentMarker, filePath, fileContent.toString()))
    .then(components => (components ? { filePath, components } : undefined));

const getComponentsOfFiles = (componentMarker: string) => (
  files: FileWithInformation[]
): Promise<any> => {
  return Promise.all(files.map(({ filePath }) => getComponentsOfFile(componentMarker, filePath)));
};

const getFilesWithStats = (path: string): Promise<FileWithInformation[]> =>
  readDir(path).then(files =>
    Promise.all(
      files.map(file => {
        const filePath = `${path}/${file}`;
        return stat(filePath).then(stats => ({ filePath, stats }));
      })
    )
  );

const getComponentsOfFolder = (componentMarker: string, path: string) => {
  const filesWithStats = getFilesWithStats(path);

  const directoriesPromise = filesWithStats.then(files =>
    files.filter(file => file.stats.isDirectory())
  );

  const jsxFilesPromise = filesWithStats.then(files =>
    files.filter(file => file.stats.isFile && FILE_REGEXP.test(file.filePath))
  );

  return directoriesPromise
    .then(directories =>
      Promise.all([
        ...directories.map(({ filePath }) => getComponentsOfFolder(componentMarker, filePath)),
        jsxFilesPromise.then(getComponentsOfFiles(componentMarker)),
      ])
    )
    .then(componentsOfFolders =>
      componentsOfFolders
        .reduce((results: any[], componentOfFolder) => [...results, ...componentOfFolder], [])
        .filter(component => !!component)
    );
};

export default getComponentsOfFolder;
