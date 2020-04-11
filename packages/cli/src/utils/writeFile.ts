import { TEMP_FOLDER } from '../constants';
import { getFS } from '../dependencies';

import path = require('path');
import util = require('util');
import _rimraf = require('rimraf');
import _mkdirp = require('mkdirp');

export type WriteComponentPropsArgs = {
  exportName: string;
  filePath: string;
  props: Record<string, any>[];
};

const fs = getFS();

const mkdirp = util.promisify(_mkdirp);
const writeFile = util.promisify(fs.writeFile.bind(fs));
const exists = util.promisify(fs.exists.bind(fs));
const readFile = util.promisify(fs.readFile.bind(fs));
const rimraf = util.promisify(_rimraf);

function getComponentFolder(filePath: string, exportName: string) {
  const mappedPath = filePath.replace(/[/\\]/g, '__');
  const folder = `${mappedPath}___${exportName}`;
  return path.join(TEMP_FOLDER, 'components', folder);
}

async function writeComponentFile({ exportName, filePath, fileContent, fileName }) {
  const componentFolder = getComponentFolder(filePath, exportName);
  await mkdirp(`${componentFolder}`, { fs });
  await writeFile(path.join(componentFolder, fileName), fileContent);
}

export async function writeComponent({ exportName, filePath, fileContent }) {
  const fileName = 'component.js';
  return writeComponentFile({
    exportName,
    filePath,
    fileContent,
    fileName,
  });
}

export function readComponentsSync() {
  return readJsonSync('components');
}

export function fileExistsSync(fileName: string): boolean {
  if (!fs.existsSync(TEMP_FOLDER)) {
    return false;
  }

  return fs.existsSync(path.join(TEMP_FOLDER, fileName));
}

export async function writeComponentProps({
  exportName,
  filePath,
  props,
}: WriteComponentPropsArgs) {
  const fileName = 'props.json';
  const fullPath = path.join(getComponentFolder(filePath, exportName), fileName);

  const existingProps = (await exists(fullPath)) ? JSON.parse(readFile(fullPath)) : [];

  const fileContent = JSON.stringify([...existingProps, ...props]);
  return writeComponentFile({
    exportName,
    filePath,
    fileContent,
    fileName,
  });
}

export async function writeSharedFile({ name, fileContent }) {
  await mkdirp(path.join(TEMP_FOLDER, 'files'), { fs });
  await writeFile(path.join(TEMP_FOLDER, 'files', `${name}.js`), fileContent);
}

export async function writeJson(what: string, content: object | any[]) {
  await mkdirp(TEMP_FOLDER, { fs });
  await writeFile(path.join(TEMP_FOLDER, `${what}.json`), JSON.stringify(content));
}

export function readJsonSync(what: string) {
  const filePath = path.join(TEMP_FOLDER, `${what}.json`);
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

export async function cleanTempFolder() {
  await rimraf(TEMP_FOLDER, fs);
}
